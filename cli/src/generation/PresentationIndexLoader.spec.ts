import { describe, expect, it } from 'vitest'

import { PresentationIndexLoader } from './PresentationIndexLoader'
import { FileSystemPaths } from '../io/FileSystemPaths'
import { YamlReader } from '../io/YamlReader'

import type { FileSystem } from '../io/FileSystem'

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
  public async directoryExists(_path: string): Promise<boolean> {
    return false
  }

  public async copyDirectory(_source: string, _destination: string): Promise<void> {}

  public async removeDirectory(_path: string): Promise<void> {}
}

describe('PresentationIndexLoader', () => {
  it('loads presentation index entries and can find a presentation by id', async () => {
    const paths = new FileSystemPaths('/workspace/project')
    const loader = new PresentationIndexLoader(new YamlReader(new MemoryFileSystem({
      '/workspace/project/content/presentations/index.yaml': `
presentations:
  - id: 2026-q1
    presentation_path: presentations/2026-q1/presentation.yaml
    generated_path: presentations/2026-q1/generated.yaml
    year: 2026
    title: Title
    subtitle: Q1 2026
    summary: Summary
    published: true
    featured: true
`,
    })))

    const entries = await loader.loadPresentations(paths)
    expect(entries).toHaveLength(1)
    expect(loader.findPresentationById(entries, '2026-q1')?.id).toBe('2026-q1')
    expect(loader.findPresentationById(entries, '2025-q4')).toBeUndefined()
  })

  it('rejects malformed index documents', async () => {
    const paths = new FileSystemPaths('/workspace/project')
    const loader = new PresentationIndexLoader(new YamlReader(new MemoryFileSystem({
      '/workspace/project/content/presentations/index.yaml': 'presentations: nope',
    })))

    await expect(loader.loadPresentations(paths)).rejects.toThrow(
      'content/presentations/index.yaml must contain a presentations array.',
    )
  })

  it('rejects malformed index entries and field types', async () => {
    const paths = new FileSystemPaths('/workspace/project')

    await expect(
      new PresentationIndexLoader(new YamlReader(new MemoryFileSystem({
        '/workspace/project/content/presentations/index.yaml': `
presentations:
  - nope
`,
      }))).loadPresentations(paths),
    ).rejects.toThrow('content/presentations/index.yaml.presentations[0] must be an object.')

    await expect(
      new PresentationIndexLoader(new YamlReader(new MemoryFileSystem({
        '/workspace/project/content/presentations/index.yaml': `
presentations:
  - id: 2026-q1
    presentation_path: presentations/2026-q1/presentation.yaml
    generated_path: presentations/2026-q1/generated.yaml
    year: nope
    title: Title
    subtitle: Q1 2026
    summary: Summary
    published: true
    featured: true
`,
      }))).loadPresentations(paths),
    ).rejects.toThrow('presentations[0].year must be a number.')

    await expect(
      new PresentationIndexLoader(new YamlReader(new MemoryFileSystem({
        '/workspace/project/content/presentations/index.yaml': `
presentations:
  - id: " "
    presentation_path: presentations/2026-q1/presentation.yaml
    generated_path: presentations/2026-q1/generated.yaml
    year: 2026
    title: Title
    subtitle: Q1 2026
    summary: Summary
    published: true
    featured: true
`,
      }))).loadPresentations(paths),
    ).rejects.toThrow('presentations[0].id must be a non-blank string.')

    await expect(
      new PresentationIndexLoader(new YamlReader(new MemoryFileSystem({
        '/workspace/project/content/presentations/index.yaml': `
presentations:
  - id: 2026-q1
    presentation_path: presentations/2026-q1/presentation.yaml
    generated_path: presentations/2026-q1/generated.yaml
    year: 2026
    title: Title
    subtitle: Q1 2026
    summary: Summary
    published: true
    featured: nope
`,
      }))).loadPresentations(paths),
    ).rejects.toThrow('presentations[0].featured must be a boolean.')
  })

})
