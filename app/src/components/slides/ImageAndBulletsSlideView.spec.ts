import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import ImageAndBulletsSlideView from './ImageAndBulletsSlideView.vue'

describe('ImageAndBulletsSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')

  it('renders split layout with image, description, and bullets', () => {
    const wrapper = mount(ImageAndBulletsSlideView, {
      props: {
        presentation: record.presentation,
        slide: {
          template: 'image-and-bullets',
          enabled: true,
          title: 'Highlights',
          content: {
            image_side: 'left',
            image: {
              src: '/assets/demo-logo.svg',
              alt: 'Demo logo',
              description: 'A quick visual summary.',
            },
            bullets: ['First point', 'Second point'],
          },
        },
        slideNumber: 1,
        slideTotal: 1,
      },
    })

    expect(wrapper.find('.image-and-bullets--split').exists()).toBe(true)
    expect(wrapper.find('.image-panel__image').attributes('alt')).toBe('Demo logo')
    expect(wrapper.text()).toContain('A quick visual summary.')
    expect(wrapper.text()).toContain('First point')
  })

  it('centers bullet-only content without image panel', () => {
    const wrapper = mount(ImageAndBulletsSlideView, {
      props: {
        presentation: record.presentation,
        slide: {
          template: 'image-and-bullets',
          enabled: true,
          title: 'Highlights',
          content: {
            bullets: ['Only bullet content'],
          },
        },
        slideNumber: 1,
        slideTotal: 1,
      },
    })

    expect(wrapper.find('.image-and-bullets--bullets-only').exists()).toBe(true)
    expect(wrapper.find('.image-panel').exists()).toBe(false)
    expect(wrapper.text()).toContain('Only bullet content')
  })

  it('renders lightweight rich text in image descriptions', () => {
    const wrapper = mount(ImageAndBulletsSlideView, {
      props: {
        presentation: record.presentation,
        slide: {
          template: 'image-and-bullets',
          enabled: true,
          title: 'Highlights',
          content: {
            image: {
              src: '/assets/demo-logo.svg',
              description: 'Architecture note.\n\n- First detail\n- Second detail',
            },
          },
        },
        slideNumber: 1,
        slideTotal: 1,
      },
    })

    expect(wrapper.find('.image-panel__description .rich-text__paragraph').text()).toBe('Architecture note.')
    expect(wrapper.findAll('.image-panel__description .rich-text__list--unordered .rich-text__item')).toHaveLength(2)
  })
})
