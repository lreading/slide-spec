import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { contentRepository } from '../content/ContentRepository'
import AppFooter from './AppFooter.vue'

describe('AppFooter', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the configured repository label and URL', () => {
    const wrapper = mount(AppFooter)

    expect(wrapper.get('.app-footer__link').attributes('href')).toBe(
      'https://github.com/lreading/td-project-updates',
    )
    expect(wrapper.text()).toContain('github.com/lreading/td-project-updates')
  })

  it('falls back to default repository values when footer config is missing', () => {
    vi.spyOn(contentRepository, 'getSiteContent').mockReturnValue({
      title: 'Threat Dragon Quarterly Updates',
      tagline: 'Quarterly updates',
      home_intro: 'Intro',
      home_cta_label: 'Latest',
      presentations_cta_label: 'Presentations',
      links: {
        repository: {
          label: 'Repo',
          url: 'https://example.com/repo',
        },
      },
    })

    const wrapper = mount(AppFooter)

    expect(wrapper.get('.app-footer__link').attributes('href')).toBe(
      'https://github.com/lreading/td-project-updates',
    )
    expect(wrapper.text()).toContain('github.com/lreading/td-project-updates')
  })
})
