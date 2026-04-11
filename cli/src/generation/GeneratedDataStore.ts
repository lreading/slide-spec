import { SLIDE_SPEC_SCHEMA_VERSION } from '../../../shared/src/content'
import { slideSpecSchemaUrls } from '../../../shared/src/json-schema-urls'
import { YamlReader } from '../io/YamlReader'
import { YamlWriter } from '../io/YamlWriter'

import type { PresentationIndexEntry } from '../../../shared/src/content'
import type { FileSystemPaths } from '../io/FileSystemPaths'
import type { GeneratedPresentationData } from './Generation.types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export class GeneratedDataStore {
  public constructor(
    private readonly yamlReader: YamlReader = new YamlReader(),
    private readonly yamlWriter: YamlWriter = new YamlWriter(),
  ) {}

  public async loadGeneratedData(
    paths: FileSystemPaths,
    entry: Pick<PresentationIndexEntry, 'id' | 'generated_path'>,
  ): Promise<GeneratedPresentationData | undefined> {
    const generatedPath = paths.resolveGeneratedPath(entry)

    try {
      const document = await this.yamlReader.readDocument(generatedPath)

      if (!isRecord(document) || !isRecord(document.generated)) {
        throw new Error(`${generatedPath} must contain a generated object.`)
      }

      return document.generated as unknown as GeneratedPresentationData
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('ENOENT')) {
        return undefined
      }

      if (error instanceof Error && error.message.startsWith('Missing file')) {
        return undefined
      }

      throw error
    }
  }

  public async writeGeneratedData(
    paths: FileSystemPaths,
    entry: Pick<PresentationIndexEntry, 'id' | 'generated_path'>,
    generated: GeneratedPresentationData,
  ): Promise<string> {
    const generatedPath = paths.resolveGeneratedPath(entry)
    await this.yamlWriter.writeDocument(generatedPath, {
      schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
      generated,
    }, {
      schemaUrl: slideSpecSchemaUrls.generated,
    })
    return generatedPath
  }
}
