import { access, readFile } from 'node:fs/promises'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export interface FileSystem {
  fileExists(path: string): Promise<boolean>
  readTextFile(path: string): Promise<string>
  writeTextFile(path: string, content: string): Promise<void>
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

  public async writeTextFile(path: string, content: string): Promise<void> {
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, content, 'utf8')
  }
}
