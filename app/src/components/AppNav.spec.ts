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
        quarter: 2,
        title: 'Q2 Deck',
        subtitle: 'Q2 2026',
        summary: 'Fallback deck',
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
})
