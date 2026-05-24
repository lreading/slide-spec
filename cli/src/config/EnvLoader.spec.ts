import { afterEach, beforeEach, describe, expect, it } from 'vitest'

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
  public async directoryExists(_path: string): Promise<boolean> {
    return false
  }

  public async copyDirectory(_source: string, _destination: string): Promise<void> {}

  public async removeDirectory(_path: string): Promise<void> {}
}

let previousGitHubPat: string | undefined
let previousGitHubToken: string | undefined
let previousGhToken: string | undefined

beforeEach(() => {
  previousGitHubPat = process.env.GITHUB_PAT
  previousGitHubToken = process.env.GITHUB_TOKEN
  previousGhToken = process.env.GH_TOKEN
  delete process.env.GITHUB_PAT
  delete process.env.GITHUB_TOKEN
  delete process.env.GH_TOKEN
})

afterEach(() => {
  restoreEnvValue('GITHUB_PAT', previousGitHubPat)
  restoreEnvValue('GITHUB_TOKEN', previousGitHubToken)
  restoreEnvValue('GH_TOKEN', previousGhToken)
})

function restoreEnvValue(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name]
    return
  }

  process.env[name] = value
}

describe('EnvLoader', () => {
  it('loads the GitHub token from environment variables before .env files', async () => {
    const paths = new FileSystemPaths('/workspace/project')

    process.env.GITHUB_PAT = 'process-token'

    await expect(
      new EnvLoader(new MemoryFileSystem({
        '/workspace/project/.env': 'GITHUB_PAT=file-token',
      })).loadEnvironment(paths),
    ).resolves.toEqual({
      githubAccessToken: 'process-token',
    })
  })

  it('loads the GitHub token from GITHUB_PAT and falls back to GITHUB_TOKEN or GH_TOKEN', async () => {
    const paths = new FileSystemPaths('/workspace/project')
    const loader = new EnvLoader(new MemoryFileSystem({
      '/workspace/project/.env': 'GITHUB_PAT=test-token',
    }))

    await expect(loader.loadEnvironment(paths)).resolves.toEqual({
      githubAccessToken: 'test-token',
    })

    await expect(
      new EnvLoader(new MemoryFileSystem({
        '/workspace/project/.env': 'GITHUB_TOKEN=fallback-token',
      })).loadEnvironment(paths),
    ).resolves.toEqual({
      githubAccessToken: 'fallback-token',
    })

    await expect(
      new EnvLoader(new MemoryFileSystem({
        '/workspace/project/.env': 'GH_TOKEN=actions-token',
      })).loadEnvironment(paths),
    ).resolves.toEqual({
      githubAccessToken: 'actions-token',
    })
  })

  it('falls back to project-root cli/.env for local monorepo compatibility', async () => {
    const paths = new FileSystemPaths('/workspace/project')

    await expect(
      new EnvLoader(new MemoryFileSystem({
        '/workspace/project/cli/.env': 'GITHUB_PAT=legacy-token',
      })).loadEnvironment(paths),
    ).resolves.toEqual({
      githubAccessToken: 'legacy-token',
    })
  })

  it('returns an empty environment when .env is missing or does not include a GitHub token', async () => {
    const paths = new FileSystemPaths('/workspace/project')

    await expect(new EnvLoader(new MemoryFileSystem({})).loadEnvironment(paths)).resolves.toEqual({})

    await expect(
      new EnvLoader(new MemoryFileSystem({
        '/workspace/project/.env': 'ANOTHER_VALUE=1',
      })).loadEnvironment(paths),
    ).resolves.toEqual({})
  })
})
