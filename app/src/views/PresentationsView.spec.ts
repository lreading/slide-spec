import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { contentRepository } from '../content/ContentRepository'
import PresentationsView from './PresentationsView.vue'

describe('PresentationsView', () => {
  const normalizeText = (value: string): string => value.replace(/\s+/g, ' ').trim()

  beforeEach(() => {
    vi.spyOn(contentRepository, 'getSiteContent').mockReturnValue({
      title: 'Threat Dragon Updates',
      home_intro: 'Intro',
      home_cta_label: 'Latest',
      presentations_cta_label: 'Presentations',
      presentations_page: {
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
      },
      links: {},
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the available presentations', () => {
    vi.spyOn(contentRepository, 'listPresentations').mockReturnValue([
      {
        id: '2026-q1',
        year: 2026,
        title: 'Q1 2026',
        subtitle: 'Q1 2026',
        summary: 'Latest quarterly update',
        published: true,
        featured: true,
      },
    ])

    const wrapper = mount(PresentationsView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('All presentations')
    expect(wrapper.text()).toContain('Q1 2026')
    expect(wrapper.find('.presentations-primary-link').exists()).toBe(true)
    expect(wrapper.findComponent(RouterLinkStub).props('to')).toEqual({
      name: 'presentation',
      params: { presentationId: '2026-q1' },
    })
  })

  it('filters by search text and year', async () => {
    vi.spyOn(contentRepository, 'listPresentations').mockReturnValue([
      {
        id: '2026-q2',
        year: 2026,
        title: 'Weekly Update 10',
        subtitle: 'Week 10, 2026',
        summary: 'Weekly cadence',
        published: true,
        featured: false,
      },
      {
        id: '2025-q4',
        year: 2025,
        title: 'Quarterly Review',
        subtitle: 'October 2025',
        summary: 'Year-end wrap-up',
        published: true,
        featured: false,
      },
    ])

    const wrapper = mount(PresentationsView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    await wrapper.get('.presentations-input').setValue('weekly')
    expect(wrapper.text()).toContain('Weekly Update 10')
    expect(wrapper.text()).not.toContain('Quarterly Review')

    await wrapper.get('.presentations-select').setValue('2025')
    expect(wrapper.text()).toContain('No matching presentations')
  })

  it('paginates long archives', async () => {
    vi.spyOn(contentRepository, 'listPresentations').mockReturnValue(
      Array.from({ length: 13 }, (_, index) => ({
        id: `2026-w${index + 1}`,
        year: 2026,
        title: `Weekly Update ${index + 1}`,
        subtitle: `Week ${index + 1}`,
        summary: 'Archive pagination test',
        published: true,
        featured: false,
      })),
    )

    const wrapper = mount(PresentationsView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(normalizeText(wrapper.text())).toContain('13 presentations total')
    expect(normalizeText(wrapper.text())).toContain('Page 1 of 2 · Showing 1-12')
    await wrapper.get('.presentations-page-button:last-child').trigger('click')
    expect(normalizeText(wrapper.text())).toContain('Page 2 of 2 · Showing 13-13')
    expect(normalizeText(wrapper.text())).toContain('Weekly Update 13')
  })

  it('renders condensed pagination for very large archives', () => {
    vi.spyOn(contentRepository, 'listPresentations').mockReturnValue(
      Array.from({ length: 6204 }, (_, index) => ({
        id: `2026-w${index + 1}`,
        year: 2026,
        title: `Presentation ${index + 1}`,
        subtitle: `Window ${index + 1}`,
        summary: 'Large presentations test',
        published: true,
        featured: false,
      })),
    )

    const wrapper = mount(PresentationsView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const labels = wrapper
      .findAll('.presentations-page-button')
      .map((button) => button.text())

    expect(labels).toEqual(['Previous', '1', '2', '…', '517', 'Next'])
  })

  it('omits configurable chrome when presentations-page labels are missing', () => {
    vi.spyOn(contentRepository, 'getSiteContent').mockReturnValue({
      title: 'Threat Dragon Updates',
      home_intro: 'Intro',
      home_cta_label: 'Latest',
      presentations_cta_label: 'Presentations',
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
      links: {},
    })
    vi.spyOn(contentRepository, 'listPresentations').mockReturnValue([
      {
        id: '2026-q1',
        year: 2026,
        title: 'Q1 2026',
        subtitle: 'January to March 2026',
        summary: 'Latest quarterly update',
        published: true,
        featured: true,
      },
    ])

    const wrapper = mount(PresentationsView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.find('.presentations-eyebrow').exists()).toBe(false)
    expect(wrapper.find('.presentations-field__label').exists()).toBe(false)
    expect(wrapper.find('.presentations-link').text()).toBe('')
  })
})
