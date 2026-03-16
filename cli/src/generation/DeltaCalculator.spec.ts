import { describe, expect, it } from 'vitest'

import { DeltaCalculator } from './DeltaCalculator'

describe('DeltaCalculator', () => {
  const calculator = new DeltaCalculator()

  it('computes quarter-over-quarter deltas with a zero fallback', () => {
    expect(calculator.createMetric('GitHub Stars', 50, 40)).toEqual({
      label: 'GitHub Stars',
      current: 50,
      previous: 40,
      delta: 10,
    })

    expect(calculator.createMetric('GitHub Stars', 50)).toEqual({
      label: 'GitHub Stars',
      current: 50,
      previous: 0,
      delta: 50,
    })
  })
})
