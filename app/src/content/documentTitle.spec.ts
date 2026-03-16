import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Router } from 'vue-router'

import { contentRepository } from './ContentRepository'
import { installDocumentTitleSync, resolveDocumentTitle } from './documentTitle'

describe('resolveDocumentTitle', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses the site title for the home route', () => {
    expect(resolveDocumentTitle({ name: 'home', params: {} })).toBe(
      'Threat Dragon Quarterly Updates',
    )
  })

  it('uses the configured presentations page title for the presentations route', () => {
    expect(resolveDocumentTitle({ name: 'presentations', params: {} })).toBe(
      'All presentations | Threat Dragon Quarterly Updates',
    )
  })

  it('uses the current presentation title for presentation routes', () => {
    expect(
      resolveDocumentTitle({
        name: 'presentation',
        params: {
          presentationId: '2026-q1',
        },
      }),
    ).toBe('OWASP Threat Dragon Quarterly Community Update | Threat Dragon Quarterly Updates')
  })

  it('falls back to the site title when the presentation cannot be resolved', () => {
    const getPresentation = vi
      .spyOn(contentRepository, 'getPresentation')
      .mockImplementation(() => {
        throw new Error('missing')
      })

    expect(
      resolveDocumentTitle({
        name: 'presentation',
        params: {
          presentationId: 'missing',
        },
      }),
    ).toBe('Threat Dragon Quarterly Updates')
    expect(getPresentation).toHaveBeenCalledWith('missing')
  })

  it('registers a router hook that keeps document.title in sync', () => {
    const afterEach = vi.fn((callback: (route: { name: string; params: Record<string, string> }) => void) => {
      callback({
        name: 'presentations',
        params: {},
      })
    })

    installDocumentTitleSync({
      afterEach,
    } as unknown as Router)

    expect(afterEach).toHaveBeenCalledOnce()
    expect(document.title).toBe('All presentations | Threat Dragon Quarterly Updates')
  })
})
