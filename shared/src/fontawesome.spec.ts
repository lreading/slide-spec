import { describe, expect, it } from 'vitest'

import {
  acceptedFontAwesomeIcons,
  fontAwesomeIconDefinitions,
  isFontAwesomeIcon,
  normalizeFontAwesomeIcon,
} from './fontawesome'

describe('Font Awesome icon definitions', () => {
  it('normalizes canonical and prefixed icon values', () => {
    expect(normalizeFontAwesomeIcon('fa-code')).toBe('fa-solid fa-code')
    expect(normalizeFontAwesomeIcon('fas fa-code')).toBe('fa-solid fa-code')
    expect(normalizeFontAwesomeIcon('fa-brands fa-github')).toBe('fa-brands fa-github')
  })

  it('rejects unknown icons and mismatched styles', () => {
    expect(isFontAwesomeIcon('fa-missing')).toBe(false)
    expect(isFontAwesomeIcon('fa-brands fa-code')).toBe(false)
  })

  it('keeps accepted values derived from the supported icon definitions', () => {
    expect(fontAwesomeIconDefinitions.some((definition) => definition.canonical === 'fa-github')).toBe(true)
    expect(acceptedFontAwesomeIcons).toContain('fa-code')
    expect(acceptedFontAwesomeIcons).toContain('fa-brands fa-github')
  })
})
