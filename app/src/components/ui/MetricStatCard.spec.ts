import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import MetricStatCard from './MetricStatCard.vue'

describe('MetricStatCard', () => {
  it('renders value, label, and trend', () => {
    const wrapper = mount(MetricStatCard, {
      props: {
        faIcon: 'fa-star',
        value: '1,234',
        label: 'GitHub Stars',
        trend: '+12% vs last Q',
      },
    })

    expect(wrapper.text()).toContain('1,234')
    expect(wrapper.text()).toContain('GitHub Stars')
    expect(wrapper.text()).toContain('+12% vs last Q')
  })

  it('renders a down trend with the down arrow class when requested', () => {
    const wrapper = mount(MetricStatCard, {
      props: {
        faIcon: 'fa-star',
        value: '4',
        label: 'New contributors',
        trend: '-20% vs last presentation',
        trendDirection: 'down',
      },
    })

    expect(wrapper.find('.metric-stat-card__trend').classes()).toContain('metric-stat-card__trend--down')
    expect(wrapper.find('.metric-stat-card__trend').text()).toContain('-20% vs last presentation')
    expect(wrapper.html()).toContain('fa-arrow-down')
  })

  it('omits trend when not provided', () => {
    const wrapper = mount(MetricStatCard, {
      props: {
        faIcon: 'fa-star',
        value: '7',
        label: 'Open issues',
      },
    })

    expect(wrapper.find('.metric-stat-card__trend').exists()).toBe(false)
  })
})
