import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import SectionTitleSlideView from './SectionTitleSlideView.vue'

describe('SectionTitleSlideView', () => {
  const presentation = {
    id: 'demo',
    title: 'Demo',
    subtitle: 'Q1 Update',
    slides: [],
  }

  it('renders required title and optional image/subtitle', () => {
    const wrapper = mount(SectionTitleSlideView, {
      props: {
        presentation,
        slide: {
          template: 'section-title',
          enabled: true,
          content: {
            title: 'Platform Architecture',
            subtitle: 'Shared services and delivery paths',
            image_url: '/content/assets/architecture.svg',
            image_alt: 'Architecture icon',
          },
        },
        slideNumber: 2,
        slideTotal: 6,
      },
    })

    expect(wrapper.find('.section-title__title').text()).toBe('Platform Architecture')
    expect(wrapper.find('.section-title__subtitle').text()).toContain('Shared services')
    expect(wrapper.find('.section-title__image').attributes('alt')).toBe('Architecture icon')
  })

  it('omits optional fields when subtitle and image are not authored', () => {
    const wrapper = mount(SectionTitleSlideView, {
      props: {
        presentation,
        slide: {
          template: 'section-title',
          enabled: true,
          content: {
            title: 'Roadmap',
          },
        },
        slideNumber: 1,
        slideTotal: 4,
      },
    })

    expect(wrapper.find('.section-title__title').text()).toBe('Roadmap')
    expect(wrapper.find('.section-title__subtitle').exists()).toBe(false)
    expect(wrapper.find('.section-title__image').exists()).toBe(false)
  })
})
