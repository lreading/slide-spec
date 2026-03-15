import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import RoadmapSlideView from './RoadmapSlideView.vue'

describe('RoadmapSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const roadmapSlides = record.deck.slides.filter((slide) => slide.kind === 'roadmap')

  it('renders the active roadmap stage from shared deck roadmap data', () => {
    const slide = roadmapSlides[1]

    if (!slide || slide.kind !== 'roadmap') {
      throw new Error('Expected roadmap slide in fixture data')
    }

    const wrapper = mount(RoadmapSlideView, {
      props: {
        deck: record.deck,
        site: contentRepository.getSiteContent(),
        slide,
        slideNumber: 5,
        slideTotal: 12,
      },
    })

    expect(wrapper.text()).toContain('Roadmap: In Progress')
    expect(wrapper.text()).toContain('Building cloud-backed project sync experiments')
    expect(wrapper.text()).toContain('Focus areas')
    expect(wrapper.findAll('.milestone-node')).toHaveLength(4)
    expect(wrapper.findAll('.milestone-node--current')).toHaveLength(1)
  })

  it('uses fallback copy when deck roadmap data is unavailable', () => {
    const slide = roadmapSlides[0]

    if (!slide || slide.kind !== 'roadmap') {
      throw new Error('Expected roadmap slide in fixture data')
    }

    const wrapper = mount(RoadmapSlideView, {
      props: {
        deck: {
          ...record.deck,
          roadmap: undefined,
        },
        site: contentRepository.getSiteContent(),
        slide,
        slideNumber: 4,
        slideTotal: 12,
      },
    })

    expect(wrapper.text()).toContain('Roadmap: Roadmap')
    expect(wrapper.text()).toContain('Roadmap details are not available.')
  })
})
