import { describe, expect, it } from 'vitest'

import { GeneratedDataStore } from './GeneratedDataStore'
import { FileSystemPaths } from '../io/FileSystemPaths'
import { YamlReader } from '../io/YamlReader'
import { YamlWriter } from '../io/YamlWriter'

import type { FileSystem } from '../io/FileSystem'

class MemoryFileSystem implements FileSystem {
  public readonly files = new Map<string, string>()

  public constructor(files: Record<string, string>) {
    Object.entries(files).forEach(([path, content]) => this.files.set(path, content))
  }

  public fileExists(path: string): Promise<boolean> {
    return Promise.resolve(this.files.has(path))
  }

  public readTextFile(path: string): Promise<string> {
    const source = this.files.get(path)
    if (!source) {
      return Promise.reject(new Error(`Missing file "${path}".`))
    }

    return Promise.resolve(source)
  }

  public writeTextFile(path: string, content: string): Promise<void> {
    this.files.set(path, content)
    return Promise.resolve()
  }
  public async directoryExists(_path: string): Promise<boolean> {
    return false
  }

  public async copyDirectory(_source: string, _destination: string): Promise<void> {}

  public async removeDirectory(_path: string): Promise<void> {}
}

describe('GeneratedDataStore', () => {
  it('loads optional previous generated data and writes generated documents', async () => {
    const fileSystem = new MemoryFileSystem({
      '/workspace/project/content/presentations/2025-q4/generated.yaml': `
generated:
  id: 2025-q4
  period:
    start: 2025-10-01
    end: 2025-12-31
  stats: {}
  releases: []
  contributors:
    total: 0
    authors: []
  merged_prs: []
`,
    })
    const store = new GeneratedDataStore(new YamlReader(fileSystem), new YamlWriter(fileSystem))
    const paths = new FileSystemPaths('/workspace/project')
    const entry = {
      id: '2025-q4',
      generated_path: 'presentations/2025-q4/generated.yaml',
    }

    await expect(store.loadGeneratedData(paths, entry)).resolves.toMatchObject({
      id: '2025-q4',
    })
    await expect(store.loadGeneratedData(paths, {
      id: 'missing',
    })).resolves.toBeUndefined()

    await expect(store.writeGeneratedData(paths, {
      id: '2026-q1',
      generated_path: 'presentations/2026-q1/generated.yaml',
    }, {
      id: '2026-q1',
      period: {
        start: '2026-01-01',
        end: '2026-03-31',
      },
      stats: {},
      releases: [],
      contributors: {
        total: 0,
        authors: [],
      },
      merged_prs: [],
    })).resolves.toBe('/workspace/project/content/presentations/2026-q1/generated.yaml')

    expect(fileSystem.files.get('/workspace/project/content/presentations/2026-q1/generated.yaml')).toContain(
      'generated:',
    )
  })
})
