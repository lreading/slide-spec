import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import HomeLogoLinks from './HomeLogoLinks.vue'

describe('HomeLogoLinks', () => {
  it('renders compact logo links', () => {
    const wrapper = mount(HomeLogoLinks, {
      props: {
        logos: [
          {
            name: 'Aurora Notes',
            url: 'https://example.org/aurora-notes',
            logo: {
              url: 'content/assets/aurora-notes-logo.svg',
              alt: 'Aurora Notes logo',
            },
          },
        ],
      },
    })

    const link = wrapper.get('a.home-logo-links__item')
    const image = wrapper.get('img.home-logo-links__image')

    expect(link.attributes('href')).toBe('https://example.org/aurora-notes')
    expect(link.text()).toContain('Aurora Notes')
    expect(image.attributes('src')).toContain('data:image/svg+xml')
    expect(image.attributes('alt')).toBe('Aurora Notes logo')
  })

  it('omits the section when no logos are configured', () => {
    const wrapper = mount(HomeLogoLinks, {
      props: {
        logos: [],
      },
    })

    expect(wrapper.find('.home-logo-links').exists()).toBe(false)
  })

  it('omits an image when a logo URL resolves to blank', () => {
    const wrapper = mount(HomeLogoLinks, {
      props: {
        logos: [
          {
            name: 'Blank Mark',
            url: 'https://example.org/blank-mark',
            logo: {
              url: '   ',
              alt: 'Blank mark logo',
            },
          },
        ],
      },
    })

    expect(wrapper.find('.home-logo-links').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('Blank Mark')
  })
})
