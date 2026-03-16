import { describe, expect, it } from 'vitest'

import { GitHubApiClient, GitHubApiError } from './GitHubClient'

import type {
  GitHubRequest,
  GitHubResponse,
  GitHubTransport,
} from './GitHubClient.types'
import type { GitHubRepositoryRef } from '../config/Config.types'

class StubTransport implements GitHubTransport {
  public readonly requests: GitHubRequest[] = []

  public constructor(private readonly responses: GitHubResponse[]) {}

  public async send(request: GitHubRequest): Promise<GitHubResponse> {
    this.requests.push(request)
    const response = this.responses.shift()

    if (!response) {
      throw new Error('No stub response available.')
    }

    return response
  }
}

function createJsonResponse(body: unknown, status = 200, statusText = 'OK'): GitHubResponse {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: async (): Promise<unknown> => body,
  }
}

const repository: GitHubRepositoryRef = {
  owner: 'OWASP',
  repo: 'threat-dragon',
  type: 'github',
  url: 'https://github.com/OWASP/threat-dragon',
}

describe('GitHubApiClient', () => {
  it('loads repository metadata via REST with auth headers', async () => {
    const transport = new StubTransport([
      createJsonResponse({
        default_branch: 'main',
        full_name: 'OWASP/threat-dragon',
        html_url: 'https://github.com/OWASP/threat-dragon',
        open_issues_count: 12,
        stargazers_count: 321,
      }),
    ])

    const client = new GitHubApiClient({
      token: 'secret-token',
      transport,
    })

    await expect(client.getRepositoryMetadata(repository)).resolves.toEqual({
      owner: 'OWASP',
      repo: 'threat-dragon',
      fullName: 'OWASP/threat-dragon',
      htmlUrl: 'https://github.com/OWASP/threat-dragon',
      defaultBranch: 'main',
      stars: 321,
      openIssues: 12,
    })

    expect(transport.requests[0]).toMatchObject({
      method: 'GET',
      url: 'https://api.github.com/repos/OWASP/threat-dragon',
    })
    expect(transport.requests[0]?.headers.Authorization).toBe('Bearer secret-token')
  })

  it('paginates releases from the REST API', async () => {
    const transport = new StubTransport([
      createJsonResponse(Array.from({ length: 100 }, (_, index) => ({
        body: `Body ${index + 1}`,
        draft: false,
        html_url: `https://github.com/OWASP/threat-dragon/releases/tag/v${index + 1}`,
        id: index + 1,
        name: `Release ${index + 1}`,
        prerelease: false,
        published_at: `2026-01-${String((index % 28) + 1).padStart(2, '0')}`,
        tag_name: `v${index + 1}`,
      }))),
      createJsonResponse([
        {
          body: 'Last page',
          draft: false,
          html_url: 'https://github.com/OWASP/threat-dragon/releases/tag/v101',
          id: 101,
          name: 'Release 101',
          prerelease: true,
          published_at: '2026-02-01',
          tag_name: 'v101',
        },
      ]),
    ])

    const client = new GitHubApiClient({ token: 'secret-token', transport })
    const releases = await client.listReleases(repository)

    expect(releases).toHaveLength(101)
    expect(releases[100]).toMatchObject({
      id: 101,
      isPrerelease: true,
      tagName: 'v101',
    })
    expect(transport.requests).toHaveLength(2)
  })

  it('paginates merged pull requests through GraphQL and includes the merged date range query', async () => {
    const transport = new StubTransport([
      createJsonResponse({
        data: {
          search: {
            nodes: [
              {
                author: { login: 'octocat' },
                mergedAt: '2026-01-10T12:00:00Z',
                number: 12,
                title: 'Add feature',
                url: 'https://github.com/OWASP/threat-dragon/pull/12',
              },
            ],
            pageInfo: {
              endCursor: 'cursor-1',
              hasNextPage: true,
            },
          },
        },
      }),
      createJsonResponse({
        data: {
          search: {
            nodes: [
              {
                author: { login: 'hubot' },
                mergedAt: '2026-01-11T12:00:00Z',
                number: 13,
                title: 'Fix bug',
                url: 'https://github.com/OWASP/threat-dragon/pull/13',
              },
            ],
            pageInfo: {
              endCursor: null,
              hasNextPage: false,
            },
          },
        },
      }),
    ])

    const client = new GitHubApiClient({ token: 'secret-token', transport })
    const pullRequests = await client.listMergedPullRequests(repository, {
      start: '2026-01-01',
      end: '2026-03-31',
    })

    expect(pullRequests).toEqual([
      {
        authorLogin: 'octocat',
        mergedAt: '2026-01-10T12:00:00Z',
        number: 12,
        title: 'Add feature',
        url: 'https://github.com/OWASP/threat-dragon/pull/12',
      },
      {
        authorLogin: 'hubot',
        mergedAt: '2026-01-11T12:00:00Z',
        number: 13,
        title: 'Fix bug',
        url: 'https://github.com/OWASP/threat-dragon/pull/13',
      },
    ])

    const firstRequestBody = JSON.parse(transport.requests[0]?.body ?? '{}') as {
      query?: string
      variables?: {
        query?: string
      }
    }

    expect(firstRequestBody.query).toContain('SearchMergedPullRequests')
    expect(firstRequestBody.variables?.query).toContain('merged:2026-01-01..2026-03-31')
    expect(transport.requests).toHaveLength(2)
  })

  it('deduplicates historical merged pull request authors before a cutoff date', async () => {
    const transport = new StubTransport([
      createJsonResponse({
        data: {
          search: {
            nodes: [
              {
                author: { login: 'octocat' },
                mergedAt: '2025-12-30T12:00:00Z',
                number: 10,
                title: 'Docs',
                url: 'https://github.com/OWASP/threat-dragon/pull/10',
              },
              {
                author: { login: 'octocat' },
                mergedAt: '2025-12-29T12:00:00Z',
                number: 9,
                title: 'More docs',
                url: 'https://github.com/OWASP/threat-dragon/pull/9',
              },
              {
                author: { login: 'alice' },
                mergedAt: '2025-12-20T12:00:00Z',
                number: 8,
                title: 'Fix tests',
                url: 'https://github.com/OWASP/threat-dragon/pull/8',
              },
            ],
            pageInfo: {
              endCursor: null,
              hasNextPage: false,
            },
          },
        },
      }),
    ])

    const client = new GitHubApiClient({ token: 'secret-token', transport })

    await expect(
      client.listMergedPullRequestAuthorsBefore(repository, '2026-01-01'),
    ).resolves.toEqual(['alice', 'octocat'])
  })

  it('loads closed issues in a date range through GraphQL', async () => {
    const transport = new StubTransport([
      createJsonResponse({
        data: {
          search: {
            nodes: [
              {
                closedAt: '2026-02-05T09:00:00Z',
                number: 88,
                title: 'Improve export flow',
                url: 'https://github.com/OWASP/threat-dragon/issues/88',
              },
            ],
            pageInfo: {
              endCursor: null,
              hasNextPage: false,
            },
          },
        },
      }),
    ])

    const client = new GitHubApiClient({ token: 'secret-token', transport })

    await expect(client.listClosedIssues(repository, {
      start: '2026-01-01',
      end: '2026-03-31',
    })).resolves.toEqual([
      {
        closedAt: '2026-02-05T09:00:00Z',
        number: 88,
        title: 'Improve export flow',
        url: 'https://github.com/OWASP/threat-dragon/issues/88',
      },
    ])
  })

  it('handles sparse optional GitHub fields and missing authors without inventing values', async () => {
    const transport = new StubTransport([
      createJsonResponse([
        {
          draft: false,
          html_url: 'https://github.com/OWASP/threat-dragon/releases/tag/v1',
          id: 1,
          name: '   ',
          prerelease: false,
          published_at: '',
          tag_name: 'v1',
        },
      ]),
      createJsonResponse({
        data: {
          search: {
            nodes: [
              {
                author: null,
                mergedAt: '2026-01-10T12:00:00Z',
                number: 12,
                title: 'Add feature',
                url: 'https://github.com/OWASP/threat-dragon/pull/12',
              },
            ],
            pageInfo: {
              endCursor: null,
              hasNextPage: false,
            },
          },
        },
      }),
    ])

    const client = new GitHubApiClient({ token: 'secret-token', transport })

    await expect(client.listReleases(repository)).resolves.toEqual([
      {
        htmlUrl: 'https://github.com/OWASP/threat-dragon/releases/tag/v1',
        id: 1,
        isDraft: false,
        isPrerelease: false,
        tagName: 'v1',
      },
    ])

    await expect(client.listMergedPullRequests(repository, {
      start: '2026-01-01',
      end: '2026-03-31',
    })).resolves.toEqual([
      {
        mergedAt: '2026-01-10T12:00:00Z',
        number: 12,
        title: 'Add feature',
        url: 'https://github.com/OWASP/threat-dragon/pull/12',
      },
    ])
  })

  it('rejects malformed REST and GraphQL payloads', async () => {
    const client = new GitHubApiClient({
      token: 'secret-token',
      transport: new StubTransport([
        createJsonResponse('not-an-object'),
      ]),
    })

    await expect(client.getRepositoryMetadata(repository)).rejects.toThrow(
      'GitHub repository response must be an object.',
    )

    await expect(
      new GitHubApiClient({
        token: 'secret-token',
        transport: new StubTransport([
          createJsonResponse('not-an-array'),
        ]),
      }).listReleases(repository),
    ).rejects.toThrow('GitHub releases response must be an array.')

    await expect(
      new GitHubApiClient({
        token: 'secret-token',
        transport: new StubTransport([
          createJsonResponse({
            data: {
              search: {
                pageInfo: {},
              },
            },
          }),
        ]),
      }).listClosedIssues(repository, {
        start: '2026-01-01',
        end: '2026-03-31',
      }),
    ).rejects.toThrow('GitHub GraphQL search response must contain nodes and pageInfo.')

    await expect(
      new GitHubApiClient({
        token: 'secret-token',
        transport: new StubTransport([
          createJsonResponse({
            data: {
              search: {
                nodes: [null],
                pageInfo: {
                  endCursor: null,
                  hasNextPage: false,
                },
              },
            },
          }),
        ]),
      }).listMergedPullRequests(repository, {
        start: '2026-01-01',
        end: '2026-03-31',
      }),
    ).rejects.toThrow('GitHub pull request search node[0] must be an object.')

    await expect(
      new GitHubApiClient({
        token: 'secret-token',
        transport: new StubTransport([
          createJsonResponse({
            data: {
              search: {
                nodes: [null],
                pageInfo: {
                  endCursor: null,
                  hasNextPage: false,
                },
              },
            },
          }),
        ]),
      }).listClosedIssues(repository, {
        start: '2026-01-01',
        end: '2026-03-31',
      }),
    ).rejects.toThrow('GitHub issue search node[0] must be an object.')
  })

  it('raises a typed API error for failed HTTP responses', async () => {
    const transport = new StubTransport([
      createJsonResponse({ message: 'Bad credentials' }, 401, 'Unauthorized'),
    ])
    const client = new GitHubApiClient({ token: 'bad-token', transport })

    const result = client.getRepositoryMetadata(repository)

    await expect(result).rejects.toBeInstanceOf(GitHubApiError)
    await expect(result).rejects.toThrow(
      'GitHub request failed with 401 Unauthorized for "https://api.github.com/repos/OWASP/threat-dragon".',
    )
  })
})
