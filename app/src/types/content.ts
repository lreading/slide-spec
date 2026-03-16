import type { SlideTemplateId } from '../templates/templateIds'

export interface SiteLink {
  label: string
  url: string
  eyebrow?: string
}

export interface PresentationLogo {
  url?: string
  alt?: string
}

export interface ProjectBadge {
  label?: string
  fa_icon?: string
  icon_position?: 'before' | 'after'
}

export interface HomeHeroContent {
  title_primary?: string
  title_accent?: string
  subtitle?: string
}

export interface NavigationContent {
  brand_title?: string
  home_label?: string
  presentations_label?: string
  latest_presentation_label?: string
  toggle_label?: string
}

export interface AppFooterContent {
  repository_label?: string
  repository_url?: string
}

export interface PresentationChromeContent {
  mark_label?: string
}

export interface PresentationToolbarContent {
  navigation_label?: string
  previous_slide_label?: string
  next_slide_label?: string
  presentation_mode_label?: string
}

export interface PresentationsPageContent {
  title?: string
  search_label?: string
  search_placeholder?: string
  year_label?: string
  all_years_label?: string
  open_presentation_label?: string
  empty_title?: string
  empty_message?: string
  previous_page_label?: string
  next_page_label?: string
  page_label?: string
  page_of_label?: string
  showing_label?: string
  total_label?: string
  presentation_singular_label?: string
  presentation_plural_label?: string
}

export interface SiteContent {
  title: string
  mascot_alt?: string
  project_badge?: ProjectBadge
  presentation_logo?: PresentationLogo
  navigation?: NavigationContent
  app_footer?: AppFooterContent
  presentation_chrome?: PresentationChromeContent
  presentation_toolbar?: PresentationToolbarContent
  home_hero?: HomeHeroContent
  home_intro: string
  home_cta_label: string
  presentations_cta_label: string
  presentations_page?: PresentationsPageContent
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
  template?: SlideTemplateId
  enabled: boolean
  title?: string
  subtitle?: string
}

export interface TitleSlide extends BaseSlide {
  kind: 'title'
  title_primary?: string
  title_accent?: string
  subtitle_prefix?: string
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
  latest_badge_label?: string
  footer_link_label?: string
  featured_release_ids: string[]
}

export interface RoadmapSlide extends BaseSlide {
  kind: 'roadmap'
  stage: RoadmapStageStatus
}

export interface ContributorSpotlightSlide extends BaseSlide {
  kind: 'contributor-spotlight'
  banner_prefix?: string
  contributors_link_label?: string
  banner_suffix?: string
  spotlight: SpotlightEntry[]
}

export interface CommunityHighlightsSlide extends BaseSlide {
  kind: 'community-highlights'
  section_heading?: string
  stats_heading?: string
  trend_suffix?: string
  stat_keys: string[]
  mentions: CommunityMention[]
}

export interface HowToContributeSlide extends BaseSlide {
  kind: 'how-to-contribute'
  footer_text?: string
  cards: ContributionCard[]
}

export interface ThankYouSlide extends BaseSlide {
  kind: 'thank-you'
  heading: string
  message: string
  quote?: string
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

export interface PresentationContent {
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
  agenda_label?: string
  deliverables_heading?: string
  focus_areas_heading?: string
  footer_link_label?: string
  sections: Record<RoadmapStageStatus, RoadmapStageContent>
}

export interface SpotlightEntry {
  login: string
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
  presentation: PresentationContent
  generated: GeneratedPresentationData
}
