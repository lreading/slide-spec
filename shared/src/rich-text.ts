export type RichTextBlock =
  | {
    type: 'paragraph'
    text: string
  }
  | {
    type: 'unordered-list'
    items: string[]
  }
  | {
    type: 'ordered-list'
    items: string[]
  }

const unorderedItemPattern = /^\s*[-*]\s+(.+)$/
const orderedItemPattern = /^\s*\d+[.)]\s+(.+)$/

const toParagraphText = (lines: string[]): string =>
  lines.map((line) => line.trim()).filter(Boolean).join(' ')

const matchListItems = (lines: string[], pattern: RegExp): string[] | undefined => {
  const items: string[] = []

  for (const line of lines) {
    const match = pattern.exec(line)

    if (!match?.[1]?.trim()) {
      return undefined
    }

    items.push(match[1].trim())
  }

  return items
}

const parseBlock = (block: string): RichTextBlock | undefined => {
  const lines = block.split('\n').filter((line) => line.trim().length > 0)

  if (lines.length === 0) {
    return undefined
  }

  const unorderedItems = matchListItems(lines, unorderedItemPattern)

  if (unorderedItems) {
    return {
      type: 'unordered-list',
      items: unorderedItems,
    }
  }

  const orderedItems = matchListItems(lines, orderedItemPattern)

  if (orderedItems) {
    return {
      type: 'ordered-list',
      items: orderedItems,
    }
  }

  return {
    type: 'paragraph',
    text: toParagraphText(lines),
  }
}

export const parseRichTextBlocks = (value: string): RichTextBlock[] =>
  value
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((block) => parseBlock(block))
    .filter((block): block is RichTextBlock => block !== undefined)
