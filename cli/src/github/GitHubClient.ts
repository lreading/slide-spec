import type {
  GitHubClient,
  GitHubDateRange,
  GitHubIssueSummary,
  GitHubPullRequestSummary,
  GitHubReleaseSummary,
  GitHubRepositoryMetadata,
  GitHubRequest,
  GitHubResponse,
  GitHubTransport,
} from './GitHubClient.types'
import type { GitHubRepositoryRef } from '../config/Config.types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function assertString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`GitHub response field "${field}" must be a non-blank string.`)
  }

  return value
}

function assertNumber(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`GitHub response field "${field}" must be a number.`)
  }

  return value
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined
  }

  return value
}

function getGraphNodeLogin(value: unknown): string | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  return optionalString(value.login)
}

function toSearchQuery(repository: GitHubRepositoryRef, qualifiers: string[]): string {
  return [`repo:${repository.owner}/${repository.repo}`, ...qualifiers].join(' ')
}

export class FetchGitHubTransport implements GitHubTransport {
  public async send(request: GitHubRequest): Promise<GitHubResponse> {
    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    })

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      json: async (): Promise<unknown> => response.json(),
    }
  }
}

export class GitHubApiError extends Error {
  public constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly url: string,
  ) {
    super(`GitHub request failed with ${status} ${statusText} for "${url}".`)
  }
}

interface GitHubApiClientOptions {
  token: string
  transport?: GitHubTransport
  restBaseUrl?: string
  graphQlUrl?: string
}

export class GitHubApiClient implements GitHubClient {
  private readonly token: string
  private readonly transport: GitHubTransport
  private readonly restBaseUrl: string
  private readonly graphQlUrl: string

  public constructor(options: GitHubApiClientOptions) {
    this.token = options.token
    this.transport = options.transport ?? new FetchGitHubTransport()
    this.restBaseUrl = options.restBaseUrl ?? 'https://api.github.com'
    this.graphQlUrl = options.graphQlUrl ?? 'https://api.github.com/graphql'
  }

  public async getRepositoryMetadata(repository: GitHubRepositoryRef): Promise<GitHubRepositoryMetadata> {
    const payload = await this.requestJson(
      `${this.restBaseUrl}/repos/${repository.owner}/${repository.repo}`,
      'GET',
    )

    if (!isRecord(payload)) {
      throw new Error('GitHub repository response must be an object.')
    }

    return {
      owner: repository.owner,
      repo: repository.repo,
      fullName: assertString(payload.full_name, 'full_name'),
      htmlUrl: assertString(payload.html_url, 'html_url'),
      defaultBranch: assertString(payload.default_branch, 'default_branch'),
      stars: assertNumber(payload.stargazers_count, 'stargazers_count'),
      openIssues: assertNumber(payload.open_issues_count, 'open_issues_count'),
    }
  }

  public async listReleases(repository: GitHubRepositoryRef): Promise<GitHubReleaseSummary[]> {
    const releases: GitHubReleaseSummary[] = []
    let page = 1
    const perPage = 100

    while (true) {
      const payload = await this.requestJson(
        `${this.restBaseUrl}/repos/${repository.owner}/${repository.repo}/releases?per_page=${perPage}&page=${page}`,
        'GET',
      )

      if (!Array.isArray(payload)) {
        throw new Error('GitHub releases response must be an array.')
      }

      const pageItems = payload.map((entry, index) => this.mapRelease(entry, index))
      releases.push(...pageItems)

      if (pageItems.length < perPage) {
        break
      }

      page += 1
    }

    return releases
  }

  public async listMergedPullRequests(
    repository: GitHubRepositoryRef,
    dateRange: GitHubDateRange,
  ): Promise<GitHubPullRequestSummary[]> {
    const query = toSearchQuery(repository, [
      'is:pr',
      'is:merged',
      `merged:${dateRange.start}..${dateRange.end}`,
    ])

    return this.searchPullRequests(query)
  }

  public async listMergedPullRequestAuthorsBefore(
    repository: GitHubRepositoryRef,
    before: string,
  ): Promise<string[]> {
    const query = toSearchQuery(repository, [
      'is:pr',
      'is:merged',
      `merged:<${before}`,
    ])

    const pullRequests = await this.searchPullRequests(query)
    const authors = new Set<string>()

    pullRequests.forEach((pullRequest) => {
      if (pullRequest.authorLogin) {
        authors.add(pullRequest.authorLogin)
      }
    })

    return [...authors].sort((left, right) => left.localeCompare(right))
  }

  public async listClosedIssues(
    repository: GitHubRepositoryRef,
    dateRange: GitHubDateRange,
  ): Promise<GitHubIssueSummary[]> {
    const query = toSearchQuery(repository, [
      'is:issue',
      'is:closed',
      `closed:${dateRange.start}..${dateRange.end}`,
    ])

    const issues: GitHubIssueSummary[] = []
    let afterCursor: string | null = null

    while (true) {
      const payload = await this.requestGraphQl(searchIssuesQuery, {
        after: afterCursor,
        query,
      })

      const search = this.getSearchPayload(payload)
      search.nodes.forEach((node, index) => {
        issues.push(this.mapIssueNode(node, index))
      })

      if (!search.pageInfo.hasNextPage) {
        break
      }

      afterCursor = search.pageInfo.endCursor
    }

    return issues
  }

  private async searchPullRequests(query: string): Promise<GitHubPullRequestSummary[]> {
    const pullRequests: GitHubPullRequestSummary[] = []
    let afterCursor: string | null = null

    while (true) {
      const payload = await this.requestGraphQl(searchPullRequestsQuery, {
        after: afterCursor,
        query,
      })

      const search = this.getSearchPayload(payload)
      search.nodes.forEach((node, index) => {
        pullRequests.push(this.mapPullRequestNode(node, index))
      })

      if (!search.pageInfo.hasNextPage) {
        break
      }

      afterCursor = search.pageInfo.endCursor
    }

    return pullRequests
  }

  private async requestJson(url: string, method: 'GET' | 'POST', body?: string): Promise<unknown> {
    const response = await this.transport.send({
      body,
      headers: this.createHeaders(method === 'POST'),
      method,
      url,
    })

    if (!response.ok) {
      throw new GitHubApiError(response.status, response.statusText, url)
    }

    return response.json()
  }

  private async requestGraphQl(query: string, variables: Record<string, unknown>): Promise<unknown> {
    return this.requestJson(this.graphQlUrl, 'POST', JSON.stringify({
      query,
      variables,
    }))
  }

  private createHeaders(includeJsonBody: boolean): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${this.token}`,
      'User-Agent': 'td-updates-cli',
      'X-GitHub-Api-Version': '2022-11-28',
    }

    if (includeJsonBody) {
      headers['Content-Type'] = 'application/json'
    }

    return headers
  }

  private mapRelease(entry: unknown, index: number): GitHubReleaseSummary {
    if (!isRecord(entry)) {
      throw new Error(`GitHub releases[${index}] must be an object.`)
    }

    const name = optionalString(entry.name)
    const publishedAt = optionalString(entry.published_at)
    const body = optionalString(entry.body)

    return {
      id: assertNumber(entry.id, `releases[${index}].id`),
      tagName: assertString(entry.tag_name, `releases[${index}].tag_name`),
      ...(name ? { name } : {}),
      ...(publishedAt ? { publishedAt } : {}),
      htmlUrl: assertString(entry.html_url, `releases[${index}].html_url`),
      ...(body ? { body } : {}),
      isDraft: Boolean(entry.draft),
      isPrerelease: Boolean(entry.prerelease),
    }
  }

  private getSearchPayload(payload: unknown): {
    nodes: unknown[]
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
    }
  } {
    if (!isRecord(payload) || !isRecord(payload.data) || !isRecord(payload.data.search)) {
      throw new Error('GitHub GraphQL search response must contain data.search.')
    }

    const search = payload.data.search
    if (!Array.isArray(search.nodes) || !isRecord(search.pageInfo)) {
      throw new Error('GitHub GraphQL search response must contain nodes and pageInfo.')
    }

    return {
      nodes: search.nodes,
      pageInfo: {
        hasNextPage: Boolean(search.pageInfo.hasNextPage),
        endCursor: typeof search.pageInfo.endCursor === 'string'
          ? search.pageInfo.endCursor
          : null,
      },
    }
  }

  private mapPullRequestNode(node: unknown, index: number): GitHubPullRequestSummary {
    if (!isRecord(node)) {
      throw new Error(`GitHub pull request search node[${index}] must be an object.`)
    }

    const authorLogin = getGraphNodeLogin(node.author)

    return {
      number: assertNumber(node.number, `pullRequest[${index}].number`),
      title: assertString(node.title, `pullRequest[${index}].title`),
      mergedAt: assertString(node.mergedAt, `pullRequest[${index}].mergedAt`),
      url: assertString(node.url, `pullRequest[${index}].url`),
      ...(authorLogin ? { authorLogin } : {}),
    }
  }

  private mapIssueNode(node: unknown, index: number): GitHubIssueSummary {
    if (!isRecord(node)) {
      throw new Error(`GitHub issue search node[${index}] must be an object.`)
    }

    return {
      number: assertNumber(node.number, `issue[${index}].number`),
      title: assertString(node.title, `issue[${index}].title`),
      closedAt: assertString(node.closedAt, `issue[${index}].closedAt`),
      url: assertString(node.url, `issue[${index}].url`),
    }
  }
}

const searchPullRequestsQuery = `
  query SearchMergedPullRequests($query: String!, $after: String) {
    search(query: $query, type: ISSUE, first: 100, after: $after) {
      nodes {
        ... on PullRequest {
          number
          title
          mergedAt
          url
          author {
            login
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

const searchIssuesQuery = `
  query SearchClosedIssues($query: String!, $after: String) {
    search(query: $query, type: ISSUE, first: 100, after: $after) {
      nodes {
        ... on Issue {
          number
          title
          closedAt
          url
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`
