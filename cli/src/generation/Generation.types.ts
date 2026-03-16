export interface PresentationIndexEntry {
  id: string
  year: number
  quarter: number
  title: string
  subtitle: string
  summary: string
  published: boolean
  featured: boolean
}

export interface QuarterWindow {
  year: number
  quarter: number
  presentationId: string
  start: string
  end: string
  previousYear: number
  previousQuarter: number
}

export interface MetricValue {
  label: string
  current: number
  previous: number
  delta: number
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
