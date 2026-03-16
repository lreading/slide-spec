import { describe, expect, it } from 'vitest'

import { resolveSlideTemplateId } from './resolveSlideTemplate'

describe('resolveSlideTemplateId', () => {
  it('prefers the authored template id when present', () => {
    expect(
      resolveSlideTemplateId({
        kind: 'title',
        template: 'hero',
      }),
    ).toBe('hero')
  })

  it('falls back to the legacy kind mapping when template is absent', () => {
    expect(
      resolveSlideTemplateId({
        kind: 'community-highlights',
      }),
    ).toBe('metrics-and-links')
  })

  it('throws when neither template nor kind is provided', () => {
    expect(() => resolveSlideTemplateId({})).toThrow(
      'Slide is missing both template and legacy kind.',
    )
  })
})
