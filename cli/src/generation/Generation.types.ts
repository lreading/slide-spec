export interface PresentationIndexEntry {
  id: string
  year?: number
  title: string
  subtitle: string
  summary: string
  published: boolean
  featured: boolean
}

export interface ReportingPeriod {
  start: string
  end: string
}

export interface ResolvedReportingPeriod {
  current: ReportingPeriod
  previous: ReportingPeriod
}

export type MetricComparisonStatus = 'complete' | 'partial' | 'skipped' | 'unavailable'

export interface MetricMetadata {
  comparison_status: MetricComparisonStatus
  warning_codes: string[]
}

export interface MetricValue {
  label: string
  current: number
  previous: number
  delta: number
  metadata: MetricMetadata
}

export interface ReleaseEntry {
  id: string
  version: string
  published_at: string
  url: string
  summary_bullets: string[]
}

export interface ContributorEntry {
  login: string
  name: string
  avatar_url: string
  merged_prs: number
  first_time: boolean
}

export interface MergedPullRequestEntry {
  number: number
  title: string
  merged_at: string
  author_login: string
}

export interface GeneratedPresentationData {
  id: string
  period: {
    start: string
    end: string
  }
  previous_presentation_id?: string
  stats: Record<string, MetricValue>
  releases: ReleaseEntry[]
  contributors: {
    total: number
    authors: ContributorEntry[]
  }
  merged_prs: MergedPullRequestEntry[]
}

export interface GeneratedDataBuildResult {
  generated: GeneratedPresentationData
  warnings: string[]
}
