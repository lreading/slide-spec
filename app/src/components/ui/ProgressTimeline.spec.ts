import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ProgressTimeline from './ProgressTimeline.vue'

describe('ProgressTimeline', () => {
  it('renders timeline items with their states', () => {
    const wrapper = mount(ProgressTimeline, {
      props: {
        items: [
          { key: '1', title: 'Completed', summary: 'Done', state: 'viewed' },
          { key: '2', title: 'Current', summary: 'Active', state: 'current' },
          { key: '3', title: 'Future', summary: 'Later', state: 'upcoming' },
        ],
      },
    })

    expect(wrapper.findAll('.progress-timeline__item')).toHaveLength(3)
    expect(wrapper.findAll('.progress-timeline__item--current')).toHaveLength(1)
    expect(wrapper.text()).toContain('Completed')
    expect(wrapper.text()).toContain('Later')
  })

  it('renders lightweight rich text summaries', () => {
    const wrapper = mount(ProgressTimeline, {
      props: {
        items: [
          {
            key: '1',
            title: 'Current',
            summary: 'Active now.\n\n- One focus\n- Second focus',
            state: 'current',
          },
        ],
      },
    })

    expect(wrapper.find('.progress-timeline__summary .rich-text__paragraph').text()).toBe('Active now.')
    expect(wrapper.findAll('.progress-timeline__summary .rich-text__list--unordered .rich-text__item')).toHaveLength(2)
  })
})
