import type {
  AppFooterContent,
  AttributionContent,
  HomeHeroContent,
  NavigationContent,
  ProgressTimelineSlideContent,
  PresentationToolbarContent,
  PresentationsPageContent,
  SiteContent,
  TitleSlide,
} from '../types/content'

export interface TitleSlideResolvedContent {
  titlePrimary?: string
  titleAccent?: string
  subtitlePrefix?: string
}

export interface RoadmapResolvedLabels {
  deliverables?: string
  focusAreas?: string
  footerLink?: string
}

export interface ResolvedAttributionContent {
  enabled: boolean
  label: string
  url: string
}

const trimOrUndefined = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : undefined
}

export const resolveNavigationContent = (
  site: SiteContent,
): NavigationContent => ({
  brand_title: trimOrUndefined(site.navigation?.brand_title),
  home_label: trimOrUndefined(site.navigation?.home_label),
  presentations_label: trimOrUndefined(site.navigation?.presentations_label),
  latest_presentation_label: trimOrUndefined(site.navigation?.latest_presentation_label),
  docs_enabled: site.navigation?.docs_enabled ?? true,
  toggle_label: trimOrUndefined(site.navigation?.toggle_label),
})

export const resolveAppFooterContent = (
  site: SiteContent,
): AppFooterContent => ({
  repository_label: trimOrUndefined(site.app_footer?.repository_label),
  repository_url: trimOrUndefined(site.app_footer?.repository_url),
})

const DEFAULT_ATTRIBUTION_LABEL = 'Powered by slide-spec'
const DEFAULT_ATTRIBUTION_URL = 'https://github.com/lreading/slide-spec'
const DEFAULT_PRESENTATIONS_PAGE_CONTENT: Required<PresentationsPageContent> = {
  title: 'All presentations',
  search_label: 'Search',
  search_placeholder: 'Search presentations...',
  year_label: 'Year',
  all_years_label: 'All years',
  open_presentation_label: 'Open presentation',
  empty_title: 'No matching presentations',
  empty_message: 'Try a different year or a broader search term.',
  previous_page_label: 'Previous',
  next_page_label: 'Next',
  page_label: 'Page',
  page_of_label: 'of',
  showing_label: 'Showing',
  total_label: 'total',
  presentation_singular_label: 'presentation',
  presentation_plural_label: 'presentations',
}

export const resolveAttributionContent = (
  site: SiteContent,
): ResolvedAttributionContent => {
  const attribution: AttributionContent | undefined = site.attribution

  return {
    enabled: attribution?.enabled ?? true,
    label: trimOrUndefined(attribution?.label) ?? DEFAULT_ATTRIBUTION_LABEL,
    url: trimOrUndefined(attribution?.url) ?? DEFAULT_ATTRIBUTION_URL,
  }
}

export const resolvePresentationChromeLabel = (site: SiteContent): string | undefined =>
  trimOrUndefined(site.presentation_chrome?.mark_label)

export const resolvePresentationToolbarContent = (
  site: SiteContent,
): PresentationToolbarContent => ({
  navigation_label: trimOrUndefined(site.presentation_toolbar?.navigation_label),
  previous_slide_label: trimOrUndefined(site.presentation_toolbar?.previous_slide_label),
  next_slide_label: trimOrUndefined(site.presentation_toolbar?.next_slide_label),
  presentation_mode_label: trimOrUndefined(site.presentation_toolbar?.presentation_mode_label),
  shortcut_help_title: trimOrUndefined(site.presentation_toolbar?.shortcut_help_title),
  shortcut_help_body: trimOrUndefined(site.presentation_toolbar?.shortcut_help_body),
  shortcut_help_dismiss_label: trimOrUndefined(site.presentation_toolbar?.shortcut_help_dismiss_label),
})

export const resolvePresentationsPageContent = (
  site: SiteContent,
): PresentationsPageContent => ({
  title: trimOrUndefined(site.presentations_page?.title) ?? DEFAULT_PRESENTATIONS_PAGE_CONTENT.title,
  search_label: trimOrUndefined(site.presentations_page?.search_label) ?? DEFAULT_PRESENTATIONS_PAGE_CONTENT.search_label,
  search_placeholder: trimOrUndefined(site.presentations_page?.search_placeholder)
    ?? DEFAULT_PRESENTATIONS_PAGE_CONTENT.search_placeholder,
  year_label: trimOrUndefined(site.presentations_page?.year_label) ?? DEFAULT_PRESENTATIONS_PAGE_CONTENT.year_label,
  all_years_label: trimOrUndefined(site.presentations_page?.all_years_label) ?? DEFAULT_PRESENTATIONS_PAGE_CONTENT.all_years_label,
  open_presentation_label: trimOrUndefined(site.presentations_page?.open_presentation_label)
    ?? DEFAULT_PRESENTATIONS_PAGE_CONTENT.open_presentation_label,
  empty_title: trimOrUndefined(site.presentations_page?.empty_title) ?? DEFAULT_PRESENTATIONS_PAGE_CONTENT.empty_title,
  empty_message: trimOrUndefined(site.presentations_page?.empty_message) ?? DEFAULT_PRESENTATIONS_PAGE_CONTENT.empty_message,
  previous_page_label: trimOrUndefined(site.presentations_page?.previous_page_label)
    ?? DEFAULT_PRESENTATIONS_PAGE_CONTENT.previous_page_label,
  next_page_label: trimOrUndefined(site.presentations_page?.next_page_label) ?? DEFAULT_PRESENTATIONS_PAGE_CONTENT.next_page_label,
  page_label: trimOrUndefined(site.presentations_page?.page_label) ?? DEFAULT_PRESENTATIONS_PAGE_CONTENT.page_label,
  page_of_label: trimOrUndefined(site.presentations_page?.page_of_label) ?? DEFAULT_PRESENTATIONS_PAGE_CONTENT.page_of_label,
  showing_label: trimOrUndefined(site.presentations_page?.showing_label) ?? DEFAULT_PRESENTATIONS_PAGE_CONTENT.showing_label,
  total_label: trimOrUndefined(site.presentations_page?.total_label) ?? DEFAULT_PRESENTATIONS_PAGE_CONTENT.total_label,
  presentation_singular_label: trimOrUndefined(site.presentations_page?.presentation_singular_label)
    ?? DEFAULT_PRESENTATIONS_PAGE_CONTENT.presentation_singular_label,
  presentation_plural_label: trimOrUndefined(site.presentations_page?.presentation_plural_label)
    ?? DEFAULT_PRESENTATIONS_PAGE_CONTENT.presentation_plural_label,
})

export const resolveHomeHeroContent = (
  site: SiteContent,
): HomeHeroContent => ({
  title_primary: trimOrUndefined(site.home_hero?.title_primary),
  title_accent: trimOrUndefined(site.home_hero?.title_accent),
  subtitle: trimOrUndefined(site.home_hero?.subtitle),
})

export const resolveTitleSlideContent = (
  slide: TitleSlide,
): TitleSlideResolvedContent => ({
  titlePrimary: trimOrUndefined(slide.content.title_primary),
  titleAccent: trimOrUndefined(slide.content.title_accent),
  subtitlePrefix: trimOrUndefined(slide.content.subtitle_prefix),
})

export const resolveRoadmapLabels = (
  content: ProgressTimelineSlideContent,
): RoadmapResolvedLabels => ({
  deliverables: trimOrUndefined(content.deliverables_heading),
  focusAreas: trimOrUndefined(content.focus_areas_heading),
  footerLink: trimOrUndefined(content.footer_link_label),
})
