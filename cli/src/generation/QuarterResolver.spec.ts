import { describe, expect, it } from 'vitest'

import { QuarterResolver } from './QuarterResolver'

describe('QuarterResolver', () => {
  const resolver = new QuarterResolver()

  it('resolves the quarter window and previous quarter metadata', () => {
    expect(resolver.resolve(2026, 1)).toEqual({
      year: 2026,
      quarter: 1,
      presentationId: '2026-q1',
      start: '2026-01-01',
      end: '2026-03-31',
      previousYear: 2025,
      previousQuarter: 4,
    })
  })

  it('rejects invalid year and quarter values', () => {
    expect(() => resolver.resolve(1999, 1)).toThrow('Year must be a valid four-digit value.')
    expect(() => resolver.resolve(2026, 5)).toThrow('Quarter must be between 1 and 4.')
  })
})
