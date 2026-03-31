import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import App from './App.vue'
import { contentRepository, rawContentFiles } from './content/ContentRepository'
import { createAppRouter } from './router'

describe('App', () => {
  const normalizeText = (value: string): string => value.replace(/\s+/g, ' ').trim()
  const sitePath = Object.keys(rawContentFiles).find((path) => path.endsWith('site.yaml'))

  afterEach(() => {
    contentRepository.replaceFiles(rawContentFiles)
  })

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

    const text = normalizeText(wrapper.text())

    expect(text).toContain('Threat Dragon Updates')
    expect(text).toContain('OWASP Threat Dragon')
    expect(text).toContain('Home')
    expect(text).toContain('Presentations')
    expect(text).toContain('Latest Presentation')
    expect(text).toContain('github.com/lreading/slide-spec')
  })

  it('hides chrome when presentation mode is active', async () => {
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

    expect(wrapper.findComponent({ name: 'AppNav' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'AppFooter' }).exists()).toBe(false)

    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      value: document.documentElement,
      writable: true,
    })
    document.dispatchEvent(new Event('fullscreenchange'))
    await flushPromises()

    expect(wrapper.findComponent({ name: 'AppNav' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'AppFooter' }).exists()).toBe(false)
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

  it('re-renders when the content changes', async () => {
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

    expect(normalizeText(wrapper.text())).toContain('Threat Dragon Updates')

    expect(sitePath).toBeDefined()

    contentRepository.replaceFiles({
      ...rawContentFiles,
      [sitePath as string]: `
site:
  title: Updated Demo
  home_intro: Updated intro
  home_cta_label: Open
  presentations_cta_label: Presentations
  links:
    repository:
      label: Repository
      url: https://example.com/repository
    docs:
      label: Docs
      url: https://example.com/docs
    community:
      label: Community
      url: https://example.com/community
`,
    })
    await flushPromises()

    expect(normalizeText(wrapper.text())).toContain('Updated intro')
  })
})
