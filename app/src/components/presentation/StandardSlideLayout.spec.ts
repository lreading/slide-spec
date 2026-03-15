import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import StandardSlideLayout from './StandardSlideLayout.vue'

describe('StandardSlideLayout', () => {
  it('renders title, subtitle, dots, and slot content by default', () => {
    const wrapper = mount(StandardSlideLayout, {
      props: {
        title: 'Roadmap',
        subtitle: 'Future direction',
        slideNumber: 4,
      },
      slots: {
        default: '<div class="slot-marker">Body</div>',
      },
    })

    expect(wrapper.text()).toContain('Roadmap')
    expect(wrapper.text()).toContain('Future direction')
    expect(wrapper.text()).toContain('04')
    expect(wrapper.find('.bg-dots').exists()).toBe(true)
    expect(wrapper.find('.slot-marker').exists()).toBe(true)
  })

  it('supports hiding subtitle and decorative dots', () => {
    const wrapper = mount(StandardSlideLayout, {
      props: {
        title: 'Agenda',
        slideNumber: 2,
        showDots: false,
      },
    })

    expect(wrapper.text()).toContain('Agenda')
    expect(wrapper.find('.subtitle').exists()).toBe(false)
    expect(wrapper.find('.bg-dots').exists()).toBe(false)
  })
})
