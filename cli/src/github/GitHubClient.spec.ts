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
  owner: 'example-org',
  repo: 'aurora-notes',
  type: 'github',
  url: 'https://github.com/example-org/aurora-notes',
}

describe('GitHubApiClient', () => {
  it('loads repository metadata via REST with auth headers', async () => {
    const transport = new StubTransport([
      createJsonResponse({
        created_at: '2023-01-01T00:00:00Z',
        default_branch: 'main',
        full_name: 'example-org/aurora-notes',
        html_url: 'https://github.com/example-org/aurora-notes',
        open_issues_count: 12,
        stargazers_count: 321,
      }),
    ])

    const client = new GitHubApiClient({
      token: 'secret-token',
      transport,
    })

    await expect(client.getRepositoryMetadata(repository)).resolves.toEqual({
      owner: 'example-org',
      repo: 'aurora-notes',
      fullName: 'example-org/aurora-notes',
      htmlUrl: 'https://github.com/example-org/aurora-notes',
      defaultBranch: 'main',
      createdAt: '2023-01-01T00:00:00Z',
      stars: 321,
      openIssues: 12,
    })

    expect(transport.requests[0]).toMatchObject({
      method: 'GET',
      url: 'https://api.github.com/repos/example-org/aurora-notes',
    })
    expect(transport.requests[0]?.headers.Authorization).toBe('Bearer secret-token')
  })

  it('omits auth headers when no token is provided', async () => {
    const transport = new StubTransport([
      createJsonResponse({
        created_at: '2023-01-01T00:00:00Z',
        default_branch: 'main',
        full_name: 'example-org/aurora-notes',
        html_url: 'https://github.com/example-org/aurora-notes',
        open_issues_count: 12,
        stargazers_count: 321,
      }),
    ])

    const client = new GitHubApiClient({ transport })

    await expect(client.getRepositoryMetadata(repository)).resolves.toMatchObject({
      owner: 'example-org',
      repo: 'aurora-notes',
    })

    expect(transport.requests[0]?.headers.Authorization).toBeUndefined()
  })

  it('counts stargazers up to a cutoff date via GraphQL history', async () => {
    const transport = new StubTransport([
      createJsonResponse({
        data: {
          repository: {
            stargazers: {
              edges: [
                { starredAt: '2025-12-01T00:00:00Z' },
                { starredAt: '2026-01-15T00:00:00Z' },
                { starredAt: '2026-04-01T00:00:00Z' },
              ],
              pageInfo: {
                hasNextPage: false,
                endCursor: null,
              },
            },
          },
        },
      }),
    ])

    const client = new GitHubApiClient({ token: 'secret-token', transport })

    await expect(
      client.getStargazerCountAt(repository, '2026-03-31T23:59:59Z'),
    ).resolves.toBe(2)
  })

  it('can count stargazers by binary-searching paged REST history when the current total is known', async () => {
    const transport = new StubTransport([
      createJsonResponse(Array.from({ length: 100 }, (_, index) => ({
        starred_at: `2025-01-${String((index % 28) + 1).padStart(2, '0')}T00:00:00Z`,
      }))),
      createJsonResponse([
        { starred_at: '2025-12-30T00:00:00Z' },
        { starred_at: '2026-03-20T00:00:00Z' },
        { starred_at: '2026-04-01T00:00:00Z' },
      ]),
    ])

    const client = new GitHubApiClient({ token: 'secret-token', transport })

    await expect(
      client.getStargazerCountAt(repository, '2025-12-31T23:59:59Z', {
        currentTotal: 103,
        repositoryCreatedAt: '2023-01-01T00:00:00Z',
      }),
    ).resolves.toBe(101)

    expect(transport.requests[0]?.url).toContain('/stargazers?per_page=100&page=1')
    expect(transport.requests[1]?.url).toContain('/stargazers?per_page=100&page=2')
    expect(transport.requests[0]?.headers.Accept).toBe('application/vnd.github.star+json')
  })

  it('returns zero stargazers without making requests when the current total is zero', async () => {
    const transport = new StubTransport([])
    const client = new GitHubApiClient({ token: 'secret-token', transport })

    await expect(
      client.getStargazerCountAt(repository, '2025-12-31T23:59:59Z', {
        currentTotal: 0,
        repositoryCreatedAt: '2023-01-01T00:00:00Z',
      }),
    ).resolves.toBe(0)

    expect(transport.requests).toHaveLength(0)
  })

  it('returns the full current total when the cutoff is after the final REST stargazer page', async () => {
    const transport = new StubTransport([
      createJsonResponse(Array.from({ length: 100 }, (_, index) => ({
        starred_at: `2025-01-${String((index % 28) + 1).padStart(2, '0')}T00:00:00Z`,
      }))),
      createJsonResponse([
        { starred_at: '2025-12-28T00:00:00Z' },
        { starred_at: '2025-12-29T00:00:00Z' },
        { starred_at: '2025-12-30T00:00:00Z' },
      ]),
    ])

    const client = new GitHubApiClient({ token: 'secret-token', transport })

    await expect(
      client.getStargazerCountAt(repository, '2025-12-31T23:59:59Z', {
        currentTotal: 103,
        repositoryCreatedAt: '2023-01-01T00:00:00Z',
      }),
    ).resolves.toBe(103)
  })

  it('returns the best known REST page count when a later binary-search page is empty', async () => {
    const transport = new StubTransport([
      createJsonResponse(Array.from({ length: 100 }, (_, index) => ({
        starred_at: `2025-01-${String((index % 28) + 1).padStart(2, '0')}T00:00:00Z`,
      }))),
      createJsonResponse([]),
    ])

    const client = new GitHubApiClient({ token: 'secret-token', transport })

    await expect(
      client.getStargazerCountAt(repository, '2025-12-31T23:59:59Z', {
        currentTotal: 150,
        repositoryCreatedAt: '2023-01-01T00:00:00Z',
      }),
    ).resolves.toBe(100)
  })

  it('falls back to descending GraphQL stargazer history when REST lookup fails near the present', async () => {
    const transport = new StubTransport([
      createJsonResponse('not-an-array'),
      createJsonResponse({
        data: {
          repository: {
            stargazers: {
              edges: [
                { starredAt: '2026-04-01T00:00:00Z' },
                { starredAt: '2026-03-20T00:00:00Z' },
              ],
              pageInfo: {
                hasNextPage: false,
                endCursor: null,
              },
            },
          },
        },
      }),
    ])

    const client = new GitHubApiClient({ token: 'secret-token', transport })

    await expect(
      client.getStargazerCountAt(repository, '2026-03-01T00:00:00Z', {
        currentTotal: 10,
        repositoryCreatedAt: '2020-01-01T00:00:00Z',
      }),
    ).resolves.toBe(8)
  })

  it('falls back to ascending GraphQL stargazer history when REST lookup fails for earlier cutoffs', async () => {
    const transport = new StubTransport([
      createJsonResponse('not-an-array'),
      createJsonResponse({
        data: {
          repository: {
            stargazers: {
              edges: [
                { starredAt: '2025-12-01T00:00:00Z' },
                { starredAt: '2026-01-15T00:00:00Z' },
                { starredAt: '2026-04-01T00:00:00Z' },
              ],
              pageInfo: {
                hasNextPage: false,
                endCursor: null,
              },
            },
          },
        },
      }),
    ])

    const client = new GitHubApiClient({ token: 'secret-token', transport })

    await expect(
      client.getStargazerCountAt(repository, '2026-03-31T23:59:59Z', {
        currentTotal: 10,
      }),
    ).resolves.toBe(2)
  })

  it('can resolve multiple stargazer cutoffs in one descending GraphQL scan', async () => {
    const transport = new StubTransport([
      createJsonResponse({
        data: {
          repository: {
            stargazers: {
              edges: [
                { starredAt: '2026-03-25T00:00:00Z' },
                { starredAt: '2026-01-15T00:00:00Z' },
                { starredAt: '2025-11-01T00:00:00Z' },
              ],
              pageInfo: {
                hasNextPage: false,
                endCursor: null,
              },
            },
          },
        },
      }),
    ])

    const client = new GitHubApiClient({ token: 'secret-token', transport })

    await expect(
      client.getStargazerCountsAt(
        repository,
        ['2025-12-31T23:59:59Z', '2026-03-01T00:00:00Z'],
        {
          currentTotal: 10,
          repositoryCreatedAt: '2020-01-01T00:00:00Z',
        },
      ),
    ).resolves.toEqual([8, 9])

    expect(transport.requests).toHaveLength(1)
    expect(transport.requests[0]?.url).toBe('https://api.github.com/graphql')
  })

  it('paginates releases from the REST API', async () => {
    const transport = new StubTransport([
      createJsonResponse(Array.from({ length: 100 }, (_, index) => ({
        body: `Body ${index + 1}`,
        draft: false,
        html_url: `https://github.com/example-org/aurora-notes/releases/tag/v${index + 1}`,
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
          html_url: 'https://github.com/example-org/aurora-notes/releases/tag/v101',
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
                url: 'https://github.com/example-org/aurora-notes/pull/12',
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
                url: 'https://github.com/example-org/aurora-notes/pull/13',
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
        url: 'https://github.com/example-org/aurora-notes/pull/12',
      },
      {
        authorLogin: 'hubot',
        mergedAt: '2026-01-11T12:00:00Z',
        number: 13,
        title: 'Fix bug',
        url: 'https://github.com/example-org/aurora-notes/pull/13',
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
                url: 'https://github.com/example-org/aurora-notes/pull/10',
              },
              {
                author: { login: 'octocat' },
                mergedAt: '2025-12-29T12:00:00Z',
                number: 9,
                title: 'More docs',
                url: 'https://github.com/example-org/aurora-notes/pull/9',
              },
              {
                author: { login: 'alice' },
                mergedAt: '2025-12-20T12:00:00Z',
                number: 8,
                title: 'Fix tests',
                url: 'https://github.com/example-org/aurora-notes/pull/8',
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

  it('checks whether a specific author had merged pull requests before a cutoff', async () => {
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
                url: 'https://github.com/example-org/aurora-notes/pull/10',
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
      client.hasMergedPullRequestByAuthorBefore(repository, 'octocat', '2026-01-01'),
    ).resolves.toBe(true)

    const requestBody = JSON.parse(transport.requests[0]?.body ?? '{}') as {
      variables?: {
        first?: number
        query?: string
      }
    }

    expect(requestBody.variables?.first).toBe(1)
    expect(requestBody.variables?.query).toContain('author:octocat')
  })

  it('returns false when an author has no merged pull requests before the cutoff', async () => {
    const transport = new StubTransport([
      createJsonResponse({
        data: {
          search: {
            nodes: [],
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
      client.hasMergedPullRequestByAuthorBefore(repository, 'nobody', '2026-01-01'),
    ).resolves.toBe(false)
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
                url: 'https://github.com/example-org/aurora-notes/issues/88',
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
        url: 'https://github.com/example-org/aurora-notes/issues/88',
      },
    ])
  })

  it('handles sparse optional GitHub fields and missing authors without inventing values', async () => {
    const transport = new StubTransport([
      createJsonResponse([
        {
          draft: false,
          html_url: 'https://github.com/example-org/aurora-notes/releases/tag/v1',
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
                url: 'https://github.com/example-org/aurora-notes/pull/12',
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
        htmlUrl: 'https://github.com/example-org/aurora-notes/releases/tag/v1',
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
        url: 'https://github.com/example-org/aurora-notes/pull/12',
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
              repository: {
                stargazers: {
                  edges: [null],
                  pageInfo: {
                    endCursor: null,
                    hasNextPage: false,
                  },
                },
              },
            },
          }),
        ]),
      }).getStargazerCountAt(repository, '2026-03-31T23:59:59Z'),
    ).rejects.toThrow('GitHub stargazer edge[0] must be an object.')

    await expect(
      new GitHubApiClient({
        token: 'secret-token',
        transport: new StubTransport([
          createJsonResponse([
            null,
          ]),
          createJsonResponse({
            data: {
              repository: {
                stargazers: {
                  edges: [
                    { starredAt: '2026-04-01T00:00:00Z' },
                    { starredAt: '2026-03-20T00:00:00Z' },
                  ],
                  pageInfo: {
                    endCursor: null,
                    hasNextPage: false,
                  },
                },
              },
            },
          }),
        ]),
      }).getStargazerCountAt(repository, '2026-03-01T00:00:00Z', {
        currentTotal: 1,
        repositoryCreatedAt: '2020-01-01T00:00:00Z',
      }),
    ).resolves.toBe(0)

    await expect(
      new GitHubApiClient({
        token: 'secret-token',
        transport: new StubTransport([
          createJsonResponse({
            data: {
              repository: {
                stargazers: {
                  pageInfo: {},
                },
              },
            },
          }),
        ]),
      }).getStargazerCountAt(repository, '2026-03-31T23:59:59Z'),
    ).rejects.toThrow('GitHub GraphQL stargazer response must contain edges and pageInfo.')

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
              repository: {
                stargazers: {
                  pageInfo: {},
                },
              },
            },
          }),
        ]),
      }).getStargazerCountAt(repository, '2026-03-31T23:59:59Z'),
    ).rejects.toThrow('GitHub GraphQL stargazer response must contain edges and pageInfo.')

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
      'GitHub request failed with 401 Unauthorized for "https://api.github.com/repos/example-org/aurora-notes".',
    )
  })
})
