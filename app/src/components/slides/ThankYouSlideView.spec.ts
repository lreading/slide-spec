import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import ThankYouSlideView from './ThankYouSlideView.vue'

describe('ThankYouSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const site = contentRepository.getSiteContent()
  const slide = record.deck.slides.find((entry) => entry.kind === 'thank-you')

  if (!slide || slide.kind !== 'thank-you') {
    throw new Error('Expected thank-you slide in fixture data')
  }

  it('renders the configured thank-you content and deck mark', () => {
    const wrapper = mount(ThankYouSlideView, {
      props: {
        deck: record.deck,
        generated: record.generated,
        site,
        slide,
      },
    })

    expect(wrapper.text()).toContain('Thank you')
    expect(wrapper.text()).toContain('See you next quarter.')
    expect(wrapper.text()).toContain('Threat Dragon')
    expect(wrapper.text()).toContain('Q1 2026')
  })

  it('falls back to the site tagline and navigation brand when chrome content is missing', () => {
    const wrapper = mount(ThankYouSlideView, {
      props: {
        deck: record.deck,
        generated: record.generated,
        site: {
          ...site,
          title: 'Threat Dragon Quarterly Updates',
          navigation: {
            brand_title: 'Threat Dragon Updates',
          },
          presentation_chrome: undefined,
        },
        slide: {
          ...slide,
          quote: undefined,
        },
      },
    })

    expect(wrapper.text()).toContain('making threat modeling less threatening')
    expect(wrapper.text()).toContain('Threat Dragon Updates')
  })

  it('falls back to the site title when no presentation chrome or navigation brand is configured', () => {
    const wrapper = mount(ThankYouSlideView, {
      props: {
        deck: record.deck,
        generated: record.generated,
        site: {
          ...site,
          title: 'Threat Dragon Quarterly Updates',
          navigation: undefined,
          presentation_chrome: undefined,
        },
        slide,
      },
    })

    expect(wrapper.text()).toContain('Threat Dragon Quarterly Updates')
  })
})
