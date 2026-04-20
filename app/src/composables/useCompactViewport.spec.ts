import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useCompactViewport } from './useCompactViewport'

describe('useCompactViewport', () => {
  const originalMatchMedia = window.matchMedia
  const originalInnerWidth = window.innerWidth

  const setViewportWidth = (width: number): void => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: width,
    })
  }

  const createHarness = () =>
    defineComponent({
      setup() {
        return useCompactViewport()
      },
      template: '<span>{{ isCompactViewport ? "compact" : "wide" }}</span>',
    })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: originalInnerWidth,
    })
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: originalMatchMedia,
    })
    vi.restoreAllMocks()
  })

  it('updates compact viewport state from resize events when matchMedia is unavailable', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: undefined,
    })
    setViewportWidth(1024)

    const wrapper = mount(createHarness())

    expect(wrapper.text()).toBe('wide')

    setViewportWidth(390)
    window.dispatchEvent(new Event('resize'))
    await nextTick()

    expect(wrapper.text()).toBe('compact')
    wrapper.unmount()
  })

  it('updates compact viewport state from matchMedia change events', async () => {
    let matches = false
    let listener: (() => void) | undefined
    const mediaQueryList = {
      get matches() {
        return matches
      },
      addEventListener: vi.fn((_event: 'change', nextListener: () => void) => {
        listener = nextListener
      }),
      removeEventListener: vi.fn(),
    }

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => mediaQueryList),
    })

    const wrapper = mount(createHarness())

    expect(wrapper.text()).toBe('wide')
    expect(mediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))

    matches = true
    listener?.()
    await nextTick()

    expect(wrapper.text()).toBe('compact')

    wrapper.unmount()
    expect(mediaQueryList.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
