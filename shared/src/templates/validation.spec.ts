import { describe, expect, it } from 'vitest'

import { validateTemplateSlide } from './validation'

describe('template validation', () => {
  it('accepts every supported template shape', () => {
    const validSlides = {
      hero: { content: { title_primary: 'Slide', title_accent: 'Spec' } },
      agenda: { title: 'Agenda', content: {} },
      'section-list-grid': { title: 'Sections', content: { sections: [{ title: 'One', bullets: ['A'] }] } },
      timeline: {
        title: 'Timeline',
        content: {
          latest_badge_label: 'Latest',
          footer_link_label: 'All releases',
          empty_state_title: 'No releases',
          empty_state_message: 'Nothing yet',
          featured_release_ids: ['v1'],
        },
      },
      'progress-timeline': {
        title: 'Progress',
        content: {
          stage: 'planned',
          deliverables_heading: 'Deliverables',
          focus_areas_heading: 'Focus',
          footer_link_label: 'Roadmap',
          stages: {
            completed: { label: 'Done', summary: 'Completed work' },
            'in-progress': { label: 'Now', summary: 'Current work' },
            planned: { label: 'Next', summary: 'Planned work' },
            future: { label: 'Later', summary: 'Future work' },
          },
          items: ['Ship it'],
          themes: [{ category: 'Quality', target: 'Keep gates green' }],
        },
      },
      people: {
        title: 'People',
        content: {
          banner_prefix: 'Thanks',
          contributors_link_label: 'Contributors',
          banner_suffix: 'team',
          spotlight: [{ login: 'octocat', summary: 'Shipped a fix' }],
        },
      },
      'metrics-and-links': {
        title: 'Metrics',
        content: {
          section_heading: 'Mentions',
          stats_heading: 'Stats',
          show_deltas: true,
          trend_suffix: 'from last period',
          stat_keys: ['stars'],
          mentions: [{ type: 'release', title: 'v1', url_label: 'Read', url: 'https://example.test' }],
        },
      },
      'action-cards': {
        title: 'Actions',
        content: {
          footer_text: 'Get involved',
          cards: [{ title: 'Try it', description: 'Run the CLI', url_label: 'Docs', url: 'https://example.test' }],
        },
      },
      closing: { content: { heading: 'Thanks', message: 'Questions?', quote: 'Ship clear slides.' } },
    } as const

    for (const [templateId, slide] of Object.entries(validSlides)) {
      expect(() => validateTemplateSlide(templateId as keyof typeof validSlides, slide, `slides.${templateId}`)).not.toThrow()
    }
  })

  it('rejects invalid template content', () => {
    expect(() =>
      validateTemplateSlide('hero', { content: { subtitle_prefix: 'Only subtitle' } }, 'slides[0]'),
    ).toThrow('slides[0].content must include title_primary or title_accent.')
    expect(() =>
      validateTemplateSlide('progress-timeline', { title: 'Progress', content: { stage: 'blocked' } }, 'slides[1]'),
    ).toThrow('slides[1].content.stage must be one of completed, in-progress, planned, or future.')
    expect(() =>
      validateTemplateSlide('metrics-and-links', { title: 'Metrics', content: { stat_keys: [], mentions: [{ type: 'post', title: 'Post', url: 'https://example.test' }] } }, 'slides[2]'),
    ).toThrow('slides[2].content.mentions[0] must provide url and url_label together.')
    expect(() =>
      validateTemplateSlide('metrics-and-links', { title: 'Metrics', content: { stat_keys: [], mentions: [{ type: 'post', title: 'Post' }] } }, 'slides[3]'),
    ).not.toThrow()
  })
})
