import { parse } from 'dotenv'

import { NodeFileSystem } from '../io/FileSystem'

import type { FileSystemPaths } from '../io/FileSystemPaths'
import type { CliEnvironment } from './Config.types'
import type { FileSystem } from '../io/FileSystem'

export class EnvLoader {
  public constructor(private readonly fileSystem: FileSystem = new NodeFileSystem()) {}

  public async loadEnvironment(paths: FileSystemPaths): Promise<CliEnvironment> {
    const envPath = await this.findEnvPath(paths)

    if (!envPath) {
      throw new Error(`Missing .env file at "${paths.getEnvPath()}".`)
    }

    const envSource = await this.fileSystem.readTextFile(envPath)
    const parsed = parse(envSource)
    const githubAccessToken = parsed.GITHUB_PAT?.trim() || parsed.GITHUB_TOKEN?.trim()

    if (!githubAccessToken) {
      throw new Error(`Missing GITHUB_PAT in "${envPath}".`)
    }

    return {
      githubAccessToken,
    }
  }

  private async findEnvPath(paths: FileSystemPaths): Promise<string | undefined> {
    const candidates = [paths.getEnvPath(), paths.getLegacyMonorepoEnvPath()]

    for (const candidate of candidates) {
      if (await this.fileSystem.fileExists(candidate)) {
        return candidate
      }
    }

    return undefined
  }
}
