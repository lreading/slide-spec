import { describe, expect, it } from 'vitest'

import { AsyncBatchExecutor } from './AsyncBatchExecutor'

describe('AsyncBatchExecutor', () => {
  it('maps items with bounded concurrency and preserves order', async () => {
    const executor = new AsyncBatchExecutor(2)

    const result = await executor.map([1, 2, 3], async (value) => value * 2)

    expect(result).toEqual([2, 4, 6])
  })

  it('returns an empty array for empty input', async () => {
    const executor = new AsyncBatchExecutor(2)

    await expect(executor.map([], async (value: number) => value * 2)).resolves.toEqual([])
  })
})
