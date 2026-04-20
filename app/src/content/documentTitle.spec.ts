import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import type { Router } from 'vue-router'

import { contentRepository, rawContentFiles } from './ContentRepository'
import { installDocumentTitleSync, resolveDocumentTitle } from './documentTitle'

describe('resolveDocumentTitle', () => {
  afterEach(() => {
    contentRepository.replaceFiles(rawContentFiles)
    vi.restoreAllMocks()
  })

  it('uses the site title for the home route', () => {
    expect(resolveDocumentTitle({ name: 'home', params: {} })).toBe(
      'Aurora Notes Quarterly Updates',
    )
  })

  it('uses the configured presentations page title for the presentations route', () => {
    expect(resolveDocumentTitle({ name: 'presentations', params: {} })).toBe(
      'All presentations | Aurora Notes Quarterly Updates',
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
    ).toBe('Aurora Notes Community Update | Aurora Notes Quarterly Updates')
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
    ).toBe('Aurora Notes Quarterly Updates')
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
    expect(document.title).toBe('All presentations | Aurora Notes Quarterly Updates')
  })

  it('updates document.title when live content changes and the router has a current route', async () => {
    const router = {
      afterEach: vi.fn(),
      currentRoute: ref({
        name: 'home',
        params: {},
      }),
    }

    installDocumentTitleSync(router as unknown as Router)

    const sitePath = Object.keys(rawContentFiles).find((path) => path.endsWith('site.yaml'))
    expect(sitePath).toBeDefined()

    contentRepository.replaceFiles({
      ...rawContentFiles,
      [sitePath as string]: `
schemaVersion: 1
site:
  title: Updated Aurora Notes Title
  home_intro: Intro
  home_cta_label: Latest
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

    await Promise.resolve()

    expect(document.title).toBe('Updated Aurora Notes Title')
  })

  it('falls back to the default presentations title when the presentations-page title is not configured', () => {
    vi.spyOn(contentRepository, 'getSiteContent').mockReturnValue({
      title: 'Aurora Notes Quarterly Updates',
      home_intro: 'Intro',
      home_cta_label: 'Latest',
      presentations_cta_label: 'Presentations',
      presentations_page: {
        title: '   ',
      },
      links: {},
    })

    expect(resolveDocumentTitle({ name: 'presentations', params: {} })).toBe(
      'All presentations | Aurora Notes Quarterly Updates',
    )
  })
})
