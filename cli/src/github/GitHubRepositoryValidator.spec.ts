import { describe, expect, it, vi } from 'vitest'

import { GitHubApiError } from './GitHubClient'
import type { GitHubApiClient } from './GitHubClient'
import { GitHubRepositoryValidator } from './GitHubRepositoryValidator'

import type { GitHubRepositoryRef } from '../config/Config.types'
import type { DataSourceResolver } from '../config/DataSourceResolver'

const repository: GitHubRepositoryRef = {
  type: 'github',
  owner: 'example-org',
  repo: 'aurora-notes',
  url: 'https://github.com/example-org/aurora-notes',
}

describe('GitHubRepositoryValidator', () => {
  it('verifies a reachable repository', async () => {
    const repositoryClient = {
      getRepositoryMetadata: vi.fn().mockResolvedValue({
        owner: 'example-org',
        repo: 'aurora-notes',
        fullName: 'example-org/aurora-notes',
        htmlUrl: repository.url,
        defaultBranch: 'main',
        stars: 1,
        openIssues: 2,
      }),
    } as unknown as GitHubApiClient
    const dataSourceResolver = {
      resolveGitHubRepository: vi.fn().mockReturnValue(repository),
    } as unknown as DataSourceResolver

    const validator = new GitHubRepositoryValidator({
      repositoryClient,
      dataSourceResolver,
    })

    await expect(validator.validate(repository.url)).resolves.toEqual({
      repository,
      verified: true,
    })
  })

  it('re-prompts callers by throwing a specific error for missing repositories', async () => {
    const repositoryClient = {
      getRepositoryMetadata: vi.fn().mockRejectedValue(
        new GitHubApiError(404, 'Not Found', 'https://api.github.com/repos/example-org/aurora-notes'),
      ),
    } as unknown as GitHubApiClient
    const dataSourceResolver = {
      resolveGitHubRepository: vi.fn().mockReturnValue(repository),
    } as unknown as DataSourceResolver

    const validator = new GitHubRepositoryValidator({
      repositoryClient,
      dataSourceResolver,
    })

    await expect(validator.validate(repository.url)).rejects.toThrow(
      'GitHub repository "https://github.com/example-org/aurora-notes" was not found. Double-check the URL and try again.',
    )
  })

  it('returns a best-effort warning when verification fails for non-404 reasons', async () => {
    const repositoryClient = {
      getRepositoryMetadata: vi.fn().mockRejectedValue(new Error('rate limited')),
    } as unknown as GitHubApiClient
    const dataSourceResolver = {
      resolveGitHubRepository: vi.fn().mockReturnValue(repository),
    } as unknown as DataSourceResolver

    const validator = new GitHubRepositoryValidator({
      repositoryClient,
      dataSourceResolver,
    })

    await expect(validator.validate(repository.url)).resolves.toEqual({
      repository,
      verified: false,
      warning: 'GitHub repository could not be verified right now. Continuing best-effort.',
    })
  })
})
