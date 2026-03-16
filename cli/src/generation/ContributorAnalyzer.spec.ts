import { describe, expect, it } from 'vitest'

import { ContributorAnalyzer } from './ContributorAnalyzer'

describe('ContributorAnalyzer', () => {
  const analyzer = new ContributorAnalyzer()

  it('builds contributor summaries and first-time counts from merged pull requests', () => {
    const result = analyzer.analyze(
      [
        {
          authorAvatarUrl: 'https://avatars.example/octocat.png',
          authorLogin: 'octocat',
          authorName: 'Octocat',
          mergedAt: '2026-01-01T00:00:00Z',
          number: 1,
          title: 'One',
          url: 'https://github.com/OWASP/threat-dragon/pull/1',
        },
        {
          authorLogin: 'alice',
          mergedAt: '2026-01-02T00:00:00Z',
          number: 2,
          title: 'Two',
          url: 'https://github.com/OWASP/threat-dragon/pull/2',
        },
        {
          authorLogin: 'octocat',
          mergedAt: '2026-01-03T00:00:00Z',
          number: 3,
          title: 'Three',
          url: 'https://github.com/OWASP/threat-dragon/pull/3',
        },
        {
          mergedAt: '2026-01-04T00:00:00Z',
          number: 4,
          title: 'Four',
          url: 'https://github.com/OWASP/threat-dragon/pull/4',
        },
      ],
      ['octocat'],
    )

    expect(result.total).toBe(2)
    expect(result.newContributorCount).toBe(1)
    expect(result.authors).toEqual([
      {
        login: 'octocat',
        name: 'Octocat',
        avatar_url: 'https://avatars.example/octocat.png',
        merged_prs: 2,
        first_time: false,
      },
      {
        login: 'alice',
        name: 'alice',
        avatar_url: 'https://github.com/alice.png',
        merged_prs: 1,
        first_time: true,
      },
    ])
  })
})
