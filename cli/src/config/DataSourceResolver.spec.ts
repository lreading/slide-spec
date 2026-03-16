import { describe, expect, it } from 'vitest'

import { DataSourceResolver } from './DataSourceResolver'

describe('DataSourceResolver', () => {
  const resolver = new DataSourceResolver()

  it('resolves a normalized GitHub repository from site config', () => {
    expect(resolver.resolveGitHubRepository({
      data_sources: [
        {
          type: 'github',
          url: 'https://www.github.com/OWASP/threat-dragon.git',
        },
      ],
    })).toEqual({
      type: 'github',
      url: 'https://github.com/OWASP/threat-dragon',
      owner: 'OWASP',
      repo: 'threat-dragon',
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
          url: 'https://github.com/OWASP/threat-dragon',
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
          url: 'https://gitlab.com/OWASP/threat-dragon',
        },
      ],
    })).toThrow(
      'GitHub data source URL "https://gitlab.com/OWASP/threat-dragon" must point to github.com.',
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
