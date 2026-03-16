import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import RecentUpdatesSlideView from './RecentUpdatesSlideView.vue'

describe('RecentUpdatesSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const slide = record.presentation.slides.find((entry) => entry.kind === 'recent-updates')

  if (!slide || slide.kind !== 'recent-updates') {
    throw new Error('Expected recent updates slide in fixture data')
  }

  it('renders the configured slide title and section content', () => {
    const wrapper = mount(RecentUpdatesSlideView, {
      props: {
        deck: record.presentation,
        slide,
        slideNumber: 3,
        slideTotal: 12,
      },
    })

    expect(wrapper.text()).toContain('What Happened Since Last Update')
    expect(wrapper.text()).toContain(slide.sections[0].title)
    expect(wrapper.text()).toContain(slide.sections[0].bullets[0])
  })

  it('falls back to the default title when the slide title is missing', () => {
    const wrapper = mount(RecentUpdatesSlideView, {
      props: {
        deck: record.presentation,
        slide: {
          ...slide,
          title: undefined,
        },
        slideNumber: 3,
        slideTotal: 12,
      },
    })

    expect(wrapper.text()).toContain('What Happened Since Last Update')
  })
})
