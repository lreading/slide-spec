import { mount } from '@vue/test-utils'
import { describe, expect, it, vi, afterEach } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import StandardSlideLayout from './StandardSlideLayout.vue'

describe('StandardSlideLayout', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders title, subtitle, dots, and slot content by default', () => {
    const wrapper = mount(StandardSlideLayout, {
      props: {
        title: 'Roadmap',
        subtitle: 'Future direction',
        slideNumber: 4,
        slideTotal: 12,
        deckSubtitle: 'Q1 2026',
      },
      slots: {
        default: '<div class="slot-marker">Body</div>',
      },
    })

    expect(wrapper.text()).toContain('Roadmap')
    expect(wrapper.text()).toContain('Future direction')
    expect(wrapper.text()).toContain('4/12')
    expect(wrapper.text()).toContain('Threat Dragon')
    expect(wrapper.find('.bg-dots').exists()).toBe(true)
    expect(wrapper.find('.logo-image').attributes('src')).toBe('/cupcake-logo.png')
    expect(wrapper.find('.slot-marker').exists()).toBe(true)
  })

  it('supports hiding subtitle and decorative dots', () => {
    const wrapper = mount(StandardSlideLayout, {
      props: {
        title: 'Agenda',
        slideNumber: 2,
        slideTotal: 12,
        showDots: false,
      },
    })

    expect(wrapper.text()).toContain('Agenda')
    expect(wrapper.find('.subtitle').exists()).toBe(false)
    expect(wrapper.find('.bg-dots').exists()).toBe(false)
  })

  it('falls back to the dragon icon when no presentation logo is configured', () => {
    vi.spyOn(contentRepository, 'getSiteContent').mockReturnValue({
      title: 'Threat Dragon Updates',
      tagline: 'Quarterly updates',
      home_intro: 'Intro',
      home_cta_label: 'Latest',
      presentations_cta_label: 'Presentations',
      links: {
        repository: {
          label: 'Repo',
          url: 'https://example.com/repo',
        },
      },
    })

    const wrapper = mount(StandardSlideLayout, {
      props: {
        title: 'Agenda',
        slideNumber: 2,
        slideTotal: 12,
      },
    })

    expect(wrapper.find('.logo-image').exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'FontAwesomeIcon' }).exists()).toBe(true)
  })

  it('uses the site title as alt text when the logo alt is blank', () => {
    vi.spyOn(contentRepository, 'getSiteContent').mockReturnValue({
      title: 'Threat Dragon Updates',
      tagline: 'Quarterly updates',
      home_intro: 'Intro',
      home_cta_label: 'Latest',
      presentations_cta_label: 'Presentations',
      presentation_logo: {
        url: 'https://example.com/logo.png',
        alt: '   ',
      },
      links: {
        repository: {
          label: 'Repo',
          url: 'https://example.com/repo',
        },
      },
    })

    const wrapper = mount(StandardSlideLayout, {
      props: {
        title: 'Agenda',
        slideNumber: 2,
        slideTotal: 12,
      },
    })

    expect(wrapper.find('.logo-image').attributes('src')).toBe('https://example.com/logo.png')
    expect(wrapper.find('.logo-image').attributes('alt')).toBe('Threat Dragon Updates')
  })

  it('falls back to the navigation brand when no presentation mark label is configured', () => {
    vi.spyOn(contentRepository, 'getSiteContent').mockReturnValue({
      title: 'Threat Dragon Quarterly Updates',
      tagline: 'Quarterly updates',
      home_intro: 'Intro',
      home_cta_label: 'Latest',
      presentations_cta_label: 'Presentations',
      navigation: {
        brand_title: 'Threat Dragon Updates',
      },
      links: {
        repository: {
          label: 'Repo',
          url: 'https://example.com/repo',
        },
      },
    })

    const wrapper = mount(StandardSlideLayout, {
      props: {
        title: 'Agenda',
        slideNumber: 2,
        slideTotal: 12,
        deckSubtitle: 'Q1 2026',
      },
    })

    expect(wrapper.text()).toContain('Threat Dragon Updates')
  })
})
