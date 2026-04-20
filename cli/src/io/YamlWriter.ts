import { stringify } from 'yaml'

import { NodeFileSystem } from './FileSystem'

import type { FileSystem } from './FileSystem'

interface WriteYamlDocumentOptions {
  schemaUrl?: string
  includeSlideSpecHeader?: boolean
}

export class YamlWriter {
  public static readonly slideSpecHeader = [
    '# Slide Spec',
    '# https://www.slide-spec.dev/',
    '# Documentation: https://docs.slide-spec.dev/',
  ].join('\n')

  public constructor(private readonly fileSystem: FileSystem = new NodeFileSystem()) {}

  public async writeDocument(path: string, document: unknown, options: WriteYamlDocumentOptions = {}): Promise<void> {
    const slideSpecHeader = options.includeSlideSpecHeader
      ? `${YamlWriter.slideSpecHeader}\n`
      : ''
    const schemaComment = options.schemaUrl
      ? `# yaml-language-server: $schema=${options.schemaUrl}\n`
      : ''

    await this.fileSystem.writeTextFile(path, `${slideSpecHeader}${schemaComment}${stringify(document)}`)
  }
}
