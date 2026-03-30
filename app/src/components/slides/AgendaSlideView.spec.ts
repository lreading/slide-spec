import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import AgendaSlideView from './AgendaSlideView.vue'

describe('AgendaSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const slide = record.presentation.slides.find((entry) => entry.template === 'agenda')

  if (!slide || slide.template !== 'agenda') {
    throw new Error('Expected agenda slide in fixture data')
  }

  it('lists each roadmap slide as a separate agenda entry', () => {
    const wrapper = mount(AgendaSlideView, {
      props: {
        presentation: record.presentation,
        slide,
        slideNumber: 2,
        slideTotal: 12,
      },
    })

    const agendaItems = wrapper.findAll('.card-text').map((node) => node.text())

    expect(agendaItems).toEqual([
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
    ])
  })
})
