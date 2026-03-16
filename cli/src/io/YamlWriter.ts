import { stringify } from 'yaml'

import { NodeFileSystem } from './FileSystem'

import type { FileSystem } from './FileSystem'

export class YamlWriter {
  public constructor(private readonly fileSystem: FileSystem = new NodeFileSystem()) {}

  public async writeDocument(path: string, document: unknown): Promise<void> {
    await this.fileSystem.writeTextFile(path, stringify(document))
  }
}
