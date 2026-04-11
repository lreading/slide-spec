import { SLIDE_SPEC_SCHEMA_VERSION } from '../../../shared/src/content'
import { slideSpecSchemaUrls } from '../../../shared/src/json-schema-urls'
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
    try {
      return await this.loader.loadPresentations(paths)
    } catch (error) {
      if (error instanceof Error && (error.message.startsWith('ENOENT') || error.message.startsWith('Missing file'))) {
        return []
      }

      throw error
    }
  }

  public findPresentationById(
    entries: PresentationIndexEntry[],
    id: string,
  ): PresentationIndexEntry | undefined {
    return this.loader.findPresentationById(entries, id)
  }

  public async write(paths: FileSystemPaths, entries: PresentationIndexEntry[]): Promise<void> {
    await this.yamlWriter.writeDocument(paths.getPresentationsIndexPath(), {
      schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
      presentations: entries,
    }, {
      schemaUrl: slideSpecSchemaUrls.presentationsIndex,
    })
  }
}
