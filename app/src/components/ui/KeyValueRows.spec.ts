import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import KeyValueRows from './KeyValueRows.vue'

describe('KeyValueRows', () => {
  it('renders key/value rows', () => {
    const wrapper = mount(KeyValueRows, {
      props: {
        rows: [
          { key: 'Category', value: 'Value' },
          { key: 'Another', value: 'More' },
        ],
      },
    })

    expect(wrapper.findAll('.key-value-rows__key')).toHaveLength(2)
    expect(wrapper.text()).toContain('Category')
    expect(wrapper.text()).toContain('More')
  })

  it('renders lightweight rich text values', () => {
    const wrapper = mount(KeyValueRows, {
      props: {
        rows: [
          {
            key: 'Category',
            value: 'First paragraph.\n\n1. First step\n2. Second step',
          },
        ],
      },
    })

    expect(wrapper.find('.rich-text__paragraph').text()).toBe('First paragraph.')
    expect(wrapper.findAll('.rich-text__list--ordered .rich-text__item')).toHaveLength(2)
  })
})
