import type { GitHubPullRequestSummary } from '../github/GitHubClient.types'
import type { ContributorEntry } from './Generation.types'

interface ContributorAnalysisResult {
  total: number
  authors: ContributorEntry[]
  newContributorCount: number
}

interface ContributorAccumulator {
  login: string
  name: string
  avatarUrl: string
  mergedPullRequests: number
  firstTime: boolean
}

export class ContributorAnalyzer {
  public analyze(
    pullRequests: GitHubPullRequestSummary[],
    historicalAuthorLogins: string[],
  ): ContributorAnalysisResult {
    const historicalAuthors = new Set(historicalAuthorLogins)
    const authors = new Map<string, ContributorAccumulator>()

    pullRequests.forEach((pullRequest) => {
      if (!pullRequest.authorLogin) {
        return
      }

      const current = authors.get(pullRequest.authorLogin)
      if (current) {
        current.mergedPullRequests += 1
        return
      }

      authors.set(pullRequest.authorLogin, {
        login: pullRequest.authorLogin,
        name: pullRequest.authorName ?? pullRequest.authorLogin,
        avatarUrl: pullRequest.authorAvatarUrl ?? `https://github.com/${pullRequest.authorLogin}.png`,
        mergedPullRequests: 1,
        firstTime: !historicalAuthors.has(pullRequest.authorLogin),
      })
    })

    const sortedAuthors = [...authors.values()]
      .sort((left, right) =>
        right.mergedPullRequests - left.mergedPullRequests || left.login.localeCompare(right.login))
      .map((author): ContributorEntry => ({
        login: author.login,
        name: author.name,
        avatar_url: author.avatarUrl,
        merged_prs: author.mergedPullRequests,
        first_time: author.firstTime,
      }))

    return {
      total: sortedAuthors.length,
      authors: sortedAuthors,
      newContributorCount: sortedAuthors.filter((author) => author.first_time).length,
    }
  }
}
