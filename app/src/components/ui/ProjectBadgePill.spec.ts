import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ProjectBadgePill from './ProjectBadgePill.vue'

describe('ProjectBadgePill', () => {
  it('renders badge icon before the label by default', () => {
    const wrapper = mount(ProjectBadgePill, {
      props: {
        badge: {
          label: 'OWASP Lab Project',
          iconClass: 'fa-solid fa-flask',
          iconPosition: 'before',
        },
      },
    })

    expect(wrapper.text()).toContain('OWASP Lab Project')
    expect(wrapper.find('.project-badge-pill__icon').classes()).toContain('fa-flask')
  })

  it('renders icon after the label when configured', () => {
    const wrapper = mount(ProjectBadgePill, {
      props: {
        badge: {
          label: 'Badge Text',
          iconClass: 'fa-solid fa-star',
          iconPosition: 'after',
        },
      },
    })

    expect(wrapper.find('.project-badge-pill__icon--after').exists()).toBe(true)
  })
})
