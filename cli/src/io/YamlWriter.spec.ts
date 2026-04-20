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
  public async directoryExists(_path: string): Promise<boolean> {
    return false
  }

  public async copyDirectory(_source: string, _destination: string): Promise<void> {}

  public async removeDirectory(_path: string): Promise<void> {}
}

describe('YamlWriter', () => {
  it('serializes and writes YAML documents', async () => {
    const fileSystem = new MemoryFileSystem()
    const writer = new YamlWriter(fileSystem)

    await writer.writeDocument('/tmp/generated.yaml', {
      schemaVersion: 1,
      generated: {
        id: '2026-q1',
      },
    })

    expect(fileSystem.writes.get('/tmp/generated.yaml')).toContain('schemaVersion:')
    expect(fileSystem.writes.get('/tmp/generated.yaml')).toContain('generated:')
    expect(fileSystem.writes.get('/tmp/generated.yaml')).toContain('id: 2026-q1')
  })

  it('prepends a yaml language server schema comment when a schema URL is provided', async () => {
    const fileSystem = new MemoryFileSystem()
    const writer = new YamlWriter(fileSystem)

    await writer.writeDocument('/tmp/site.yaml', { schemaVersion: 1, site: {} }, {
      schemaUrl: 'https://slide-spec.dev/schema/site.schema.json',
    })

    expect(fileSystem.writes.get('/tmp/site.yaml')?.startsWith(
      '# yaml-language-server: $schema=https://slide-spec.dev/schema/site.schema.json\n',
    )).toBe(true)
  })

  it('prepends the Slide Spec header before schema comments when requested', async () => {
    const fileSystem = new MemoryFileSystem()
    const writer = new YamlWriter(fileSystem)

    await writer.writeDocument('/tmp/site.yaml', { schemaVersion: 1, site: {} }, {
      schemaUrl: 'https://slide-spec.dev/schema/site.schema.json',
      includeSlideSpecHeader: true,
    })

    expect(fileSystem.writes.get('/tmp/site.yaml')?.startsWith(
      [
        '# Slide Spec',
        '# https://www.slide-spec.dev/',
        '# Documentation: https://docs.slide-spec.dev/',
        '# yaml-language-server: $schema=https://slide-spec.dev/schema/site.schema.json',
        'schemaVersion:',
      ].join('\n'),
    )).toBe(true)
  })
})
