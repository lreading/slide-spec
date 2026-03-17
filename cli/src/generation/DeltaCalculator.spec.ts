import { describe, expect, it } from 'vitest'

import { DeltaCalculator } from './DeltaCalculator'

describe('DeltaCalculator', () => {
  const calculator = new DeltaCalculator()

  it('computes period-over-period deltas with a zero fallback', () => {
    expect(calculator.createMetric('GitHub Stars', 50, 40)).toEqual({
      label: 'GitHub Stars',
      current: 50,
      previous: 40,
      delta: 10,
      metadata: {
        comparison_status: 'complete',
        warning_codes: [],
      },
    })

    expect(calculator.createMetric('GitHub Stars', 50)).toEqual({
      label: 'GitHub Stars',
      current: 50,
      previous: 0,
      delta: 50,
      metadata: {
        comparison_status: 'complete',
        warning_codes: [],
      },
    })
  })
})
