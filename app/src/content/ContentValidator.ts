import type {
  GeneratedPresentationData,
  MetricValue,
  PresentationContent,
  PresentationIndexEntry,
  SiteContent,
  SiteLink,
} from '../types/content'
import { isSlideTemplateId } from '../templates/templateIds'
import { validateTemplateSlide } from '../templates/validation'

interface PresentationIndexDocument {
  presentations: PresentationIndexEntry[]
}

interface SiteDocument {
  site: SiteContent
}

interface PresentationDocument {
  presentation: PresentationContent
}

interface GeneratedDocument {
  generated: GeneratedPresentationData
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

function assertString(value: unknown, path: string): asserts value is string {
  assert(typeof value === 'string', `${path} must be a string.`)
}

function assertNonBlankString(value: unknown, path: string): asserts value is string {
  assertString(value, path)
  assert(value.trim().length > 0, `${path} must not be blank.`)
}

function assertBoolean(value: unknown, path: string): asserts value is boolean {
  assert(typeof value === 'boolean', `${path} must be a boolean.`)
}

function assertNumber(value: unknown, path: string): asserts value is number {
  assert(typeof value === 'number' && Number.isFinite(value), `${path} must be a number.`)
}

function assertStringArray(value: unknown, path: string): asserts value is string[] {
  assert(Array.isArray(value), `${path} must be an array.`)
  const entries = value as unknown[]
  entries.forEach((entry, index) => assertNonBlankString(entry, `${path}[${index}]`))
}

function assertOptionalString(value: unknown, path: string): void {
  if (value !== undefined) {
    assertNonBlankString(value, path)
  }
}

function assertLink(value: unknown, path: string): asserts value is SiteLink {
  assert(isRecord(value), `${path} must be an object.`)
  assertNonBlankString(value.label, `${path}.label`)
  assertNonBlankString(value.url, `${path}.url`)
  assertOptionalString(value.eyebrow, `${path}.eyebrow`)
}

function assertProjectBadge(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertOptionalString(value.label, `${path}.label`)
  assertOptionalString(value.fa_icon, `${path}.fa_icon`)
  assertOptionalString(value.icon_position, `${path}.icon_position`)
  assert(value.label !== undefined || value.fa_icon !== undefined, `${path} must include label or fa_icon.`)
  if (value.icon_position !== undefined) {
    assert(
      value.icon_position === 'before' || value.icon_position === 'after',
      `${path}.icon_position must be "before" or "after".`,
    )
  }
}

function assertPresentationLogo(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertOptionalString(value.url, `${path}.url`)
  assertOptionalString(value.alt, `${path}.alt`)
  assert(value.url !== undefined || value.alt === undefined, `${path}.alt requires ${path}.url.`)
}

function assertNavigationContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertOptionalString(value.brand_title, `${path}.brand_title`)
  assertOptionalString(value.home_label, `${path}.home_label`)
  assertOptionalString(value.presentations_label, `${path}.presentations_label`)
  assertOptionalString(value.latest_presentation_label, `${path}.latest_presentation_label`)
  assertOptionalString(value.toggle_label, `${path}.toggle_label`)
}

function assertAppFooterContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertOptionalString(value.repository_label, `${path}.repository_label`)
  assertOptionalString(value.repository_url, `${path}.repository_url`)
  assert(
    (value.repository_label === undefined && value.repository_url === undefined)
      || (value.repository_label !== undefined && value.repository_url !== undefined),
    `${path} must provide both repository_label and repository_url together.`,
  )
}

function assertPresentationChromeContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertOptionalString(value.mark_label, `${path}.mark_label`)
}

function assertPresentationToolbarContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertOptionalString(value.navigation_label, `${path}.navigation_label`)
  assertOptionalString(value.previous_slide_label, `${path}.previous_slide_label`)
  assertOptionalString(value.next_slide_label, `${path}.next_slide_label`)
  assertOptionalString(value.presentation_mode_label, `${path}.presentation_mode_label`)
}

function assertHomeHeroContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertOptionalString(value.title_primary, `${path}.title_primary`)
  assertOptionalString(value.title_accent, `${path}.title_accent`)
  assertOptionalString(value.subtitle, `${path}.subtitle`)
}

function assertPresentationsPageContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertOptionalString(value.title, `${path}.title`)
  assertOptionalString(value.search_label, `${path}.search_label`)
  assertOptionalString(value.search_placeholder, `${path}.search_placeholder`)
  assertOptionalString(value.year_label, `${path}.year_label`)
  assertOptionalString(value.all_years_label, `${path}.all_years_label`)
  assertOptionalString(value.open_presentation_label, `${path}.open_presentation_label`)
  assertOptionalString(value.empty_title, `${path}.empty_title`)
  assertOptionalString(value.empty_message, `${path}.empty_message`)
  assertOptionalString(value.previous_page_label, `${path}.previous_page_label`)
  assertOptionalString(value.next_page_label, `${path}.next_page_label`)
  assertOptionalString(value.page_label, `${path}.page_label`)
  assertOptionalString(value.page_of_label, `${path}.page_of_label`)
  assertOptionalString(value.showing_label, `${path}.showing_label`)
  assertOptionalString(value.total_label, `${path}.total_label`)
  assertOptionalString(value.presentation_singular_label, `${path}.presentation_singular_label`)
  assertOptionalString(value.presentation_plural_label, `${path}.presentation_plural_label`)
}

function assertMetricValue(value: unknown, path: string): asserts value is MetricValue {
  assert(isRecord(value), `${path} must be an object.`)
  assertNonBlankString(value.label, `${path}.label`)
  assertNumber(value.current, `${path}.current`)
  assertNumber(value.previous, `${path}.previous`)
  assertNumber(value.delta, `${path}.delta`)
}

function assertRoadmapStageContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNonBlankString(value.label, `${path}.label`)
  assertNonBlankString(value.summary, `${path}.summary`)
  assertStringArray(value.items, `${path}.items`)
  assert(Array.isArray(value.themes), `${path}.themes must be an array.`)
  const themes = value.themes as unknown[]
  themes.forEach((theme, index) => {
    assert(isRecord(theme), `${path}.themes[${index}] must be an object.`)
    assertNonBlankString(theme.category, `${path}.themes[${index}].category`)
    assertNonBlankString(theme.target, `${path}.themes[${index}].target`)
  })
}

function assertRoadmapContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertOptionalString(value.agenda_label, `${path}.agenda_label`)
  assertOptionalString(value.deliverables_heading, `${path}.deliverables_heading`)
  assertOptionalString(value.focus_areas_heading, `${path}.focus_areas_heading`)
  assertOptionalString(value.footer_link_label, `${path}.footer_link_label`)
  assert(isRecord(value.sections), `${path}.sections must be an object.`)
  assertRoadmapStageContent(value.sections.completed, `${path}.sections.completed`)
  assertRoadmapStageContent(value.sections['in-progress'], `${path}.sections.in-progress`)
  assertRoadmapStageContent(value.sections.planned, `${path}.sections.planned`)
  assertRoadmapStageContent(value.sections.future, `${path}.sections.future`)
}

function validateSlide(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNonBlankString(value.template, `${path}.template`)
  assert(
    isSlideTemplateId(value.template),
    `${path}.template must be a supported template id.`,
  )
  assertBoolean(value.enabled, `${path}.enabled`)
  assertOptionalString(value.title, `${path}.title`)
  assertOptionalString(value.subtitle, `${path}.subtitle`)
  assert(isRecord(value.content), `${path}.content must be an object.`)

  validateTemplateSlide(value.template, value, path)
}

export class ContentValidator {
  public validateSiteDocument(document: unknown): asserts document is SiteDocument {
    assert(isRecord(document), 'site.yaml must be an object.')
    assert(isRecord(document.site), 'site.yaml.site must be an object.')
    const site = document.site
    assertNonBlankString(site.title, 'site.yaml.site.title')
    assertOptionalString(site.mascot_alt, 'site.yaml.site.mascot_alt')
    assertNonBlankString(site.home_intro, 'site.yaml.site.home_intro')
    assertNonBlankString(site.home_cta_label, 'site.yaml.site.home_cta_label')
    assertNonBlankString(site.presentations_cta_label, 'site.yaml.site.presentations_cta_label')
    if (site.project_badge !== undefined) {
      assertProjectBadge(site.project_badge, 'site.yaml.site.project_badge')
    }
    if (site.presentation_logo !== undefined) {
      assertPresentationLogo(site.presentation_logo, 'site.yaml.site.presentation_logo')
    }
    if (site.navigation !== undefined) {
      assertNavigationContent(site.navigation, 'site.yaml.site.navigation')
    }
    if (site.app_footer !== undefined) {
      assertAppFooterContent(site.app_footer, 'site.yaml.site.app_footer')
    }
    if (site.presentation_chrome !== undefined) {
      assertPresentationChromeContent(site.presentation_chrome, 'site.yaml.site.presentation_chrome')
    }
    if (site.presentation_toolbar !== undefined) {
      assertPresentationToolbarContent(site.presentation_toolbar, 'site.yaml.site.presentation_toolbar')
    }
    if (site.home_hero !== undefined) {
      assertHomeHeroContent(site.home_hero, 'site.yaml.site.home_hero')
    }
    if (site.presentations_page !== undefined) {
      assertPresentationsPageContent(site.presentations_page, 'site.yaml.site.presentations_page')
    }
    assert(isRecord(site.links), 'site.yaml.site.links must be an object.')
    assertLink(site.links.repository, 'site.yaml.site.links.repository')
    assertLink(site.links.docs, 'site.yaml.site.links.docs')
    assertLink(site.links.owasp, 'site.yaml.site.links.owasp')
  }

  public validatePresentationIndexDocument(document: unknown): asserts document is PresentationIndexDocument {
    assert(isRecord(document), 'presentations/index.yaml must be an object.')
    assert(Array.isArray(document.presentations), 'presentations/index.yaml.presentations must be an array.')

    const ids = new Set<string>()
    const presentations = document.presentations as unknown[]
    presentations.forEach((entry, index) => {
      const path = `presentations/index.yaml.presentations[${index}]`
      assert(isRecord(entry), `${path} must be an object.`)
      assertNonBlankString(entry.id, `${path}.id`)
      assert(!ids.has(entry.id), `${path}.id must be unique.`)
      ids.add(entry.id)
      assertNumber(entry.year, `${path}.year`)
      assertNumber(entry.quarter, `${path}.quarter`)
      assertNonBlankString(entry.title, `${path}.title`)
      assertNonBlankString(entry.subtitle, `${path}.subtitle`)
      assertNonBlankString(entry.summary, `${path}.summary`)
      assertBoolean(entry.published, `${path}.published`)
      assertBoolean(entry.featured, `${path}.featured`)
    })
  }

  public validatePresentationDocument(document: unknown): asserts document is PresentationDocument {
    assert(isRecord(document), 'presentation document must be an object.')
    assert(isRecord(document.presentation), 'presentation document.presentation must be an object.')
    const presentation = document.presentation
    assertNonBlankString(presentation.id, 'presentation document.presentation.id')
    assertNumber(presentation.year, 'presentation document.presentation.year')
    assertNumber(presentation.quarter, 'presentation document.presentation.quarter')
    assertNonBlankString(presentation.title, 'presentation document.presentation.title')
    assertNonBlankString(presentation.subtitle, 'presentation document.presentation.subtitle')
    if (presentation.roadmap !== undefined) {
      assertRoadmapContent(presentation.roadmap, 'presentation document.presentation.roadmap')
    }
    assert(Array.isArray(presentation.slides), 'presentation document.presentation.slides must be an array.')
    const slides = presentation.slides as unknown[]
    slides.forEach((slide, index) => validateSlide(slide, `presentation document.presentation.slides[${index}]`))
  }

  public validateGeneratedDocument(document: unknown): asserts document is GeneratedDocument {
    assert(isRecord(document), 'generated document must be an object.')
    assert(isRecord(document.generated), 'generated document.generated must be an object.')
    const generated = document.generated
    assertNonBlankString(generated.id, 'generated document.generated.id')
    assert(isRecord(generated.period), 'generated document.generated.period must be an object.')
    assertNonBlankString(generated.period.start, 'generated document.generated.period.start')
    assertNonBlankString(generated.period.end, 'generated document.generated.period.end')
    assertOptionalString(
      generated.previous_presentation_id,
      'generated document.generated.previous_presentation_id',
    )

    assert(isRecord(generated.stats), 'generated document.generated.stats must be an object.')
    Object.entries(generated.stats).forEach(([key, value]) => {
      assertMetricValue(value, `generated document.generated.stats.${key}`)
    })

    assert(Array.isArray(generated.releases), 'generated document.generated.releases must be an array.')
    const releases = generated.releases as unknown[]
    releases.forEach((release, index) => {
      const path = `generated document.generated.releases[${index}]`
      assert(isRecord(release), `${path} must be an object.`)
      assertNonBlankString(release.id, `${path}.id`)
      assertNonBlankString(release.version, `${path}.version`)
      assertNonBlankString(release.published_at, `${path}.published_at`)
      assertNonBlankString(release.url, `${path}.url`)
      assertStringArray(release.summary_bullets, `${path}.summary_bullets`)
    })

    assert(isRecord(generated.contributors), 'generated document.generated.contributors must be an object.')
    assertNumber(generated.contributors.total, 'generated document.generated.contributors.total')
    assert(
      Array.isArray(generated.contributors.authors),
      'generated document.generated.contributors.authors must be an array.',
    )
    const authors = generated.contributors.authors as unknown[]
    authors.forEach((author, index) => {
      const path = `generated document.generated.contributors.authors[${index}]`
      assert(isRecord(author), `${path} must be an object.`)
      assertNonBlankString(author.login, `${path}.login`)
      assertNonBlankString(author.name, `${path}.name`)
      assertNonBlankString(author.avatar_url, `${path}.avatar_url`)
      assertNumber(author.merged_prs, `${path}.merged_prs`)
      assertBoolean(author.first_time, `${path}.first_time`)
    })
  }

  public validatePresentationRecordConsistency(
    indexEntry: PresentationIndexEntry,
    presentation: PresentationContent,
    generated: GeneratedPresentationData,
  ): void {
    assert(
      indexEntry.id === presentation.id,
      `Presentation id mismatch between index "${indexEntry.id}" and presentation "${presentation.id}".`,
    )
    assert(
      indexEntry.id === generated.id,
      `Presentation id mismatch between index "${indexEntry.id}" and generated "${generated.id}".`,
    )
    assert(
      indexEntry.year === presentation.year,
      `Presentation year mismatch between index "${indexEntry.year}" and presentation "${presentation.year}".`,
    )
    assert(
      indexEntry.quarter === presentation.quarter,
      `Presentation quarter mismatch between index "${indexEntry.quarter}" and presentation "${presentation.quarter}".`,
    )
    assert(
      indexEntry.title === presentation.title,
      `Presentation title mismatch between index "${indexEntry.title}" and presentation "${presentation.title}".`,
    )
    assert(
      indexEntry.subtitle === presentation.subtitle,
      `Presentation subtitle mismatch between index "${indexEntry.subtitle}" and presentation "${presentation.subtitle}".`,
    )
  }
}
