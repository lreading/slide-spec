import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import RoadmapSlideView from './RoadmapSlideView.vue'

describe('RoadmapSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const roadmapSlides = record.presentation.slides.filter(
    (slide) => slide.template === 'progress-timeline',
  )

  it('renders the active roadmap stage from shared deck roadmap data', () => {
    const slide = roadmapSlides[1]

    if (!slide || slide.template !== 'progress-timeline') {
      throw new Error('Expected roadmap slide in fixture data')
    }

    const wrapper = mount(RoadmapSlideView, {
      props: {
        presentation: record.presentation,
        site: contentRepository.getSiteContent(),
        slide,
        slideNumber: 5,
        slideTotal: 12,
      },
    })

    expect(wrapper.text()).toContain('Roadmap: In Progress')
    expect(wrapper.text()).toContain('Desktop unit test coverage and desktop end-to-end coverage both landed in March.')
    expect(wrapper.text()).toContain('Focus areas')
    expect(wrapper.findAll('.progress-timeline__item')).toHaveLength(4)
    expect(wrapper.findAll('.progress-timeline__item--current')).toHaveLength(1)
  })

  it('renders without fallback copy when roadmap data is unavailable', () => {
    const slide = roadmapSlides[0]

    if (!slide || slide.template !== 'progress-timeline') {
      throw new Error('Expected roadmap slide in fixture data')
    }

    const wrapper = mount(RoadmapSlideView, {
      props: {
        presentation: {
          ...record.presentation,
          roadmap: undefined,
        },
        site: contentRepository.getSiteContent(),
        slide,
        slideNumber: 4,
        slideTotal: 12,
      },
    })

    expect(wrapper.text()).toContain('Roadmap: Completed')
    expect(wrapper.text()).not.toContain('Roadmap details are not available.')
    expect(wrapper.find('.card-eyebrow').exists()).toBe(false)
    expect(wrapper.find('.card-title').exists()).toBe(false)
    expect(wrapper.find('.footer-link').exists()).toBe(false)
  })
})
