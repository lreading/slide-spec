import type {
  AppFooterContent,
  AttributionContent,
  HomeHeroContent,
  NavigationContent,
  PresentationContent,
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
  title: trimOrUndefined(site.presentations_page?.title),
  search_label: trimOrUndefined(site.presentations_page?.search_label),
  search_placeholder: trimOrUndefined(site.presentations_page?.search_placeholder),
  year_label: trimOrUndefined(site.presentations_page?.year_label),
  all_years_label: trimOrUndefined(site.presentations_page?.all_years_label),
  open_presentation_label: trimOrUndefined(site.presentations_page?.open_presentation_label),
  empty_title: trimOrUndefined(site.presentations_page?.empty_title),
  empty_message: trimOrUndefined(site.presentations_page?.empty_message),
  previous_page_label: trimOrUndefined(site.presentations_page?.previous_page_label),
  next_page_label: trimOrUndefined(site.presentations_page?.next_page_label),
  page_label: trimOrUndefined(site.presentations_page?.page_label),
  page_of_label: trimOrUndefined(site.presentations_page?.page_of_label),
  showing_label: trimOrUndefined(site.presentations_page?.showing_label),
  total_label: trimOrUndefined(site.presentations_page?.total_label),
  presentation_singular_label: trimOrUndefined(site.presentations_page?.presentation_singular_label),
  presentation_plural_label: trimOrUndefined(site.presentations_page?.presentation_plural_label),
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
  presentation: PresentationContent,
): RoadmapResolvedLabels => ({
  deliverables: trimOrUndefined(presentation.roadmap?.deliverables_heading),
  focusAreas: trimOrUndefined(presentation.roadmap?.focus_areas_heading),
  footerLink: trimOrUndefined(presentation.roadmap?.footer_link_label),
})
