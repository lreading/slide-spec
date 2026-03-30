import { YamlReader } from '../io/YamlReader'

import type { FileSystemPaths } from '../io/FileSystemPaths'
import type { PresentationIndexEntry } from './Generation.types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function assertString(value: unknown, path: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${path} must be a non-blank string.`)
  }

  return value
}

function assertOptionalNumber(value: unknown, path: string): number | undefined {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${path} must be a number.`)
  }

  return value
}

function assertBoolean(value: unknown, path: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`${path} must be a boolean.`)
  }

  return value
}

export class PresentationIndexLoader {
  public constructor(private readonly yamlReader: YamlReader = new YamlReader()) {}

  public async loadPresentations(paths: FileSystemPaths): Promise<PresentationIndexEntry[]> {
    const document = await this.yamlReader.readDocument(paths.getPresentationsIndexPath())

    if (!isRecord(document) || !Array.isArray(document.presentations)) {
      throw new Error('content/presentations/index.yaml must contain a presentations array.')
    }

    return document.presentations.map((entry, index) => this.mapEntry(entry, index))
  }

  public findPresentationById(
    entries: PresentationIndexEntry[],
    id: string,
  ): PresentationIndexEntry | undefined {
    return entries.find((entry) => entry.id === id)
  }

  private mapEntry(entry: unknown, index: number): PresentationIndexEntry {
    if (!isRecord(entry)) {
      throw new Error(`content/presentations/index.yaml.presentations[${index}] must be an object.`)
    }

    const year = assertOptionalNumber(entry.year, `presentations[${index}].year`)

    return {
      id: assertString(entry.id, `presentations[${index}].id`),
      ...(year !== undefined ? { year } : {}),
      title: assertString(entry.title, `presentations[${index}].title`),
      subtitle: assertString(entry.subtitle, `presentations[${index}].subtitle`),
      summary: assertString(entry.summary, `presentations[${index}].summary`),
      presentation_path: assertString(entry.presentation_path, `presentations[${index}].presentation_path`),
      ...(entry.generated_path !== undefined
        ? { generated_path: assertString(entry.generated_path, `presentations[${index}].generated_path`) }
        : {}),
      published: assertBoolean(entry.published, `presentations[${index}].published`),
      featured: assertBoolean(entry.featured, `presentations[${index}].featured`),
    }
  }
}
