import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import RichText from './RichText.vue'

describe('RichText', () => {
  it('renders paragraphs and lists from plain text tokens', () => {
    const wrapper = mount(RichText, {
      props: {
        text: 'First paragraph.\n\n- First item\n- Second item\n\n1. Ordered item',
      },
    })

    expect(wrapper.findAll('.rich-text__paragraph')).toHaveLength(1)
    expect(wrapper.findAll('.rich-text__list--unordered .rich-text__item')).toHaveLength(2)
    expect(wrapper.findAll('.rich-text__list--ordered .rich-text__item')).toHaveLength(1)
  })

  it('escapes html-like text through Vue interpolation', () => {
    const wrapper = mount(RichText, {
      props: {
        text: '<strong>Not markup</strong>',
      },
    })

    expect(wrapper.html()).toContain('&lt;strong&gt;Not markup&lt;/strong&gt;')
    expect(wrapper.find('strong').exists()).toBe(false)
  })
})
