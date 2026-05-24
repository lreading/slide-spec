import { parse } from 'dotenv'

import { NodeFileSystem } from '../io/FileSystem'

import type { FileSystemPaths } from '../io/FileSystemPaths'
import type { CliEnvironment } from './Config.types'
import type { FileSystem } from '../io/FileSystem'

export class EnvLoader {
  public constructor(private readonly fileSystem: FileSystem = new NodeFileSystem()) {}

  public async loadEnvironment(paths: FileSystemPaths): Promise<CliEnvironment> {
    const processToken = this.readGitHubToken(process.env)

    if (processToken) {
      return {
        githubAccessToken: processToken,
      }
    }

    const envPath = await this.findEnvPath(paths)

    if (!envPath) {
      return {}
    }

    const envSource = await this.fileSystem.readTextFile(envPath)
    const parsed = parse(envSource)
    const githubAccessToken = this.readGitHubToken(parsed)

    if (!githubAccessToken) {
      return {}
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

  private readGitHubToken(source: Record<string, string | undefined>): string | undefined {
    return source.GITHUB_PAT?.trim() || source.GITHUB_TOKEN?.trim() || source.GH_TOKEN?.trim() || undefined
  }
}
