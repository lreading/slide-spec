import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import SlideRenderer from './SlideRenderer.vue'

describe('SlideRenderer', () => {
  const site = contentRepository.getSiteContent()
  const record = contentRepository.getPresentation('2026-q1')
  const slides = record.presentation.slides.filter((slide) => slide.enabled)

  it('renders every enabled slide kind from the YAML deck', () => {
    const headings = [
      'OWASP Threat Dragon',
      'Agenda',
      'What Happened Since Last Update',
      'Releases',
      'Roadmap: Completed',
      'Roadmap: In Progress',
      'Roadmap: Planned',
      'Roadmap: Future',
      'Contributor Spotlight',
      'Community Highlights',
      'How to Contribute',
      'Thank you',
    ]

    slides.forEach((slide, index) => {
      const wrapper = mount(SlideRenderer, {
        props: {
          record,
          site,
          slide,
          slideNumber: index + 1,
          slideTotal: slides.length,
        },
      })

      expect(wrapper.text()).toContain(headings[index])
    })
  })
})
