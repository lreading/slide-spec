import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { contentRepository } from '../../content/ContentRepository'
import TitleSlideView from './TitleSlideView.vue'

describe('TitleSlideView', () => {
  const record = contentRepository.getPresentation('2026-q1')
  const site = contentRepository.getSiteContent()
  const slide = record.presentation.slides.find((entry) => entry.template === 'hero')

  if (!slide || slide.template !== 'hero') {
    throw new Error('Expected title slide in fixture data')
  }

  it('renders clickable footer links from site config', () => {
    const wrapper = mount(TitleSlideView, {
      props: {
        presentation: record.presentation,
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

  it('omits hero headings when title config is missing', () => {
    const wrapper = mount(TitleSlideView, {
      props: {
        presentation: record.presentation,
        site,
        slide: {
          ...slide,
          content: {
            ...slide.content,
            title_primary: undefined,
            title_accent: undefined,
            subtitle_prefix: undefined,
          },
        },
      },
    })

    expect(wrapper.find('.hero-title').exists()).toBe(false)
    expect(wrapper.find('.hero-subtitle').exists()).toBe(false)
  })

  it('supports accent-only titles and omits mascot alt text when not authored', () => {
    const wrapper = mount(TitleSlideView, {
      props: {
        presentation: record.presentation,
        site: {
          ...site,
          mascot_alt: undefined,
        },
        slide: {
          ...slide,
          content: {
            ...slide.content,
            title_primary: undefined,
            title_accent: 'Threat Dragon',
            subtitle_prefix: 'Quarterly Community Update',
            quote: undefined,
          },
        },
      },
    })

    expect(wrapper.find('.hero-title')?.text()).toContain('Threat Dragon')
    expect(wrapper.find('.hero-subtitle').exists()).toBe(true)
    expect(wrapper.find('.hero-quote').exists()).toBe(false)
    expect(wrapper.get('.floating-mascot__image').attributes('alt')).toBeUndefined()
  })
})
