import { describe, expect, it } from 'vitest'

import { contentRepository } from './ContentRepository'
import {
  resolveAppFooterContent,
  resolveHomeHeroContent,
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

  if (!titleSlide || titleSlide.template !== 'hero') {
    throw new Error('Expected title slide in fixture data')
  }

  it('normalizes configured site content', () => {
    expect(resolveNavigationContent(site)).toEqual({
      brand_title: 'Threat Dragon Updates',
      home_label: 'Home',
      presentations_label: 'Presentations',
      latest_presentation_label: 'Latest Presentation',
      toggle_label: 'Toggle navigation',
    })
    expect(resolveAppFooterContent(site)).toEqual({
      repository_label: 'github.com/lreading/td-project-updates',
      repository_url: 'https://github.com/lreading/td-project-updates',
    })
    expect(resolvePresentationToolbarContent(site)).toEqual({
      navigation_label: 'Slide navigation',
      previous_slide_label: 'Previous slide',
      next_slide_label: 'Next slide',
      presentation_mode_label: 'Presentation mode',
    })
    expect(resolvePresentationsPageContent(site).search_placeholder).toBe('Search presentations...')
    expect(resolvePresentationsPageContent(site).page_of_label).toBe('of')
    expect(resolveHomeHeroContent(site)).toEqual({
      title_primary: 'OWASP',
      title_accent: 'Threat Dragon',
      subtitle: 'Community Updates',
    })
    expect(resolvePresentationChromeLabel(site)).toBe('Threat Dragon')
  })

  it('returns undefined for blank optional site content instead of using defaults', () => {
    const blankSite = {
      ...site,
      navigation: {
        brand_title: '   ',
        home_label: '   ',
        presentations_label: '   ',
        latest_presentation_label: '   ',
        toggle_label: '   ',
      },
      app_footer: {
        repository_label: '   ',
        repository_url: '   ',
      },
      presentation_chrome: {
        mark_label: '   ',
      },
      presentation_toolbar: {
        navigation_label: '   ',
        previous_slide_label: '   ',
        next_slide_label: '   ',
        presentation_mode_label: '   ',
      },
      home_hero: {
        title_primary: '   ',
        title_accent: '   ',
        subtitle: '   ',
      },
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
    expect(resolveAppFooterContent(blankSite).repository_label).toBeUndefined()
    expect(resolvePresentationToolbarContent(blankSite).presentation_mode_label).toBeUndefined()
    expect(resolvePresentationsPageContent(blankSite).title).toBeUndefined()
    expect(resolveHomeHeroContent(blankSite).title_primary).toBeUndefined()
    expect(resolvePresentationChromeLabel(blankSite)).toBeUndefined()
  })

  it('normalizes authored slide and roadmap labels', () => {
    expect(resolveTitleSlideContent(titleSlide)).toEqual({
      titlePrimary: 'OWASP',
      titleAccent: 'Threat Dragon',
      subtitlePrefix: 'Community Update',
    })
    expect(resolveRoadmapLabels(record.presentation)).toEqual({
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
        ...record.presentation,
        roadmap: {
          ...record.presentation.roadmap!,
          deliverables_heading: '   ',
          focus_areas_heading: '   ',
          footer_link_label: '   ',
        },
      }),
    ).toEqual({
      deliverables: undefined,
      focusAreas: undefined,
      footerLink: undefined,
    })
  })
})
