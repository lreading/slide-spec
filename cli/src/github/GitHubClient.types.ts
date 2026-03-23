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
  createdAt: string
  stars: number
  openIssues: number
}

export interface GitHubStargazerSnapshotOptions {
  currentTotal?: number
  repositoryCreatedAt?: string
  timeoutMs?: number
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
  authorName?: string
  authorAvatarUrl?: string
}

export interface GitHubIssueSummary {
  number: number
  title: string
  closedAt: string
  url: string
}

export interface GitHubClient {
  getRepositoryMetadata(repository: GitHubRepositoryRef): Promise<GitHubRepositoryMetadata>
  getStargazerCountAt(
    repository: GitHubRepositoryRef,
    at: string,
    options?: GitHubStargazerSnapshotOptions,
  ): Promise<number>
  getStargazerCountsAt(
    repository: GitHubRepositoryRef,
    atValues: string[],
    options?: GitHubStargazerSnapshotOptions,
  ): Promise<number[]>
  listReleases(repository: GitHubRepositoryRef): Promise<GitHubReleaseSummary[]>
  listMergedPullRequests(
    repository: GitHubRepositoryRef,
    dateRange: GitHubDateRange,
  ): Promise<GitHubPullRequestSummary[]>
  hasMergedPullRequestByAuthorBefore(
    repository: GitHubRepositoryRef,
    authorLogin: string,
    before: string,
  ): Promise<boolean>
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
