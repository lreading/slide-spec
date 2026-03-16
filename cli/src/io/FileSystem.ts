import { access, readFile } from 'node:fs/promises'

export interface FileSystem {
  fileExists(path: string): Promise<boolean>
  readTextFile(path: string): Promise<string>
}

export class NodeFileSystem implements FileSystem {
  public async fileExists(path: string): Promise<boolean> {
    try {
      await access(path)
      return true
    } catch {
      return false
    }
  }

  public async readTextFile(path: string): Promise<string> {
    return readFile(path, 'utf8')
  }
}
