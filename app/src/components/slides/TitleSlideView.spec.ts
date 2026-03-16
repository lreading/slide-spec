import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import TitleSlideView from './TitleSlideView.vue'

describe('TitleSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const site = contentRepository.getSiteContent()
  const slide = record.deck.slides.find((entry) => entry.kind === 'title')

  if (!slide || slide.kind !== 'title') {
    throw new Error('Expected title slide in fixture data')
  }

  it('renders clickable footer links from site config', () => {
    const wrapper = mount(TitleSlideView, {
      props: {
        deck: record.deck,
        site,
        slide,
      },
    })

    const links = wrapper.findAll('.site-footer-links__link')

    expect(links).toHaveLength(3)
    expect(links[0].attributes('href')).toBe(site.links.repository.url)
    expect(links[1].attributes('href')).toBe(site.links.docs.url)
    expect(links[2].attributes('href')).toBe(site.links.owasp.url)
    expect(wrapper.text()).toContain('OWASP Lab Project')
    expect(wrapper.find('.project-badge-pill .fa-flask').exists()).toBe(true)
    expect(wrapper.text()).toContain('github.com/OWASP/threat-dragon')
    expect(wrapper.text()).toContain('threatdragon.com/docs')
    expect(wrapper.text()).toContain('owasp.org/www-project-threat-dragon')
  })

  it('falls back to default hero labels when title config is missing', () => {
    const wrapper = mount(TitleSlideView, {
      props: {
        deck: record.deck,
        site,
        slide: {
          ...slide,
          title_primary: undefined,
          title_accent: undefined,
          subtitle_prefix: undefined,
        },
      },
    })

    expect(wrapper.text()).toContain('OWASP Threat Dragon')
    expect(wrapper.text()).toContain('Quarterly Community Update')
  })
})
