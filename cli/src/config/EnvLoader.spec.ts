import { describe, expect, it } from 'vitest'

import { EnvLoader } from './EnvLoader'
import { FileSystemPaths } from '../io/FileSystemPaths'

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
}

describe('EnvLoader', () => {
  it('loads the GitHub token from GITHUB_PAT and falls back to GITHUB_TOKEN', async () => {
    const paths = new FileSystemPaths('/workspace/project/cli')
    const loader = new EnvLoader(new MemoryFileSystem({
      '/workspace/project/cli/.env': 'GITHUB_PAT=test-token',
    }))

    await expect(loader.loadEnvironment(paths)).resolves.toEqual({
      githubAccessToken: 'test-token',
    })

    await expect(
      new EnvLoader(new MemoryFileSystem({
        '/workspace/project/cli/.env': 'GITHUB_TOKEN=fallback-token',
      })).loadEnvironment(paths),
    ).resolves.toEqual({
      githubAccessToken: 'fallback-token',
    })
  })

  it('rejects missing .env files and missing tokens', async () => {
    const paths = new FileSystemPaths('/workspace/project/cli')

    await expect(new EnvLoader(new MemoryFileSystem({})).loadEnvironment(paths)).rejects.toThrow(
      'Missing .env file at "/workspace/project/cli/.env".',
    )

    await expect(
      new EnvLoader(new MemoryFileSystem({
        '/workspace/project/cli/.env': 'ANOTHER_VALUE=1',
      })).loadEnvironment(paths),
    ).rejects.toThrow('Missing GITHUB_PAT in "/workspace/project/cli/.env".')
  })
})
