import { stringify } from 'yaml'

import { NodeFileSystem } from './FileSystem'

import type { FileSystem } from './FileSystem'

interface WriteYamlDocumentOptions {
  schemaUrl?: string
}

export class YamlWriter {
  public constructor(private readonly fileSystem: FileSystem = new NodeFileSystem()) {}

  public async writeDocument(path: string, document: unknown, options: WriteYamlDocumentOptions = {}): Promise<void> {
    const schemaComment = options.schemaUrl
      ? `# yaml-language-server: $schema=${options.schemaUrl}\n`
      : ''

    await this.fileSystem.writeTextFile(path, `${schemaComment}${stringify(document)}`)
  }
}
