import { describe, expect, it } from 'vitest'

import { FetchTimingCollector } from './FetchTimingCollector'

describe('FetchTimingCollector', () => {
  it('records timings for successful async work', async () => {
    const collector = new FetchTimingCollector()

    const result = await collector.measure('step-a', async () => 'done')

    expect(result).toBe('done')
    expect(collector.getTimings()).toEqual([
      expect.objectContaining({
        name: 'step-a',
      }),
    ])
    expect(collector.getTimings()[0]?.duration_ms).toBeGreaterThanOrEqual(0)
  })

  it('records timings even when the measured work throws', async () => {
    const collector = new FetchTimingCollector()

    await expect(
      collector.measure('step-b', async () => {
        throw new Error('boom')
      }),
    ).rejects.toThrow('boom')

    expect(collector.getTimings()).toEqual([
      expect.objectContaining({
        name: 'step-b',
      }),
    ])
  })
})
