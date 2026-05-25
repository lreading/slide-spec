export type FontAwesomeIconStyle = 'solid' | 'brands'

export interface FontAwesomeIconDefinition {
  canonical: string
  label: string
  style: FontAwesomeIconStyle
}

export const fontAwesomeIconDefinitions = [
  { canonical: 'fa-arrow-down', label: 'Arrow Down', style: 'solid' },
  { canonical: 'fa-arrow-left', label: 'Arrow Left', style: 'solid' },
  { canonical: 'fa-arrow-right', label: 'Arrow Right', style: 'solid' },
  { canonical: 'fa-arrow-up', label: 'Arrow Up', style: 'solid' },
  { canonical: 'fa-book', label: 'Book', style: 'solid' },
  { canonical: 'fa-bug', label: 'Bug', style: 'solid' },
  { canonical: 'fa-bullhorn', label: 'Bullhorn', style: 'solid' },
  { canonical: 'fa-bullseye', label: 'Bullseye', style: 'solid' },
  { canonical: 'fa-chart-line', label: 'Chart Line', style: 'solid' },
  { canonical: 'fa-check', label: 'Check', style: 'solid' },
  { canonical: 'fa-check-circle', label: 'Check Circle', style: 'solid' },
  { canonical: 'fa-chevron-right', label: 'Chevron Right', style: 'solid' },
  { canonical: 'fa-code', label: 'Code', style: 'solid' },
  { canonical: 'fa-code-branch', label: 'Code Branch', style: 'solid' },
  { canonical: 'fa-external-link-alt', label: 'External Link Alt', style: 'solid' },
  { canonical: 'fa-flask', label: 'Flask', style: 'solid' },
  { canonical: 'fa-globe', label: 'Globe', style: 'solid' },
  { canonical: 'fa-heart', label: 'Heart', style: 'solid' },
  { canonical: 'fa-lock', label: 'Lock', style: 'solid' },
  { canonical: 'fa-microphone-alt', label: 'Microphone Alt', style: 'solid' },
  { canonical: 'fa-podcast', label: 'Podcast', style: 'solid' },
  { canonical: 'fa-quote-left', label: 'Quote Left', style: 'solid' },
  { canonical: 'fa-rss', label: 'RSS', style: 'solid' },
  { canonical: 'fa-shield-alt', label: 'Shield Alt', style: 'solid' },
  { canonical: 'fa-shield-halved', label: 'Shield Halved', style: 'solid' },
  { canonical: 'fa-star', label: 'Star', style: 'solid' },
  { canonical: 'fa-tag', label: 'Tag', style: 'solid' },
  { canonical: 'fa-user-astronaut', label: 'User Astronaut', style: 'solid' },
  { canonical: 'fa-user-ninja', label: 'User Ninja', style: 'solid' },
  { canonical: 'fa-user-plus', label: 'User Plus', style: 'solid' },
  { canonical: 'fa-user-secret', label: 'User Secret', style: 'solid' },
  { canonical: 'fa-users', label: 'Users', style: 'solid' },
  { canonical: 'fa-wrench', label: 'Wrench', style: 'solid' },
  { canonical: 'fa-github', label: 'GitHub', style: 'brands' },
] as const satisfies readonly FontAwesomeIconDefinition[]

export type SupportedFontAwesomeIcon = (typeof fontAwesomeIconDefinitions)[number]['canonical']
export type AcceptedFontAwesomeIcon =
  | SupportedFontAwesomeIcon
  | `fa-solid ${SupportedFontAwesomeIcon}`
  | `fas ${SupportedFontAwesomeIcon}`
  | `fa-brands ${SupportedFontAwesomeIcon}`
  | `fab ${SupportedFontAwesomeIcon}`

const solidPrefixes = new Set(['fa-solid', 'fas'])
const brandPrefixes = new Set(['fa-brands', 'fab'])
const definitionByCanonical = new Map(
  fontAwesomeIconDefinitions.map((definition) => [definition.canonical, definition]),
)

export const acceptedFontAwesomeIcons: readonly string[] = fontAwesomeIconDefinitions.flatMap((definition) => {
  const prefixes = definition.style === 'brands' ? ['fa-brands', 'fab'] : ['fa-solid', 'fas']

  return [
    definition.canonical,
    ...prefixes.map((prefix) => `${prefix} ${definition.canonical}`),
  ]
})

export function normalizeFontAwesomeIcon(value: string): string | undefined {
  const parts = value.trim().split(/\s+/)

  if (parts.length === 1) {
    const [icon] = parts
    if (!icon) return undefined

    const definition = definitionByCanonical.get(icon as SupportedFontAwesomeIcon)
    if (!definition) return undefined

    return `${definition.style === 'brands' ? 'fa-brands' : 'fa-solid'} ${definition.canonical}`
  }

  if (parts.length !== 2) return undefined

  const [prefix, icon] = parts
  if (!prefix || !icon) return undefined

  const definition = definitionByCanonical.get(icon as SupportedFontAwesomeIcon)
  if (!definition) return undefined

  const prefixStyle = brandPrefixes.has(prefix)
    ? 'brands'
    : solidPrefixes.has(prefix)
      ? 'solid'
      : undefined

  if (prefixStyle !== definition.style) return undefined

  return `${definition.style === 'brands' ? 'fa-brands' : 'fa-solid'} ${definition.canonical}`
}

export function isFontAwesomeIcon(value: string): boolean {
  return normalizeFontAwesomeIcon(value) !== undefined
}
