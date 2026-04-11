import { describe, expect, it } from 'vitest'

import { isSlideTemplateId, slideTemplateIds } from './templateIds'

describe('slide template ids', () => {
  it('recognizes supported template ids', () => {
    expect(slideTemplateIds).toContain('hero')
    expect(isSlideTemplateId('hero')).toBe(true)
    expect(isSlideTemplateId('unknown')).toBe(false)
  })
})
