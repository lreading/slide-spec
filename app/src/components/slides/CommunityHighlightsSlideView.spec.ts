import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import CommunityHighlightsSlideView from './CommunityHighlightsSlideView.vue'

describe('CommunityHighlightsSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const slide = record.presentation.slides.find(
    (entry) => entry.template === 'metrics-and-links',
  )

  if (!slide || slide.template !== 'metrics-and-links') {
    throw new Error('Expected community-highlights slide in fixture data')
  }

  it('renders the configured mentions and quarterly stats', () => {
    const wrapper = mount(CommunityHighlightsSlideView, {
      props: {
        presentation: record.presentation,
        generated: record.generated,
        slide,
        slideNumber: 7,
        slideTotal: 12,
      },
    })

    expect(wrapper.text()).toContain('Community Activity')
    expect(wrapper.findAll('.mention-card')).toHaveLength(slide.content.mentions.length)
    expect(wrapper.findAll('.stat-card')).toHaveLength(slide.content.stat_keys.length)
    expect(wrapper.text()).toContain(`+12% ${slide.content.trend_suffix}`)
    expect(wrapper.text()).toContain('GitHub Stars')
    expect(wrapper.findAll('a.mention-card')).toHaveLength(slide.content.mentions.length)
    expect(wrapper.text()).toContain('Interop tool')
  })

  it('maps icon/trend slots deterministically for reordered stat keys', () => {
    const reorderedSlide = {
      ...slide,
      content: {
        ...slide.content,
        stat_keys: ['new_contributors', 'prs_merged', 'issues_closed', 'stars'],
      },
    }

    const wrapper = mount(CommunityHighlightsSlideView, {
      props: {
        presentation: record.presentation,
        generated: record.generated,
        slide: reorderedSlide,
        slideNumber: 7,
        slideTotal: 12,
      },
    })

    const labels = wrapper.findAll('.metric-stat-card__label').map((node) => node.text())
    const trends = wrapper.findAll('.metric-stat-card__trend').map((node) => node.text())

    expect(labels).toEqual([
      'New contributors',
      'PRs Merged',
      'Issues closed',
      'GitHub Stars',
    ])
    expect(trends).toEqual([
      `+50% ${slide.content.trend_suffix}`,
      `+15% ${slide.content.trend_suffix}`,
      `+8% ${slide.content.trend_suffix}`,
      `+12% ${slide.content.trend_suffix}`,
    ])
  })

  it('omits the trend label when the delta is zero', () => {
    const wrapper = mount(CommunityHighlightsSlideView, {
      props: {
        presentation: record.presentation,
        generated: {
          ...record.generated,
          stats: {
            ...record.generated.stats,
            stars: {
              ...record.generated.stats.stars,
              delta: 0,
            },
          },
        },
        slide: {
          ...slide,
          content: {
            ...slide.content,
            stat_keys: ['stars'],
          },
        },
        slideNumber: 7,
        slideTotal: 12,
      },
    })

    expect(wrapper.find('.metric-stat-card__trend').exists()).toBe(false)
  })

  it('uses an absolute delta trend when there is no previous value', () => {
    const wrapper = mount(CommunityHighlightsSlideView, {
      props: {
        presentation: record.presentation,
        generated: {
          ...record.generated,
          stats: {
            ...record.generated.stats,
            stars: {
              ...record.generated.stats.stars,
              previous: 0,
              delta: 42,
            },
          },
        },
        slide: {
          ...slide,
          content: {
            ...slide.content,
            stat_keys: ['stars'],
          },
        },
        slideNumber: 7,
        slideTotal: 12,
      },
    })

    expect(wrapper.find('.metric-stat-card__trend').text()).toBe(
      `+42 ${slide.content.trend_suffix}`,
    )
  })

  it('renders a suffix-free trend when no trend suffix is configured', () => {
    const wrapper = mount(CommunityHighlightsSlideView, {
      props: {
        presentation: record.presentation,
        generated: {
          ...record.generated,
          stats: {
            ...record.generated.stats,
            stars: {
              ...record.generated.stats.stars,
              previous: 0,
              delta: 42,
            },
          },
        },
        slide: {
          ...slide,
          content: {
            ...slide.content,
            trend_suffix: undefined,
            stat_keys: ['stars'],
          },
        },
        slideNumber: 7,
        slideTotal: 12,
      },
    })

    expect(wrapper.find('.metric-stat-card__trend').text()).toBe('+42')
  })

  it('renders mention cards without links when a URL is not provided', () => {
    const mixedLinkSlide = {
      ...slide,
      content: {
        ...slide.content,
        mentions: [
          slide.content.mentions[0],
          {
            ...slide.content.mentions[1],
            url: undefined,
            url_label: undefined,
          },
        ],
      },
    }

    const wrapper = mount(CommunityHighlightsSlideView, {
      props: {
        presentation: record.presentation,
        generated: record.generated,
        slide: mixedLinkSlide,
        slideNumber: 7,
        slideTotal: 12,
      },
    })

    const mentionCards = wrapper.findAll('.mention-card')

    expect(mentionCards).toHaveLength(2)
    expect(mentionCards[0]?.attributes('href')).toBe(slide.content.mentions[0]?.url)
    expect(mentionCards[1]?.attributes('href')).toBeUndefined()
    expect(mentionCards[1].find('.mention-link').exists()).toBe(false)
  })

  it('omits the section heading when none is configured', () => {
    const wrapper = mount(CommunityHighlightsSlideView, {
      props: {
        presentation: record.presentation,
        generated: record.generated,
        slide: {
          ...slide,
          content: {
            ...slide.content,
            section_heading: undefined,
          },
        },
        slideNumber: 7,
        slideTotal: 12,
      },
    })

    expect(wrapper.text()).not.toContain('Community Activity')
  })

  it('omits title and stats heading when optional values are missing while keeping mention icon fallback', () => {
    const wrapper = mount(CommunityHighlightsSlideView, {
      props: {
        presentation: record.presentation,
        generated: record.generated,
        slide: {
          ...slide,
          title: undefined,
          content: {
            ...slide.content,
            stats_heading: undefined,
            mentions: [
              ...slide.content.mentions,
              {
                type: 'Community tooling',
                title: 'A fourth mention to exercise icon fallback behavior',
              },
            ],
          },
        },
        slideNumber: 7,
        slideTotal: 12,
      },
    })

    expect(wrapper.find('.page-title').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Stats This Quarter')
    expect(wrapper.text()).toContain('Community tooling')

    const mentionTypes = wrapper.findAll('.mention-type')
    expect(mentionTypes[3]?.text()).toContain('Community tooling')
  })
})
