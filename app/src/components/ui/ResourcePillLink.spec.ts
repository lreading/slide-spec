import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ResourcePillLink from './ResourcePillLink.vue'

describe('ResourcePillLink', () => {
  it('renders a linked pill with eyebrow and title', () => {
    const wrapper = mount(ResourcePillLink, {
      props: {
        href: 'https://example.com',
        icon: ['fab', 'github'],
        eyebrow: 'Source Code',
        title: 'GitHub Repo',
      },
    })

    expect(wrapper.attributes('href')).toBe('https://example.com')
    expect(wrapper.text()).toContain('Source Code')
    expect(wrapper.text()).toContain('GitHub Repo')
  })

  it('supports title-only pills', () => {
    const wrapper = mount(ResourcePillLink, {
      props: {
        href: 'https://example.com',
        icon: 'book',
        title: 'Read the Docs',
      },
    })

    expect(wrapper.text()).toContain('Read the Docs')
    expect(wrapper.find('.resource-pill-link__eyebrow').exists()).toBe(false)
  })
})
