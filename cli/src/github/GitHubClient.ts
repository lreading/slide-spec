import type {
  GitHubClient,
  GitHubDateRange,
  GitHubIssueSummary,
  GitHubPullRequestSummary,
  GitHubReleaseSummary,
  GitHubRepositoryMetadata,
  GitHubRequest,
  GitHubResponse,
  GitHubStargazerSnapshotOptions,
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

function getGraphNodeName(value: unknown): string | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  return optionalString(value.name)
}

function getGraphNodeAvatarUrl(value: unknown): string | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  return optionalString(value.avatarUrl)
}

function toSearchQuery(repository: GitHubRepositoryRef, qualifiers: string[]): string {
  return [`repo:${repository.owner}/${repository.repo}`, ...qualifiers].join(' ')
}

export class FetchGitHubTransport implements GitHubTransport {
  public async send(request: GitHubRequest): Promise<GitHubResponse> {
    const response = await fetch(request.url, {
      ...(request.body ? { body: request.body } : {}),
      headers: request.headers,
      method: request.method,
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
  token?: string
  transport?: GitHubTransport
  restBaseUrl?: string
  graphQlUrl?: string
}

const maxRestStargazerPages = 400

export class GitHubApiClient implements GitHubClient {
  private readonly token: string
  private readonly transport: GitHubTransport
  private readonly restBaseUrl: string
  private readonly graphQlUrl: string

  public constructor(options: GitHubApiClientOptions) {
    this.token = options.token ?? ''
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
      createdAt: assertString(payload.created_at, 'created_at'),
      stars: assertNumber(payload.stargazers_count, 'stargazers_count'),
      openIssues: assertNumber(payload.open_issues_count, 'open_issues_count'),
    }
  }

  public async getStargazerCountAt(
    repository: GitHubRepositoryRef,
    at: string,
    options: GitHubStargazerSnapshotOptions = {},
  ): Promise<number> {
    if (typeof options.currentTotal === 'number') {
      try {
        return await this.getRestPagedStargazerCount(repository, at, options.currentTotal)
      } catch {
        const direction = this.resolveStargazerDirection(at, options.repositoryCreatedAt)

        if (direction === 'DESC') {
          return this.getDescendingStargazerCount(repository, at, options.currentTotal)
        }
      }
    }

    return this.getAscendingStargazerCount(repository, at)
  }

  public async getStargazerCountsAt(
    repository: GitHubRepositoryRef,
    atValues: string[],
    options: GitHubStargazerSnapshotOptions = {},
  ): Promise<number[]> {
    if (atValues.length === 0) {
      return []
    }

    if (atValues.length === 1) {
      return [
        await this.getStargazerCountAt(repository, atValues[0] as string, options),
      ]
    }

    if (typeof options.currentTotal !== 'number') {
      return Promise.all(
        atValues.map((at) => this.getStargazerCountAt(repository, at, options)),
      )
    }

    const countsByCutoff = await this.getDescendingStargazerCounts(
      repository,
      [...new Set(atValues)].sort((left, right) => right.localeCompare(left)),
      options.currentTotal,
    )

    return atValues.map((at) => countsByCutoff.get(at) ?? 0)
  }

  public async hasMergedPullRequestByAuthorBefore(
    repository: GitHubRepositoryRef,
    authorLogin: string,
    before: string,
  ): Promise<boolean> {
    const query = toSearchQuery(repository, [
      'is:pr',
      'is:merged',
      `author:${authorLogin}`,
      `merged:<${before}`,
    ])

    const pullRequests = await this.searchPullRequests(query, 1)
    return pullRequests.length > 0
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

  private async getAscendingStargazerCount(repository: GitHubRepositoryRef, at: string): Promise<number> {
    let afterCursor: string | null = null
    let count = 0

    while (true) {
      const payload = await this.requestGraphQl(stargazerHistoryQuery, {
        after: afterCursor,
        direction: 'ASC',
        name: repository.repo,
        owner: repository.owner,
      })
      const stargazerPage = this.getStargazerPayload(payload)

      for (const edge of stargazerPage.edges) {
        const starredAt = assertString(edge.starredAt, 'stargazer.starredAt')

        if (starredAt > at) {
          return count
        }

        count += 1
      }

      if (!stargazerPage.pageInfo.hasNextPage) {
        break
      }

      afterCursor = stargazerPage.pageInfo.endCursor
    }

    return count
  }

  private async getDescendingStargazerCount(
    repository: GitHubRepositoryRef,
    at: string,
    currentTotal: number,
  ): Promise<number> {
    let afterCursor: string | null = null
    let starsAfterCutoff = 0

    while (true) {
      const payload = await this.requestGraphQl(stargazerHistoryQuery, {
        after: afterCursor,
        direction: 'DESC',
        name: repository.repo,
        owner: repository.owner,
      })
      const stargazerPage = this.getStargazerPayload(payload)

      for (const edge of stargazerPage.edges) {
        const starredAt = assertString(edge.starredAt, 'stargazer.starredAt')

        if (starredAt <= at) {
          return Math.max(currentTotal - starsAfterCutoff, 0)
        }

        starsAfterCutoff += 1
      }

      if (!stargazerPage.pageInfo.hasNextPage) {
        break
      }

      afterCursor = stargazerPage.pageInfo.endCursor
    }

    return Math.max(currentTotal - starsAfterCutoff, 0)
  }

  private async getRestPagedStargazerCount(
    repository: GitHubRepositoryRef,
    at: string,
    currentTotal: number,
  ): Promise<number> {
    const pageSize = 100
    const totalPages = Math.ceil(currentTotal / pageSize)

    if (currentTotal === 0 || totalPages === 0) {
      return 0
    }

    if (totalPages > maxRestStargazerPages) {
      throw new Error('GitHub stargazer REST pagination limit exceeded.')
    }

    let low = 1
    let high = totalPages
    let exactCount = 0

    while (low <= high) {
      const page = Math.floor((low + high) / 2)
      const stargazers = await this.fetchRestStargazerPage(repository, page, pageSize)

      if (stargazers.length === 0) {
        high = page - 1
        continue
      }

      const firstStarredAt = assertString(stargazers[0]?.starredAt, `stargazers[page=${page}][0].starredAt`)
      const lastStarredAt = assertString(
        stargazers[stargazers.length - 1]?.starredAt,
        `stargazers[page=${page}][last].starredAt`,
      )

      if (at < firstStarredAt) {
        high = page - 1
        continue
      }

      if (at >= lastStarredAt) {
        exactCount = page === totalPages ? currentTotal : page * pageSize
        low = page + 1
        continue
      }

      return ((page - 1) * pageSize)
        + stargazers.filter((stargazer) => assertString(stargazer.starredAt, 'stargazer.starredAt') <= at).length
    }

    return exactCount
  }

  private async getDescendingStargazerCounts(
    repository: GitHubRepositoryRef,
    sortedCutoffs: string[],
    currentTotal: number,
  ): Promise<Map<string, number>> {
    const results = new Map<string, number>()
    let afterCursor: string | null = null
    let starsAfterCutoff = 0
    let cutoffIndex = 0

    while (cutoffIndex < sortedCutoffs.length) {
      const payload = await this.requestGraphQl(stargazerHistoryQuery, {
        after: afterCursor,
        direction: 'DESC',
        name: repository.repo,
        owner: repository.owner,
      })
      const stargazerPage = this.getStargazerPayload(payload)

      for (const edge of stargazerPage.edges) {
        const starredAt = assertString(edge.starredAt, 'stargazer.starredAt')

        while (
          cutoffIndex < sortedCutoffs.length
          && starredAt <= (sortedCutoffs[cutoffIndex] as string)
        ) {
          results.set(
            sortedCutoffs[cutoffIndex] as string,
            Math.max(currentTotal - starsAfterCutoff, 0),
          )
          cutoffIndex += 1
        }

        starsAfterCutoff += 1
      }

      if (!stargazerPage.pageInfo.hasNextPage) {
        break
      }

      afterCursor = stargazerPage.pageInfo.endCursor
    }

    while (cutoffIndex < sortedCutoffs.length) {
      results.set(
        sortedCutoffs[cutoffIndex] as string,
        Math.max(currentTotal - starsAfterCutoff, 0),
      )
      cutoffIndex += 1
    }

    return results
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

  private async searchPullRequests(query: string, limit = Number.POSITIVE_INFINITY): Promise<GitHubPullRequestSummary[]> {
    const pullRequests: GitHubPullRequestSummary[] = []
    let afterCursor: string | null = null

    while (pullRequests.length < limit) {
      const payload = await this.requestGraphQl(searchPullRequestsQuery, {
        after: afterCursor,
        first: Math.min(100, limit - pullRequests.length),
        query,
      })

      const search = this.getSearchPayload(payload)
      search.nodes.forEach((node, index) => {
        if (pullRequests.length < limit) {
          pullRequests.push(this.mapPullRequestNode(node, index))
        }
      })

      if (!search.pageInfo.hasNextPage || pullRequests.length >= limit) {
        break
      }

      afterCursor = search.pageInfo.endCursor
    }

    return pullRequests
  }

  private async requestJson(
    url: string,
    method: 'GET' | 'POST',
    body?: string,
    accept = 'application/vnd.github+json',
  ): Promise<unknown> {
    const response = await this.transport.send({
      ...(body ? { body } : {}),
      headers: this.createHeaders(method === 'POST', accept),
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

  private async fetchRestStargazerPage(
    repository: GitHubRepositoryRef,
    page: number,
    pageSize: number,
  ): Promise<Array<{ starredAt: unknown }>> {
    const payload = await this.requestJson(
      `${this.restBaseUrl}/repos/${repository.owner}/${repository.repo}/stargazers?per_page=${pageSize}&page=${page}`,
      'GET',
      undefined,
      'application/vnd.github.star+json',
    )

    if (!Array.isArray(payload)) {
      throw new Error('GitHub stargazers response must be an array.')
    }

    return payload.map((entry, index) => {
      if (!isRecord(entry)) {
        throw new Error(`GitHub stargazers[${index}] must be an object.`)
      }

      return {
        starredAt: entry.starred_at,
      }
    })
  }

  private createHeaders(includeJsonBody: boolean, accept = 'application/vnd.github+json'): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: accept,
      'User-Agent': 'oss-slides-cli',
      'X-GitHub-Api-Version': '2022-11-28',
    }

    if (this.token.trim().length > 0) {
      headers.Authorization = `Bearer ${this.token}`
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

  private getStargazerPayload(payload: unknown): {
    edges: Array<{ starredAt: unknown }>
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
    }
  } {
    if (
      !isRecord(payload)
      || !isRecord(payload.data)
      || !isRecord(payload.data.repository)
      || !isRecord(payload.data.repository.stargazers)
    ) {
      throw new Error('GitHub GraphQL stargazer response must contain data.repository.stargazers.')
    }

    const stargazers = payload.data.repository.stargazers
    if (!Array.isArray(stargazers.edges) || !isRecord(stargazers.pageInfo)) {
      throw new Error('GitHub GraphQL stargazer response must contain edges and pageInfo.')
    }

    return {
      edges: stargazers.edges.map((edge, index) => {
        if (!isRecord(edge)) {
          throw new Error(`GitHub stargazer edge[${index}] must be an object.`)
        }

        return {
          starredAt: edge.starredAt,
        }
      }),
      pageInfo: {
        hasNextPage: Boolean(stargazers.pageInfo.hasNextPage),
        endCursor: typeof stargazers.pageInfo.endCursor === 'string'
          ? stargazers.pageInfo.endCursor
          : null,
      },
    }
  }

  private mapPullRequestNode(node: unknown, index: number): GitHubPullRequestSummary {
    if (!isRecord(node)) {
      throw new Error(`GitHub pull request search node[${index}] must be an object.`)
    }

    const authorLogin = getGraphNodeLogin(node.author)
    const authorName = getGraphNodeName(node.author)
    const authorAvatarUrl = getGraphNodeAvatarUrl(node.author)

    return {
      number: assertNumber(node.number, `pullRequest[${index}].number`),
      title: assertString(node.title, `pullRequest[${index}].title`),
      mergedAt: assertString(node.mergedAt, `pullRequest[${index}].mergedAt`),
      url: assertString(node.url, `pullRequest[${index}].url`),
      ...(authorLogin ? { authorLogin } : {}),
      ...(authorName ? { authorName } : {}),
      ...(authorAvatarUrl ? { authorAvatarUrl } : {}),
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

  private resolveStargazerDirection(
    at: string,
    repositoryCreatedAt: string | undefined,
  ): 'ASC' | 'DESC' {
    if (!repositoryCreatedAt) {
      return 'ASC'
    }

    const cutoffTimestamp = Date.parse(at)
    const createdTimestamp = Date.parse(repositoryCreatedAt)
    const nowTimestamp = Date.now()

    if (
      !Number.isFinite(cutoffTimestamp)
      || !Number.isFinite(createdTimestamp)
      || cutoffTimestamp <= createdTimestamp
      || cutoffTimestamp >= nowTimestamp
    ) {
      return 'ASC'
    }

    const historyBeforeCutoff = cutoffTimestamp - createdTimestamp
    const historyAfterCutoff = nowTimestamp - cutoffTimestamp

    return historyAfterCutoff < historyBeforeCutoff ? 'DESC' : 'ASC'
  }
}

const searchPullRequestsQuery = `
  query SearchMergedPullRequests($query: String!, $after: String, $first: Int!) {
    search(query: $query, type: ISSUE, first: $first, after: $after) {
      nodes {
        ... on PullRequest {
          number
          title
          mergedAt
          url
          author {
            login
            ... on User {
              name
              avatarUrl
            }
            ... on Bot {
              avatarUrl
            }
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

const stargazerHistoryQuery = `
query StargazerHistory($owner: String!, $name: String!, $after: String, $direction: OrderDirection!) {
  repository(owner: $owner, name: $name) {
    stargazers(first: 100, after: $after, orderBy: { field: STARRED_AT, direction: $direction }) {
      edges {
        starredAt
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
`
