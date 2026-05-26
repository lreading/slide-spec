import { describe, expect, it } from 'vitest'

import { validateTemplateSlide } from './validation'

const validProgressTimelineSlide = {
  title: 'Progress',
  content: {
    stage: 'planned',
    stages: {
      completed: { label: 'Done', summary: 'Completed work' },
      'in-progress': { label: 'Now', summary: 'Current work' },
      planned: { label: 'Next', summary: 'Planned work' },
      future: { label: 'Later', summary: 'Future work' },
    },
    sections: [
      {
        title: 'What changed',
        fa_icon: 'fa-check',
        type: 'richtext',
        body: 'Ship it',
      },
      {
        title: 'Signals',
        type: 'keyvalue',
        separator_fa_icon: 'fa-arrow-right',
        body: [{ key: 'Quality', value: 'Keep gates green' }],
      },
    ],
  },
} as const

describe('progress-timeline validation', () => {
  it('accepts slides with three authored stages', () => {
    expect(() =>
      validateTemplateSlide(
        'progress-timeline',
        {
          ...validProgressTimelineSlide,
          content: {
            ...validProgressTimelineSlide.content,
            stage: '6-months',
            stages: {
              '3-months': { label: '3 Months', summary: 'Stabilize adoption.' },
              '6-months': { label: '6 Months', summary: 'Expand core workflows.' },
              '12-months': { label: '12 Months', summary: 'Scale the operating model.' },
            },
          },
        },
        'slides[progress]',
      ),
    ).not.toThrow()
  })

  it('rejects slides when the active stage is not authored', () => {
    expect(() =>
      validateTemplateSlide(
        'progress-timeline',
        {
          ...validProgressTimelineSlide,
          content: {
            ...validProgressTimelineSlide.content,
            stage: 'future',
            stages: {
              completed: { label: 'Done', summary: 'Completed work' },
              planned: { label: 'Next', summary: 'Planned work' },
            },
          },
        },
        'slides[progress]',
      ),
    ).toThrow('slides[progress].content.stage must match one of the keys in slides[progress].content.stages.')
  })

  it('rejects slides with fewer than two stages', () => {
    expect(() =>
      validateTemplateSlide(
        'progress-timeline',
        {
          ...validProgressTimelineSlide,
          content: {
            ...validProgressTimelineSlide.content,
            stages: {
              completed: { label: 'Done', summary: 'Completed work' },
            },
          },
        },
        'slides[progress]',
      ),
    ).toThrow('slides[progress].content.stages must include at least 2 stages.')
  })

  it('rejects slides with more than six stages', () => {
    expect(() =>
      validateTemplateSlide(
        'progress-timeline',
        {
          ...validProgressTimelineSlide,
          content: {
            ...validProgressTimelineSlide.content,
            stage: 'stage-7',
            stages: {
              'stage-1': { label: 'Stage 1', summary: 'First stage' },
              'stage-2': { label: 'Stage 2', summary: 'Second stage' },
              'stage-3': { label: 'Stage 3', summary: 'Third stage' },
              'stage-4': { label: 'Stage 4', summary: 'Fourth stage' },
              'stage-5': { label: 'Stage 5', summary: 'Fifth stage' },
              'stage-6': { label: 'Stage 6', summary: 'Sixth stage' },
              'stage-7': { label: 'Stage 7', summary: 'Seventh stage' },
            },
          },
        },
        'slides[progress]',
      ),
    ).toThrow('slides[progress].content.stages must include no more than 6 stages.')
  })

  it('rejects more than three declarative sections', () => {
    expect(() =>
      validateTemplateSlide(
        'progress-timeline',
        {
          ...validProgressTimelineSlide,
          content: {
            ...validProgressTimelineSlide.content,
            sections: [
              { type: 'richtext', body: 'One' },
              { type: 'richtext', body: 'Two' },
              { type: 'richtext', body: 'Three' },
              { type: 'richtext', body: 'Four' },
            ],
          },
        },
        'slides[progress]',
      ),
    ).toThrow('slides[progress].content.sections must include no more than 3 sections.')
  })

  it('rejects separator icons for richtext sections', () => {
    expect(() =>
      validateTemplateSlide(
        'progress-timeline',
        {
          ...validProgressTimelineSlide,
          content: {
            ...validProgressTimelineSlide.content,
            sections: [
              {
                type: 'richtext',
                separator_fa_icon: 'fa-arrow-right',
                body: 'Text',
              },
            ],
          },
        },
        'slides[progress]',
      ),
    ).toThrow('slides[progress].content.sections[0].separator_fa_icon is only allowed when slides[progress].content.sections[0].type is "keyvalue".')
  })

  it('rejects unsupported detail fields', () => {
    expect(() =>
      validateTemplateSlide(
        'progress-timeline',
        {
          ...validProgressTimelineSlide,
          content: {
            ...validProgressTimelineSlide.content,
            detail_columns: ['Fixed detail'],
          },
        },
        'slides[progress]',
      ),
    ).toThrow('slides[progress].content.detail_columns is not allowed.')
  })
})
