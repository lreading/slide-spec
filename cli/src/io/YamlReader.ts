import { parse } from 'yaml'

import { NodeFileSystem } from './FileSystem'

import type { FileSystem } from './FileSystem'

export class YamlReader {
  public constructor(private readonly fileSystem: FileSystem = new NodeFileSystem()) {}

  public async readDocument(path: string): Promise<unknown> {
    const source = await this.fileSystem.readTextFile(path)
    return parse(source)
  }
}
