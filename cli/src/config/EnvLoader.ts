import { parse } from 'dotenv'

import { NodeFileSystem } from '../io/FileSystem'

import type { FileSystemPaths } from '../io/FileSystemPaths'
import type { CliEnvironment } from './Config.types'
import type { FileSystem } from '../io/FileSystem'

export class EnvLoader {
  public constructor(private readonly fileSystem: FileSystem = new NodeFileSystem()) {}

  public async loadEnvironment(paths: FileSystemPaths): Promise<CliEnvironment> {
    const envPath = paths.getEnvPath()
    if (!(await this.fileSystem.fileExists(envPath))) {
      throw new Error(`Missing .env file at "${envPath}".`)
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
}
