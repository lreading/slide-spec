import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import FaIcon from './FaIcon.vue'

describe('FaIcon', () => {
  it('normalizes supported icon classes', () => {
    const wrapper = mount(FaIcon, {
      props: {
        faIcon: 'fa-github',
      },
    })

    expect(wrapper.classes()).toContain('fa-brands')
    expect(wrapper.classes()).toContain('fa-github')
  })

  it('falls back when an unchecked icon value reaches rendering', () => {
    const wrapper = mount(FaIcon, {
      props: {
        faIcon: 'fa-nope',
      },
    })

    expect(wrapper.classes()).toContain('fa-solid')
    expect(wrapper.classes()).toContain('fa-star')
  })
})
