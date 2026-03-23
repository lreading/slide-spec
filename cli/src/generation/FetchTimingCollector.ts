import type { FetchStepTiming } from './Generation.types'

export class FetchTimingCollector {
  private readonly timings: FetchStepTiming[] = []

  public async measure<T>(name: string, run: () => Promise<T>): Promise<T> {
    const startedAt = performance.now()

    try {
      return await run()
    } finally {
      this.timings.push({
        name,
        duration_ms: Math.round((performance.now() - startedAt) * 100) / 100,
      })
    }
  }

  public getTimings(): FetchStepTiming[] {
    return [...this.timings]
  }
}
