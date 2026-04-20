import { describe, expect, it } from 'vitest'

import { GeneratedDataBuilder } from './GeneratedDataBuilder'

import type { GitHubClient, GitHubReleaseSummary } from '../github/GitHubClient.types'
import type { GitHubRepositoryRef } from '../config/Config.types'
import type { ReportingPeriod } from './Generation.types'

class StubGitHubClient implements GitHubClient {
  public async getRepositoryMetadata() {
    return {
      owner: 'example-org',
      repo: 'aurora-notes',
      fullName: 'example-org/aurora-notes',
      htmlUrl: 'https://github.com/example-org/aurora-notes',
      defaultBranch: 'main',
      createdAt: '2023-01-01T00:00:00Z',
      stars: 250,
      openIssues: 9,
    }
  }

  public async listReleases(): Promise<GitHubReleaseSummary[]> {
    return [
      {
        id: 1,
        tagName: 'v2.1.0',
        name: 'Period release',
        publishedAt: '2026-02-10',
        htmlUrl: 'https://github.com/example-org/aurora-notes/releases/tag/v2.1.0',
        body: '- Added thing\n- Fixed thing',
        isDraft: false,
        isPrerelease: false,
      },
      {
        id: 2,
        tagName: 'v2.0.0',
        name: 'Older release',
        publishedAt: '2025-12-20',
        htmlUrl: 'https://github.com/example-org/aurora-notes/releases/tag/v2.0.0',
        isDraft: false,
        isPrerelease: false,
      },
    ]
  }

  public async getStargazerCountAt(_repository: GitHubRepositoryRef, at: string): Promise<number> {
    return at.startsWith('2025-12-31') ? 200 : 250
  }

  public async getStargazerCountsAt(_repository: GitHubRepositoryRef, atValues: string[]): Promise<number[]> {
    return Promise.all(
      atValues.map((at) => this.getStargazerCountAt(_repository, at)),
    )
  }

  public async hasMergedPullRequestByAuthorBefore(
    _repository: GitHubRepositoryRef,
    authorLogin: string,
    before: string,
  ): Promise<boolean> {
    if (before === '2025-10-01') {
      return authorLogin === 'octocat'
    }

    return authorLogin === 'octocat'
  }

  public async listMergedPullRequestAuthorsBefore(): Promise<string[]> {
    return ['octocat']
  }

  public async listMergedPullRequests(_repository: GitHubRepositoryRef, dateRange: ReportingPeriod) {
    if (dateRange.start === '2025-10-01') {
      return [
        {
          authorAvatarUrl: 'https://avatars.example/octocat.png',
          authorLogin: 'octocat',
          authorName: 'Octocat',
          mergedAt: '2025-11-12T10:00:00Z',
          number: 10,
          title: 'Prior feature',
          url: 'https://github.com/example-org/aurora-notes/pull/10',
        },
      ]
    }

    return [
      {
        authorAvatarUrl: 'https://avatars.example/octocat.png',
        authorLogin: 'octocat',
        authorName: 'Octocat',
        mergedAt: '2026-01-12T10:00:00Z',
        number: 12,
        title: 'Add feature',
        url: 'https://github.com/example-org/aurora-notes/pull/12',
      },
      {
        authorLogin: 'alice',
        mergedAt: '2026-02-01T10:00:00Z',
        number: 13,
        title: 'Fix bug',
        url: 'https://github.com/example-org/aurora-notes/pull/13',
      },
    ]
  }

  public async listClosedIssues(_repository: GitHubRepositoryRef, dateRange: ReportingPeriod) {
    if (dateRange.start === '2025-10-01') {
      return [
        {
          number: 77,
          title: 'Issue 0',
          closedAt: '2025-11-01T00:00:00Z',
          url: 'https://github.com/example-org/aurora-notes/issues/77',
        },
      ]
    }

    return [
      {
        number: 88,
        title: 'Issue 1',
        closedAt: '2026-02-01T00:00:00Z',
        url: 'https://github.com/example-org/aurora-notes/issues/88',
      },
    ]
  }
}

describe('GeneratedDataBuilder', () => {
  const builder = new GeneratedDataBuilder()
  const repository: GitHubRepositoryRef = {
    owner: 'example-org',
    repo: 'aurora-notes',
    type: 'github',
    url: 'https://github.com/example-org/aurora-notes',
  }
  const currentPeriod: ReportingPeriod = {
    start: '2026-01-01',
    end: '2026-03-31',
  }
  const previousPeriod: ReportingPeriod = {
    start: '2025-10-01',
    end: '2025-12-31',
  }

  it('builds generated presentation data with previous-period deltas and contributor analysis', async () => {
    const result = await builder.build({
      client: new StubGitHubClient(),
      presentationId: '2026-q1',
      currentPeriod,
      previousPeriod,
      repository,
    })
    const generated = result.generated

    expect(result.warnings).toEqual([])
    expect(result.timings).not.toEqual([])
    expect(generated.stats.stars?.delta).toBe(50)
    expect(generated.stats.stars?.previous).toBe(200)
    expect(generated.stats.stars?.metadata).toEqual({
      comparison_status: 'complete',
      warning_codes: [],
    })
    expect(generated.stats.prs_merged?.delta).toBe(1)
    expect(generated.stats.prs_merged?.metadata).toEqual({
      comparison_status: 'complete',
      warning_codes: [],
    })
    expect(generated.stats.new_contributors?.current).toBe(1)
    expect(generated.stats.issues_closed?.previous).toBe(1)
    expect(generated.releases[0]?.summary_bullets).toEqual(['Added thing', 'Fixed thing'])
    expect(generated.contributors.authors).toContainEqual(expect.objectContaining({
      login: 'alice',
      first_time: true,
    }))
    expect(generated.merged_prs).toEqual([
      {
        number: 12,
        title: 'Add feature',
        merged_at: '2026-01-12T10:00:00Z',
        author_login: 'octocat',
      },
      {
        number: 13,
        title: 'Fix bug',
        merged_at: '2026-02-01T10:00:00Z',
        author_login: 'alice',
      },
    ])
  })

  it('falls back to zero previous values when no previous generated data exists', async () => {
    const result = await builder.build({
      client: new StubGitHubClient(),
      presentationId: '2026-q1',
      currentPeriod,
      repository,
    })
    const generated = result.generated

    expect(generated.stats.stars?.previous).toBe(0)
    expect(generated.stats.stars?.delta).toBe(250)
    expect(generated.stats.stars?.metadata).toEqual({
      comparison_status: 'skipped',
      warning_codes: ['comparison_disabled'],
    })
  })

  it('uses combined star snapshot lookup for very large repositories when it completes in budget', async () => {
    class LargeRepositoryClient extends StubGitHubClient {
      public combinedCalls = 0
      public singleCalls = 0

      public override async getRepositoryMetadata() {
        const metadata = await super.getRepositoryMetadata()
        return {
          ...metadata,
          stars: 45000,
        }
      }

      public override async getStargazerCountAt(_repository: GitHubRepositoryRef, _at: string): Promise<number> {
        this.singleCalls += 1
        return 44000
      }

      public override async getStargazerCountsAt(
        _repository: GitHubRepositoryRef,
        _atValues: string[],
      ): Promise<number[]> {
        this.combinedCalls += 1
        return [44000, 43000]
      }
    }

    const client = new LargeRepositoryClient()
    const result = await builder.build({
      client,
      presentationId: '2026-q1',
      currentPeriod,
      previousPeriod,
      repository,
    })

    expect(client.combinedCalls).toBe(1)
    expect(client.singleCalls).toBe(0)
    expect(result.generated.stats.stars?.current).toBe(44000)
    expect(result.generated.stats.stars?.previous).toBe(43000)
    expect(result.generated.stats.stars?.delta).toBe(1000)
    expect(result.generated.stats.stars?.metadata).toEqual({
      comparison_status: 'complete',
      warning_codes: [],
    })
  })

  it('marks previous star comparisons unavailable when the large-repository combined lookup falls back', async () => {
    class LargeRepositoryFallbackClient extends StubGitHubClient {
      public combinedCalls = 0
      public singleCalls = 0

      public override async getRepositoryMetadata() {
        const metadata = await super.getRepositoryMetadata()
        return {
          ...metadata,
          stars: 45000,
        }
      }

      public override async getStargazerCountAt(_repository: GitHubRepositoryRef, _at: string): Promise<number> {
        this.singleCalls += 1
        return 44000
      }

      public override async getStargazerCountsAt(): Promise<number[]> {
        this.combinedCalls += 1
        throw new Error('Timed out')
      }
    }

    const client = new LargeRepositoryFallbackClient()
    const result = await builder.build({
      client,
      presentationId: '2026-q1',
      currentPeriod,
      previousPeriod,
      repository,
    })

    expect(client.combinedCalls).toBe(1)
    expect(client.singleCalls).toBe(1)
    expect(result.generated.stats.stars?.current).toBe(44000)
    expect(result.generated.stats.stars?.previous).toBe(44000)
    expect(result.generated.stats.stars?.delta).toBe(0)
    expect(result.generated.stats.stars?.metadata).toEqual({
      comparison_status: 'unavailable',
      warning_codes: ['combined_snapshot_fallback', 'previous_snapshot_unavailable_large_repo'],
    })
    expect(result.warnings).toContain(
      'Previous-period star comparison was unavailable after exhausting the large-repository time budget.',
    )
  })

  it('filters out releases outside the current period and falls back to repository name when no bullets or release name exist', async () => {
    class SparseReleaseClient extends StubGitHubClient {
      public override async listReleases(): Promise<GitHubReleaseSummary[]> {
        return [
          {
            id: 3,
            tagName: 'v2.2.0',
            publishedAt: '2026-03-15T10:00:00Z',
            htmlUrl: 'https://github.com/example-org/aurora-notes/releases/tag/v2.2.0',
            isDraft: false,
            isPrerelease: false,
          },
          {
            id: 4,
            tagName: 'v2.1.9',
            publishedAt: '2025-12-31T23:59:59Z',
            htmlUrl: 'https://github.com/example-org/aurora-notes/releases/tag/v2.1.9',
            isDraft: false,
            isPrerelease: false,
          },
          {
            id: 5,
            tagName: 'v2.1.8',
            htmlUrl: 'https://github.com/example-org/aurora-notes/releases/tag/v2.1.8',
            isDraft: false,
            isPrerelease: false,
          },
        ]
      }
    }

    const generated = (await builder.build({
      client: new SparseReleaseClient(),
      presentationId: '2026-q1',
      currentPeriod,
      repository,
    })).generated

    expect(generated.releases).toEqual([
      {
        id: 'v2.2.0',
        version: 'v2.2.0',
        published_at: '2026-03-15T10:00:00Z',
        url: 'https://github.com/example-org/aurora-notes/releases/tag/v2.2.0',
        summary_bullets: ['Release for example-org/aurora-notes'],
      },
    ])
  })

  it('falls back to repository metadata and warning text when star history is unavailable', async () => {
    class FailingStarClient extends StubGitHubClient {
      public override async getStargazerCountAt(): Promise<number> {
        throw new Error('GraphQL unavailable')
      }
    }

    const result = await builder.build({
      client: new FailingStarClient(),
      presentationId: '2026-q1',
      currentPeriod,
      previousPeriod,
      repository,
    })

    expect(result.generated.stats.stars?.current).toBe(250)
    expect(result.generated.stats.stars?.previous).toBe(0)
    expect(result.generated.stats.stars?.metadata).toEqual({
      comparison_status: 'partial',
      warning_codes: ['current_snapshot_fallback', 'previous_snapshot_unavailable'],
    })
    expect(result.warnings).toEqual([
      'Historical star snapshot for the current period was unavailable; current stars use repository metadata.',
      'Historical star snapshot for the previous period was unavailable; previous stars defaulted to 0.',
    ])
  })
})
