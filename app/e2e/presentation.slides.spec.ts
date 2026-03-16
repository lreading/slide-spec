import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

import { FixtureRepository } from './support/FixtureRepository'

import type {
  CommunityHighlightsSlide,
  ContributorSpotlightSlide,
  HowToContributeSlide,
  PresentationSlide,
  RecentUpdatesSlide,
  ReleasesSlide,
  RoadmapSlide,
} from '../src/types/content'

const fixtures = new FixtureRepository()
const site = fixtures.getSiteContent()
const record = fixtures.getPresentation('2026-q1')
const enabledSlides = record.deck.slides.filter((slide) => slide.enabled)

function formatFooterText(url: string): string {
  const parsed = new URL(url)
  const path = parsed.pathname.replace(/\/$/, '')

  return `${parsed.host}${path}`
}

async function assertSlideContent(page: Page, slide: PresentationSlide): Promise<void> {
  switch (slide.kind) {
    case 'title':
      await expect(page.getByRole('heading', { name: /owasp threat dragon/i })).toBeVisible()
      await expect(page.getByText(record.deck.subtitle)).toBeVisible()
      await expect(page.getByText(String(slide.quote))).toBeVisible()
      for (const link of Object.values(site.links)) {
        await expect(page.getByRole('link', { name: formatFooterText(link.url) })).toHaveAttribute(
          'href',
          link.url,
        )
      }
      break
    case 'agenda':
      await expect(page.getByText('Agenda')).toBeVisible()
      await expect(page.getByText('What Happened Since Last Update')).toBeVisible()
      await expect(page.getByText('Roadmap')).toBeVisible()
      await expect(page.getByText('Thank You')).toBeVisible()
      break
    case 'recent-updates': {
      const recentSlide: RecentUpdatesSlide = slide
      await expect(page.getByText(recentSlide.subtitle ?? '')).toBeVisible()
      await expect(page.getByText(recentSlide.sections[0].title)).toBeVisible()
      await expect(page.getByText(recentSlide.sections[0].bullets[0])).toBeVisible()
      break
    }
    case 'releases': {
      const releasesSlide: ReleasesSlide = slide
      const release = record.generated.releases.find(
        (entry) => entry.id === releasesSlide.featured_release_ids[0],
      )
      await expect(page.getByText(releasesSlide.subtitle ?? '')).toBeVisible()
      await expect(page.getByRole('link', { name: release?.version ?? '' })).toHaveAttribute(
        'href',
        release?.url ?? '',
      )
      await expect(page.getByText(release?.summary_bullets[0] ?? '')).toBeVisible()
      break
    }
    case 'roadmap': {
      const roadmapSlide: RoadmapSlide = slide
      const section = record.deck.roadmap?.sections[roadmapSlide.stage]
      await expect(page.getByText(`Roadmap: ${section?.label}`)).toBeVisible()
      await expect(page.getByText(section?.summary ?? '', { exact: true }).first()).toBeVisible()
      await expect(page.getByText(section?.items[0] ?? '')).toBeVisible()
      await expect(
        page.getByText(section?.themes[0].category ?? '', { exact: true }).first(),
      ).toBeVisible()
      break
    }
    case 'contributor-spotlight': {
      const contributorSlide: ContributorSpotlightSlide = slide
      const spotlight = contributorSlide.spotlight[0]
      const contributor = record.generated.contributors.authors.find(
        (entry) => entry.login === spotlight.login,
      )
      await expect(page.getByText(contributorSlide.subtitle ?? '')).toBeVisible()
      await expect(page.getByRole('heading', { name: contributor?.name ?? '' })).toBeVisible()
      await expect(page.getByRole('link', { name: `@${spotlight.login}` })).toHaveAttribute(
        'href',
        `https://github.com/${spotlight.login}`,
      )
      await expect(page.getByText(spotlight.summary)).toBeVisible()
      break
    }
    case 'community-highlights': {
      const communitySlide: CommunityHighlightsSlide = slide
      await expect(page.getByText(communitySlide.subtitle ?? '')).toBeVisible()
      await expect(
        page.getByText(communitySlide.section_heading ?? '', { exact: true }).first(),
      ).toBeVisible()
      await expect(page.getByText(record.generated.stats[communitySlide.stat_keys[0]].label)).toBeVisible()
      await expect(page.getByText(communitySlide.mentions[0].title)).toBeVisible()
      break
    }
    case 'how-to-contribute': {
      const contributeSlide: HowToContributeSlide = slide
      await expect(page.getByText(contributeSlide.subtitle ?? '')).toBeVisible()
      await expect(page.getByText(contributeSlide.cards[0].title)).toBeVisible()
      await expect(page.getByRole('link', { name: contributeSlide.cards[0].url_label })).toHaveAttribute(
        'href',
        contributeSlide.cards[0].url,
      )
      break
    }
    case 'thank-you':
      await expect(page.getByRole('heading', { name: /thank you/i })).toBeVisible()
      await expect(page.getByText(/see you next quarter/i)).toBeVisible()
      await expect(page.getByRole('link', { name: 'GitHub Repo' })).toHaveAttribute(
        'href',
        site.links.repository.url,
      )
      break
  }
}

for (const [index, slide] of enabledSlides.entries()) {
  test(`renders slide ${index + 1}: ${slide.kind}`, async ({ page }) => {
    await page.goto(`/presentations/2026-q1?slide=${index + 1}`)

    await assertSlideContent(page, slide)
  })
}
