import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import CommunityHighlightsSlideView from './CommunityHighlightsSlideView.vue'

describe('CommunityHighlightsSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const slide = record.deck.slides.find(
    (entry) => entry.kind === 'community-highlights',
  )

  if (!slide || slide.kind !== 'community-highlights') {
    throw new Error('Expected community-highlights slide in fixture data')
  }

  it('renders the configured mentions and quarterly stats', () => {
    const wrapper = mount(CommunityHighlightsSlideView, {
      props: {
        deck: record.deck,
        generated: record.generated,
        slide,
        slideNumber: 7,
        slideTotal: 12,
      },
    })

    expect(wrapper.text()).toContain('Community Activity')
    expect(wrapper.findAll('.mention-card')).toHaveLength(slide.mentions.length)
    expect(wrapper.findAll('.stat-card')).toHaveLength(slide.stat_keys.length)
    expect(wrapper.text()).toContain('+12% vs last Q')
    expect(wrapper.text()).toContain('GitHub Stars')
    expect(wrapper.findAll('a.mention-card')).toHaveLength(slide.mentions.length)
    expect(wrapper.text()).toContain('Interop tool')
  })

  it('maps icon/trend slots deterministically for reordered stat keys', () => {
    const reorderedSlide = {
      ...slide,
      stat_keys: ['new_contributors', 'prs_merged', 'issues_closed', 'stars'],
    }

    const wrapper = mount(CommunityHighlightsSlideView, {
      props: {
        deck: record.deck,
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
      '+12% vs last Q',
      '+8% vs last Q',
      '+15% vs last Q',
      '+5 vs last Q',
    ])
  })

  it('renders mention cards without links when a URL is not provided', () => {
    const mixedLinkSlide = {
      ...slide,
      mentions: [
        slide.mentions[0],
        {
          ...slide.mentions[1],
          url: undefined,
          url_label: undefined,
        },
      ],
    }

    const wrapper = mount(CommunityHighlightsSlideView, {
      props: {
        deck: record.deck,
        generated: record.generated,
        slide: mixedLinkSlide,
        slideNumber: 7,
        slideTotal: 12,
      },
    })

    const mentionCards = wrapper.findAll('.mention-card')

    expect(mentionCards).toHaveLength(2)
    expect(mentionCards[0]?.attributes('href')).toBe(slide.mentions[0]?.url)
    expect(mentionCards[1]?.attributes('href')).toBeUndefined()
    expect(mentionCards[1].find('.mention-link').exists()).toBe(false)
  })

  it('falls back to the default section heading when none is configured', () => {
    const wrapper = mount(CommunityHighlightsSlideView, {
      props: {
        deck: record.deck,
        generated: record.generated,
        slide: {
          ...slide,
          section_heading: undefined,
        },
        slideNumber: 7,
        slideTotal: 12,
      },
    })

    expect(wrapper.text()).toContain('Community Activity')
  })

  it('falls back to default title, stats heading, and mention icon when optional values are missing', () => {
    const wrapper = mount(CommunityHighlightsSlideView, {
      props: {
        deck: record.deck,
        generated: record.generated,
        slide: {
          ...slide,
          title: undefined,
          stats_heading: undefined,
          mentions: [
            ...slide.mentions,
            {
              type: 'Community tooling',
              title: 'A fourth mention to exercise icon fallback behavior',
            },
          ],
        },
        slideNumber: 7,
        slideTotal: 12,
      },
    })

    expect(wrapper.text()).toContain('Community Highlights')
    expect(wrapper.text()).toContain('Stats This Quarter')
    expect(wrapper.text()).toContain('Community tooling')

    const mentionTypes = wrapper.findAll('.mention-type')
    expect(mentionTypes[3]?.text()).toContain('Community tooling')
  })
})
