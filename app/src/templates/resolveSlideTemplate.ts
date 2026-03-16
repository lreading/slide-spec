import type { PresentationSlide, SlideKind } from '../types/content'

import type { SlideTemplateId } from './templateIds'

const legacySlideKindTemplateMap: Record<SlideKind, SlideTemplateId> = {
  title: 'hero',
  agenda: 'agenda',
  'recent-updates': 'section-list-grid',
  releases: 'timeline',
  roadmap: 'progress-timeline',
  'contributor-spotlight': 'people',
  'community-highlights': 'metrics-and-links',
  'how-to-contribute': 'action-cards',
  'thank-you': 'closing',
}

export const getLegacyTemplateIdForSlideKind = (kind: SlideKind): SlideTemplateId =>
  legacySlideKindTemplateMap[kind]

export const resolveSlideTemplateId = (slide: PresentationSlide): SlideTemplateId =>
  slide.template ?? getLegacyTemplateIdForSlideKind(slide.kind)
