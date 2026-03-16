import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import ReleasesSlideView from './ReleasesSlideView.vue'

describe('ReleasesSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const site = contentRepository.getSiteContent()
  const slide = record.presentation.slides.find((entry) => entry.template === 'timeline')

  if (!slide || slide.template !== 'timeline') {
    throw new Error('Expected releases slide in fixture data')
  }

  it('links release cards and the footer CTA to GitHub release pages', () => {
    const wrapper = mount(ReleasesSlideView, {
      props: {
        presentation: record.presentation,
        generated: record.generated,
        site,
        slide,
        slideNumber: 4,
        slideTotal: 12,
      },
    })

    const releaseCards = wrapper.findAll('.release-card')

    expect(releaseCards).toHaveLength(slide.content.featured_release_ids.length)
    expect(releaseCards[0]?.attributes('href')).toBe(
      'https://github.com/OWASP/threat-dragon/releases/tag/v2.3.0',
    )
    expect(wrapper.text()).toContain('Latest')
    expect(wrapper.get('.github-link').attributes('href')).toBe(
      'https://github.com/OWASP/threat-dragon/releases',
    )
    expect(wrapper.text()).toContain('View all releases on GitHub')
  })

  it('omits optional authored labels when they are absent', () => {
    const wrapper = mount(ReleasesSlideView, {
      props: {
        presentation: record.presentation,
        generated: record.generated,
        site,
        slide: {
          ...slide,
          content: {
            ...slide.content,
            latest_badge_label: undefined,
            footer_link_label: undefined,
          },
        },
        slideNumber: 4,
        slideTotal: 12,
      },
    })

    expect(wrapper.text()).not.toContain('Latest')
    expect(wrapper.find('.github-link').exists()).toBe(false)
  })
})
