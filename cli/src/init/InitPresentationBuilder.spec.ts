import { describe, expect, it } from 'vitest'

import { InitPresentationBuilder } from './InitPresentationBuilder'

describe('InitPresentationBuilder', () => {
  const builder = new InitPresentationBuilder()
  const initInput = {
    presentationId: '2026-q1',
    title: 'Quarterly Community Update',
    subtitle: 'Q1 2026',
    summary: 'Replace with a summary before publishing.',
    period: {
      start: '2026-01-01',
      end: '2026-03-31',
    },
  }

  it('builds placeholder index, presentation, and generated documents', () => {
    expect(
      builder.buildIndexEntry(initInput, {
        published: true,
        featured: true,
      }),
    ).toEqual({
      id: '2026-q1',
      title: 'Quarterly Community Update',
      subtitle: 'Q1 2026',
      summary: 'Replace with a summary before publishing.',
      published: true,
      featured: true,
    })

    const presentationDocument = builder.buildPresentationDocument(initInput)
    expect(presentationDocument.presentation.slides).toHaveLength(9)
    expect(presentationDocument.presentation.slides[0]).toMatchObject({
      template: 'hero',
      enabled: true,
    })

    expect(builder.buildGeneratedData(initInput, '2025-q4')).toMatchObject({
      id: '2026-q1',
      previous_presentation_id: '2025-q4',
      merged_prs: [],
    })
  })
})
