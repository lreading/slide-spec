import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PresentationToolbar from './PresentationToolbar.vue'

describe('PresentationToolbar', () => {
  const toolbarLabels = {
    navigationLabel: 'Slide navigation',
    previousSlideLabel: 'Previous slide',
    nextSlideLabel: 'Next slide',
    viewportModeLabel: 'Viewport mode',
    fullscreenModeLabel: 'Fullscreen mode',
  }

  it('emits navigation and mode events', async () => {
    const wrapper = mount(PresentationToolbar, {
      props: {
        slideNumber: 2,
        slideTotal: 9,
        ...toolbarLabels,
      },
    })

    const buttons = wrapper.findAll('button')

    await buttons[0].trigger('click')
    await buttons[1].trigger('click')
    await buttons[2].trigger('click')
    await buttons[3].trigger('click')
    expect(wrapper.emitted('previous')).toHaveLength(1)
    expect(wrapper.emitted('next')).toHaveLength(1)
    expect(wrapper.emitted('toggleViewportMode')).toHaveLength(1)
    expect(wrapper.emitted('toggleFullscreenMode')).toHaveLength(1)
  })

  it('renders compact slide controls and presentation mode triggers', () => {
    const wrapper = mount(PresentationToolbar, {
      props: {
        slideNumber: 1,
        slideTotal: 3,
        ...toolbarLabels,
      },
    })

    expect(wrapper.findAll('button')).toHaveLength(4)
    expect(wrapper.find('[aria-label="Previous slide"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Next slide"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Viewport mode')
    expect(wrapper.text()).toContain('Fullscreen mode')
    expect(wrapper.text()).toContain('1 / 3')
  })

  it('omits controls whose labels are not configured', () => {
    const wrapper = mount(PresentationToolbar, {
      props: {
        slideNumber: 1,
        slideTotal: 3,
      },
    })

    expect(wrapper.findAll('button')).toHaveLength(0)
    expect(wrapper.text()).toContain('1 / 3')
  })
})
