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
  | {
    type: 'spacer'
    size: number
  }

const unorderedItemPattern = /^\s*[-*]\s+(.+)$/
const orderedItemPattern = /^\s*\d+[.)]\s+(.+)$/
const blockSeparatorPattern = /(\n[ \t]*\n(?:[ \t]*\n)*)/

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

const countNewlines = (value: string): number => value.match(/\n/g)?.length ?? 0

export const parseRichTextBlocks = (value: string): RichTextBlock[] => {
  const blocks: RichTextBlock[] = []
  let pendingSpacerSize = 0

  for (const part of value.replace(/\r\n?/g, '\n').split(blockSeparatorPattern)) {
    if (part.trim().length === 0) {
      pendingSpacerSize += Math.max(0, countNewlines(part) - 2)
      continue
    }

    const block = parseBlock(part)

    if (!block) {
      continue
    }

    if (blocks.length > 0 && pendingSpacerSize > 0) {
      blocks.push({
        type: 'spacer',
        size: pendingSpacerSize,
      })
    }

    blocks.push(block)
    pendingSpacerSize = 0
  }

  return blocks
}
