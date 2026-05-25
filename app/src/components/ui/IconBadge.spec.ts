import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import IconBadge from './IconBadge.vue'

describe('IconBadge', () => {
  it('renders a circular icon badge with defaults', () => {
    const wrapper = mount(IconBadge, {
      props: {
        faIcon: 'fa-star',
      },
    })

    expect(wrapper.classes()).toContain('icon-badge--circle')
    expect(wrapper.attributes('style')).toContain('--icon-badge-size: 60px')
  })

  it('supports rounded badges and custom visual values', () => {
    const wrapper = mount(IconBadge, {
      props: {
        faIcon: 'fa-github',
        shape: 'rounded',
        size: '100px',
        iconSize: '40px',
        background: '#1e1e2e',
      },
    })

    expect(wrapper.classes()).toContain('icon-badge--rounded')
    expect(wrapper.attributes('style')).toContain('--icon-badge-size: 100px')
    expect(wrapper.attributes('style')).toContain('--icon-badge-icon-size: 40px')
    expect(wrapper.attributes('style')).toContain('--icon-badge-background: #1e1e2e')
  })
})
