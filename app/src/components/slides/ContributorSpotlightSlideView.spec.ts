import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import ContributorSpotlightSlideView from './ContributorSpotlightSlideView.vue'

describe('ContributorSpotlightSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const site = contentRepository.getSiteContent()
  const slide = record.deck.slides.find(
    (entry) => entry.kind === 'contributor-spotlight',
  )

  if (!slide || slide.kind !== 'contributor-spotlight') {
    throw new Error('Expected contributor-spotlight slide in fixture data')
  }

  it('renders contributor spotlight entries from generated contributor data', () => {
    const wrapper = mount(ContributorSpotlightSlideView, {
      props: {
        deck: record.deck,
        generated: record.generated,
        site,
        slide,
        slideNumber: 6,
        slideTotal: 12,
      },
    })

    expect(wrapper.findAll('.profile-card')).toHaveLength(slide.spotlight.length)
    expect(wrapper.text()).toContain('Special thanks to')
    expect(wrapper.text()).toContain('all 24 contributors')
    expect(wrapper.get('.contributors-link').attributes('href')).toBe(
      'https://github.com/OWASP/threat-dragon/graphs/contributors',
    )
    expect(wrapper.findAll('.github-handle')[0]?.attributes('href')).toBe(
      'https://github.com/schen_dev',
    )
  })

  it('falls back to login names and the default icon when generated data is missing', () => {
    const fallbackSlide = {
      ...slide,
      spotlight: [
        ...slide.spotlight,
        {
          login: 'mystery_contributor',
          focus_area: 'Release Engineering',
          summary: 'Helped clean up release automation and packaging workflows.',
        },
      ],
    }

    const wrapper = mount(ContributorSpotlightSlideView, {
      props: {
        deck: record.deck,
        generated: record.generated,
        site,
        slide: fallbackSlide,
        slideNumber: 6,
        slideTotal: 12,
      },
    })

    const names = wrapper.findAll('.contributor-name').map((node) => node.text())
    const handles = wrapper.findAll('.github-handle').map((node) => node.text())
    const links = wrapper.findAll('.github-handle').map((node) => node.attributes('href'))
    const icons = wrapper
      .findAllComponents({ name: 'FontAwesomeIcon' })
      .map((node) => String(node.props('icon')))

    expect(names).toContain('mystery_contributor')
    expect(handles).toContain('@mystery_contributor')
    expect(links).toContain('https://github.com/mystery_contributor')
    expect(icons).toContain('fa-user-secret')
  })
})
