import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ContentList from './ContentList.vue'

describe('ContentList', () => {
  it('renders icon lists', () => {
    const wrapper = mount(ContentList, {
      props: {
        items: ['First', 'Second'],
        marker: 'icon',
        faIcon: 'fa-chevron-right',
      },
    })

    expect(wrapper.findAll('.content-list__item')).toHaveLength(2)
    expect(wrapper.find('.content-list__icon').exists()).toBe(true)
  })

  it('renders bullet lists', () => {
    const wrapper = mount(ContentList, {
      props: {
        items: ['One'],
        marker: 'bullet',
      },
    })

    expect(wrapper.find('.content-list__item--bullet').exists()).toBe(true)
  })
})
