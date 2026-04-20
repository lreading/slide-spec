import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import ThankYouSlideView from './ThankYouSlideView.vue'

describe('ThankYouSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const site = contentRepository.getSiteContent()
  const slide = record.presentation.slides.find((entry) => entry.template === 'closing')

  if (!slide || slide.template !== 'closing') {
    throw new Error('Expected thank-you slide in fixture data')
  }

  it('renders the configured thank-you content and presentation mark', () => {
    const wrapper = mount(ThankYouSlideView, {
      props: {
        presentation: record.presentation,
        generated: record.generated,
        site,
        slide,
      },
    })

    expect(wrapper.text()).toContain('Thank you')
    expect(wrapper.text()).toContain('See you in the next update.')
    expect(wrapper.text()).toContain('Aurora Notes')
    expect(wrapper.text()).toContain('Q1 2026')
  })

  it('omits the footer quote and deck mark when authored chrome content is missing', () => {
    const wrapper = mount(ThankYouSlideView, {
      props: {
        presentation: record.presentation,
        generated: record.generated,
        site: {
          ...site,
          title: 'Aurora Notes Quarterly Updates',
          navigation: {
            brand_title: 'Aurora Notes Updates',
          },
          presentation_chrome: undefined,
        },
        slide: {
          ...slide,
          content: {
            ...slide.content,
            quote: undefined,
          },
        },
      },
    })

    expect(wrapper.find('.footer-quote').exists()).toBe(false)
    expect(wrapper.find('.presentation-mark').exists()).toBe(false)
  })

  it('omits the deck mark when no presentation chrome label is configured', () => {
    const wrapper = mount(ThankYouSlideView, {
      props: {
        presentation: record.presentation,
        generated: record.generated,
        site: {
          ...site,
          title: 'Aurora Notes Quarterly Updates',
          navigation: undefined,
          presentation_chrome: undefined,
        },
        slide,
      },
    })

    expect(wrapper.find('.presentation-mark').exists()).toBe(false)
  })
})
