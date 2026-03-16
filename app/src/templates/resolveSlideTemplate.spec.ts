import { describe, expect, it } from 'vitest'

import { resolveSlideTemplateId } from './resolveSlideTemplate'

describe('resolveSlideTemplateId', () => {
  it('prefers the authored template id when present', () => {
    expect(
      resolveSlideTemplateId({
        kind: 'title',
        template: 'hero',
        enabled: true,
        title_primary: 'Threat Dragon',
      }),
    ).toBe('hero')
  })

  it('falls back to the legacy kind mapping when template is absent', () => {
    expect(
      resolveSlideTemplateId({
        kind: 'community-highlights',
        enabled: true,
        title: 'Community Highlights',
        stat_keys: [],
        mentions: [],
      }),
    ).toBe('metrics-and-links')
  })
})
