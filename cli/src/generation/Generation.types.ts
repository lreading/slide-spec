import type {
  GeneratedPresentationData,
  ReportingPeriod,
} from '../../../shared/src/content'

export type {
  ContributorEntry,
  GeneratedPresentationData,
  MergedPullRequestEntry,
  MetricMetadata,
  MetricValue,
  PresentationIndexEntry,
  ReleaseEntry,
  ReportingPeriod,
} from '../../../shared/src/content'

export interface ResolvedReportingPeriod {
  current: ReportingPeriod
  previous: ReportingPeriod
}

export interface GeneratedDataBuildResult {
  generated: GeneratedPresentationData
  warnings: string[]
}
