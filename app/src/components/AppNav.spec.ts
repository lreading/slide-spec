import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { contentRepository } from '../content/ContentRepository'
import { createAppRouter } from '../router'
import AppNav from './AppNav.vue'

describe('AppNav', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the featured deck link and closes the mobile menu on route changes', async () => {
    const router = createAppRouter(true)
    await router.push('/')
    await router.isReady()

    const wrapper = mount(AppNav, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const links = wrapper.findAllComponents(RouterLinkStub)
    expect(links[3].props('to')).toEqual({
      name: 'presentation',
      params: { presentationId: '2026-q1' },
    })
    expect(wrapper.get('a[href="https://www.threatdragon.com/docs"]').text()).toBe('Threat Dragon Docs')

    await wrapper.find('.app-nav__toggle').trigger('click')
    expect(wrapper.find('.app-nav__links').classes()).toContain('app-nav__links--open')

    await router.push('/presentations')
    await flushPromises()

    expect(wrapper.find('.app-nav__links').classes()).not.toContain('app-nav__links--open')
    expect(wrapper.findAll('.app-nav__link--active')[0]?.text()).toBe('Presentations')
  })

  it('uses the current presentation route when already inside a deck', async () => {
    const router = createAppRouter(true)
    await router.push('/presentations/2026-q1')
    await router.isReady()

    const wrapper = mount(AppNav, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const links = wrapper.findAllComponents(RouterLinkStub)
    expect(links[3].props('to')).toEqual({
      name: 'presentation',
      params: { presentationId: '2026-q1' },
    })
    expect(wrapper.findAll('.app-nav__link--active')[0]?.text()).toBe('Latest Presentation')
  })

  it('falls back to the first presentation when there is no featured deck', async () => {
    vi.spyOn(contentRepository, 'listPresentations').mockReturnValue([
      {
        id: '2026-q2',
        year: 2026,
        title: 'Q2 Deck',
        subtitle: 'Q2 2026',
        summary: 'Fallback deck',
        presentation_path: 'presentations/2026-q2/presentation.yaml',
        published: true,
        featured: false,
      },
    ])

    const router = createAppRouter(true)
    await router.push('/')
    await router.isReady()

    const wrapper = mount(AppNav, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const links = wrapper.findAllComponents(RouterLinkStub)
    expect(links[3].props('to')).toEqual({
      name: 'presentation',
      params: { presentationId: '2026-q2' },
    })
  })

  it('hides the docs nav link when navigation.docs_enabled is false', async () => {
    vi.spyOn(contentRepository, 'getSiteContent').mockReturnValue({
      title: 'Threat Dragon Quarterly Updates',
      home_intro: 'Intro',
      home_cta_label: 'Latest',
      presentations_cta_label: 'Presentations',
      navigation: {
        brand_title: 'Threat Dragon Updates',
        home_label: 'Home',
        presentations_label: 'Presentations',
        latest_presentation_label: 'Latest Presentation',
        docs_enabled: false,
        toggle_label: 'Toggle navigation',
      },
      links: {
        repository: {
          label: 'Repo',
          url: 'https://example.com/repo',
        },
        docs: {
          label: 'Docs',
          url: 'https://example.com/docs',
        },
        community: {
          label: 'Community',
          url: 'https://example.com/community',
        },
      },
    })

    const router = createAppRouter(true)
    await router.push('/')
    await router.isReady()

    const wrapper = mount(AppNav, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.find('a[href="https://example.com/docs"]').exists()).toBe(false)
  })

  it('hides navigation labels when config values are blank', async () => {
    vi.spyOn(contentRepository, 'getSiteContent').mockReturnValue({
      title: 'Threat Dragon Quarterly Updates',
      home_intro: 'Intro',
      home_cta_label: 'Latest',
      presentations_cta_label: 'Presentations',
      navigation: {
        brand_title: '   ',
        home_label: '   ',
        presentations_label: '   ',
        latest_presentation_label: '   ',
        docs_enabled: false,
        toggle_label: '   ',
      },
      links: {
        repository: {
          label: 'Repo',
          url: 'https://example.com/repo',
        },
        docs: {
          label: 'Docs',
          url: 'https://example.com/docs',
        },
        community: {
          label: 'Community',
          url: 'https://example.com/community',
        },
      },
    })

    const router = createAppRouter(true)
    await router.push('/')
    await router.isReady()

    const wrapper = mount(AppNav, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).not.toContain('Threat Dragon Updates')
    expect(wrapper.text()).not.toContain('Home')
    expect(wrapper.text()).not.toContain('Presentations')
    expect(wrapper.text()).not.toContain('Latest Presentation')
    expect(wrapper.get('.app-nav__toggle').attributes('aria-label')).toBeUndefined()
  })
})
