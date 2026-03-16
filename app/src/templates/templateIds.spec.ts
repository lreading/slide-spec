import { describe, expect, it } from 'vitest'

import { isSlideTemplateId, slideTemplateIds } from './templateIds'

describe('templateIds', () => {
  it('defines the supported template allow-list', () => {
    expect(slideTemplateIds).toEqual([
      'hero',
      'agenda',
      'section-list-grid',
      'timeline',
      'progress-timeline',
      'people',
      'metrics-and-links',
      'action-cards',
      'closing',
    ])
  })

  it('checks whether a value is a supported template id', () => {
    expect(isSlideTemplateId('hero')).toBe(true)
    expect(isSlideTemplateId('unknown-template')).toBe(false)
  })
})
