import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import RoadmapSlideView from './RoadmapSlideView.vue'

describe('RoadmapSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const roadmapSlides = record.presentation.slides.filter(
    (slide) => slide.template === 'progress-timeline',
  )

  it('renders the active roadmap stage from slide-local roadmap data', () => {
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
    expect(wrapper.text()).toContain('Presentation search coverage and keyboard navigation coverage both landed in March.')
    expect(wrapper.text()).toContain('Focus areas')
    expect(wrapper.findAll('.progress-timeline__item')).toHaveLength(4)
    expect(wrapper.findAll('.progress-timeline__item--current')).toHaveLength(1)
  })

  it('hides the footer link when the slide omits its own footer label', () => {
    const slide = roadmapSlides[0]

    if (!slide || slide.template !== 'progress-timeline') {
      throw new Error('Expected roadmap slide in fixture data')
    }

    const wrapper = mount(RoadmapSlideView, {
      props: {
        presentation: record.presentation,
        site: contentRepository.getSiteContent(),
        slide: {
          ...slide,
          content: {
            ...slide.content,
            footer_link_label: undefined,
          },
        },
        slideNumber: 4,
        slideTotal: 12,
      },
    })

    expect(wrapper.text()).toContain('Roadmap: Completed')
    expect(wrapper.find('.card-eyebrow').exists()).toBe(true)
    expect(wrapper.find('.card-title').exists()).toBe(true)
    expect(wrapper.find('.footer-link').exists()).toBe(false)
  })

  it('omits optional roadmap headings and stage eyebrow when slide-local labels are blank', () => {
    const slide = roadmapSlides[2]

    if (!slide || slide.template !== 'progress-timeline') {
      throw new Error('Expected roadmap slide in fixture data')
    }

    const wrapper = mount(RoadmapSlideView, {
      props: {
        presentation: record.presentation,
        site: contentRepository.getSiteContent(),
        slide: {
          ...slide,
          title: undefined,
          subtitle: undefined,
          content: {
            ...slide.content,
            deliverables_heading: undefined,
            focus_areas_heading: undefined,
            footer_link_label: undefined,
            stages: {
              ...slide.content.stages,
              planned: {
                ...slide.content.stages.planned,
                label: '',
                summary: '',
              },
            },
          },
        },
        slideNumber: 6,
        slideTotal: 12,
      },
    })

    expect(wrapper.find('.card-eyebrow').exists()).toBe(false)
    expect(wrapper.find('.card-title').exists()).toBe(false)
    expect(wrapper.find('.section-heading').exists()).toBe(false)
    expect(wrapper.find('.footer-link').exists()).toBe(false)
    expect(wrapper.find('.standard-slide-layout__subtitle').exists()).toBe(false)

    const timelineItems = wrapper.findAll('.progress-timeline__item')
    expect(timelineItems).toHaveLength(4)
    expect(timelineItems[0]?.classes()).toContain('progress-timeline__item--viewed')
    expect(timelineItems[1]?.classes()).toContain('progress-timeline__item--viewed')
    expect(timelineItems[2]?.classes()).toContain('progress-timeline__item--current')
    expect(timelineItems[2]?.text()).not.toContain('Roadmap: Planned')
    expect(timelineItems[3]?.classes()).toContain('progress-timeline__item--upcoming')
  })
})
