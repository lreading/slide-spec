import { describe, expect, it } from 'vitest'

import { resolveSlideTemplateId } from './resolveSlideTemplate'

describe('resolveSlideTemplateId', () => {
  it('returns the authored template id', () => {
    expect(
      resolveSlideTemplateId({
        template: 'hero',
        enabled: true,
        content: {
          title_primary: 'Aurora Notes',
        },
      }),
    ).toBe('hero')
  })
})
