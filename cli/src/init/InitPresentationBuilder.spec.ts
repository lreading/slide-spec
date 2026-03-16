import { describe, expect, it } from 'vitest'

import { InitPresentationBuilder } from './InitPresentationBuilder'

import type { QuarterWindow } from '../generation/Generation.types'

describe('InitPresentationBuilder', () => {
  const builder = new InitPresentationBuilder()
  const quarterWindow: QuarterWindow = {
    year: 2026,
    quarter: 1,
    presentationId: '2026-q1',
    start: '2026-01-01',
    end: '2026-03-31',
    previousYear: 2025,
    previousQuarter: 4,
  }

  it('builds placeholder index, presentation, and generated documents', () => {
    expect(builder.buildIndexEntry(quarterWindow)).toEqual({
      id: '2026-q1',
      year: 2026,
      quarter: 1,
      title: 'Quarterly Community Update',
      subtitle: 'Q1 2026',
      summary: 'Replace with a summary before publishing.',
      published: false,
      featured: false,
    })

    const presentationDocument = builder.buildPresentationDocument(quarterWindow)
    expect(presentationDocument.presentation.slides).toHaveLength(9)
    expect(presentationDocument.presentation.slides[0]).toMatchObject({
      template: 'hero',
      enabled: true,
    })

    expect(builder.buildGeneratedData(quarterWindow, '2025-q4')).toMatchObject({
      id: '2026-q1',
      previous_presentation_id: '2025-q4',
      merged_prs: [],
    })
  })
})
