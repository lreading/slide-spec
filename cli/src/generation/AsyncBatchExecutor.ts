export class AsyncBatchExecutor {
  public constructor(private readonly concurrency: number = 6) {}

  public async map<TItem, TResult>(
    items: TItem[],
    worker: (item: TItem) => Promise<TResult>,
  ): Promise<TResult[]> {
    const results = new Array<TResult>(items.length)
    let nextIndex = 0

    const runNext = async (): Promise<void> => {
      const currentIndex = nextIndex

      if (currentIndex >= items.length) {
        return
      }

      nextIndex += 1
      results[currentIndex] = await worker(items[currentIndex] as TItem)
      await runNext()
    }

    const workerCount = Math.min(this.concurrency, items.length)
    await Promise.all(Array.from({ length: workerCount }, () => runNext()))
    return results
  }
}
