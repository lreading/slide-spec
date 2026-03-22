export const slideTemplateIds = [
  'hero',
  'agenda',
  'section-list-grid',
  'timeline',
  'progress-timeline',
  'people',
  'metrics-and-links',
  'action-cards',
  'closing',
] as const

export type SlideTemplateId = (typeof slideTemplateIds)[number]

export const isSlideTemplateId = (value: string): value is SlideTemplateId =>
  slideTemplateIds.includes(value as SlideTemplateId)
