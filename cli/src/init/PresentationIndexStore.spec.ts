import { describe, expect, it } from 'vitest'

import { PresentationIndexStore } from './PresentationIndexStore'
import { PresentationIndexLoader } from '../generation/PresentationIndexLoader'
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
}

describe('PresentationIndexStore', () => {
  it('loads, finds, and writes presentation index entries without reordering them', async () => {
    const fileSystem = new MemoryFileSystem({
      '/workspace/project/content/presentations/index.yaml': `
presentations:
  - id: 2025-q4
    year: 2025
    title: Previous
    subtitle: Q4 2025
    summary: Summary
    published: true
    featured: false
`,
    })
    const store = new PresentationIndexStore(
      new PresentationIndexLoader(new YamlReader(fileSystem)),
      new YamlWriter(fileSystem),
    )
    const paths = new FileSystemPaths('/workspace/project')
    const entries = await store.load(paths)

    expect(store.findPresentationById(entries, '2025-q4')?.id).toBe('2025-q4')

    await store.write(paths, [
      ...entries,
      {
        id: '2026-q1',
        year: 2026,
        title: 'Current',
        subtitle: 'Q1 2026',
        summary: 'Summary',
        published: false,
        featured: false,
      },
    ])

    const content = fileSystem.files.get('/workspace/project/content/presentations/index.yaml') ?? ''
    expect(content.indexOf('id: 2025-q4')).toBeLessThan(content.indexOf('id: 2026-q1'))
  })

  it('preserves input order when writing the index', async () => {
    const fileSystem = new MemoryFileSystem({})
    const store = new PresentationIndexStore(
      new PresentationIndexLoader(new YamlReader(fileSystem)),
      new YamlWriter(fileSystem),
    )
    const paths = new FileSystemPaths('/workspace/project')

    await store.write(paths, [
      {
        id: '2026-q1-b',
        year: 2026,
        title: 'Later id',
        subtitle: 'Q1 2026',
        summary: 'Summary',
        published: false,
        featured: false,
      },
      {
        id: '2026-q1-a',
        year: 2026,
        title: 'Earlier id',
        subtitle: 'Q1 2026',
        summary: 'Summary',
        published: false,
        featured: false,
      },
      {
        id: '2026-q2',
        year: 2026,
        title: 'Later quarter',
        subtitle: 'Q2 2026',
        summary: 'Summary',
        published: false,
        featured: false,
      },
      {
        id: '2025-q4',
        year: 2025,
        title: 'Previous year',
        subtitle: 'Q4 2025',
        summary: 'Summary',
        published: false,
        featured: false,
      },
    ])

    const content = fileSystem.files.get('/workspace/project/content/presentations/index.yaml') ?? ''
    expect(content.indexOf('id: 2026-q1-b')).toBeLessThan(content.indexOf('id: 2026-q1-a'))
    expect(content.indexOf('id: 2026-q1-a')).toBeLessThan(content.indexOf('id: 2026-q2'))
    expect(content.indexOf('id: 2026-q2')).toBeLessThan(content.indexOf('id: 2025-q4'))
  })

  it('returns an empty list when the index file does not exist', async () => {
    const fileSystem = new MemoryFileSystem({})
    const store = new PresentationIndexStore(
      new PresentationIndexLoader(new YamlReader(fileSystem)),
      new YamlWriter(fileSystem),
    )

    await expect(store.load(new FileSystemPaths('/workspace/project'))).resolves.toEqual([])
  })

  it('rethrows non-missing index errors', async () => {
    const fileSystem = new MemoryFileSystem({
      '/workspace/project/content/presentations/index.yaml': 'presentations: nope',
    })
    const store = new PresentationIndexStore(
      new PresentationIndexLoader(new YamlReader(fileSystem)),
      new YamlWriter(fileSystem),
    )

    await expect(store.load(new FileSystemPaths('/workspace/project'))).rejects.toThrow(
      'content/presentations/index.yaml must contain a presentations array.',
    )
  })
})
