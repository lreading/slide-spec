export interface SiteLink {
  label: string
  url: string
}

export interface SiteContent {
  title: string
  tagline: string
  eyebrow: string
  home_intro: string
  home_cta_label: string
  archive_cta_label: string
  links: Record<string, SiteLink>
}

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

export type SlideKind =
  | 'title'
  | 'agenda'
  | 'recent-updates'
  | 'releases'
  | 'roadmap'
  | 'contributor-spotlight'
  | 'community-highlights'
  | 'how-to-contribute'
  | 'thank-you'

export interface BaseSlide {
  kind: SlideKind
  enabled: boolean
  subtitle?: string
}

export interface TitleSlide extends BaseSlide {
  kind: 'title'
  quote?: string
}

export interface AgendaSlide extends BaseSlide {
  kind: 'agenda'
}

export interface RecentUpdatesSlide extends BaseSlide {
  kind: 'recent-updates'
  sections: ContentSection[]
}

export interface ReleasesSlide extends BaseSlide {
  kind: 'releases'
  featured_release_ids: string[]
}

export interface RoadmapSlide extends BaseSlide {
  kind: 'roadmap'
  stage: RoadmapStageStatus
}

export interface ContributorSpotlightSlide extends BaseSlide {
  kind: 'contributor-spotlight'
  spotlight: SpotlightEntry[]
}

export interface CommunityHighlightsSlide extends BaseSlide {
  kind: 'community-highlights'
  stat_keys: string[]
  mentions: CommunityMention[]
}

export interface HowToContributeSlide extends BaseSlide {
  kind: 'how-to-contribute'
  cards: ContributionCard[]
}

export interface ThankYouSlide extends BaseSlide {
  kind: 'thank-you'
  heading: string
  message: string
}

export type PresentationSlide =
  | TitleSlide
  | AgendaSlide
  | RecentUpdatesSlide
  | ReleasesSlide
  | RoadmapSlide
  | ContributorSpotlightSlide
  | CommunityHighlightsSlide
  | HowToContributeSlide
  | ThankYouSlide

export interface PresentationDeck {
  id: string
  year: number
  quarter: number
  title: string
  subtitle: string
  roadmap?: RoadmapContent
  slides: PresentationSlide[]
}

export interface ContentSection {
  title: string
  bullets: string[]
}

export type RoadmapStageStatus = 'completed' | 'in-progress' | 'planned' | 'future'

export interface RoadmapTheme {
  category: string
  target: string
}

export interface RoadmapStageContent {
  label: string
  summary: string
  items: string[]
  themes: RoadmapTheme[]
}

export interface RoadmapContent {
  sections: Record<RoadmapStageStatus, RoadmapStageContent>
}

export interface SpotlightEntry {
  login: string
  focus_area: string
  summary: string
}

export interface CommunityMention {
  type: string
  title: string
  url_label?: string
  url?: string
}

export interface ContributionCard {
  title: string
  description: string
  url_label: string
  url: string
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

export interface GeneratedPresentationData {
  id: string
  period: { start: string; end: string }
  previous_presentation_id?: string
  stats: Record<string, MetricValue>
  releases: ReleaseEntry[]
  contributors: {
    total: number
    authors: ContributorEntry[]
  }
}

export interface PresentationRecord {
  index: PresentationIndexEntry
  deck: PresentationDeck
  generated: GeneratedPresentationData
}
