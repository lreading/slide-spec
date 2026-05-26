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

  it('uses visible block spacing between paragraphs and unordered lists', () => {
    const wrapper = mount(RichText, {
      props: {
        text: 'Intro paragraph.\n\n- First action\n- Second action',
      },
    })

    expect(wrapper.find('.rich-text__paragraph + .rich-text__list--unordered').exists()).toBe(true)
  })

  it('renders extra blank lines as spacer elements between blocks', () => {
    const wrapper = mount(RichText, {
      props: {
        text: 'Intro paragraph.\n\n\n\n- First action\n- Second action',
      },
    })

    const spacer = wrapper.find('.rich-text__spacer')

    expect(spacer.exists()).toBe(true)
    expect(spacer.attributes('style')).toContain('--rich-text-spacer-lines: 2;')
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
