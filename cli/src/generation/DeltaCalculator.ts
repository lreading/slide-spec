import type { MetricMetadata, MetricValue } from './Generation.types'

export class DeltaCalculator {
  public createMetric(
    label: string,
    current: number,
    previous = 0,
    metadata: MetricMetadata = {
      comparison_status: 'complete',
      warning_codes: [],
    },
  ): MetricValue {
    return {
      label,
      current,
      previous,
      delta: current - previous,
      metadata,
    }
  }
}
