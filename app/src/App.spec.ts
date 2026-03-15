import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import App from './App.vue'
import { createAppRouter } from './router'

describe('App', () => {
  it('renders the app nav and the routed home view', async () => {
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      value: null,
    })

    const router = createAppRouter(true)

    await router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Threat Dragon Quarterly Updates')
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Presentations')
    expect(wrapper.text()).toContain('Current Deck')
  })

  it('hides the nav during fullscreen presentation', async () => {
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      value: null,
      writable: true,
    })

    const router = createAppRouter(true)

    await router.push('/presentations/2026-q1?mode=presentation')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.findComponent({ name: 'AppNav' }).exists()).toBe(true)

    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      value: document.documentElement,
      writable: true,
    })
    document.dispatchEvent(new Event('fullscreenchange'))
    await flushPromises()

    expect(wrapper.findComponent({ name: 'AppNav' }).exists()).toBe(false)
  })

  it('removes the fullscreen listener when unmounted', async () => {
    const removeEventListener = vi.spyOn(document, 'removeEventListener')

    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      value: null,
    })

    const router = createAppRouter(true)
    await router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    wrapper.unmount()

    expect(removeEventListener).toHaveBeenCalledWith('fullscreenchange', expect.any(Function))
  })
})
