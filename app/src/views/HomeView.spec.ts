import { mount, RouterLinkStub } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { contentRepository } from '../content/ContentRepository'
import HomeView from './HomeView.vue'

describe('HomeView', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the landing page hero, footer links, and CTA links', () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('OWASP Threat Dragon')
    expect(wrapper.text()).toContain('Community Updates')
    expect(wrapper.text()).toContain('Quarterly community updates, published as a static presentation app.')
    expect(wrapper.text()).toContain('OWASP Lab Project')
    expect(wrapper.find('.project-badge-pill .fa-flask').exists()).toBe(true)
    expect(wrapper.text()).toContain('View latest presentation')
    expect(wrapper.text()).toContain('View all presentations')
    expect(wrapper.text()).toContain('github.com/OWASP/threat-dragon')
  })

  it('falls back to the first presentation when none are featured', () => {
    vi.spyOn(contentRepository, 'listPresentations').mockReturnValue([
      {
        id: '2026-q3',
        year: 2026,
        quarter: 3,
        title: 'Fallback Quarterly Update',
        subtitle: 'Q3 2026',
        summary: 'Fallback summary',
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

    expect(wrapper.findAllComponents(RouterLinkStub)[0].props('to')).toEqual({
      name: 'presentation',
      params: { presentationId: '2026-q3' },
    })
  })

  it('falls back to default home hero text when hero config is missing', () => {
    vi.spyOn(contentRepository, 'getSiteContent').mockReturnValue({
      title: 'Threat Dragon Quarterly Updates',
      tagline: 'making threat modeling less threatening',
      home_intro: 'Fallback intro',
      home_cta_label: 'View latest presentation',
      presentations_cta_label: 'View all presentations',
      links: {
        repository: {
          label: 'GitHub Repo',
          url: 'https://github.com/OWASP/threat-dragon',
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

    expect(wrapper.text()).toContain('OWASP Threat Dragon')
    expect(wrapper.text()).toContain('Community Updates')
    expect(wrapper.text()).toContain('Fallback intro')
  })
})
