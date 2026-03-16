import { describe, expect, it } from 'vitest'

import { GeneratedDataBuilder } from './GeneratedDataBuilder'

import type { GitHubClient } from '../github/GitHubClient.types'
import type { GitHubRepositoryRef } from '../config/Config.types'
import type { QuarterWindow } from './Generation.types'

class StubGitHubClient implements GitHubClient {
  public async getRepositoryMetadata() {
    return {
      owner: 'OWASP',
      repo: 'threat-dragon',
      fullName: 'OWASP/threat-dragon',
      htmlUrl: 'https://github.com/OWASP/threat-dragon',
      defaultBranch: 'main',
      stars: 250,
      openIssues: 9,
    }
  }

  public async listReleases() {
    return [
      {
        id: 1,
        tagName: 'v2.1.0',
        name: 'Quarterly release',
        publishedAt: '2026-02-10',
        htmlUrl: 'https://github.com/OWASP/threat-dragon/releases/tag/v2.1.0',
        body: '- Added thing\n- Fixed thing',
        isDraft: false,
        isPrerelease: false,
      },
      {
        id: 2,
        tagName: 'v2.0.0',
        name: 'Older release',
        publishedAt: '2025-12-20',
        htmlUrl: 'https://github.com/OWASP/threat-dragon/releases/tag/v2.0.0',
        isDraft: false,
        isPrerelease: false,
      },
    ]
  }

  public async listMergedPullRequests() {
    return [
      {
        authorAvatarUrl: 'https://avatars.example/octocat.png',
        authorLogin: 'octocat',
        authorName: 'Octocat',
        mergedAt: '2026-01-12T10:00:00Z',
        number: 12,
        title: 'Add feature',
        url: 'https://github.com/OWASP/threat-dragon/pull/12',
      },
      {
        authorLogin: 'alice',
        mergedAt: '2026-02-01T10:00:00Z',
        number: 13,
        title: 'Fix bug',
        url: 'https://github.com/OWASP/threat-dragon/pull/13',
      },
    ]
  }

  public async listMergedPullRequestAuthorsBefore() {
    return ['octocat']
  }

  public async listClosedIssues() {
    return [
      {
        number: 88,
        title: 'Issue 1',
        closedAt: '2026-02-01T00:00:00Z',
        url: 'https://github.com/OWASP/threat-dragon/issues/88',
      },
    ]
  }
}

describe('GeneratedDataBuilder', () => {
  const builder = new GeneratedDataBuilder()
  const repository: GitHubRepositoryRef = {
    owner: 'OWASP',
    repo: 'threat-dragon',
    type: 'github',
    url: 'https://github.com/OWASP/threat-dragon',
  }
  const quarterWindow: QuarterWindow = {
    year: 2026,
    quarter: 1,
    presentationId: '2026-q1',
    start: '2026-01-01',
    end: '2026-03-31',
    previousYear: 2025,
    previousQuarter: 4,
  }

  it('builds generated presentation data with previous-quarter deltas and contributor analysis', async () => {
    const generated = await builder.build({
      client: new StubGitHubClient(),
      presentationId: '2026-q1',
      previousGenerated: {
        id: '2025-q4',
        period: {
          start: '2025-10-01',
          end: '2025-12-31',
        },
        stats: {
          stars: { label: 'GitHub Stars', current: 200, previous: 0, delta: 200 },
          issues_closed: { label: 'Issues closed', current: 3, previous: 0, delta: 3 },
          prs_merged: { label: 'PRs Merged', current: 1, previous: 0, delta: 1 },
          new_contributors: { label: 'New contributors', current: 0, previous: 0, delta: 0 },
        },
        releases: [],
        contributors: {
          total: 0,
          authors: [],
        },
        merged_prs: [],
      },
      previousPresentationId: '2025-q4',
      quarterWindow,
      repository,
    })

    expect(generated.stats.stars?.delta).toBe(50)
    expect(generated.stats.prs_merged?.delta).toBe(1)
    expect(generated.stats.new_contributors?.current).toBe(1)
    expect(generated.previous_presentation_id).toBe('2025-q4')
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
    const generated = await builder.build({
      client: new StubGitHubClient(),
      presentationId: '2026-q1',
      quarterWindow,
      repository,
    })

    expect(generated.stats.stars?.previous).toBe(0)
    expect(generated.stats.stars?.delta).toBe(250)
  })
})
