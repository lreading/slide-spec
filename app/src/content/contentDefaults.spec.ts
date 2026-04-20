import { describe, expect, it } from 'vitest'

import { contentRepository } from './ContentRepository'
import {
  resolveAttributionContent,
  resolveAppFooterContent,
  resolveHomeHeroContent,
  resolveHomeLogos,
  resolveNavigationContent,
  resolvePresentationChromeLabel,
  resolvePresentationsPageContent,
  resolvePresentationToolbarContent,
  resolveRoadmapLabels,
  resolveTitleSlideContent,
} from './contentDefaults'

describe('contentDefaults', () => {
  const site = contentRepository.getSiteContent()
  const record = contentRepository.getPresentation('2026-q1')
  const titleSlide = record.presentation.slides.find((slide) => slide.template === 'hero')
  const roadmapSlide = record.presentation.slides.find((slide) => slide.template === 'progress-timeline')

  if (!titleSlide || titleSlide.template !== 'hero') {
    throw new Error('Expected title slide in fixture data')
  }

  if (!roadmapSlide || roadmapSlide.template !== 'progress-timeline') {
    throw new Error('Expected roadmap slide in fixture data')
  }

  it('normalizes configured site content', () => {
    expect(resolveNavigationContent(site)).toEqual({
      brand_title: 'Aurora Notes Updates',
      home_label: 'Home',
      presentations_label: 'Presentations',
      latest_presentation_label: 'Latest Presentation',
      docs_enabled: true,
      toggle_label: 'Toggle navigation',
    })
    expect(resolveAppFooterContent(site)).toEqual({
      repository_label: undefined,
      repository_url: undefined,
    })
    expect(resolveAttributionContent(site)).toEqual({
      enabled: true,
      label: 'Powered by slide-spec',
      url: 'https://github.com/lreading/slide-spec',
    })
    expect(resolvePresentationToolbarContent(site)).toEqual({
      navigation_label: 'Slide navigation',
      previous_slide_label: 'Previous slide',
      next_slide_label: 'Next slide',
      presentation_mode_label: 'Presentation mode',
      shortcut_help_title: 'Keyboard shortcuts',
      shortcut_help_body: 'Use Left and Right to move, Space or Enter for next, and Escape to exit presentation mode.',
      shortcut_help_dismiss_label: 'Do not show again',
    })
    expect(resolvePresentationsPageContent(site).search_placeholder).toBe('Search presentations...')
    expect(resolvePresentationsPageContent(site).page_of_label).toBe('of')
    expect(resolveHomeHeroContent(site)).toEqual({
      title_primary: 'Aurora',
      title_accent: 'Notes',
      subtitle: 'Community Updates',
    })
    expect(resolveHomeLogos({
      ...site,
      home_logos: [
        {
          name: 'Demo Project',
          url: 'https://example.org/projects/aurora-notes/',
          logo: {
            url: 'content/assets/aurora-notes-logo.svg',
            alt: 'Demo project logo',
          },
        },
      ],
    })).toEqual([
      {
        name: 'Demo Project',
        url: 'https://example.org/projects/aurora-notes/',
        logo: {
          url: 'content/assets/aurora-notes-logo.svg',
          alt: 'Demo project logo',
        },
      },
    ])
    expect(resolvePresentationChromeLabel(site)).toBe('Aurora Notes')
  })

  it('falls back to presentations-page defaults when page copy is blank', () => {
    const blankSite = {
      ...site,
      navigation: {
        brand_title: '   ',
        home_label: '   ',
        presentations_label: '   ',
        latest_presentation_label: '   ',
        toggle_label: '   ',
      },
      attribution: {
        label: '   ',
        url: '   ',
      },
      presentation_chrome: {
        mark_label: '   ',
      },
      presentation_toolbar: {
        navigation_label: '   ',
        previous_slide_label: '   ',
        next_slide_label: '   ',
        presentation_mode_label: '   ',
        shortcut_help_title: '   ',
        shortcut_help_body: '   ',
        shortcut_help_dismiss_label: '   ',
      },
      home_hero: {
        title_primary: '   ',
        title_accent: '   ',
        subtitle: '   ',
      },
      home_logos: [
        {
          name: '   ',
          url: '   ',
          logo: {
            url: '   ',
            alt: '   ',
          },
        },
      ],
      presentations_page: {
        title: '   ',
        search_label: '   ',
        search_placeholder: '   ',
        year_label: '   ',
        all_years_label: '   ',
        open_presentation_label: '   ',
        empty_title: '   ',
        empty_message: '   ',
        previous_page_label: '   ',
        next_page_label: '   ',
        page_label: '   ',
        page_of_label: '   ',
        showing_label: '   ',
        total_label: '   ',
        presentation_singular_label: '   ',
        presentation_plural_label: '   ',
      },
    }

    expect(resolveNavigationContent(blankSite).brand_title).toBeUndefined()
    expect(resolveNavigationContent(blankSite).docs_enabled).toBe(true)
    expect(resolveAppFooterContent(blankSite).repository_label).toBeUndefined()
    expect(resolveAttributionContent(blankSite)).toEqual({
      enabled: true,
      label: 'Powered by slide-spec',
      url: 'https://github.com/lreading/slide-spec',
    })
    expect(resolvePresentationToolbarContent(blankSite).presentation_mode_label).toBeUndefined()
    expect(resolvePresentationsPageContent(blankSite)).toEqual({
      title: 'All presentations',
      search_label: 'Search',
      search_placeholder: 'Search presentations...',
      year_label: 'Year',
      all_years_label: 'All years',
      open_presentation_label: 'Open presentation',
      empty_title: 'No matching presentations',
      empty_message: 'Try a different year or a broader search term.',
      previous_page_label: 'Previous',
      next_page_label: 'Next',
      page_label: 'Page',
      page_of_label: 'of',
      showing_label: 'Showing',
      total_label: 'total',
      presentation_singular_label: 'presentation',
      presentation_plural_label: 'presentations',
    })
    expect(resolveHomeHeroContent(blankSite).title_primary).toBeUndefined()
    expect(resolveHomeLogos(blankSite)).toEqual([])
    expect(resolvePresentationChromeLabel(blankSite)).toBeUndefined()
  })

  it('respects an explicit disabled docs nav toggle', () => {
    expect(
      resolveNavigationContent({
        ...site,
        navigation: {
          ...site.navigation,
          docs_enabled: false,
        },
      }),
    ).toMatchObject({
      docs_enabled: false,
    })
  })

  it('normalizes authored slide and roadmap labels', () => {
    expect(resolveTitleSlideContent(titleSlide)).toEqual({
      titlePrimary: 'Aurora',
      titleAccent: 'Notes',
      subtitlePrefix: 'Community Update',
    })
    expect(resolveRoadmapLabels(roadmapSlide.content)).toEqual({
      deliverables: 'Key deliverables',
      focusAreas: 'Focus areas',
      footerLink: 'View full roadmap & milestones on GitHub',
    })
  })

  it('returns undefined for blank title-slide and roadmap labels', () => {
    expect(
      resolveTitleSlideContent({
        ...titleSlide,
        content: {
          ...titleSlide.content,
          title_primary: '   ',
          title_accent: '   ',
          subtitle_prefix: '   ',
        },
      }),
    ).toEqual({
      titlePrimary: undefined,
      titleAccent: undefined,
      subtitlePrefix: undefined,
    })

    expect(
      resolveRoadmapLabels({
        ...roadmapSlide.content,
        deliverables_heading: '   ',
        focus_areas_heading: '   ',
        footer_link_label: '   ',
      }),
    ).toEqual({
      deliverables: undefined,
      focusAreas: undefined,
      footerLink: undefined,
    })
  })
})
