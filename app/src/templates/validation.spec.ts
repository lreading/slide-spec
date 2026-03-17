import { describe, expect, it } from 'vitest'

import { contentRepository } from '../content/ContentRepository'
import { getSlideTemplateDefinition } from './registry'
import type { SlideTemplateId } from './templateIds'

describe('template validation', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const sparseRecord = contentRepository.getPresentation('2025-template-sparse')

  it('accepts every current authored slide through its template validator', () => {
    record.presentation.slides.forEach((slide, index) => {
      const definition = getSlideTemplateDefinition(slide.template)

      expect(() =>
        definition.validate(slide as unknown as Record<string, unknown>, `slides[${index}]`),
      ).not.toThrow()
    })
  })

  it('accepts sparse authored slides through their template validators', () => {
    sparseRecord.presentation.slides.forEach((slide, index) => {
      const definition = getSlideTemplateDefinition(slide.template)

      expect(() =>
        definition.validate(slide as unknown as Record<string, unknown>, `sparseSlides[${index}]`),
      ).not.toThrow()
    })
  })

  const invalidSlides: Record<SlideTemplateId, Record<string, unknown>> = {
    hero: {
      template: 'hero',
      enabled: true,
      content: {},
    },
    agenda: {
      template: 'agenda',
      enabled: true,
      title: '  ',
      content: {},
    },
    'section-list-grid': {
      template: 'section-list-grid',
      enabled: true,
      title: 'Updates',
      content: {
        sections: {},
      },
    },
    timeline: {
      template: 'timeline',
      enabled: true,
      title: 'Releases',
      content: {
        featured_release_ids: 'v1.0.0',
      },
    },
    'progress-timeline': {
      template: 'progress-timeline',
      enabled: true,
      title: 'Roadmap',
      content: {
        stage: 'active',
      },
    },
    people: {
      template: 'people',
      enabled: true,
      title: 'People',
      content: {
        spotlight: [
          {
            login: 'octocat',
          },
        ],
      },
    },
    'metrics-and-links': {
      template: 'metrics-and-links',
      enabled: true,
      title: 'Metrics',
      content: {
        stat_keys: ['stars'],
        mentions: [
          {
            type: 'Blog post',
            title: 'Community article',
            url: 'https://example.com/post',
          },
        ],
      },
    },
    'action-cards': {
      template: 'action-cards',
      enabled: true,
      title: 'Contribute',
      content: {
        cards: [
          {
            title: 'Submit code',
            description: 'Open a PR',
            url_label: 'Contribute',
          },
        ],
      },
    },
    closing: {
      template: 'closing',
      enabled: true,
      content: {
        heading: 'Thank you',
      },
    },
  }

  it('rejects invalid payloads for every template in the current catalog', () => {
    const expectations: Record<SlideTemplateId, string> = {
      hero: 'slides[hero].content must include title_primary or title_accent.',
      agenda: 'slides[agenda].title must not be blank.',
      'section-list-grid': 'slides[section-list-grid].content.sections must be an array.',
      timeline: 'slides[timeline].content.featured_release_ids must be an array.',
      'progress-timeline':
        'slides[progress-timeline].content.stage must be one of completed, in-progress, planned, or future.',
      people: 'slides[people].content.spotlight[0].summary must be a string.',
      'metrics-and-links':
        'slides[metrics-and-links].content.mentions[0] must provide url and url_label together.',
      'action-cards': 'slides[action-cards].content.cards[0].url must be a string.',
      closing: 'slides[closing].content.message must be a string.',
    }

    ;(Object.keys(invalidSlides) as SlideTemplateId[]).forEach((templateId) => {
      const definition = getSlideTemplateDefinition(templateId)

      expect(() =>
        definition.validate(
          invalidSlides[templateId],
          `slides[${templateId}]`,
        ),
      ).toThrow(expectations[templateId])
    })
  })

  it('rejects non-boolean show_deltas for metrics-and-links slides', () => {
    const definition = getSlideTemplateDefinition('metrics-and-links')

    expect(() =>
      definition.validate(
        {
          template: 'metrics-and-links',
          enabled: true,
          title: 'Metrics',
          content: {
            show_deltas: 'yes',
            stat_keys: ['stars'],
            mentions: [],
          },
        } as unknown as Record<string, unknown>,
        'slides[metrics-and-links]',
      ),
    ).toThrow('slides[metrics-and-links].content.show_deltas must be a boolean.')
  })
})
