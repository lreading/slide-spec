import { YamlReader } from '../io/YamlReader'

import type { FileSystemPaths } from '../io/FileSystemPaths'
import type { SiteConfig } from './Config.types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export class ContentConfigLoader {
  public constructor(private readonly yamlReader: YamlReader = new YamlReader()) {}

  public async loadSiteConfig(paths: FileSystemPaths): Promise<SiteConfig> {
    const document = await this.yamlReader.readDocument(paths.getSiteConfigPath())

    if (!isRecord(document)) {
      throw new Error('content/site.yaml must contain an object document.')
    }

    if (!isRecord(document.site)) {
      throw new Error('content/site.yaml must contain a top-level site object.')
    }

    return document.site as unknown as SiteConfig
  }
}
