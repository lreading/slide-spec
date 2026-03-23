import { AsyncBatchExecutor } from './AsyncBatchExecutor'
import { ContributorAnalyzer } from './ContributorAnalyzer'
import { DeltaCalculator } from './DeltaCalculator'
import { FetchTimingCollector } from './FetchTimingCollector'

import type { GeneratedDataBuildResult, ReleaseEntry, ReportingPeriod } from './Generation.types'
import type { MetricMetadata } from './Generation.types'
import type { GitHubClient, GitHubReleaseSummary, GitHubRepositoryMetadata } from '../github/GitHubClient.types'
import type { GitHubRepositoryRef } from '../config/Config.types'

interface BuildGeneratedDataInput {
  client: GitHubClient
  presentationId: string
  currentPeriod: ReportingPeriod
  previousPeriod?: ReportingPeriod
  repository: GitHubRepositoryRef
}

const metricLabels = {
  issues_closed: 'Issues closed',
  new_contributors: 'New contributors',
  prs_merged: 'PRs Merged',
  stars: 'GitHub Stars',
} as const

interface StarSnapshotResult {
  current: number
  previous: number
  metadata: MetricMetadata
  warnings: string[]
}

const largeRepositoryStarThreshold = 40000
const largeRepositoryCombinedSnapshotTimeoutMs = 90000
const largeRepositoryCurrentSnapshotTimeoutMs = 30000

export class GeneratedDataBuilder {
  public constructor(
    private readonly deltaCalculator: DeltaCalculator = new DeltaCalculator(),
    private readonly contributorAnalyzer: ContributorAnalyzer = new ContributorAnalyzer(),
    private readonly asyncBatchExecutor: AsyncBatchExecutor = new AsyncBatchExecutor(),
  ) {}

  public async build(input: BuildGeneratedDataInput): Promise<GeneratedDataBuildResult> {
    const timingCollector = new FetchTimingCollector()
    const repositoryMetadataPromise = timingCollector.measure('repository_metadata', () =>
      input.client.getRepositoryMetadata(input.repository))
    const releasesPromise = timingCollector.measure('releases', () =>
      input.client.listReleases(input.repository))
    const currentPullRequestsPromise = timingCollector.measure('current_merged_pull_requests', () =>
      input.client.listMergedPullRequests(input.repository, input.currentPeriod))
    const currentClosedIssuesPromise = timingCollector.measure('current_closed_issues', () =>
      input.client.listClosedIssues(input.repository, input.currentPeriod))
    const previousPullRequestsPromise = input.previousPeriod
      ? timingCollector.measure('previous_merged_pull_requests', () =>
        input.client.listMergedPullRequests(input.repository, input.previousPeriod as ReportingPeriod))
      : Promise.resolve([])
    const previousClosedIssuesPromise = input.previousPeriod
      ? timingCollector.measure('previous_closed_issues', () =>
        input.client.listClosedIssues(input.repository, input.previousPeriod as ReportingPeriod))
      : Promise.resolve([])

    const repositoryMetadata = await repositoryMetadataPromise
    const currentPullRequests = await currentPullRequestsPromise
    const previousPullRequests = await previousPullRequestsPromise
    const currentHistoricalAuthorsPromise = timingCollector.measure('current_contributor_history', () =>
      this.resolveHistoricalAuthors(
        input.client,
        input.repository,
        currentPullRequests,
        input.currentPeriod.start,
      ))
    const previousHistoricalAuthorsPromise = input.previousPeriod
      ? timingCollector.measure('previous_contributor_history', () =>
        this.resolveHistoricalAuthors(
          input.client,
          input.repository,
          previousPullRequests,
          input.previousPeriod?.start as string,
        ))
      : Promise.resolve([])
    const starSnapshotPromise = timingCollector.measure('star_snapshot', () =>
      this.resolveStarSnapshot(input, repositoryMetadata))

    const [
      releases,
      closedIssues,
      previousClosedIssues,
      historicalAuthors,
      previousHistoricalAuthors,
      starSnapshot,
    ] = await Promise.all([
      releasesPromise,
      currentClosedIssuesPromise,
      previousClosedIssuesPromise,
      currentHistoricalAuthorsPromise,
      previousHistoricalAuthorsPromise,
      starSnapshotPromise,
    ])

    const contributorAnalysis = this.contributorAnalyzer.analyze(currentPullRequests, historicalAuthors)
    const previousContributorAnalysis = input.previousPeriod
      ? this.contributorAnalyzer.analyze(previousPullRequests, previousHistoricalAuthors)
      : undefined

    return {
      generated: {
        id: input.presentationId,
        period: {
          start: input.currentPeriod.start,
          end: input.currentPeriod.end,
        },
        stats: {
          stars: this.deltaCalculator.createMetric(
            metricLabels.stars,
            starSnapshot.current,
            starSnapshot.previous,
            starSnapshot.metadata,
          ),
          issues_closed: this.deltaCalculator.createMetric(
            metricLabels.issues_closed,
            closedIssues.length,
            previousClosedIssues.length,
            this.createComparisonMetadata(input.previousPeriod),
          ),
          prs_merged: this.deltaCalculator.createMetric(
            metricLabels.prs_merged,
            currentPullRequests.length,
            previousPullRequests.length,
            this.createComparisonMetadata(input.previousPeriod),
          ),
          new_contributors: this.deltaCalculator.createMetric(
            metricLabels.new_contributors,
            contributorAnalysis.newContributorCount,
            previousContributorAnalysis?.newContributorCount ?? 0,
            this.createComparisonMetadata(input.previousPeriod),
          ),
        },
        releases: this.selectReleases(releases, repositoryMetadata, input.currentPeriod),
        contributors: {
          total: contributorAnalysis.total,
          authors: contributorAnalysis.authors,
        },
        merged_prs: currentPullRequests
          .filter((pullRequest) => pullRequest.authorLogin)
          .sort((left, right) => left.mergedAt.localeCompare(right.mergedAt))
          .map((pullRequest) => ({
            number: pullRequest.number,
            title: pullRequest.title,
            merged_at: pullRequest.mergedAt,
            author_login: pullRequest.authorLogin as string,
          })),
      },
      warnings: starSnapshot.warnings,
      timings: timingCollector.getTimings(),
    }
  }

  private async resolveStarSnapshot(
    input: BuildGeneratedDataInput,
    repositoryMetadata: GitHubRepositoryMetadata,
  ): Promise<StarSnapshotResult> {
    const warnings: string[] = []
    const warningCodes: string[] = []
    const currentCutoff = this.toPeriodCutoff(input.currentPeriod.end)

    if (input.previousPeriod && repositoryMetadata.stars > largeRepositoryStarThreshold) {
      try {
        const previousCutoff = this.toPeriodCutoff(input.previousPeriod.end)
        const [current, previous] = await input.client.getStargazerCountsAt(
          input.repository,
          [currentCutoff, previousCutoff],
          {
            currentTotal: repositoryMetadata.stars,
            repositoryCreatedAt: repositoryMetadata.createdAt,
            timeoutMs: largeRepositoryCombinedSnapshotTimeoutMs,
          },
        )

        return {
          current: current ?? repositoryMetadata.stars,
          previous: previous ?? 0,
          metadata: {
            comparison_status: 'complete',
            warning_codes: [],
          },
          warnings,
        }
      } catch {
        warningCodes.push('combined_snapshot_fallback')
        warnings.push(
          'Combined historical star snapshots exceeded the large-repository time budget; retrying current-period snapshot only.',
        )
      }
    }

    let resolvedCurrent = repositoryMetadata.stars

    try {
      resolvedCurrent = await input.client.getStargazerCountAt(input.repository, currentCutoff, {
        currentTotal: repositoryMetadata.stars,
        repositoryCreatedAt: repositoryMetadata.createdAt,
        ...(input.previousPeriod && repositoryMetadata.stars > largeRepositoryStarThreshold
          ? { timeoutMs: largeRepositoryCurrentSnapshotTimeoutMs }
          : {}),
      })
    } catch {
      warningCodes.push('current_snapshot_fallback')
      warnings.push('Historical star snapshot for the current period was unavailable; current stars use repository metadata.')
    }

    if (!input.previousPeriod) {
      return {
        current: resolvedCurrent,
        previous: 0,
        metadata: {
          comparison_status: 'skipped',
          warning_codes: ['comparison_disabled', ...warningCodes],
        },
        warnings,
      }
    }

    if (repositoryMetadata.stars > largeRepositoryStarThreshold) {
      warningCodes.push('previous_snapshot_unavailable_large_repo')
      return {
        current: resolvedCurrent,
        previous: resolvedCurrent,
        metadata: {
          comparison_status: 'unavailable',
          warning_codes: warningCodes,
        },
        warnings: [
          ...warnings,
          'Previous-period star comparison was unavailable after exhausting the large-repository time budget.',
        ],
      }
    }

    const previousCutoff = this.toPeriodCutoff(input.previousPeriod.end)

    try {
      return {
        current: resolvedCurrent,
        previous: await input.client.getStargazerCountAt(input.repository, previousCutoff, {
          currentTotal: repositoryMetadata.stars,
          repositoryCreatedAt: repositoryMetadata.createdAt,
        }),
        metadata: {
          comparison_status: warningCodes.length > 0 ? 'partial' : 'complete',
          warning_codes: warningCodes,
        },
        warnings,
      }
    } catch {
      warningCodes.push('previous_snapshot_unavailable')
      return {
        current: resolvedCurrent,
        previous: 0,
        metadata: {
          comparison_status: 'partial',
          warning_codes: warningCodes,
        },
        warnings: [
          ...warnings,
          'Historical star snapshot for the previous period was unavailable; previous stars defaulted to 0.',
        ],
      }
    }
  }

  private async resolveHistoricalAuthors(
    client: GitHubClient,
    repository: GitHubRepositoryRef,
    pullRequests: Array<{ authorLogin?: string }>,
    before: string,
  ): Promise<string[]> {
    const authorLogins = [...new Set(
      pullRequests
        .map((pullRequest) => pullRequest.authorLogin)
        .filter((authorLogin): authorLogin is string => typeof authorLogin === 'string' && authorLogin.length > 0),
    )].sort((left, right) => left.localeCompare(right))

    const historicalStatuses = await this.asyncBatchExecutor.map(authorLogins, async (authorLogin) => ({
      authorLogin,
      hasHistory: await client.hasMergedPullRequestByAuthorBefore(repository, authorLogin, before),
    }))

    return historicalStatuses
      .filter((entry) => entry.hasHistory)
      .map((entry) => entry.authorLogin)
  }

  private toPeriodCutoff(end: string): string {
    return `${end}T23:59:59Z`
  }

  private createComparisonMetadata(previousPeriod?: ReportingPeriod): MetricMetadata {
    if (!previousPeriod) {
      return {
        comparison_status: 'skipped',
        warning_codes: ['comparison_disabled'],
      }
    }

    return {
      comparison_status: 'complete',
      warning_codes: [],
    }
  }

  private selectReleases(
    releases: GitHubReleaseSummary[],
    repositoryMetadata: GitHubRepositoryMetadata,
    period: ReportingPeriod,
  ): ReleaseEntry[] {
    return releases
      .filter((release) =>
        typeof release.publishedAt === 'string'
        && release.publishedAt >= period.start
        && release.publishedAt <= `${period.end}T23:59:59Z`)
      .sort((left, right) => (right.publishedAt ?? '').localeCompare(left.publishedAt ?? ''))
      .slice(0, 3)
      .map((release) => ({
        id: release.tagName,
        version: release.tagName,
        published_at: release.publishedAt as string,
        url: release.htmlUrl,
        summary_bullets: this.extractReleaseBullets(release, repositoryMetadata),
      }))
  }

  private extractReleaseBullets(
    release: GitHubReleaseSummary,
    repositoryMetadata: GitHubRepositoryMetadata,
  ): string[] {
    const bulletLines = (release.body ?? '')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('- ') || line.startsWith('* '))
      .map((line) => line.slice(2).trim())
      .filter((line) => line.length > 0)
      .slice(0, 5)

    if (bulletLines.length > 0) {
      return bulletLines
    }

    const summarySource = release.name?.trim() || `Release for ${repositoryMetadata.fullName}`
    return [summarySource]
  }
}
