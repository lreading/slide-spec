import { describe, expect, it } from 'vitest'

import { contentRepository } from './ContentRepository'
import { getSlideLabel } from './slideLabels'

describe('getSlideLabel', () => {
  const record = contentRepository.getPresentation('2026-q1')

  it('uses authored titles for roadmap slides when present', () => {
    const roadmapSlides = record.presentation.slides.filter(
      (slide) => slide.template === 'progress-timeline',
    )

    expect(roadmapSlides).toHaveLength(4)
    expect(getSlideLabel(roadmapSlides[0], record.presentation)).toBe('Roadmap: Completed')
    expect(getSlideLabel(roadmapSlides[1], record.presentation)).toBe('Roadmap: In Progress')
    expect(getSlideLabel(roadmapSlides[2], record.presentation)).toBe('Roadmap: Planned')
    expect(getSlideLabel(roadmapSlides[3], record.presentation)).toBe('Roadmap: Future')
  })

  it('uses authored titles for non-roadmap slides when present', () => {
    const releasesSlide = record.presentation.slides.find((slide) => slide.template === 'timeline')

    if (!releasesSlide || releasesSlide.template !== 'timeline') {
      throw new Error('Expected releases slide in fixture data')
    }

    expect(getSlideLabel(releasesSlide, record.presentation)).toBe('Releases')
  })

  it('uses the shared roadmap agenda label when a roadmap slide title is missing', () => {
    const roadmapSlide = record.presentation.slides.find(
      (slide) => slide.template === 'progress-timeline',
    )

    if (!roadmapSlide || roadmapSlide.template !== 'progress-timeline') {
      throw new Error('Expected roadmap slide in fixture data')
    }

    expect(
      getSlideLabel(
        {
          ...roadmapSlide,
          title: undefined,
        },
        {
          ...record.presentation,
        },
      ),
    ).toBe('Roadmap')
  })

  it('returns undefined when a non-roadmap slide does not provide a title', () => {
    const releasesSlide = record.presentation.slides.find((slide) => slide.template === 'timeline')

    if (!releasesSlide || releasesSlide.template !== 'timeline') {
      throw new Error('Expected releases slide in fixture data')
    }

    expect(
      getSlideLabel(
        {
          ...releasesSlide,
          title: undefined,
        },
        record.presentation,
      ),
    ).toBeUndefined()
  })

  it('uses the thank-you heading when that slide does not provide a title', () => {
    const thankYouSlide = record.presentation.slides.find((slide) => slide.template === 'closing')

    if (!thankYouSlide || thankYouSlide.template !== 'closing') {
      throw new Error('Expected thank-you slide in fixture data')
    }

    expect(getSlideLabel(thankYouSlide, record.presentation)).toBe(thankYouSlide.content.heading)
  })

  it('returns undefined when roadmap title and shared agenda label are both missing', () => {
    const roadmapSlide = record.presentation.slides.find(
      (slide) => slide.template === 'progress-timeline',
    )

    if (!roadmapSlide || roadmapSlide.template !== 'progress-timeline') {
      throw new Error('Expected roadmap slide in fixture data')
    }

    expect(
      getSlideLabel(
        {
          ...roadmapSlide,
          title: undefined,
        },
        {
          ...record.presentation,
          roadmap: undefined,
        },
      ),
    ).toBeUndefined()
  })
})
