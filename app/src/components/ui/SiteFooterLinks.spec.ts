import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import SiteFooterLinks from './SiteFooterLinks.vue'

describe('SiteFooterLinks', () => {
  it('renders configured repository, docs, and community links in order', () => {
    const wrapper = mount(SiteFooterLinks, {
      props: {
        site: {
          links: {
            repository: {
              label: 'Repo',
              url: 'https://github.com/OWASP/threat-dragon',
            },
            docs: {
              label: 'Docs',
              url: 'https://www.threatdragon.com/docs',
            },
            community: {
              label: 'Community',
              url: 'https://owasp.org/www-project-threat-dragon/',
            },
          },
        },
      },
    })

    const links = wrapper.findAll('.site-footer-links__link')

    expect(links).toHaveLength(3)
    expect(links[0].attributes('href')).toBe('https://github.com/OWASP/threat-dragon')
    expect(links[1].text()).toContain('threatdragon.com/docs')
    expect(links[2].text()).toContain('owasp.org/www-project-threat-dragon')
  })

  it('skips missing configured keys', () => {
    const wrapper = mount(SiteFooterLinks, {
      props: {
        site: {
          links: {
            repository: {
              label: 'Repo',
              url: 'https://github.com/example/repo',
            },
          },
        },
      },
    })

    expect(wrapper.findAll('.site-footer-links__link')).toHaveLength(1)
    expect(wrapper.find('.site-footer-links__separator').exists()).toBe(false)
  })
})
