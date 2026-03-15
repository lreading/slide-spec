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
      },
    })

    expect(wrapper.text()).toContain('Talks & Mentions')
    expect(wrapper.findAll('.mention-card')).toHaveLength(slide.mentions.length)
    expect(wrapper.findAll('.stat-card')).toHaveLength(slide.stat_keys.length)
    expect(wrapper.text()).toContain('+12% vs last Q')
    expect(wrapper.text()).toContain('GitHub Stars')
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
      },
    })

    const labels = wrapper.findAll('.stat-label').map((node) => node.text())
    const trends = wrapper.findAll('.trend-indicator').map((node) => node.text())

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
})
