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
    const featuredReleases = slide.content.featured_release_ids
      .map((id) => record.generated.releases.find((entry) => entry.id === id))
      .filter((entry) => entry !== undefined)

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

    expect(releaseCards).toHaveLength(featuredReleases.length)
    if (featuredReleases[0]) {
      expect(releaseCards[0]?.attributes('href')).toBe(featuredReleases[0].url)
    }
    if (featuredReleases.length > 0) {
      expect(wrapper.text()).toContain('Latest')
    }
    expect(wrapper.get('.github-link').attributes('href')).toBe(
      'https://github.com/OWASP/threat-dragon/releases',
    )
    expect(wrapper.text()).toContain('View release history on GitHub')
  })

  it('renders authored featured releases with fallback GitHub URLs and non-primary icons', () => {
    const wrapper = mount(ReleasesSlideView, {
      props: {
        presentation: record.presentation,
        generated: {
          ...record.generated,
          releases: [
            {
              id: 'release-a',
              version: 'v9.9.0',
              published_at: '2026-03-01',
              url: '',
              summary_bullets: ['First bullet'],
            },
            {
              id: 'release-b',
              version: 'v9.8.0',
              published_at: '2026-02-15',
              url: 'https://github.com/OWASP/threat-dragon/releases/tag/v9.8.0',
              summary_bullets: ['Second bullet'],
            },
            {
              id: 'release-c',
              version: 'v9.7.0',
              published_at: '2026-01-20',
              url: 'https://example.com/ignored',
              summary_bullets: ['Ignored bullet'],
            },
          ],
        },
        site,
        slide: {
          ...slide,
          content: {
            ...slide.content,
            featured_release_ids: ['release-a', 'release-b'],
          },
        },
        slideNumber: 4,
        slideTotal: 12,
      },
    })

    const releaseCards = wrapper.findAll('.release-card')
    const releaseComponents = wrapper.findAllComponents({ name: 'TimelineEventCard' })

    expect(releaseCards).toHaveLength(2)
    expect(releaseCards[0]?.attributes('href')).toBe(
      'https://github.com/OWASP/threat-dragon/releases/tag/v9.9.0',
    )
    expect(releaseCards[1]?.attributes('href')).toBe(
      'https://github.com/OWASP/threat-dragon/releases/tag/v9.8.0',
    )
    expect(releaseComponents[0]?.props('labelIcon')).toBe('tag')
    expect(releaseComponents[1]?.props('labelIcon')).toBe('code-branch')
    expect(releaseComponents[0]?.props('badgeLabel')).toBe(slide.content.latest_badge_label)
    expect(releaseComponents[1]?.props('badgeLabel')).toBeUndefined()
    expect(wrapper.text()).toContain('First bullet')
    expect(wrapper.text()).toContain('Second bullet')
    expect(wrapper.text()).not.toContain('Ignored bullet')
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

  it('omits release cards and latest badge when generated releases are unavailable', () => {
    const wrapper = mount(ReleasesSlideView, {
      props: {
        presentation: record.presentation,
        generated: {
          ...record.generated,
          releases: [],
        },
        site,
        slide,
        slideNumber: 4,
        slideTotal: 12,
      },
    })

    expect(wrapper.findAll('.release-card')).toHaveLength(0)
    expect(wrapper.text()).toContain(slide.content.empty_state_title ?? '')
    expect(wrapper.text()).toContain(slide.content.empty_state_message ?? '')
    expect(wrapper.text()).not.toContain('Latest')
    expect(wrapper.get('.github-link').attributes('href')).toBe(
      'https://github.com/OWASP/threat-dragon/releases',
    )
  })

  it('omits the empty state when no authored empty-state copy is provided', () => {
    const wrapper = mount(ReleasesSlideView, {
      props: {
        presentation: record.presentation,
        generated: {
          ...record.generated,
          releases: [],
        },
        site,
        slide: {
          ...slide,
          content: {
            ...slide.content,
            empty_state_title: undefined,
            empty_state_message: undefined,
          },
        },
        slideNumber: 4,
        slideTotal: 12,
      },
    })

    expect(wrapper.find('.empty-state').exists()).toBe(false)
  })
})
