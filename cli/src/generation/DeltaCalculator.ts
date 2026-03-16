import type { MetricValue } from './Generation.types'

export class DeltaCalculator {
  public createMetric(label: string, current: number, previous = 0): MetricValue {
    return {
      label,
      current,
      previous,
      delta: current - previous,
    }
  }
}
