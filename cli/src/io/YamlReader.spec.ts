import { describe, expect, it } from 'vitest'

import { YamlReader } from './YamlReader'

import type { FileSystem } from './FileSystem'

class MemoryFileSystem implements FileSystem {
  public constructor(private readonly files: Record<string, string>) {}

  public fileExists(path: string): Promise<boolean> {
    return Promise.resolve(this.files[path] !== undefined)
  }

  public readTextFile(path: string): Promise<string> {
    const source = this.files[path]
    if (!source) {
      return Promise.reject(new Error(`Missing file "${path}".`))
    }

    return Promise.resolve(source)
  }

  public writeTextFile(_path: string, _content: string): Promise<void> {
    return Promise.resolve()
  }
}

describe('YamlReader', () => {
  it('parses YAML documents from the injected file system', async () => {
    const reader = new YamlReader(new MemoryFileSystem({
      '/tmp/site.yaml': 'site:\n  title: Test',
    }))

    await expect(reader.readDocument('/tmp/site.yaml')).resolves.toEqual({
      site: {
        title: 'Test',
      },
    })
  })
})
