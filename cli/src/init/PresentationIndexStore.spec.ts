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
  it('loads, finds, and writes sorted presentation index entries', async () => {
    const fileSystem = new MemoryFileSystem({
      '/workspace/project/content/presentations/index.yaml': `
presentations:
  - id: 2025-q4
    year: 2025
    quarter: 4
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
    const paths = new FileSystemPaths('/workspace/project/cli')
    const entries = await store.load(paths)

    expect(store.findPresentationIdForQuarter(entries, 2025, 4)).toBe('2025-q4')

    await store.write(paths, [
      ...entries,
      {
        id: '2026-q1',
        year: 2026,
        quarter: 1,
        title: 'Current',
        subtitle: 'Q1 2026',
        summary: 'Summary',
        published: false,
        featured: false,
      },
    ])

    const content = fileSystem.files.get('/workspace/project/content/presentations/index.yaml') ?? ''
    expect(content.indexOf('id: 2026-q1')).toBeLessThan(content.indexOf('id: 2025-q4'))
  })

  it('sorts by year, then quarter, then id when writing the index', async () => {
    const fileSystem = new MemoryFileSystem({})
    const store = new PresentationIndexStore(
      new PresentationIndexLoader(new YamlReader(fileSystem)),
      new YamlWriter(fileSystem),
    )
    const paths = new FileSystemPaths('/workspace/project/cli')

    await store.write(paths, [
      {
        id: '2026-q1-b',
        year: 2026,
        quarter: 1,
        title: 'Later id',
        subtitle: 'Q1 2026',
        summary: 'Summary',
        published: false,
        featured: false,
      },
      {
        id: '2026-q1-a',
        year: 2026,
        quarter: 1,
        title: 'Earlier id',
        subtitle: 'Q1 2026',
        summary: 'Summary',
        published: false,
        featured: false,
      },
      {
        id: '2026-q2',
        year: 2026,
        quarter: 2,
        title: 'Later quarter',
        subtitle: 'Q2 2026',
        summary: 'Summary',
        published: false,
        featured: false,
      },
      {
        id: '2025-q4',
        year: 2025,
        quarter: 4,
        title: 'Previous year',
        subtitle: 'Q4 2025',
        summary: 'Summary',
        published: false,
        featured: false,
      },
    ])

    const content = fileSystem.files.get('/workspace/project/content/presentations/index.yaml') ?? ''
    expect(content.indexOf('id: 2026-q2')).toBeLessThan(content.indexOf('id: 2026-q1-a'))
    expect(content.indexOf('id: 2026-q1-a')).toBeLessThan(content.indexOf('id: 2026-q1-b'))
    expect(content.indexOf('id: 2026-q1-b')).toBeLessThan(content.indexOf('id: 2025-q4'))
  })
})
