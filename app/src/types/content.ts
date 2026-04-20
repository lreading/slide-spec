import type { SlideTemplateId } from '../templates/templateIds'
import type {
  DataSource,
  GeneratedPresentationData,
  PresentationIndexEntry,
  SiteDeploymentConfig,
  SiteMetadataConfig,
} from '../../../shared/src/content'

export type {
  ContributorEntry,
  DataSource,
  GeneratedPresentationData,
  MetricComparisonStatus,
  MetricMetadata,
  MetricValue,
  PresentationIndexEntry,
  ReleaseEntry,
  SiteMetadataConfig,
} from '../../../shared/src/content'

export interface SiteLink {
  label: string
  url: string
  eyebrow?: string
}

export interface PresentationLogo {
  url?: string
  alt?: string
}

export interface MascotContent {
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

export interface HomeLogoImage {
  url: string
  alt: string
}

export interface HomeLogoLinkContent {
  name: string
  url: string
  logo: HomeLogoImage
}

export interface NavigationContent {
  brand_title?: string
  home_label?: string
  presentations_label?: string
  latest_presentation_label?: string
  docs_enabled?: boolean
  toggle_label?: string
}

export interface AppFooterContent {
  repository_label?: string
  repository_url?: string
}

export interface AttributionContent {
  enabled?: boolean
  label?: string
  url?: string
}

export interface PresentationChromeContent {
  mark_label?: string
}

export interface PresentationToolbarContent {
  navigation_label?: string
  previous_slide_label?: string
  next_slide_label?: string
  presentation_mode_label?: string
  shortcut_help_title?: string
  shortcut_help_body?: string
  shortcut_help_dismiss_label?: string
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
  deployment_url?: SiteDeploymentConfig['deployment_url']
  sitemap_enabled?: SiteDeploymentConfig['sitemap_enabled']
  metadata?: SiteMetadataConfig
  mascot?: MascotContent
  data_sources?: DataSource[]
  project_badge?: ProjectBadge
  presentation_logo?: PresentationLogo
  navigation?: NavigationContent
  app_footer?: AppFooterContent
  attribution?: AttributionContent
  presentation_chrome?: PresentationChromeContent
  presentation_toolbar?: PresentationToolbarContent
  home_hero?: HomeHeroContent
  home_logos?: HomeLogoLinkContent[]
  home_intro: string
  home_cta_label: string
  presentations_cta_label: string
  presentations_page?: PresentationsPageContent
  links: Record<string, SiteLink>
}

export interface SlideBase<TTemplate extends SlideTemplateId, TContent> {
  template: TTemplate
  enabled: boolean
  title?: string
  subtitle?: string
  content: TContent
}

export interface HeroSlideContent {
  title_primary?: string
  title_accent?: string
  subtitle_prefix?: string
  quote?: string
}

export type AgendaSlideContent = Record<string, never>

export interface SectionListGridSlideContent {
  sections: ContentSection[]
}

export interface TimelineSlideContent {
  latest_badge_label?: string
  footer_link_label?: string
  empty_state_title?: string
  empty_state_message?: string
  featured_release_ids: string[]
}

export interface ProgressTimelineSlideContent {
  stage: RoadmapStageStatus
  deliverables_heading?: string
  focus_areas_heading?: string
  footer_link_label?: string
  stages: Record<RoadmapStageStatus, RoadmapStageSummary>
  items: string[]
  themes: RoadmapTheme[]
}

export interface PeopleSlideContent {
  banner_prefix?: string
  contributors_link_label?: string
  banner_suffix?: string
  spotlight: SpotlightEntry[]
}

export interface MetricsAndLinksSlideContent {
  section_heading?: string
  stats_heading?: string
  show_deltas?: boolean
  trend_suffix?: string
  stat_keys: string[]
  mentions: CommunityMention[]
}

export interface ActionCardsSlideContent {
  footer_text?: string
  cards: ContributionCard[]
}

export interface ClosingSlideContent {
  heading: string
  message: string
  quote?: string
}

export type TitleSlide = SlideBase<'hero', HeroSlideContent>

export type AgendaSlide = Omit<SlideBase<'agenda', AgendaSlideContent>, 'content'> & {
  /** Omitted in YAML when unused; `{}` is still accepted for backward compatibility. */
  content?: AgendaSlideContent
}

export type RecentUpdatesSlide = SlideBase<'section-list-grid', SectionListGridSlideContent>

export type ReleasesSlide = SlideBase<'timeline', TimelineSlideContent>

export type RoadmapSlide = SlideBase<'progress-timeline', ProgressTimelineSlideContent>

export type ContributorSpotlightSlide = SlideBase<'people', PeopleSlideContent>

export type CommunityHighlightsSlide = SlideBase<'metrics-and-links', MetricsAndLinksSlideContent>

export type HowToContributeSlide = SlideBase<'action-cards', ActionCardsSlideContent>

export type ThankYouSlide = SlideBase<'closing', ClosingSlideContent>

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
  year?: number
  title: string
  subtitle: string
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

export interface RoadmapStageSummary {
  label: string
  summary: string
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

export interface PresentationRecord {
  index: PresentationIndexEntry
  presentation: PresentationContent
  generated: GeneratedPresentationData
}
