import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { CardGridSlide, PresentationContent } from '../../types/content'
import CardGridSlideView from './CardGridSlideView.vue'

const presentation: PresentationContent = {
  id: '2026-q1',
  year: 2026,
  title: 'Aurora Notes Quarterly Community Update',
  subtitle: 'Q1 2026',
  slides: [],
}

const slide: CardGridSlide = {
  template: 'card-grid',
  enabled: true,
  title: 'Initiative Areas',
  subtitle: 'What to prioritize next',
  content: {
    card_arrow_fa_icon: 'fa-arrow-right',
    items: [
      { title: 'Detection / Response', fa_icon: 'fa-shield-halved' },
      { title: 'Supply Chain', marker_text: 'B' },
      { title: 'Documentation', url: 'https://example.com/docs' },
    ],
  },
}

describe('CardGridSlideView', () => {
  it('renders authored card rows with icons, markers, defaults, and links', () => {
    const wrapper = mount(CardGridSlideView, {
      props: {
        presentation,
        slide,
        slideNumber: 4,
        slideTotal: 12,
      },
    })

    expect(wrapper.findAll('.card-grid__card')).toHaveLength(3)
    expect(wrapper.text()).toContain('Detection / Response')
    expect(wrapper.text()).toContain('Supply Chain')
    expect(wrapper.text()).toContain('B')
    expect(wrapper.text()).toContain('03')
    expect(wrapper.find('.fa-shield-halved').exists()).toBe(true)
    expect(wrapper.findAll('.card-grid__arrow')).toHaveLength(3)
    expect(wrapper.get('a.card-grid__card').attributes('href')).toBe('https://example.com/docs')
  })

  it('omits card arrows when no card arrow icon is configured', () => {
    const wrapper = mount(CardGridSlideView, {
      props: {
        presentation,
        slide: {
          ...slide,
          content: {
            items: slide.content.items,
          },
        },
        slideNumber: 4,
        slideTotal: 12,
      },
    })

    expect(wrapper.find('.card-grid__arrow').exists()).toBe(false)
  })
})
