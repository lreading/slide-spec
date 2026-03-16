import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import SectionHeading from './SectionHeading.vue'

describe('SectionHeading', () => {
  it('renders the heading title and icon', () => {
    const wrapper = mount(SectionHeading, {
      props: {
        title: 'Community Activity',
        icon: 'bullhorn',
      },
    })

    expect(wrapper.text()).toContain('Community Activity')
    expect(wrapper.find('.section-heading__icon').exists()).toBe(true)
  })
})
