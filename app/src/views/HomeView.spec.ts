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
    expect(wrapper.text()).toContain('Community Update')
    expect(wrapper.text()).toContain('OWASP Lab Project')
    expect(wrapper.find('.glass-badge .fa-flask').exists()).toBe(true)
    expect(wrapper.text()).toContain('View latest update')
    expect(wrapper.text()).toContain('Browse archive')
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

    expect(wrapper.text()).toContain('Q3 2026')
  })
})
