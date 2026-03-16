import type { GitHubRepositoryRef } from '../config/Config.types'

export interface GitHubDateRange {
  start: string
  end: string
}

export interface GitHubRepositoryMetadata {
  owner: string
  repo: string
  fullName: string
  htmlUrl: string
  defaultBranch: string
  stars: number
  openIssues: number
}

export interface GitHubReleaseSummary {
  id: number
  tagName: string
  name?: string
  publishedAt?: string
  htmlUrl: string
  body?: string
  isDraft: boolean
  isPrerelease: boolean
}

export interface GitHubPullRequestSummary {
  number: number
  title: string
  mergedAt: string
  url: string
  authorLogin?: string
}

export interface GitHubIssueSummary {
  number: number
  title: string
  closedAt: string
  url: string
}

export interface GitHubClient {
  getRepositoryMetadata(repository: GitHubRepositoryRef): Promise<GitHubRepositoryMetadata>
  listReleases(repository: GitHubRepositoryRef): Promise<GitHubReleaseSummary[]>
  listMergedPullRequests(
    repository: GitHubRepositoryRef,
    dateRange: GitHubDateRange,
  ): Promise<GitHubPullRequestSummary[]>
  listMergedPullRequestAuthorsBefore(
    repository: GitHubRepositoryRef,
    before: string,
  ): Promise<string[]>
  listClosedIssues(
    repository: GitHubRepositoryRef,
    dateRange: GitHubDateRange,
  ): Promise<GitHubIssueSummary[]>
}

export interface GitHubRequest {
  url: string
  method: 'GET' | 'POST'
  headers: Record<string, string>
  body?: string
}

export interface GitHubResponse {
  ok: boolean
  status: number
  statusText: string
  json(): Promise<unknown>
}

export interface GitHubTransport {
  send(request: GitHubRequest): Promise<GitHubResponse>
}
