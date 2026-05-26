import { describe, expect, it } from 'vitest'

import { parseRichTextBlocks } from './rich-text'

describe('parseRichTextBlocks', () => {
  it('keeps a one-line string as one paragraph', () => {
    expect(parseRichTextBlocks('One line of body copy.')).toEqual([
      {
        type: 'paragraph',
        text: 'One line of body copy.',
      },
    ])
  })

  it('splits blank-line-separated text into paragraphs', () => {
    expect(parseRichTextBlocks('First paragraph.\r\n\r\nSecond paragraph.')).toEqual([
      {
        type: 'paragraph',
        text: 'First paragraph.',
      },
      {
        type: 'paragraph',
        text: 'Second paragraph.',
      },
    ])
  })

  it('renders wrapped paragraph lines as a single paragraph token', () => {
    expect(parseRichTextBlocks('A wrapped paragraph\ncontinues on the next line.')).toEqual([
      {
        type: 'paragraph',
        text: 'A wrapped paragraph continues on the next line.',
      },
    ])
  })

  it('parses unordered list blocks that use dash or star markers', () => {
    expect(parseRichTextBlocks('- First item\n- Second item\n* Third item')).toEqual([
      {
        type: 'unordered-list',
        items: ['First item', 'Second item', 'Third item'],
      },
    ])
  })

  it('parses ordered list blocks that use period or parenthesis markers', () => {
    expect(parseRichTextBlocks('1. First item\n2) Second item')).toEqual([
      {
        type: 'ordered-list',
        items: ['First item', 'Second item'],
      },
    ])
  })

  it('falls back to paragraph text for mixed block structures', () => {
    expect(parseRichTextBlocks('- First item\nA continuation line')).toEqual([
      {
        type: 'paragraph',
        text: '- First item A continuation line',
      },
    ])
  })

  it('preserves raw text rather than interpreting html', () => {
    expect(parseRichTextBlocks('<strong>Safe text</strong>')).toEqual([
      {
        type: 'paragraph',
        text: '<strong>Safe text</strong>',
      },
    ])
  })

  it('omits blank input', () => {
    expect(parseRichTextBlocks(' \n\n\t')).toEqual([])
  })
})
