export class PresentationNavigation {
  private readonly slideCount: number

  public constructor(slideCount: number) {
    this.slideCount = slideCount
  }

  public first(): number {
    return 1
  }

  public last(): number {
    return this.slideCount
  }

  public next(current: number): number {
    return Math.min(this.slideCount, current + 1)
  }

  public previous(current: number): number {
    return Math.max(1, current - 1)
  }

  public resolve(candidate: unknown): number {
    const value = Number(candidate)

    if (!Number.isInteger(value) || value < 1) {
      return this.first()
    }

    return Math.min(value, this.last())
  }
}
