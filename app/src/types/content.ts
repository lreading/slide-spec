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
  viewport_mode_label?: string
  fullscreen_mode_label?: string
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

export interface SectionTitleSlideContent {
  title: string
  subtitle?: string
  image_url?: string
  image_alt?: string
}

export interface AgendaSlideContent {
  card_arrow_fa_icon?: string
}

export interface CardGridSlideContent {
  card_arrow_fa_icon?: string
  items: CardGridItem[]
}

export interface SectionListGridSlideContent {
  sections: ContentSection[]
}

export interface TimelineSlideContent {
  latest_badge_label?: string
  footer_link_label?: string
  empty_state_title?: string
  empty_state_message?: string
  latest_release_fa_icon?: string
  release_fa_icon?: string
  footer_link_fa_icon?: string
  featured_release_ids: string[]
}

export interface ProgressTimelineSlideContent {
  stage: RoadmapStageStatus
  deliverables_heading?: string
  focus_areas_heading?: string
  footer_link_label?: string
  item_fa_icon?: string
  focus_areas_fa_icon?: string
  theme_fa_icon?: string
  footer_link_fa_icon?: string
  stages: Record<RoadmapStageStatus, RoadmapStageSummary>
  items: string[]
  themes: RoadmapTheme[]
}

export interface PeopleSlideContent {
  banner_prefix?: string
  contributors_link_label?: string
  banner_suffix?: string
  github_fa_icon?: string
  quote_fa_icon?: string
  banner_fa_icon?: string
  spotlight: SpotlightEntry[]
}

export interface MetricsAndLinksSlideContent {
  section_heading?: string
  stats_heading?: string
  show_deltas?: boolean
  trend_suffix?: string
  section_heading_fa_icon?: string
  stats_heading_fa_icon?: string
  stat_fa_icons?: string[]
  trend_up_fa_icon?: string
  trend_down_fa_icon?: string
  stat_keys: string[]
  mentions: CommunityMention[]
}

export interface ActionCardsSlideContent {
  footer_text?: string
  footer_link_enabled?: boolean
  footer_fa_icon?: string
  footer_link_fa_icon?: string
  cards: ContributionCard[]
}

export interface ImageAndBulletsSlideImage {
  src: string
  alt?: string
  description?: string
}

export interface ImageAndBulletsSlideContent {
  image_side?: 'left' | 'right'
  image?: ImageAndBulletsSlideImage
  bullets?: string[]
}

export interface ClosingSlideContent {
  heading: string
  message: string
  quote?: string
  repository_fa_icon?: string
  docs_fa_icon?: string
  community_fa_icon?: string
}

export type TitleSlide = SlideBase<'hero', HeroSlideContent>
export type SectionTitleSlide = SlideBase<'section-title', SectionTitleSlideContent>

export type AgendaSlide = Omit<SlideBase<'agenda', AgendaSlideContent>, 'content'> & {
  /** Omitted in YAML when unused; `{}` is still accepted for backward compatibility. */
  content?: AgendaSlideContent
}

export type CardGridSlide = SlideBase<'card-grid', CardGridSlideContent>

export type RecentUpdatesSlide = SlideBase<'section-list-grid', SectionListGridSlideContent>

export type ReleasesSlide = SlideBase<'timeline', TimelineSlideContent>

export type RoadmapSlide = SlideBase<'progress-timeline', ProgressTimelineSlideContent>

export type ContributorSpotlightSlide = SlideBase<'people', PeopleSlideContent>

export type CommunityHighlightsSlide = SlideBase<'metrics-and-links', MetricsAndLinksSlideContent>

export type HowToContributeSlide = SlideBase<'action-cards', ActionCardsSlideContent>

export type ImageAndBulletsSlide = SlideBase<'image-and-bullets', ImageAndBulletsSlideContent>

export type ThankYouSlide = SlideBase<'closing', ClosingSlideContent>

export type PresentationSlide =
  | TitleSlide
  | SectionTitleSlide
  | AgendaSlide
  | CardGridSlide
  | RecentUpdatesSlide
  | ReleasesSlide
  | RoadmapSlide
  | ContributorSpotlightSlide
  | CommunityHighlightsSlide
  | ImageAndBulletsSlide
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
  fa_icon?: string
}

export interface CardGridItem {
  title: string
  marker_text?: string
  fa_icon?: string
  url?: string
}

export type RoadmapStageStatus = string

export interface RoadmapTheme {
  category: string
  target: string
}

export interface RoadmapStageSummary {
  label: string
  summary: string
}

export interface SpotlightEntry {
  login?: string
  name?: string
  summary: string
  fa_icon?: string
}

export interface CommunityMention {
  type: string
  title: string
  url_label?: string
  url?: string
  fa_icon?: string
  link_fa_icon?: string
}

export interface ContributionCard {
  title: string
  description?: string
  url_label?: string
  url?: string
  fa_icon?: string
  link_fa_icon?: string
}

export interface PresentationRecord {
  index: PresentationIndexEntry
  presentation: PresentationContent
  generated: GeneratedPresentationData
}
