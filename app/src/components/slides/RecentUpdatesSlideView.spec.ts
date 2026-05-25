import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import RecentUpdatesSlideView from './RecentUpdatesSlideView.vue'

describe('RecentUpdatesSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const slide = record.presentation.slides.find((entry) => entry.template === 'section-list-grid')

  if (!slide || slide.template !== 'section-list-grid') {
    throw new Error('Expected recent updates slide in fixture data')
  }

  it('renders the configured slide title and section content', () => {
    const wrapper = mount(RecentUpdatesSlideView, {
      props: {
        presentation: record.presentation,
        slide,
        slideNumber: 3,
        slideTotal: 12,
      },
    })

    expect(wrapper.text()).toContain('What Happened Since Last Update')
    expect(wrapper.text()).toContain(slide.content.sections[0].title)
    expect(wrapper.text()).toContain(slide.content.sections[0].bullets[0])
  })

  it('omits the title heading when the slide title is missing', () => {
    const wrapper = mount(RecentUpdatesSlideView, {
      props: {
        presentation: record.presentation,
        slide: {
          ...slide,
          title: undefined,
        },
        slideNumber: 3,
        slideTotal: 12,
      },
    })

    expect(wrapper.find('.page-title').exists()).toBe(false)
  })

  it('uses configured, ordered default, and overflow fallback icons', () => {
    const wrapper = mount(RecentUpdatesSlideView, {
      props: {
        presentation: record.presentation,
        slide: {
          ...slide,
          content: {
            sections: [
              { title: 'Custom', fa_icon: 'fa-code', bullets: ['Custom icon'] },
              { title: 'Default', bullets: ['Ordered default icon'] },
              { title: 'Third', bullets: ['Third ordered default'] },
              { title: 'Overflow', bullets: ['Overflow fallback icon'] },
            ],
          },
        },
        slideNumber: 3,
        slideTotal: 12,
      },
    })

    expect(wrapper.find('.fa-code').exists()).toBe(true)
    expect(wrapper.find('.fa-users').exists()).toBe(true)
    expect(wrapper.findAll('.fa-star')).toHaveLength(2)
  })
})
