import { describe, expect, it } from 'vitest'

import { PresentationNavigation } from './PresentationNavigation'

describe('PresentationNavigation', () => {
  it('moves within the presentation bounds', () => {
    const navigation = new PresentationNavigation(12)

    expect(navigation.first()).toBe(1)
    expect(navigation.last()).toBe(12)
    expect(navigation.previous(1)).toBe(1)
    expect(navigation.next(12)).toBe(12)
    expect(navigation.next(3)).toBe(4)
  })

  it('normalizes invalid route values', () => {
    const navigation = new PresentationNavigation(4)

    expect(navigation.resolve(undefined)).toBe(1)
    expect(navigation.resolve('2')).toBe(2)
    expect(navigation.resolve('400')).toBe(4)
  })
})
