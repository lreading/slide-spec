import { PresentationIndexLoader } from '../generation/PresentationIndexLoader'
import { YamlWriter } from '../io/YamlWriter'

import type { FileSystemPaths } from '../io/FileSystemPaths'
import type { PresentationIndexEntry } from '../generation/Generation.types'

export class PresentationIndexStore {
  public constructor(
    private readonly loader: PresentationIndexLoader = new PresentationIndexLoader(),
    private readonly yamlWriter: YamlWriter = new YamlWriter(),
  ) {}

  public async load(paths: FileSystemPaths): Promise<PresentationIndexEntry[]> {
    return this.loader.loadPresentations(paths)
  }

  public findPresentationIdForQuarter(
    entries: PresentationIndexEntry[],
    year: number,
    quarter: number,
  ): string | undefined {
    return this.loader.findPresentationIdForQuarter(entries, year, quarter)
  }

  public async write(paths: FileSystemPaths, entries: PresentationIndexEntry[]): Promise<void> {
    const sortedEntries = [...entries].sort((left, right) =>
      right.year - left.year || right.quarter - left.quarter || left.id.localeCompare(right.id))

    await this.yamlWriter.writeDocument(paths.getPresentationsIndexPath(), {
      presentations: sortedEntries,
    })
  }
}
