import type { PresentationSlide } from '../types/content'

import type { SlideTemplateId } from './templateIds'

export const resolveSlideTemplateId = (
  slide: PresentationSlide,
): SlideTemplateId => {
  return slide.template
}
