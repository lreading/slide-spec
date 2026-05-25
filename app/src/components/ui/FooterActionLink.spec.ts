import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import FooterActionLink from './FooterActionLink.vue'

describe('FooterActionLink', () => {
  it('renders a compact external action link', () => {
    const wrapper = mount(FooterActionLink, {
      props: {
        href: 'https://example.com',
        faIcon: 'fa-github',
        label: 'Open on GitHub',
      },
    })

    expect(wrapper.attributes('href')).toBe('https://example.com')
    expect(wrapper.text()).toContain('Open on GitHub')
    expect(wrapper.classes()).toContain('footer-action-link--end')
  })

  it('supports alternate alignment', () => {
    const wrapper = mount(FooterActionLink, {
      props: {
        href: 'https://example.com',
        faIcon: 'fa-code',
        label: 'Source',
        align: 'start',
      },
    })

    expect(wrapper.classes()).toContain('footer-action-link--start')
  })
})
