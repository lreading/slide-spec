import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { HowToContributeSlide, PresentationContent, SiteContent } from '../../types/content'
import HowToContributeSlideView from './HowToContributeSlideView.vue'

const presentation: PresentationContent = {
  id: '2026-q1',
  year: 2026,
  quarter: 1,
  title: 'Threat Dragon Quarterly Community Update',
  subtitle: 'Q1 2026',
  slides: [],
}

const slide: HowToContributeSlide = {
  kind: 'how-to-contribute',
  enabled: true,
  subtitle: 'Join the mission',
  cards: [
    {
      title: 'Report Bugs',
      description: 'File issues with reproduction steps.',
      url_label: 'Submit an issue',
      url: 'https://example.com/issues',
    },
    {
      title: 'Submit Code',
      description: 'Open a pull request.',
      url_label: 'Read CONTRIBUTING.md',
      url: 'https://example.com/contributing',
    },
    {
      title: 'Improve Docs',
      description: 'Help improve the docs.',
      url_label: 'Edit docs',
      url: 'https://example.com/docs',
    },
    {
      title: 'Spread the Word',
      description: 'Share the project.',
      url_label: 'Share it',
      url: 'https://example.com/share',
    },
  ],
}

describe('HowToContributeSlideView', () => {
  it('uses the configured repository link in the footer', () => {
    const site: SiteContent = {
      title: 'Threat Dragon Updates',
      home_intro: 'Intro',
      home_cta_label: 'View latest presentation',
      presentations_cta_label: 'View all presentations',
      links: {
        repository: {
          label: 'View source on GitHub',
          url: 'https://github.com/example/project',
        },
      },
    }

    const wrapper = mount(HowToContributeSlideView, {
      props: {
        presentation,
        site,
        slide,
        slideNumber: 11,
        slideTotal: 12,
      },
    })

    expect(wrapper.get('.footer-action-link').attributes('href')).toBe(
      'https://github.com/example/project',
    )
    expect(wrapper.text()).toContain('View source on GitHub')
  })

  it('omits the repository footer link when no repository link is configured', () => {
    const site: SiteContent = {
      title: 'Threat Dragon Updates',
      home_intro: 'Intro',
      home_cta_label: 'View latest presentation',
      presentations_cta_label: 'View all presentations',
      links: {},
    }

    const wrapper = mount(HowToContributeSlideView, {
      props: {
        presentation,
        site,
        slide,
        slideNumber: 11,
        slideTotal: 12,
      },
    })

    expect(wrapper.find('.footer-action-link').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Open Source and Community Driven')
  })

  it('omits the footer callout entirely when footer copy and repository link are both missing', () => {
    const site: SiteContent = {
      title: 'Threat Dragon Updates',
      home_intro: 'Intro',
      home_cta_label: 'View latest presentation',
      presentations_cta_label: 'View all presentations',
      links: {},
    }

    const wrapper = mount(HowToContributeSlideView, {
      props: {
        presentation,
        site,
        slide: {
          ...slide,
          footer_text: undefined,
        },
        slideNumber: 11,
        slideTotal: 12,
      },
    })

    expect(wrapper.find('.footer-cta').exists()).toBe(false)
  })
})
