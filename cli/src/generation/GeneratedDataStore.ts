import { YamlReader } from '../io/YamlReader'
import { YamlWriter } from '../io/YamlWriter'

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
    presentationId: string,
  ): Promise<GeneratedPresentationData | undefined> {
    try {
      const document = await this.yamlReader.readDocument(paths.getGeneratedPath(presentationId))

      if (!isRecord(document) || !isRecord(document.generated)) {
        throw new Error(`content/presentations/${presentationId}/generated.yaml must contain a generated object.`)
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
    presentationId: string,
    generated: GeneratedPresentationData,
  ): Promise<string> {
    const generatedPath = paths.getGeneratedPath(presentationId)
    await this.yamlWriter.writeDocument(generatedPath, {
      generated,
    })
    return generatedPath
  }
}
