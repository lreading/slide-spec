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

export interface SlideTemplateSource {
  template?: SlideTemplateId
  kind?: SlideKind
}

export const resolveSlideTemplateId = (
  slide: PresentationSlide | SlideTemplateSource,
): SlideTemplateId => {
  if (slide.template) {
    return slide.template
  }

  if (slide.kind) {
    return getLegacyTemplateIdForSlideKind(slide.kind)
  }

  throw new Error('Slide is missing both template and legacy kind.')
}
