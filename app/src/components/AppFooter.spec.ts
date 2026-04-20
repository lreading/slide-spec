import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { contentRepository } from '../content/ContentRepository'
import AppFooter from './AppFooter.vue'

describe('AppFooter', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders attribution by default', () => {
    const wrapper = mount(AppFooter)

    const links = wrapper.findAll('.app-footer__link')

    expect(links).toHaveLength(1)
    expect(links[0].attributes('href')).toBe('https://github.com/lreading/slide-spec')
    expect(links[0].attributes('aria-label')).toBe('Powered by slide-spec')
    expect(wrapper.text()).toContain('github.com/lreading/slide-spec')
  })

  it('renders the repository footer link when configured', () => {
    vi.spyOn(contentRepository, 'getSiteContent').mockReturnValue({
      title: 'Aurora Notes Quarterly Updates',
      home_intro: 'Intro',
      home_cta_label: 'Latest',
      presentations_cta_label: 'Presentations',
      app_footer: {
        repository_label: 'Project Repo',
        repository_url: 'https://example.com/repo',
      },
      attribution: {
        enabled: false,
      },
      links: {
        repository: {
          label: 'Repo',
          url: 'https://example.com/repo',
        },
      },
    })

    const wrapper = mount(AppFooter)

    const links = wrapper.findAll('.app-footer__link')

    expect(links).toHaveLength(1)
    expect(links[0].attributes('href')).toBe('https://example.com/repo')
    expect(links[0].attributes('aria-label')).toBe('Project Repo')
    expect(wrapper.text()).toContain('example.com/repo')
  })

  it('hides the footer when repository and attribution are both unavailable', () => {
    vi.spyOn(contentRepository, 'getSiteContent').mockReturnValue({
      title: 'Aurora Notes Quarterly Updates',
      home_intro: 'Intro',
      home_cta_label: 'Latest',
      presentations_cta_label: 'Presentations',
      links: {
        repository: {
          label: 'Repo',
          url: 'https://example.com/repo',
        },
      },
      attribution: {
        enabled: false,
      },
    })

    const wrapper = mount(AppFooter)

    expect(wrapper.find('.app-footer').exists()).toBe(false)
  })
})
