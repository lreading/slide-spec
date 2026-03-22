import {
  assert,
  assertNonBlankString,
  assertOptionalBoolean,
  assertOptionalString,
  assertStringArray,
  isRecord,
} from '../validation/assertions'
import type { SlideTemplateId } from './templateIds'

const roadmapStageStatuses = new Set(['completed', 'in-progress', 'planned', 'future'])

type SlideRecord = Record<string, unknown>

export type SlideTemplateValidator = (slide: SlideRecord, path: string) => void

function assertContentSection(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNonBlankString(value.title, `${path}.title`)
  assertStringArray(value.bullets, `${path}.bullets`)
}

function assertSpotlightEntry(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNonBlankString(value.login, `${path}.login`)
  assertNonBlankString(value.summary, `${path}.summary`)
}

function assertContributionCard(value: unknown, path: string): void {
  assert(isRecord(value), `${path} must be an object.`)
  assertNonBlankString(value.title, `${path}.title`)
  assertNonBlankString(value.description, `${path}.description`)
  assertNonBlankString(value.url_label, `${path}.url_label`)
  assertNonBlankString(value.url, `${path}.url`)
}

const heroValidator: SlideTemplateValidator = (slide, path) => {
  const content = slide.content as Record<string, unknown>
  assertOptionalString(content.title_primary, `${path}.content.title_primary`)
  assertOptionalString(content.title_accent, `${path}.content.title_accent`)
  assertOptionalString(content.subtitle_prefix, `${path}.content.subtitle_prefix`)
  assertOptionalString(content.quote, `${path}.content.quote`)
  assert(
    content.title_primary !== undefined || content.title_accent !== undefined,
    `${path}.content must include title_primary or title_accent.`,
  )
}

const agendaValidator: SlideTemplateValidator = (slide, path) => {
  assertNonBlankString(slide.title, `${path}.title`)
}

const sectionListGridValidator: SlideTemplateValidator = (slide, path) => {
  assertNonBlankString(slide.title, `${path}.title`)
  const content = slide.content as Record<string, unknown>
  assert(Array.isArray(content.sections), `${path}.content.sections must be an array.`)
  ;(content.sections as unknown[]).forEach((section, index) =>
    assertContentSection(section, `${path}.content.sections[${index}]`))
}

const timelineValidator: SlideTemplateValidator = (slide, path) => {
  assertNonBlankString(slide.title, `${path}.title`)
  const content = slide.content as Record<string, unknown>
  assertOptionalString(content.latest_badge_label, `${path}.content.latest_badge_label`)
  assertOptionalString(content.footer_link_label, `${path}.content.footer_link_label`)
  assertOptionalString(content.empty_state_title, `${path}.content.empty_state_title`)
  assertOptionalString(content.empty_state_message, `${path}.content.empty_state_message`)
  assertStringArray(content.featured_release_ids, `${path}.content.featured_release_ids`)
}

const progressTimelineValidator: SlideTemplateValidator = (slide, path) => {
  assertNonBlankString(slide.title, `${path}.title`)
  const content = slide.content as Record<string, unknown>
  assertNonBlankString(content.stage, `${path}.content.stage`)
  assert(
    roadmapStageStatuses.has(content.stage),
    `${path}.content.stage must be one of completed, in-progress, planned, or future.`,
  )
}

const peopleValidator: SlideTemplateValidator = (slide, path) => {
  assertNonBlankString(slide.title, `${path}.title`)
  const content = slide.content as Record<string, unknown>
  assertOptionalString(content.banner_prefix, `${path}.content.banner_prefix`)
  assertOptionalString(content.contributors_link_label, `${path}.content.contributors_link_label`)
  assertOptionalString(content.banner_suffix, `${path}.content.banner_suffix`)
  assert(Array.isArray(content.spotlight), `${path}.content.spotlight must be an array.`)
  ;(content.spotlight as unknown[]).forEach((entry, index) =>
    assertSpotlightEntry(entry, `${path}.content.spotlight[${index}]`))
}

const metricsAndLinksValidator: SlideTemplateValidator = (slide, path) => {
  assertNonBlankString(slide.title, `${path}.title`)
  const content = slide.content as Record<string, unknown>
  assertOptionalString(content.section_heading, `${path}.content.section_heading`)
  assertOptionalString(content.stats_heading, `${path}.content.stats_heading`)
  assertOptionalBoolean(content.show_deltas, `${path}.content.show_deltas`)
  assertOptionalString(content.trend_suffix, `${path}.content.trend_suffix`)
  assertStringArray(content.stat_keys, `${path}.content.stat_keys`)
  assert(Array.isArray(content.mentions), `${path}.content.mentions must be an array.`)
  ;(content.mentions as unknown[]).forEach((mention, index) => {
    const mentionPath = `${path}.content.mentions[${index}]`
    assert(isRecord(mention), `${mentionPath} must be an object.`)
    assertNonBlankString(mention.type, `${mentionPath}.type`)
    assertNonBlankString(mention.title, `${mentionPath}.title`)
    assertOptionalString(mention.url_label, `${mentionPath}.url_label`)
    assertOptionalString(mention.url, `${mentionPath}.url`)
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
  assertOptionalString(content.footer_text, `${path}.content.footer_text`)
  assert(Array.isArray(content.cards), `${path}.content.cards must be an array.`)
  ;(content.cards as unknown[]).forEach((card, index) =>
    assertContributionCard(card, `${path}.content.cards[${index}]`))
}

const closingValidator: SlideTemplateValidator = (slide, path) => {
  const content = slide.content as Record<string, unknown>
  assertNonBlankString(content.heading, `${path}.content.heading`)
  assertNonBlankString(content.message, `${path}.content.message`)
  assertOptionalString(content.quote, `${path}.content.quote`)
}

export const slideTemplateValidators: Record<SlideTemplateId, SlideTemplateValidator> = {
  hero: heroValidator,
  agenda: agendaValidator,
  'section-list-grid': sectionListGridValidator,
  timeline: timelineValidator,
  'progress-timeline': progressTimelineValidator,
  people: peopleValidator,
  'metrics-and-links': metricsAndLinksValidator,
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
