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
const enabledSlides = record.presentation.slides.filter((slide) => slide.enabled)

function formatFooterText(url: string): string {
  const parsed = new URL(url)
  const path = parsed.pathname.replace(/\/$/, '')

  return `${parsed.host}${path}`
}

function formatHeroTitle(primary: string | undefined, accent: string | undefined): string {
  return [primary, accent].filter(Boolean).join(' ')
}

function formatContributorsLinkLabel(total: number, label: string): string {
  return `${total} ${label}`
}

async function assertSlideContent(page: Page, slide: PresentationSlide): Promise<void> {
  switch (slide.template) {
    case 'hero':
      await expect(page.getByRole('heading', { name: /owasp threat dragon/i })).toBeVisible()
      await expect(
        page.getByRole('heading', {
          name: formatHeroTitle(slide.content.title_primary, slide.content.title_accent),
          exact: true,
        }),
      ).toBeVisible()
      await expect(page.getByText(slide.content.subtitle_prefix ?? '')).toBeVisible()
      await expect(page.getByText(String(slide.content.quote))).toBeVisible()
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
      await expect(page.getByText('Roadmap: Completed', { exact: true })).toBeVisible()
      await expect(page.getByText('Roadmap: Future', { exact: true })).toBeVisible()
      await expect(page.getByText('Thank You')).toBeVisible()
      break
    case 'section-list-grid': {
      const recentSlide: RecentUpdatesSlide = slide
      await expect(page.getByText(recentSlide.title ?? '')).toBeVisible()
      await expect(page.getByText(recentSlide.subtitle ?? '')).toBeVisible()
      for (const section of recentSlide.content.sections) {
        await expect(page.getByText(section.title)).toBeVisible()
        for (const bullet of section.bullets) {
          await expect(page.getByText(bullet)).toBeVisible()
        }
      }
      break
    }
    case 'timeline': {
      const releasesSlide: ReleasesSlide = slide
      const releases = releasesSlide.content.featured_release_ids
        .map((id: string) => record.generated.releases.find((entry) => entry.id === id))
        .filter((entry) => entry !== undefined)
      await expect(page.getByText(releasesSlide.subtitle ?? '')).toBeVisible()
      if (releases.length > 0) {
        for (const release of releases) {
          await expect(page.getByRole('link', { name: release.version })).toHaveAttribute(
            'href',
            release.url,
          )
          for (const bullet of release.summary_bullets) {
            await expect(page.getByText(bullet)).toBeVisible()
          }
        }
      } else {
        if (releasesSlide.content.empty_state_title) {
          await expect(page.getByText(releasesSlide.content.empty_state_title)).toBeVisible()
        }
        if (releasesSlide.content.empty_state_message) {
          await expect(page.getByText(releasesSlide.content.empty_state_message)).toBeVisible()
        }
      }
      if (releasesSlide.content.latest_badge_label && releases.length > 0) {
        await expect(
          page.getByText(releasesSlide.content.latest_badge_label, { exact: true }),
        ).toBeVisible()
      }
      if (releasesSlide.content.footer_link_label) {
        await expect(
          page.getByRole('link', { name: releasesSlide.content.footer_link_label }),
        ).toHaveAttribute('href', `${site.links.repository.url}/releases`)
      }
      break
    }
    case 'progress-timeline': {
      const roadmapSlide: RoadmapSlide = slide
      const stage = roadmapSlide.content.stages[roadmapSlide.content.stage]
      await expect(page.getByText(`Roadmap: ${stage?.label}`)).toBeVisible()
      await expect(page.getByText(roadmapSlide.content.deliverables_heading ?? 'Key deliverables')).toBeVisible()
      await expect(page.getByText(roadmapSlide.content.focus_areas_heading ?? 'Focus areas')).toBeVisible()
      for (const timelineStage of Object.values(roadmapSlide.content.stages)) {
        await expect(page.getByText(timelineStage.label, { exact: true }).first()).toBeVisible()
      }
      await expect(page.getByText(stage?.summary ?? '', { exact: true }).first()).toBeVisible()
      for (const item of roadmapSlide.content.items) {
        await expect(page.getByText(item)).toBeVisible()
      }
      for (const theme of roadmapSlide.content.themes) {
        await expect(page.getByText(theme.category, { exact: true }).first()).toBeVisible()
        await expect(page.getByText(theme.target)).toBeVisible()
      }
      if (roadmapSlide.content.footer_link_label) {
        await expect(page.getByRole('link', { name: roadmapSlide.content.footer_link_label })).toHaveAttribute(
          'href',
          site.links.repository.url,
        )
      }
      break
    }
    case 'people': {
      const contributorSlide: ContributorSpotlightSlide = slide
      await expect(page.getByText(contributorSlide.subtitle ?? '')).toBeVisible()
      for (const spotlight of contributorSlide.content.spotlight) {
        const contributor = record.generated.contributors.authors.find(
          (entry) => entry.login === spotlight.login,
        )
        await expect(
          page.getByRole('heading', { name: contributor?.name ?? spotlight.login }),
        ).toBeVisible()
        await expect(page.getByRole('link', { name: `@${spotlight.login}` })).toHaveAttribute(
          'href',
          `https://github.com/${spotlight.login}`,
        )
        await expect(page.getByText(spotlight.summary)).toBeVisible()
      }
      const contributorsLinkLabel = contributorSlide.content.contributors_link_label ?? 'contributors'
      await expect(
        page.getByRole('link', {
          name: formatContributorsLinkLabel(record.generated.contributors.total, contributorsLinkLabel),
          exact: true,
        }),
      ).toHaveAttribute('href', `${site.links.repository.url}/graphs/contributors`)
      break
    }
    case 'metrics-and-links': {
      const communitySlide: CommunityHighlightsSlide = slide
      await expect(page.getByText(communitySlide.title ?? '')).toBeVisible()
      await expect(page.getByText(communitySlide.subtitle ?? '')).toBeVisible()
      await expect(
        page.getByText(communitySlide.content.section_heading ?? '', { exact: true }).first(),
      ).toBeVisible()
      await expect(
        page.getByText(communitySlide.content.stats_heading ?? 'Stats This Quarter'),
      ).toBeVisible()
      for (const statKey of communitySlide.content.stat_keys) {
        const stat = record.generated.stats[statKey]
        await expect(page.getByText(stat.label)).toBeVisible()
        await expect(page.getByText(stat.current.toLocaleString(), { exact: true })).toBeVisible()
      }
      for (const mention of communitySlide.content.mentions) {
        await expect(page.getByText(mention.type, { exact: true }).first()).toBeVisible()
        await expect(page.getByText(mention.title)).toBeVisible()
        if (mention.url && mention.url_label) {
          await expect(
            page.locator(`a[href="${mention.url}"]`).filter({ has: page.getByText(mention.title) }).first(),
          ).toBeVisible()
        }
      }
      break
    }
    case 'action-cards': {
      const contributeSlide: HowToContributeSlide = slide
      await expect(page.getByText(contributeSlide.title ?? '')).toBeVisible()
      await expect(page.getByText(contributeSlide.subtitle ?? '')).toBeVisible()
      for (const card of contributeSlide.content.cards) {
        await expect(page.getByText(card.title)).toBeVisible()
        await expect(page.getByText(card.description)).toBeVisible()
        await expect(page.getByRole('link', { name: card.url_label })).toHaveAttribute('href', card.url)
      }
      await expect(
        page.getByText(contributeSlide.content.footer_text ?? 'Open Source and Community Driven'),
      ).toBeVisible()
      await expect(page.getByRole('link', { name: site.links.repository.label })).toHaveAttribute(
        'href',
        site.links.repository.url,
      )
      break
    }
    case 'closing':
      await expect(page.getByRole('heading', { name: /thank you/i })).toBeVisible()
      await expect(page.getByText(slide.content.message)).toBeVisible()
      await expect(page.getByText(site.links.repository.eyebrow ?? '')).toBeVisible()
      await expect(page.getByText(site.links.docs.eyebrow ?? '')).toBeVisible()
      await expect(page.getByText(site.links.community.eyebrow ?? '')).toBeVisible()
      await expect(page.getByRole('link', { name: site.links.repository.label })).toHaveAttribute(
        'href',
        site.links.repository.url,
      )
      await expect(page.getByRole('link', { name: site.links.docs.label })).toHaveAttribute(
        'href',
        site.links.docs.url,
      )
      await expect(page.getByRole('link', { name: site.links.community.label })).toHaveAttribute(
        'href',
        site.links.community.url,
      )
      if (slide.content.quote) {
        await expect(page.getByText(`"${slide.content.quote}"`)).toBeVisible()
      }
      if (site.presentation_chrome?.mark_label) {
        await expect(page.getByText(site.presentation_chrome.mark_label, { exact: true })).toBeVisible()
      }
      break
  }
}

for (const [index, slide] of enabledSlides.entries()) {
  test(`renders slide ${index + 1}: ${slide.template}`, async ({ page }) => {
    await page.goto(`/presentations/2026-q1?slide=${index + 1}`)

    await assertSlideContent(page, slide)
  })
}
