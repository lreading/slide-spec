import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import FloatingMascot from './FloatingMascot.vue'

describe('FloatingMascot', () => {
  it('renders the mascot image with default sizing', () => {
    const wrapper = mount(FloatingMascot, {
      props: {
        src: '/mascot.svg',
        alt: 'Demo mascot',
      },
    })

    const image = wrapper.get('img')

    expect(image.attributes('src')).toBe('/mascot.svg')
    expect(image.attributes('alt')).toBe('Demo mascot')
    expect(wrapper.attributes('style')).toContain('--floating-mascot-size: 12rem')
  })

  it('supports custom size and glow opacity', () => {
    const wrapper = mount(FloatingMascot, {
      props: {
        src: '/mascot.svg',
        alt: 'Demo mascot',
        size: '200px',
        glowOpacity: 0.55,
      },
    })

    expect(wrapper.attributes('style')).toContain('--floating-mascot-size: 200px')
    expect(wrapper.attributes('style')).toContain('--floating-mascot-glow-opacity: 0.55')
  })

  it('omits the alt attribute when none is provided', () => {
    const wrapper = mount(FloatingMascot, {
      props: {
        src: '/mascot.svg',
      },
    })

    expect(wrapper.get('img').attributes('alt')).toBeUndefined()
  })
})
