import type { PresentationContent, PresentationSlide } from '../types/content'

export const getSlideLabel = (
  slide: PresentationSlide,
  presentation: PresentationContent,
): string | undefined => {
  if (slide.title) {
    return slide.title
  }

  if (slide.kind === 'thank-you') {
    return slide.heading
  }

  if (slide.kind === 'roadmap') {
    if (presentation.roadmap?.agenda_label) {
      return presentation.roadmap.agenda_label
    }
  }

  return undefined
}
