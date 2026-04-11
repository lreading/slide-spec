import type { GeneratedPresentationData, MetricValue, PresentationIndexEntry } from './content'
import { isSlideTemplateId } from './templates/templateIds'
import { validateTemplateSlide } from './templates/validation'
import {
  assert,
  assertBoolean,
  assertNoUnexpectedKeys,
  assertNonBlankString,
  assertNumber,
  assertOptionalNumber,
  assertOptionalString,
  assertSchemaVersion,
  assertStringArray,
  isRecord,
} from './validation/assertions'

interface PresentationIndexDocument {
  schemaVersion: number
  presentations: PresentationIndexEntry[]
}

interface SiteDocument {
  schemaVersion: number
  site: Record<string, unknown>
}

interface PresentationDocument {
  schemaVersion: number
  presentation: Record<string, unknown>
}

interface GeneratedDocument {
  schemaVersion: number
  generated: GeneratedPresentationData
}

function assertLink(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['label', 'url', 'eyebrow'], path)
  assertNonBlankString(value.label, `${path}.label`)
  assertNonBlankString(value.url, `${path}.url`)
  assertOptionalString(value.eyebrow, `${path}.eyebrow`)
}

function assertProjectBadge(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['label', 'fa_icon', 'icon_position'], path)
  assertOptionalString(value.label, `${path}.label`)
  assertOptionalString(value.fa_icon, `${path}.fa_icon`)
  assertOptionalString(value.icon_position, `${path}.icon_position`)
  assert(value.label !== undefined || value.fa_icon !== undefined, `${path} must include label or fa_icon.`)
  if (value.icon_position !== undefined) {
    assert(value.icon_position === 'before' || value.icon_position === 'after', `${path}.icon_position must be "before" or "after".`)
  }
}

function assertPresentationLogo(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['url', 'alt'], path)
  assertOptionalString(value.url, `${path}.url`)
  assertOptionalString(value.alt, `${path}.alt`)
  assert(value.url !== undefined || value.alt === undefined, `${path}.alt requires ${path}.url.`)
}

function assertMascotContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['url', 'alt'], path)
  assertOptionalString(value.url, `${path}.url`)
  assertOptionalString(value.alt, `${path}.alt`)
  assert(value.url !== undefined || value.alt === undefined, `${path}.alt requires ${path}.url.`)
}

function assertSiteMetadata(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['title', 'description', 'image_url', 'image_alt'], path)
  assertOptionalString(value.title, `${path}.title`)
  assertOptionalString(value.description, `${path}.description`)
  assertOptionalString(value.image_url, `${path}.image_url`)
  assertOptionalString(value.image_alt, `${path}.image_alt`)
  assert(value.image_url !== undefined || value.image_alt === undefined, `${path}.image_alt requires ${path}.image_url.`)
}

function assertDataSource(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['type', 'url'], path)
  assertNonBlankString(value.type, `${path}.type`)
  assert(value.type === 'github', `${path}.type must be "github".`)
  assertNonBlankString(value.url, `${path}.url`)
  let parsedUrl: URL
  try {
    parsedUrl = new URL(value.url)
  } catch {
    throw new Error(`${path}.url must be a valid URL.`)
  }
  const hostname = parsedUrl.hostname.toLowerCase()
  assert(hostname === 'github.com' || hostname === 'www.github.com', `${path}.url must point to github.com.`)
}

function assertOptionalUrlString(value: unknown, path: string): void {
  assertOptionalString(value, path)
  if (typeof value === 'string') {
    try {
      new URL(value)
    } catch {
      throw new Error(`${path} must be a valid URL.`)
    }
  }
}

function assertNavigationContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['brand_title', 'home_label', 'presentations_label', 'latest_presentation_label', 'docs_enabled', 'toggle_label'], path)
  assertOptionalString(value.brand_title, `${path}.brand_title`)
  assertOptionalString(value.home_label, `${path}.home_label`)
  assertOptionalString(value.presentations_label, `${path}.presentations_label`)
  assertOptionalString(value.latest_presentation_label, `${path}.latest_presentation_label`)
  if (value.docs_enabled !== undefined) {
    assertBoolean(value.docs_enabled, `${path}.docs_enabled`)
  }
  assertOptionalString(value.toggle_label, `${path}.toggle_label`)
}

function assertAppFooterContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['repository_label', 'repository_url'], path)
  assertOptionalString(value.repository_label, `${path}.repository_label`)
  assertOptionalString(value.repository_url, `${path}.repository_url`)
  assert(
    (value.repository_label === undefined && value.repository_url === undefined)
      || (value.repository_label !== undefined && value.repository_url !== undefined),
    `${path} must provide both repository_label and repository_url together.`,
  )
}

function assertAttributionContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['enabled', 'label', 'url'], path)
  if (value.enabled !== undefined) {
    assertBoolean(value.enabled, `${path}.enabled`)
  }
  assertOptionalString(value.label, `${path}.label`)
  assertOptionalString(value.url, `${path}.url`)
  assert(
    (value.label === undefined && value.url === undefined)
      || (value.label !== undefined && value.url !== undefined),
    `${path} must provide both label and url together.`,
  )
}

function assertPresentationChromeContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['mark_label'], path)
  assertOptionalString(value.mark_label, `${path}.mark_label`)
}

function assertPresentationToolbarContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(
    value,
    [
      'navigation_label',
      'previous_slide_label',
      'next_slide_label',
      'presentation_mode_label',
      'shortcut_help_title',
      'shortcut_help_body',
      'shortcut_help_dismiss_label',
    ],
    path,
  )
  assertOptionalString(value.navigation_label, `${path}.navigation_label`)
  assertOptionalString(value.previous_slide_label, `${path}.previous_slide_label`)
  assertOptionalString(value.next_slide_label, `${path}.next_slide_label`)
  assertOptionalString(value.presentation_mode_label, `${path}.presentation_mode_label`)
  assertOptionalString(value.shortcut_help_title, `${path}.shortcut_help_title`)
  assertOptionalString(value.shortcut_help_body, `${path}.shortcut_help_body`)
  assertOptionalString(value.shortcut_help_dismiss_label, `${path}.shortcut_help_dismiss_label`)
}

function assertHomeHeroContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['title_primary', 'title_accent', 'subtitle'], path)
  assertOptionalString(value.title_primary, `${path}.title_primary`)
  assertOptionalString(value.title_accent, `${path}.title_accent`)
  assertOptionalString(value.subtitle, `${path}.subtitle`)
}

function assertPresentationsPageContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(
    value,
    [
      'title',
      'search_label',
      'search_placeholder',
      'year_label',
      'all_years_label',
      'open_presentation_label',
      'empty_title',
      'empty_message',
      'previous_page_label',
      'next_page_label',
      'page_label',
      'page_of_label',
      'showing_label',
      'total_label',
      'presentation_singular_label',
      'presentation_plural_label',
    ],
    path,
  )
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
  assertNoUnexpectedKeys(value, ['label', 'current', 'previous', 'delta', 'metadata'], path)
  assertNonBlankString(value.label, `${path}.label`)
  assertNumber(value.current, `${path}.current`)
  assertNumber(value.previous, `${path}.previous`)
  assertNumber(value.delta, `${path}.delta`)
  assert(isRecord(value.metadata), `${path}.metadata must be an object.`)
  assertNoUnexpectedKeys(value.metadata, ['comparison_status', 'warning_codes'], `${path}.metadata`)
  assertNonBlankString(value.metadata.comparison_status, `${path}.metadata.comparison_status`)
  assert(
    ['complete', 'partial', 'skipped', 'unavailable'].includes(value.metadata.comparison_status),
    `${path}.metadata.comparison_status must be one of complete, partial, skipped, or unavailable.`,
  )
  assertStringArray(value.metadata.warning_codes, `${path}.metadata.warning_codes`)
}

function assertReleaseEntry(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['id', 'version', 'published_at', 'url', 'summary_bullets'], path)
  assertNonBlankString(value.id, `${path}.id`)
  assertNonBlankString(value.version, `${path}.version`)
  assertNonBlankString(value.published_at, `${path}.published_at`)
  assertNonBlankString(value.url, `${path}.url`)
  assertStringArray(value.summary_bullets, `${path}.summary_bullets`)
}

function assertContributorEntry(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['login', 'name', 'avatar_url', 'merged_prs', 'first_time'], path)
  assertNonBlankString(value.login, `${path}.login`)
  assertNonBlankString(value.name, `${path}.name`)
  assertNonBlankString(value.avatar_url, `${path}.avatar_url`)
  assertNumber(value.merged_prs, `${path}.merged_prs`)
  assertBoolean(value.first_time, `${path}.first_time`)
}

function assertMergedPullRequestEntry(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['number', 'title', 'merged_at', 'author_login'], path)
  assertNumber(value.number, `${path}.number`)
  assertNonBlankString(value.title, `${path}.title`)
  assertNonBlankString(value.merged_at, `${path}.merged_at`)
  assertNonBlankString(value.author_login, `${path}.author_login`)
}

function validateSlide(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['template', 'enabled', 'title', 'subtitle', 'content'], path)
  assertNonBlankString(value.template, `${path}.template`)
  assert(isSlideTemplateId(value.template), `${path}.template must be a supported template id.`)
  assertBoolean(value.enabled, `${path}.enabled`)
  assertOptionalString(value.title, `${path}.title`)
  assertOptionalString(value.subtitle, `${path}.subtitle`)

  if (value.template === 'agenda') {
    if (value.content !== undefined) {
      assert(isRecord(value.content), `${path}.content must be an object.`)
      assert(
        Object.keys(value.content).length === 0,
        `${path}.content must be omitted or an empty object for agenda slides.`,
      )
    }
  } else {
    assert(isRecord(value.content), `${path}.content must be an object.`)
  }

  validateTemplateSlide(value.template, value, path)
}

export class ContentValidator {
  public validateSiteDocument(document: unknown): asserts document is SiteDocument {
    assert(isRecord(document), 'site.yaml must be an object.')
    assertNoUnexpectedKeys(document, ['schemaVersion', 'site'], 'site.yaml')
    assertSchemaVersion(document.schemaVersion, 'site.yaml.schemaVersion')
    assert(isRecord(document.site), 'site.yaml.site must be an object.')
    const site = document.site
    assertNoUnexpectedKeys(
      site,
      [
        'title',
        'deployment_url',
        'sitemap_enabled',
        'metadata',
        'mascot',
        'data_sources',
        'project_badge',
        'presentation_logo',
        'navigation',
        'app_footer',
        'attribution',
        'presentation_chrome',
        'presentation_toolbar',
        'home_hero',
        'home_intro',
        'home_cta_label',
        'presentations_cta_label',
        'presentations_page',
        'links',
      ],
      'site.yaml.site',
    )
    assertNonBlankString(site.title, 'site.yaml.site.title')
    assertOptionalUrlString(site.deployment_url, 'site.yaml.site.deployment_url')
    if (site.sitemap_enabled !== undefined) {
      assertBoolean(site.sitemap_enabled, 'site.yaml.site.sitemap_enabled')
    }
    if (site.sitemap_enabled === true) {
      assert(site.deployment_url !== undefined, 'site.yaml.site.deployment_url is required when site.yaml.site.sitemap_enabled is true.')
    }
    if (site.metadata !== undefined) assertSiteMetadata(site.metadata, 'site.yaml.site.metadata')
    if (site.data_sources !== undefined) {
      assert(Array.isArray(site.data_sources), 'site.yaml.site.data_sources must be an array.')
      ;(site.data_sources as unknown[]).forEach((source, index) => assertDataSource(source, `site.yaml.site.data_sources[${index}]`))
    }
    assertNonBlankString(site.home_intro, 'site.yaml.site.home_intro')
    assertNonBlankString(site.home_cta_label, 'site.yaml.site.home_cta_label')
    assertNonBlankString(site.presentations_cta_label, 'site.yaml.site.presentations_cta_label')
    if (site.mascot !== undefined) assertMascotContent(site.mascot, 'site.yaml.site.mascot')
    if (site.project_badge !== undefined) assertProjectBadge(site.project_badge, 'site.yaml.site.project_badge')
    if (site.presentation_logo !== undefined) assertPresentationLogo(site.presentation_logo, 'site.yaml.site.presentation_logo')
    if (site.navigation !== undefined) assertNavigationContent(site.navigation, 'site.yaml.site.navigation')
    if (site.app_footer !== undefined) assertAppFooterContent(site.app_footer, 'site.yaml.site.app_footer')
    if (site.attribution !== undefined) assertAttributionContent(site.attribution, 'site.yaml.site.attribution')
    if (site.presentation_chrome !== undefined) {
      assertPresentationChromeContent(site.presentation_chrome, 'site.yaml.site.presentation_chrome')
    }
    if (site.presentation_toolbar !== undefined) {
      assertPresentationToolbarContent(site.presentation_toolbar, 'site.yaml.site.presentation_toolbar')
    }
    if (site.home_hero !== undefined) assertHomeHeroContent(site.home_hero, 'site.yaml.site.home_hero')
    if (site.presentations_page !== undefined) {
      assertPresentationsPageContent(site.presentations_page, 'site.yaml.site.presentations_page')
    }
    assert(isRecord(site.links), 'site.yaml.site.links must be an object.')
    assertLink(site.links.repository, 'site.yaml.site.links.repository')
    assertLink(site.links.docs, 'site.yaml.site.links.docs')
    assertLink(site.links.community, 'site.yaml.site.links.community')
  }

  public validatePresentationIndexDocument(document: unknown): asserts document is PresentationIndexDocument {
    assert(isRecord(document), 'presentations/index.yaml must be an object.')
    assertNoUnexpectedKeys(document, ['schemaVersion', 'presentations'], 'presentations/index.yaml')
    assertSchemaVersion(document.schemaVersion, 'presentations/index.yaml.schemaVersion')
    assert(Array.isArray(document.presentations), 'presentations/index.yaml.presentations must be an array.')
    const ids = new Set<string>()
    const presentationPaths = new Set<string>()
    const generatedPaths = new Set<string>()
    ;(document.presentations as unknown[]).forEach((entry, index) => {
      const path = `presentations/index.yaml.presentations[${index}]`
      assert(isRecord(entry), `${path} must be an object.`)
      assertNoUnexpectedKeys(
        entry,
        ['id', 'year', 'title', 'subtitle', 'summary', 'presentation_path', 'generated_path', 'published', 'featured'],
        path,
      )
      assertNonBlankString(entry.id, `${path}.id`)
      const id = entry.id
      assert(!ids.has(id), `${path}.id must be unique.`)
      ids.add(id)
      assertOptionalNumber(entry.year, `${path}.year`)
      assertNonBlankString(entry.title, `${path}.title`)
      assertNonBlankString(entry.subtitle, `${path}.subtitle`)
      assertNonBlankString(entry.summary, `${path}.summary`)
      assertNonBlankString(entry.presentation_path, `${path}.presentation_path`)
      const presentationPath = entry.presentation_path
      assert(!presentationPaths.has(presentationPath), `${path}.presentation_path must be unique.`)
      presentationPaths.add(presentationPath)
      assertOptionalString(entry.generated_path, `${path}.generated_path`)
      const effectiveGeneratedPath = typeof entry.generated_path === 'string'
        ? entry.generated_path
        : `presentations/${id}/generated.yaml`
      assert(!generatedPaths.has(effectiveGeneratedPath), `${path}.generated_path must be unique.`)
      generatedPaths.add(effectiveGeneratedPath)
      assertBoolean(entry.published, `${path}.published`)
      assertBoolean(entry.featured, `${path}.featured`)
    })
  }

  public validatePresentationDocument(document: unknown): asserts document is PresentationDocument {
    assert(isRecord(document), 'presentation document must be an object.')
    assertNoUnexpectedKeys(document, ['schemaVersion', 'presentation'], 'presentation document')
    assertSchemaVersion(document.schemaVersion, 'presentation document.schemaVersion')
    assert(isRecord(document.presentation), 'presentation document.presentation must be an object.')
    const presentation = document.presentation
    assertNoUnexpectedKeys(presentation, ['id', 'year', 'title', 'subtitle', 'slides'], 'presentation document.presentation')
    assertNonBlankString(presentation.id, 'presentation document.presentation.id')
    assertOptionalNumber(presentation.year, 'presentation document.presentation.year')
    assertNonBlankString(presentation.title, 'presentation document.presentation.title')
    assertNonBlankString(presentation.subtitle, 'presentation document.presentation.subtitle')
    assert(Array.isArray(presentation.slides), 'presentation document.presentation.slides must be an array.')
    ;(presentation.slides as unknown[]).forEach((slide, index) => validateSlide(slide, `presentation document.presentation.slides[${index}]`))
  }

  public validateGeneratedDocument(document: unknown): asserts document is GeneratedDocument {
    assert(isRecord(document), 'generated document must be an object.')
    assertNoUnexpectedKeys(document, ['schemaVersion', 'generated'], 'generated document')
    assertSchemaVersion(document.schemaVersion, 'generated document.schemaVersion')
    assert(isRecord(document.generated), 'generated document.generated must be an object.')
    const generated = document.generated
    assertNoUnexpectedKeys(
      generated,
      ['id', 'period', 'previous_presentation_id', 'stats', 'releases', 'contributors', 'merged_prs'],
      'generated document.generated',
    )
    assertNonBlankString(generated.id, 'generated document.generated.id')
    assert(isRecord(generated.period), 'generated document.generated.period must be an object.')
    assertNoUnexpectedKeys(generated.period, ['start', 'end'], 'generated document.generated.period')
    assertNonBlankString(generated.period.start, 'generated document.generated.period.start')
    assertNonBlankString(generated.period.end, 'generated document.generated.period.end')
    assertOptionalString(generated.previous_presentation_id, 'generated document.generated.previous_presentation_id')
    assert(isRecord(generated.stats), 'generated document.generated.stats must be an object.')
    Object.entries(generated.stats).forEach(([key, value]) => assertMetricValue(value, `generated document.generated.stats.${key}`))
    assert(Array.isArray(generated.releases), 'generated document.generated.releases must be an array.')
    ;(generated.releases as unknown[]).forEach((release, index) =>
      assertReleaseEntry(release, `generated document.generated.releases[${index}]`))
    assert(isRecord(generated.contributors), 'generated document.generated.contributors must be an object.')
    assertNoUnexpectedKeys(generated.contributors, ['total', 'authors'], 'generated document.generated.contributors')
    assertNumber(generated.contributors.total, 'generated document.generated.contributors.total')
    assert(Array.isArray(generated.contributors.authors), 'generated document.generated.contributors.authors must be an array.')
    ;(generated.contributors.authors as unknown[]).forEach((author, index) =>
      assertContributorEntry(author, `generated document.generated.contributors.authors[${index}]`))
    if (generated.merged_prs !== undefined) {
      assert(Array.isArray(generated.merged_prs), 'generated document.generated.merged_prs must be an array.')
      ;(generated.merged_prs as unknown[]).forEach((pullRequest, index) =>
        assertMergedPullRequestEntry(pullRequest, `generated document.generated.merged_prs[${index}]`))
    }
  }

  public validatePresentationRecordConsistency(indexEntry: PresentationIndexEntry, presentation: Record<string, unknown>, generated: GeneratedPresentationData): void {
    assert(
      indexEntry.id === presentation.id,
      `Presentation id mismatch between index "${indexEntry.id}" and presentation "${String(presentation.id)}".`,
    )
    assert(
      indexEntry.id === generated.id,
      `Presentation id mismatch between index "${indexEntry.id}" and generated "${generated.id}".`,
    )
  }
}
