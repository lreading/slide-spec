import { describe, expect, it } from 'vitest'

import { contentRepository } from '../content/ContentRepository'
import { getSlideTemplateDefinition } from './registry'
import { slideTemplateIds } from './templateIds'

describe('template registry', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const site = contentRepository.getSiteContent()
  const slidesByTemplate = new Map(
    record.presentation.slides
      .filter((slide) => slide.enabled && slide.template)
      .map((slide) => [slide.template, slide]),
  )

  it('defines a renderer for every supported template id', () => {
    slideTemplateIds.forEach((templateId) => {
      const definition = getSlideTemplateDefinition(templateId)

      expect(definition.id).toBe(templateId)
      expect(definition.label.length).toBeGreaterThan(0)
      expect(definition.component).toBeTruthy()
    })
  })

  it('creates render props for every current template in fixture content', () => {
    slideTemplateIds.forEach((templateId) => {
      const slide = slidesByTemplate.get(templateId)

      if (!slide) {
        return
      }

      const definition = getSlideTemplateDefinition(templateId)
      const props = definition.createProps({
        record,
        site,
        slide,
        slideNumber: 1,
        slideTotal: record.presentation.slides.length,
      })

      expect(props.slide).toBe(slide)
      expect(props.presentation).toBe(record.presentation)
    })
  })
})
