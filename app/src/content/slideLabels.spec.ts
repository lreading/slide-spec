import { describe, expect, it } from 'vitest'

import { contentRepository } from './ContentRepository'
import { getSlideLabel } from './slideLabels'

describe('getSlideLabel', () => {
  const record = contentRepository.getPresentation('2026-q1')

  it('uses stage-specific labels for roadmap slides', () => {
    const roadmapSlides = record.deck.slides.filter((slide) => slide.kind === 'roadmap')

    expect(roadmapSlides).toHaveLength(4)
    expect(getSlideLabel(roadmapSlides[0], record.deck)).toBe('Roadmap: Completed')
    expect(getSlideLabel(roadmapSlides[1], record.deck)).toBe('Roadmap: In Progress')
    expect(getSlideLabel(roadmapSlides[2], record.deck)).toBe('Roadmap: Planned')
    expect(getSlideLabel(roadmapSlides[3], record.deck)).toBe('Roadmap: Future')
  })

  it('falls back to default labels for non-roadmap slides', () => {
    const releasesSlide = record.deck.slides.find((slide) => slide.kind === 'releases')

    if (!releasesSlide || releasesSlide.kind !== 'releases') {
      throw new Error('Expected releases slide in fixture data')
    }

    expect(getSlideLabel(releasesSlide, record.deck)).toBe('Releases')
  })

  it('falls back to the generic roadmap label when roadmap section data is missing', () => {
    const roadmapSlide = record.deck.slides.find((slide) => slide.kind === 'roadmap')

    if (!roadmapSlide || roadmapSlide.kind !== 'roadmap') {
      throw new Error('Expected roadmap slide in fixture data')
    }

    expect(
      getSlideLabel(
        {
          ...roadmapSlide,
          title: undefined,
        },
        {
        ...record.deck,
        roadmap: undefined,
        },
      ),
    ).toBe('Roadmap')
  })
})
