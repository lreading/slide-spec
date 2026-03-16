import type { PresentationContent, PresentationSlide } from '../types/content'

export const getSlideLabel = (
  slide: PresentationSlide,
  presentation: PresentationContent,
): string | undefined => {
  if (slide.title) {
    return slide.title
  }

  if (slide.template === 'closing') {
    return slide.content.heading
  }

  if (slide.template === 'progress-timeline') {
    if (presentation.roadmap?.agenda_label) {
      return presentation.roadmap.agenda_label
    }
  }

  return undefined
}
