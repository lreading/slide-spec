import { describe, expect, it } from 'vitest'

import { YamlWriter } from './YamlWriter'

import type { FileSystem } from './FileSystem'

class MemoryFileSystem implements FileSystem {
  public readonly writes = new Map<string, string>()

  public fileExists(_path: string): Promise<boolean> {
    return Promise.resolve(false)
  }

  public readTextFile(_path: string): Promise<string> {
    return Promise.reject(new Error('Not implemented'))
  }

  public writeTextFile(path: string, content: string): Promise<void> {
    this.writes.set(path, content)
    return Promise.resolve()
  }
}

describe('YamlWriter', () => {
  it('serializes and writes YAML documents', async () => {
    const fileSystem = new MemoryFileSystem()
    const writer = new YamlWriter(fileSystem)

    await writer.writeDocument('/tmp/generated.yaml', {
      generated: {
        id: '2026-q1',
      },
    })

    expect(fileSystem.writes.get('/tmp/generated.yaml')).toContain('generated:')
    expect(fileSystem.writes.get('/tmp/generated.yaml')).toContain('id: 2026-q1')
  })
})
