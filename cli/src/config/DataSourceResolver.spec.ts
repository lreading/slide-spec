import { describe, expect, it } from 'vitest'

import { DataSourceResolver } from './DataSourceResolver'

describe('DataSourceResolver', () => {
  const resolver = new DataSourceResolver()

  it('resolves a normalized GitHub repository from site config', () => {
    expect(resolver.resolveGitHubRepository({
      data_sources: [
        {
          type: 'github',
          url: 'https://www.github.com/example-org/aurora-notes.git',
        },
      ],
    })).toEqual({
      type: 'github',
      url: 'https://github.com/example-org/aurora-notes',
      owner: 'example-org',
      repo: 'aurora-notes',
    })
  })

  it('rejects missing, duplicate, or malformed GitHub sources', () => {
    expect(() => resolver.resolveGitHubRepository({})).toThrow(
      'site.data_sources must include exactly one github source.',
    )

    expect(() => resolver.resolveGitHubRepository({
      data_sources: [
        {
          type: 'github',
          url: 'https://github.com/example-org/aurora-notes',
        },
        {
          type: 'github',
          url: 'https://github.com/OWASP/juice-shop',
        },
      ],
    })).toThrow('site.data_sources must not include more than one github source.')

    expect(() => resolver.resolveGitHubRepository({
      data_sources: [
        {
          type: 'github',
          url: 'https://github.com/OWASP',
        },
      ],
    })).toThrow('GitHub data source URL "https://github.com/OWASP" must target a repository root.')

    expect(() => resolver.resolveGitHubRepository({
      data_sources: [
        {
          type: 'github',
          url: 'not-a-url',
        },
      ],
    })).toThrow('GitHub data source URL "not-a-url" is invalid.')

    expect(() => resolver.resolveGitHubRepository({
      data_sources: [
        {
          type: 'github',
          url: 'https://gitlab.com/example-org/aurora-notes',
        },
      ],
    })).toThrow(
      'GitHub data source URL "https://gitlab.com/example-org/aurora-notes" must point to github.com.',
    )

    expect(() => resolver.resolveGitHubRepository({
      data_sources: [
        {
          type: 'github',
          url: 'https://github.com/OWASP/.git',
        },
      ],
    })).toThrow(
      'GitHub data source URL "https://github.com/OWASP/.git" must target a repository root.',
    )
  })
})
