import {
  assert,
  assertNoUnexpectedKeys,
  assertNonBlankString,
  assertOptionalBoolean,
  assertOptionalFontAwesomeIcon,
  assertOptionalString,
  assertStringArray,
  isRecord,
} from '../validation/assertions'
import type { SlideTemplateId } from './templateIds'

const minimumRoadmapStageCount = 2
const maximumRoadmapStageCount = 6

function assertRoadmapStageContent(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNonBlankString(value.label, `${path}.label`)
  assertNonBlankString(value.summary, `${path}.summary`)
}

function assertRoadmapStages(value: unknown, activeStage: unknown, path: string): void {
  assert(isRecord(value), `${path}.stages must be an object.`)
  assertNonBlankString(activeStage, `${path}.stage`)
  const activeStageKey = activeStage as string

  const stageEntries = Object.entries(value)
  assert(
    stageEntries.length >= minimumRoadmapStageCount,
    `${path}.stages must include at least ${String(minimumRoadmapStageCount)} stages.`,
  )
  assert(
    stageEntries.length <= maximumRoadmapStageCount,
    `${path}.stages must include no more than ${String(maximumRoadmapStageCount)} stages.`,
  )

  stageEntries.forEach(([key, stage]) => {
    assert(key.trim().length > 0, `${path}.stages keys must not be blank.`)
    assertRoadmapStageContent(stage, `${path}.stages.${key}`)
  })

  assert(
    Object.prototype.hasOwnProperty.call(value, activeStageKey),
    `${path}.stage must match one of the keys in ${path}.stages.`,
  )
}

function assertRoadmapTheme(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNonBlankString(value.category, `${path}.category`)
  assertNonBlankString(value.target, `${path}.target`)
}

function assertRoadmapThemes(value: unknown, path: string): void {
  assert(Array.isArray(value), `${path} must be an array.`)
  ;(value as unknown[]).forEach((theme, index) => {
    assert(isRecord(theme), `${path}[${index}] must be an object.`)
    assertRoadmapTheme(theme, `${path}[${index}]`)
  })
}

type SlideRecord = Record<string, unknown>

export type SlideTemplateValidator = (slide: SlideRecord, path: string) => void

function assertContentSection(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['title', 'bullets', 'fa_icon'], path)
  assertNonBlankString(value.title, `${path}.title`)
  assertStringArray(value.bullets, `${path}.bullets`)
  assertOptionalFontAwesomeIcon(value.fa_icon, `${path}.fa_icon`)
}

function assertSpotlightEntry(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['login', 'summary', 'fa_icon'], path)
  assertNonBlankString(value.login, `${path}.login`)
  assertNonBlankString(value.summary, `${path}.summary`)
  assertOptionalFontAwesomeIcon(value.fa_icon, `${path}.fa_icon`)
}

function assertContributionCard(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['title', 'description', 'url_label', 'url', 'fa_icon', 'link_fa_icon'], path)
  assertNonBlankString(value.title, `${path}.title`)
  assertNonBlankString(value.description, `${path}.description`)
  assertNonBlankString(value.url_label, `${path}.url_label`)
  assertNonBlankString(value.url, `${path}.url`)
  assertOptionalFontAwesomeIcon(value.fa_icon, `${path}.fa_icon`)
  assertOptionalFontAwesomeIcon(value.link_fa_icon, `${path}.link_fa_icon`)
}

function assertImageAndBulletsImage(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNoUnexpectedKeys(value, ['src', 'alt', 'description'], path)
  assertNonBlankString(value.src, `${path}.src`)
  assertOptionalString(value.alt, `${path}.alt`)
  assertOptionalString(value.description, `${path}.description`)
}

function assertOptionalFontAwesomeIconArray(value: unknown, path: string): void {
  if (value === undefined) return

  assert(Array.isArray(value), `${path} must be an array.`)
  ;(value as unknown[]).forEach((icon, index) => assertOptionalFontAwesomeIcon(icon, `${path}[${index}]`))
}

const heroValidator: SlideTemplateValidator = (slide, path) => {
  const content = slide.content as Record<string, unknown>
  assertNoUnexpectedKeys(content, ['title_primary', 'title_accent', 'subtitle_prefix', 'quote'], `${path}.content`)
  assertOptionalString(content.title_primary, `${path}.content.title_primary`)
  assertOptionalString(content.title_accent, `${path}.content.title_accent`)
  assertOptionalString(content.subtitle_prefix, `${path}.content.subtitle_prefix`)
  assertOptionalString(content.quote, `${path}.content.quote`)
  assert(
    content.title_primary !== undefined || content.title_accent !== undefined,
    `${path}.content must include title_primary or title_accent.`,
  )
}

const sectionTitleValidator: SlideTemplateValidator = (slide, path) => {
  const content = slide.content as Record<string, unknown>
  assertNoUnexpectedKeys(content, ['title', 'subtitle', 'image_url', 'image_alt'], `${path}.content`)
  assertNonBlankString(content.title, `${path}.content.title`)
  assertOptionalString(content.subtitle, `${path}.content.subtitle`)
  assertOptionalString(content.image_url, `${path}.content.image_url`)
  assertOptionalString(content.image_alt, `${path}.content.image_alt`)
  assert(
    content.image_url !== undefined || content.image_alt === undefined,
    `${path}.content.image_alt requires ${path}.content.image_url.`,
  )
}

const agendaValidator: SlideTemplateValidator = (slide, path) => {
  assertNonBlankString(slide.title, `${path}.title`)
  if (slide.content !== undefined) {
    const content = slide.content as Record<string, unknown>
    assertNoUnexpectedKeys(content, ['card_arrow_fa_icon'], `${path}.content`)
    assertOptionalFontAwesomeIcon(content.card_arrow_fa_icon, `${path}.content.card_arrow_fa_icon`)
  }
}

const sectionListGridValidator: SlideTemplateValidator = (slide, path) => {
  assertNonBlankString(slide.title, `${path}.title`)
  const content = slide.content as Record<string, unknown>
  assertNoUnexpectedKeys(content, ['sections'], `${path}.content`)
  assert(Array.isArray(content.sections), `${path}.content.sections must be an array.`)
  ;(content.sections as unknown[]).forEach((section, index) =>
    assertContentSection(section, `${path}.content.sections[${index}]`))
}

const timelineValidator: SlideTemplateValidator = (slide, path) => {
  assertNonBlankString(slide.title, `${path}.title`)
  const content = slide.content as Record<string, unknown>
  assertNoUnexpectedKeys(
    content,
    [
      'latest_badge_label',
      'footer_link_label',
      'empty_state_title',
      'empty_state_message',
      'featured_release_ids',
      'latest_release_fa_icon',
      'release_fa_icon',
      'footer_link_fa_icon',
    ],
    `${path}.content`,
  )
  assertOptionalString(content.latest_badge_label, `${path}.content.latest_badge_label`)
  assertOptionalString(content.footer_link_label, `${path}.content.footer_link_label`)
  assertOptionalString(content.empty_state_title, `${path}.content.empty_state_title`)
  assertOptionalString(content.empty_state_message, `${path}.content.empty_state_message`)
  assertStringArray(content.featured_release_ids, `${path}.content.featured_release_ids`)
  assertOptionalFontAwesomeIcon(content.latest_release_fa_icon, `${path}.content.latest_release_fa_icon`)
  assertOptionalFontAwesomeIcon(content.release_fa_icon, `${path}.content.release_fa_icon`)
  assertOptionalFontAwesomeIcon(content.footer_link_fa_icon, `${path}.content.footer_link_fa_icon`)
}

const progressTimelineValidator: SlideTemplateValidator = (slide, path) => {
  assertNonBlankString(slide.title, `${path}.title`)
  const content = slide.content as Record<string, unknown>
  assertNoUnexpectedKeys(
    content,
    [
      'stage',
      'deliverables_heading',
      'focus_areas_heading',
      'footer_link_label',
      'stages',
      'items',
      'themes',
      'item_fa_icon',
      'focus_areas_fa_icon',
      'theme_fa_icon',
      'footer_link_fa_icon',
    ],
    `${path}.content`,
  )
  assertOptionalString(content.deliverables_heading, `${path}.content.deliverables_heading`)
  assertOptionalString(content.focus_areas_heading, `${path}.content.focus_areas_heading`)
  assertOptionalString(content.footer_link_label, `${path}.content.footer_link_label`)
  assertOptionalFontAwesomeIcon(content.item_fa_icon, `${path}.content.item_fa_icon`)
  assertOptionalFontAwesomeIcon(content.focus_areas_fa_icon, `${path}.content.focus_areas_fa_icon`)
  assertOptionalFontAwesomeIcon(content.theme_fa_icon, `${path}.content.theme_fa_icon`)
  assertOptionalFontAwesomeIcon(content.footer_link_fa_icon, `${path}.content.footer_link_fa_icon`)
  assertRoadmapStages(content.stages, content.stage, `${path}.content`)
  assertStringArray(content.items, `${path}.content.items`)
  assertRoadmapThemes(content.themes, `${path}.content.themes`)
}

const peopleValidator: SlideTemplateValidator = (slide, path) => {
  assertNonBlankString(slide.title, `${path}.title`)
  const content = slide.content as Record<string, unknown>
  assertNoUnexpectedKeys(
    content,
    [
      'banner_prefix',
      'contributors_link_label',
      'banner_suffix',
      'spotlight',
      'github_fa_icon',
      'quote_fa_icon',
      'banner_fa_icon',
    ],
    `${path}.content`,
  )
  assertOptionalString(content.banner_prefix, `${path}.content.banner_prefix`)
  assertOptionalString(content.contributors_link_label, `${path}.content.contributors_link_label`)
  assertOptionalString(content.banner_suffix, `${path}.content.banner_suffix`)
  assertOptionalFontAwesomeIcon(content.github_fa_icon, `${path}.content.github_fa_icon`)
  assertOptionalFontAwesomeIcon(content.quote_fa_icon, `${path}.content.quote_fa_icon`)
  assertOptionalFontAwesomeIcon(content.banner_fa_icon, `${path}.content.banner_fa_icon`)
  assert(Array.isArray(content.spotlight), `${path}.content.spotlight must be an array.`)
  ;(content.spotlight as unknown[]).forEach((entry, index) =>
    assertSpotlightEntry(entry, `${path}.content.spotlight[${index}]`))
}

const metricsAndLinksValidator: SlideTemplateValidator = (slide, path) => {
  assertNonBlankString(slide.title, `${path}.title`)
  const content = slide.content as Record<string, unknown>
  assertNoUnexpectedKeys(
    content,
    [
      'section_heading',
      'stats_heading',
      'show_deltas',
      'trend_suffix',
      'stat_keys',
      'mentions',
      'section_heading_fa_icon',
      'stats_heading_fa_icon',
      'stat_fa_icons',
      'trend_up_fa_icon',
      'trend_down_fa_icon',
    ],
    `${path}.content`,
  )
  assertOptionalString(content.section_heading, `${path}.content.section_heading`)
  assertOptionalString(content.stats_heading, `${path}.content.stats_heading`)
  assertOptionalBoolean(content.show_deltas, `${path}.content.show_deltas`)
  assertOptionalString(content.trend_suffix, `${path}.content.trend_suffix`)
  assertOptionalFontAwesomeIcon(content.section_heading_fa_icon, `${path}.content.section_heading_fa_icon`)
  assertOptionalFontAwesomeIcon(content.stats_heading_fa_icon, `${path}.content.stats_heading_fa_icon`)
  assertOptionalFontAwesomeIconArray(content.stat_fa_icons, `${path}.content.stat_fa_icons`)
  assertOptionalFontAwesomeIcon(content.trend_up_fa_icon, `${path}.content.trend_up_fa_icon`)
  assertOptionalFontAwesomeIcon(content.trend_down_fa_icon, `${path}.content.trend_down_fa_icon`)
  assertStringArray(content.stat_keys, `${path}.content.stat_keys`)
  assert(Array.isArray(content.mentions), `${path}.content.mentions must be an array.`)
  ;(content.mentions as unknown[]).forEach((mention, index) => {
    const mentionPath = `${path}.content.mentions[${index}]`
    assert(isRecord(mention), `${mentionPath} must be an object.`)
    assertNoUnexpectedKeys(mention, ['type', 'title', 'url_label', 'url', 'fa_icon', 'link_fa_icon'], mentionPath)
    assertNonBlankString(mention.type, `${mentionPath}.type`)
    assertNonBlankString(mention.title, `${mentionPath}.title`)
    assertOptionalString(mention.url_label, `${mentionPath}.url_label`)
    assertOptionalString(mention.url, `${mentionPath}.url`)
    assertOptionalFontAwesomeIcon(mention.fa_icon, `${mentionPath}.fa_icon`)
    assertOptionalFontAwesomeIcon(mention.link_fa_icon, `${mentionPath}.link_fa_icon`)
    assert(
      (mention.url === undefined && mention.url_label === undefined)
        || (mention.url !== undefined && mention.url_label !== undefined),
      `${mentionPath} must provide url and url_label together.`,
    )
  })
}

const actionCardsValidator: SlideTemplateValidator = (slide, path) => {
  assertNonBlankString(slide.title, `${path}.title`)
  const content = slide.content as Record<string, unknown>
  assertNoUnexpectedKeys(content, ['footer_text', 'cards', 'footer_fa_icon', 'footer_link_fa_icon'], `${path}.content`)
  assertOptionalString(content.footer_text, `${path}.content.footer_text`)
  assertOptionalFontAwesomeIcon(content.footer_fa_icon, `${path}.content.footer_fa_icon`)
  assertOptionalFontAwesomeIcon(content.footer_link_fa_icon, `${path}.content.footer_link_fa_icon`)
  assert(Array.isArray(content.cards), `${path}.content.cards must be an array.`)
  ;(content.cards as unknown[]).forEach((card, index) =>
    assertContributionCard(card, `${path}.content.cards[${index}]`))
}

const imageAndBulletsValidator: SlideTemplateValidator = (slide, path) => {
  assertNonBlankString(slide.title, `${path}.title`)
  const content = slide.content as Record<string, unknown>
  assertNoUnexpectedKeys(content, ['image_side', 'image', 'bullets'], `${path}.content`)
  assertOptionalString(content.image_side, `${path}.content.image_side`)
  assert(
    content.image_side === undefined || content.image_side === 'left' || content.image_side === 'right',
    `${path}.content.image_side must be left or right.`,
  )
  if (content.image !== undefined) {
    assertImageAndBulletsImage(content.image, `${path}.content.image`)
  }
  if (content.bullets !== undefined) {
    assertStringArray(content.bullets, `${path}.content.bullets`)
    assert(content.bullets.length > 0, `${path}.content.bullets must include at least one item.`)
  }
  assert(
    content.image !== undefined || content.bullets !== undefined,
    `${path}.content must include image or bullets.`,
  )
}

const closingValidator: SlideTemplateValidator = (slide, path) => {
  const content = slide.content as Record<string, unknown>
  assertNoUnexpectedKeys(
    content,
    ['heading', 'message', 'quote', 'repository_fa_icon', 'docs_fa_icon', 'community_fa_icon'],
    `${path}.content`,
  )
  assertNonBlankString(content.heading, `${path}.content.heading`)
  assertNonBlankString(content.message, `${path}.content.message`)
  assertOptionalString(content.quote, `${path}.content.quote`)
  assertOptionalFontAwesomeIcon(content.repository_fa_icon, `${path}.content.repository_fa_icon`)
  assertOptionalFontAwesomeIcon(content.docs_fa_icon, `${path}.content.docs_fa_icon`)
  assertOptionalFontAwesomeIcon(content.community_fa_icon, `${path}.content.community_fa_icon`)
}

export const slideTemplateValidators: Record<SlideTemplateId, SlideTemplateValidator> = {
  hero: heroValidator,
  'section-title': sectionTitleValidator,
  agenda: agendaValidator,
  'section-list-grid': sectionListGridValidator,
  timeline: timelineValidator,
  'progress-timeline': progressTimelineValidator,
  people: peopleValidator,
  'metrics-and-links': metricsAndLinksValidator,
  'image-and-bullets': imageAndBulletsValidator,
  'action-cards': actionCardsValidator,
  closing: closingValidator,
}

export const validateTemplateSlide = (
  templateId: SlideTemplateId,
  slide: SlideRecord,
  path: string,
): void => {
  slideTemplateValidators[templateId](slide, path)
}
