import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import ReleasesSlideView from './ReleasesSlideView.vue'

describe('ReleasesSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const site = contentRepository.getSiteContent()
  const slide = record.presentation.slides.find((entry) => entry.kind === 'releases')

  if (!slide || slide.kind !== 'releases') {
    throw new Error('Expected releases slide in fixture data')
  }

  it('links release cards and the footer CTA to GitHub release pages', () => {
    const wrapper = mount(ReleasesSlideView, {
      props: {
        deck: record.presentation,
        generated: record.generated,
        site,
        slide,
        slideNumber: 4,
        slideTotal: 12,
      },
    })

    const releaseCards = wrapper.findAll('.release-card')

    expect(releaseCards).toHaveLength(slide.featured_release_ids.length)
    expect(releaseCards[0]?.attributes('href')).toBe(
      'https://github.com/OWASP/threat-dragon/releases/tag/v2.3.0',
    )
    expect(wrapper.get('.github-link').attributes('href')).toBe(
      'https://github.com/OWASP/threat-dragon/releases',
    )
  })
})
