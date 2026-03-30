import type { PresentationSlide } from '../types/content'

export const getSlideLabel = (slide: PresentationSlide): string | undefined => {
  if (slide.title) {
    return slide.title
  }

  if (slide.template === 'closing') {
    return slide.content.heading
  }

  return undefined
}
