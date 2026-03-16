import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import FloatingMascot from './FloatingMascot.vue'

describe('FloatingMascot', () => {
  it('renders the mascot image with default sizing', () => {
    const wrapper = mount(FloatingMascot, {
      props: {
        src: '/cupcake.png',
        alt: 'Cupcake Mascot',
      },
    })

    const image = wrapper.get('img')

    expect(image.attributes('src')).toBe('/cupcake.png')
    expect(image.attributes('alt')).toBe('Cupcake Mascot')
    expect(wrapper.attributes('style')).toContain('--floating-mascot-size: 12rem')
  })

  it('supports custom size and glow opacity', () => {
    const wrapper = mount(FloatingMascot, {
      props: {
        src: '/cupcake.png',
        alt: 'Cupcake Mascot',
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
        src: '/cupcake.png',
      },
    })

    expect(wrapper.get('img').attributes('alt')).toBeUndefined()
  })
})
