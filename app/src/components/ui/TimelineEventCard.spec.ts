import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import TimelineEventCard from './TimelineEventCard.vue'

describe('TimelineEventCard', () => {
  it('renders an event card with label, date, and items', () => {
    const wrapper = mount(TimelineEventCard, {
      props: {
        href: 'https://example.com/release',
        label: 'v1.0.0',
        labelFaIcon: 'fa-tag',
        date: 'January 1, 2026',
        items: ['One', 'Two'],
        highlighted: true,
        badgeLabel: 'Latest',
      },
    })

    expect(wrapper.attributes('href')).toBe('https://example.com/release')
    expect(wrapper.text()).toContain('v1.0.0')
    expect(wrapper.text()).toContain('Latest')
    expect(wrapper.text()).toContain('One')
    expect(wrapper.find('.timeline-event-card__node--highlighted').exists()).toBe(true)
  })

  it('renders without a badge or highlighted styling when optional props are absent', () => {
    const wrapper = mount(TimelineEventCard, {
      props: {
        href: 'https://example.com/release',
        label: 'v0.9.0',
        labelFaIcon: 'fa-github',
        date: 'December 1, 2025',
        items: ['Only'],
      },
    })

    expect(wrapper.text()).toContain('v0.9.0')
    expect(wrapper.text()).not.toContain('Latest')
    expect(wrapper.find('.timeline-event-card__node--highlighted').exists()).toBe(false)
    expect(wrapper.find('.timeline-event-card__badge').exists()).toBe(false)
  })
})
