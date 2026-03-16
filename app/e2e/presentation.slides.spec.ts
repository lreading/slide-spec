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
      await expect(
        page.getByRole('heading', {
          name: new RegExp(`${slide.title_primary ?? ''}\\s+${slide.title_accent ?? ''}`, 'i'),
        }),
      ).toBeVisible()
      await expect(page.getByText(slide.subtitle_prefix ?? '')).toBeVisible()
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
      await expect(page.getByText(recentSlide.title ?? '')).toBeVisible()
      await expect(page.getByText(recentSlide.subtitle ?? '')).toBeVisible()
      for (const section of recentSlide.sections) {
        await expect(page.getByText(section.title)).toBeVisible()
        for (const bullet of section.bullets) {
          await expect(page.getByText(bullet)).toBeVisible()
        }
      }
      break
    }
    case 'releases': {
      const releasesSlide: ReleasesSlide = slide
      const releases = releasesSlide.featured_release_ids
        .map((id) => record.generated.releases.find((entry) => entry.id === id))
        .filter((entry) => entry !== undefined)
      await expect(page.getByText(releasesSlide.subtitle ?? '')).toBeVisible()
      for (const release of releases) {
        await expect(page.getByRole('link', { name: release.version })).toHaveAttribute(
          'href',
          release.url,
        )
        for (const bullet of release.summary_bullets) {
          await expect(page.getByText(bullet)).toBeVisible()
        }
      }
      break
    }
    case 'roadmap': {
      const roadmapSlide: RoadmapSlide = slide
      const section = record.deck.roadmap?.sections[roadmapSlide.stage]
      await expect(page.getByText(`Roadmap: ${section?.label}`)).toBeVisible()
      await expect(page.getByText('Key deliverables')).toBeVisible()
      await expect(page.getByText('Focus areas')).toBeVisible()
      for (const stage of Object.values(record.deck.roadmap?.sections ?? {})) {
        await expect(page.getByText(stage.label, { exact: true }).first()).toBeVisible()
      }
      await expect(page.getByText(section?.summary ?? '', { exact: true }).first()).toBeVisible()
      for (const item of section?.items ?? []) {
        await expect(page.getByText(item)).toBeVisible()
      }
      for (const theme of section?.themes ?? []) {
        await expect(page.getByText(theme.category, { exact: true }).first()).toBeVisible()
        await expect(page.getByText(theme.target)).toBeVisible()
      }
      await expect(page.getByRole('link', { name: /view full roadmap & milestones on github/i })).toHaveAttribute(
        'href',
        site.links.repository.url,
      )
      break
    }
    case 'contributor-spotlight': {
      const contributorSlide: ContributorSpotlightSlide = slide
      await expect(page.getByText(contributorSlide.subtitle ?? '')).toBeVisible()
      for (const spotlight of contributorSlide.spotlight) {
        const contributor = record.generated.contributors.authors.find(
          (entry) => entry.login === spotlight.login,
        )
        await expect(page.getByRole('heading', { name: contributor?.name ?? '' })).toBeVisible()
        await expect(page.getByRole('link', { name: `@${spotlight.login}` })).toHaveAttribute(
          'href',
          `https://github.com/${spotlight.login}`,
        )
        await expect(page.getByText(spotlight.summary)).toBeVisible()
      }
      const contributorsLinkLabel = contributorSlide.contributors_link_label ?? 'contributors'
      await expect(
        page.getByRole('link', {
          name: new RegExp(`${record.generated.contributors.total}\\s+${contributorsLinkLabel}`, 'i'),
        }),
      ).toHaveAttribute('href', `${site.links.repository.url}/graphs/contributors`)
      break
    }
    case 'community-highlights': {
      const communitySlide: CommunityHighlightsSlide = slide
      await expect(page.getByText(communitySlide.title ?? '')).toBeVisible()
      await expect(page.getByText(communitySlide.subtitle ?? '')).toBeVisible()
      await expect(
        page.getByText(communitySlide.section_heading ?? '', { exact: true }).first(),
      ).toBeVisible()
      await expect(page.getByText(communitySlide.stats_heading ?? 'Stats This Quarter')).toBeVisible()
      for (const statKey of communitySlide.stat_keys) {
        const stat = record.generated.stats[statKey]
        await expect(page.getByText(stat.label)).toBeVisible()
        await expect(page.getByText(stat.current.toLocaleString(), { exact: true })).toBeVisible()
      }
      for (const mention of communitySlide.mentions) {
        await expect(page.getByText(mention.type)).toBeVisible()
        await expect(page.getByText(mention.title)).toBeVisible()
        if (mention.url && mention.url_label) {
          await expect(page.getByRole('link', { name: new RegExp(mention.url_label, 'i') }).first()).toHaveAttribute(
            'href',
            mention.url,
          )
        }
      }
      break
    }
    case 'how-to-contribute': {
      const contributeSlide: HowToContributeSlide = slide
      await expect(page.getByText(contributeSlide.title ?? '')).toBeVisible()
      await expect(page.getByText(contributeSlide.subtitle ?? '')).toBeVisible()
      for (const card of contributeSlide.cards) {
        await expect(page.getByText(card.title)).toBeVisible()
        await expect(page.getByText(card.description)).toBeVisible()
        await expect(page.getByRole('link', { name: card.url_label })).toHaveAttribute('href', card.url)
      }
      await expect(page.getByText(contributeSlide.footer_text ?? 'Open Source and Community Driven')).toBeVisible()
      await expect(page.getByRole('link', { name: site.links.repository.label })).toHaveAttribute(
        'href',
        site.links.repository.url,
      )
      break
    }
    case 'thank-you':
      await expect(page.getByRole('heading', { name: /thank you/i })).toBeVisible()
      await expect(page.getByText(slide.message)).toBeVisible()
      await expect(page.getByText(site.links.repository.eyebrow ?? '')).toBeVisible()
      await expect(page.getByText(site.links.docs.eyebrow ?? '')).toBeVisible()
      await expect(page.getByText(site.links.owasp.eyebrow ?? '')).toBeVisible()
      await expect(page.getByRole('link', { name: site.links.repository.label })).toHaveAttribute(
        'href',
        site.links.repository.url,
      )
      await expect(page.getByRole('link', { name: site.links.docs.label })).toHaveAttribute(
        'href',
        site.links.docs.url,
      )
      await expect(page.getByRole('link', { name: site.links.owasp.label })).toHaveAttribute(
        'href',
        site.links.owasp.url,
      )
      await expect(page.getByText(`"${slide.quote ?? site.tagline}"`)).toBeVisible()
      await expect(
        page.getByText(site.presentation_chrome?.mark_label ?? site.navigation?.brand_title ?? site.title, {
          exact: true,
        }),
      ).toBeVisible()
      break
  }
}

for (const [index, slide] of enabledSlides.entries()) {
  test(`renders slide ${index + 1}: ${slide.kind}`, async ({ page }) => {
    await page.goto(`/presentations/2026-q1?slide=${index + 1}`)

    await assertSlideContent(page, slide)
  })
}
