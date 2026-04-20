import { mount, RouterLinkStub } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { contentRepository } from '../content/ContentRepository'
import HomeView from './HomeView.vue'

describe('HomeView', () => {
  const normalizeText = (value: string): string => value.replace(/\s+/g, ' ').trim()

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the landing page hero, footer links, and CTA links', () => {
    vi.spyOn(contentRepository, 'getSiteContent').mockReturnValue({
      ...contentRepository.getSiteContent(),
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
    })

    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const text = normalizeText(wrapper.text())

    expect(text).toContain('Aurora Notes')
    expect(text).toContain('Community Updates')
    expect(text).toContain('Quarterly community updates, published as a static presentation app.')
    expect(text).toContain('Demo Lab Project')
    expect(wrapper.find('.project-badge-pill .fa-flask').exists()).toBe(true)
    expect(text).toContain('View latest presentation')
    expect(text).toContain('View all presentations')
    expect(text).toContain('Aurora Notes Docs')
    expect(text).toContain('Demo Project')
    expect(wrapper.get('a[href="https://example.org/projects/aurora-notes/"]').text()).toBe('Demo Project')
    expect(wrapper.find('img[alt="Demo project logo"]').exists()).toBe(true)
    expect(text).toContain('github.com/example-org/aurora-notes')
  })

  it('falls back to the first presentation when none are featured', () => {
    vi.spyOn(contentRepository, 'listPresentations').mockReturnValue([
      {
        id: '2026-q3',
        year: 2026,
        title: 'Fallback Quarterly Update',
        subtitle: 'Q3 2026',
        summary: 'Fallback summary',
        presentation_path: 'presentations/2026-q3/presentation.yaml',
        published: true,
        featured: false,
      },
    ])

    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const links = wrapper.findAllComponents(RouterLinkStub)

    expect(links[0].props('to')).toEqual({
      name: 'presentation',
      params: { presentationId: '2026-q3' },
    })
    expect(wrapper.get('a[href="https://docs.example.org/aurora-notes"]').text()).toBe('Aurora Notes Docs')
  })

  it('omits home hero headings when hero config is missing', () => {
    vi.spyOn(contentRepository, 'getSiteContent').mockReturnValue({
      title: 'Aurora Notes Quarterly Updates',
      home_intro: 'Fallback intro',
      home_cta_label: 'View latest presentation',
      presentations_cta_label: 'View all presentations',
      links: {
        repository: {
          label: 'GitHub Repo',
          url: 'https://github.com/example-org/aurora-notes',
        },
      },
    })

    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.find('.hero-title').exists()).toBe(false)
    expect(wrapper.find('.hero-subtitle').exists()).toBe(false)
    expect(wrapper.text()).toContain('Fallback intro')
  })

  it('omits the featured presentation CTA when there are no presentations', () => {
    vi.spyOn(contentRepository, 'listPresentations').mockReturnValue([])

    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const links = wrapper.findAllComponents(RouterLinkStub)

    expect(links).toHaveLength(1)
    expect(links[0].props('to')).toEqual({ name: 'presentations' })
    expect(wrapper.get('a[href="https://docs.example.org/aurora-notes"]').text()).toBe('Aurora Notes Docs')
  })

  it('renders accent-only hero content and omits optional intro and mascot', () => {
    vi.spyOn(contentRepository, 'getSiteContent').mockReturnValue({
      title: 'Aurora Notes Quarterly Updates',
      home_intro: '',
      home_cta_label: 'View latest presentation',
      presentations_cta_label: 'View all presentations',
      home_hero: {
        title_accent: 'Slide Spec',
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
      mascot: {
        url: '',
        alt: '   ',
      },
      links: {
        repository: {
          label: 'GitHub Repo',
          url: 'https://github.com/example-org/aurora-notes',
        },
      },
    })

    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.find('.hero-title').text()).toBe('Slide Spec')
    expect(wrapper.find('.accent-text').text()).toBe('Slide Spec')
    expect(wrapper.find('.hero-description').exists()).toBe(false)
    expect(wrapper.find('.mascot-wrap').exists()).toBe(false)
    expect(wrapper.find('.home-logo-links').exists()).toBe(false)
  })
})
