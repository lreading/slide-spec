import type { QuarterWindow } from './Generation.types'

export class QuarterResolver {
  public resolve(year: number, quarter: number): QuarterWindow {
    if (!Number.isInteger(year) || year < 2000) {
      throw new Error('Year must be a valid four-digit value.')
    }

    if (!Number.isInteger(quarter) || quarter < 1 || quarter > 4) {
      throw new Error('Quarter must be between 1 and 4.')
    }

    const startMonthIndex = (quarter - 1) * 3
    const start = new Date(Date.UTC(year, startMonthIndex, 1))
    const end = new Date(Date.UTC(year, startMonthIndex + 3, 0))
    const previousQuarter = quarter === 1 ? 4 : quarter - 1
    const previousYear = quarter === 1 ? year - 1 : year

    return {
      year,
      quarter,
      presentationId: `${year}-q${quarter}`,
      start: this.toDateString(start),
      end: this.toDateString(end),
      previousQuarter,
      previousYear,
    }
  }

  private toDateString(value: Date): string {
    return value.toISOString().slice(0, 10)
  }
}
