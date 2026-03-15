import { describe, expect, it, vi } from 'vitest'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { App } from 'vue'

import { installFontAwesome } from './fontawesome'

describe('installFontAwesome', () => {
  it('registers the FontAwesomeIcon component on the Vue app', () => {
    const component = vi.fn()
    const app = { component } as unknown as App

    installFontAwesome(app)

    expect(component).toHaveBeenCalledWith('FontAwesomeIcon', FontAwesomeIcon)
  })
})
