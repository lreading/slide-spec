import { describe, expect, it } from 'vitest'

import { ContentConfigLoader } from './ContentConfigLoader'
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

describe('ContentConfigLoader', () => {
  it('loads the site config from the main content file', async () => {
    const paths = new FileSystemPaths('/workspace/project')
    const loader = new ContentConfigLoader(new YamlReader(new MemoryFileSystem({
      '/workspace/project/content/site.yaml': `
schemaVersion: 1
site:
  title: Demo
  home_intro: Intro
  home_cta_label: Start
  presentations_cta_label: Browse
  data_sources:
    - type: github
      url: https://github.com/example-org/aurora-notes
  links:
    repository:
      label: Repo
      url: https://github.com/example-org/aurora-notes
    docs:
      label: Docs
      url: https://example.com/docs
    community:
      label: Community
      url: https://example.com/community
`,
    })))

    await expect(loader.loadSiteConfig(paths)).resolves.toEqual({
      title: 'Demo',
      home_intro: 'Intro',
      home_cta_label: 'Start',
      presentations_cta_label: 'Browse',
      data_sources: [
        {
          type: 'github',
          url: 'https://github.com/example-org/aurora-notes',
        },
      ],
      links: {
        repository: {
          label: 'Repo',
          url: 'https://github.com/example-org/aurora-notes',
        },
        docs: {
          label: 'Docs',
          url: 'https://example.com/docs',
        },
        community: {
          label: 'Community',
          url: 'https://example.com/community',
        },
      },
    })
  })

  it('rejects documents without a top-level site object', async () => {
    const paths = new FileSystemPaths('/workspace/project')
    const loader = new ContentConfigLoader(new YamlReader(new MemoryFileSystem({
      '/workspace/project/content/site.yaml': 'title: nope',
    })))

    await expect(loader.loadSiteConfig(paths)).rejects.toThrow(
      'site.yaml.title is not allowed.',
    )
  })
})
