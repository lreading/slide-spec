import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createAppRouter } from '../router'
import DeckView from './DeckView.vue'

describe('DeckView', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'fullscreenEnabled', {
      configurable: true,
      value: false,
    })
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      value: null,
    })
  })

  it('renders the current slide and updates route query on keyboard navigation', async () => {
    const router = createAppRouter(true)

    await router.push('/presentations/2026-q1?slide=1')
    await router.isReady()

    const wrapper = mount(DeckView, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('OWASP Threat Dragon Quarterly Community Update')

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await flushPromises()

    expect(router.currentRoute.value.query.slide).toBe('2')
    expect(wrapper.text()).toContain('Agenda')
    wrapper.unmount()
  })

  it('normalizes invalid slide queries and exits presentation mode on escape', async () => {
    const router = createAppRouter(true)

    await router.push('/presentations/2026-q1?slide=999&mode=presentation')
    await router.isReady()

    const wrapper = mount(DeckView, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    await flushPromises()

    expect(router.currentRoute.value.query.slide).toBe('9')
    expect(wrapper.find('.page-header').exists()).toBe(false)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()

    expect(router.currentRoute.value.query.mode).toBeUndefined()
    wrapper.unmount()
  })

  it('supports first, last, and fullscreen shortcuts', async () => {
    const requestFullscreen = vi.fn<() => Promise<void>>().mockResolvedValue(undefined)
    const exitFullscreen = vi.fn<() => Promise<void>>().mockResolvedValue(undefined)

    Object.defineProperty(document, 'fullscreenEnabled', {
      configurable: true,
      value: true,
    })
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      configurable: true,
      value: requestFullscreen,
    })
    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
      value: exitFullscreen,
    })

    const router = createAppRouter(true)

    await router.push('/presentations/2026-q1?slide=3')
    await router.isReady()

    const wrapper = mount(DeckView, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }))
    await flushPromises()
    expect(router.currentRoute.value.query.slide).toBe('1')

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }))
    await flushPromises()
    expect(router.currentRoute.value.query.slide).toBe('9')

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' }))
    await flushPromises()
    expect(requestFullscreen).toHaveBeenCalledTimes(1)

    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      value: document.documentElement,
    })

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()
    expect(exitFullscreen).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('ignores modified shortcuts and toggles presentation mode with p', async () => {
    const router = createAppRouter(true)

    await router.push('/presentations/2026-q1?slide=2')
    await router.isReady()

    const wrapper = mount(DeckView, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', ctrlKey: true }))
    await flushPromises()
    expect(router.currentRoute.value.query.slide).toBe('2')

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }))
    await flushPromises()
    expect(router.currentRoute.value.query.mode).toBe('presentation')

    wrapper.unmount()
  })

  it('does nothing for fullscreen requests when fullscreen is unavailable', async () => {
    const requestFullscreen = vi.fn<() => Promise<void>>().mockResolvedValue(undefined)

    Object.defineProperty(document, 'fullscreenEnabled', {
      configurable: true,
      value: false,
    })
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      configurable: true,
      value: requestFullscreen,
    })

    const router = createAppRouter(true)

    await router.push('/presentations/2026-q1?slide=3')
    await router.isReady()

    const wrapper = mount(DeckView, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' }))
    await flushPromises()
    expect(requestFullscreen).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})
