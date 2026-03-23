import { DataSourceResolver } from '../config/DataSourceResolver'
import { GitHubApiClient, GitHubApiError } from './GitHubClient'

import type { CliLogger } from '../logging/CliLogger.types'

import type { GitHubRepositoryRef } from '../config/Config.types'

export interface GitHubRepositoryValidationResult {
  repository: GitHubRepositoryRef
  verified: boolean
  warning?: string
}

interface GitHubRepositoryValidatorOptions {
  token?: string
  repositoryClient?: GitHubApiClient
  dataSourceResolver?: DataSourceResolver
  logger?: CliLogger
}

export class GitHubRepositoryValidator {
  private readonly repositoryClient: GitHubApiClient
  private readonly dataSourceResolver: DataSourceResolver

  public constructor(options: GitHubRepositoryValidatorOptions = {}) {
    this.repositoryClient = options.repositoryClient ?? new GitHubApiClient({
      ...(options.token !== undefined ? { token: options.token } : {}),
      ...(options.logger !== undefined ? { logger: options.logger } : {}),
    })
    this.dataSourceResolver = options.dataSourceResolver ?? new DataSourceResolver()
  }

  public async validate(repositoryUrl: string): Promise<GitHubRepositoryValidationResult> {
    const repository = this.dataSourceResolver.resolveGitHubRepository({
      data_sources: [
        {
          type: 'github',
          url: repositoryUrl,
        },
      ],
    })

    try {
      await this.repositoryClient.getRepositoryMetadata(repository)
      return {
        repository,
        verified: true,
      }
    } catch (error) {
      if (error instanceof GitHubApiError && error.status === 404) {
        throw new Error(
          `GitHub repository "${repositoryUrl}" was not found. Double-check the URL and try again.`,
          { cause: error },
        )
      }

      return {
        repository,
        verified: false,
        warning: 'GitHub repository could not be verified right now. Continuing best-effort.',
      }
    }
  }
}
