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
}

describe('ContentConfigLoader', () => {
  it('loads the site config from the main content file', async () => {
    const paths = new FileSystemPaths('/workspace/project/cli')
    const loader = new ContentConfigLoader(new YamlReader(new MemoryFileSystem({
      '/workspace/project/content/site.yaml': `
site:
  data_sources:
    - type: github
      url: https://github.com/OWASP/threat-dragon
`,
    })))

    await expect(loader.loadSiteConfig(paths)).resolves.toEqual({
      data_sources: [
        {
          type: 'github',
          url: 'https://github.com/OWASP/threat-dragon',
        },
      ],
    })
  })

  it('rejects documents without a top-level site object', async () => {
    const paths = new FileSystemPaths('/workspace/project/cli')
    const loader = new ContentConfigLoader(new YamlReader(new MemoryFileSystem({
      '/workspace/project/content/site.yaml': 'title: nope',
    })))

    await expect(loader.loadSiteConfig(paths)).rejects.toThrow(
      'content/site.yaml must contain a top-level site object.',
    )
  })
})
