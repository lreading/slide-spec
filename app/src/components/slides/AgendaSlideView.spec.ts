import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import AgendaSlideView from './AgendaSlideView.vue'

describe('AgendaSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const slide = record.presentation.slides.find((entry) => entry.kind === 'agenda')

  if (!slide || slide.kind !== 'agenda') {
    throw new Error('Expected agenda slide in fixture data')
  }

  it('collapses multiple roadmap slides into a single agenda entry', () => {
    const wrapper = mount(AgendaSlideView, {
      props: {
        deck: record.presentation,
        slide,
        slideNumber: 2,
        slideTotal: 12,
      },
    })

    const agendaItems = wrapper.findAll('.card-text').map((node) => node.text())

    expect(agendaItems).toContain('Roadmap')
    expect(agendaItems.filter((item) => item === 'Roadmap')).toHaveLength(1)
    expect(agendaItems).not.toContain('Roadmap: Completed')
  })
})
