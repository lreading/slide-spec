import { describe, expect, it } from 'vitest'

import { ContentRepository, selectContentFiles } from './ContentRepository'

const files = {
  '/virtual/site.yaml': `
site:
  title: Test Site
  project_badge:
    label: Demo
    fa_icon: fa-flask
    icon_position: before
  presentation_logo:
    url: /favicon.ico
    alt: Demo logo
  home_intro: Intro
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
  '/virtual/presentations/index.yaml': `
presentations:
  - id: 2025-q4
    presentation_path: presentations/2025-q4/presentation.yaml
    generated_path: presentations/2025-q4/generated.yaml
    year: 2025
    title: Q4
    subtitle: Q4 2025
    summary: Previous
    published: true
    featured: false
  - id: 2026-q1
    presentation_path: presentations/2026-q1/presentation.yaml
    generated_path: presentations/2026-q1/generated.yaml
    year: 2026
    title: Q1
    subtitle: Q1 2026
    summary: Latest
    published: true
    featured: true
`,
  '/virtual/presentations/2026-q1/presentation.yaml': `
presentation:
  id: 2026-q1
  year: 2026
  title: Q1
  subtitle: Q1 2026
  slides:
    - template: hero
      enabled: true
      content:
        title_primary: Q1
`,
  '/virtual/presentations/2026-q1/generated.yaml': `
generated:
  id: 2026-q1
  period:
    start: 2026-01-01
    end: 2026-03-31
  stats: {}
  releases: []
  contributors:
    total: 0
    authors: []
`,
  '/virtual/presentations/2025-q4/presentation.yaml': `
presentation:
  id: 2025-q4
  year: 2025
  title: Q4
  subtitle: Q4 2025
  slides:
    - template: hero
      enabled: true
      content:
        title_primary: Q4
`,
  '/virtual/presentations/2025-q4/generated.yaml': `
generated:
  id: 2025-q4
  period:
    start: 2025-10-01
    end: 2025-12-31
  stats: {}
  releases: []
  contributors:
    total: 0
    authors: []
`,
}

describe('ContentRepository', () => {
  it('selects fixture files only when fixture mode is enabled', () => {
    expect(selectContentFiles(undefined, { live: true }, { fixture: true }, { demo: true }, { docs: true }, { cli: true })).toEqual({
      live: true,
    })
    expect(selectContentFiles('fixtures', { live: true }, { fixture: true }, { demo: true }, { docs: true }, { cli: true })).toEqual({
      fixture: true,
    })
    expect(selectContentFiles('demo', { live: true }, { fixture: true }, { demo: true }, { docs: true }, { cli: true })).toEqual({
      demo: true,
    })
    expect(selectContentFiles('docs-reference', { live: true }, { fixture: true }, { demo: true }, { docs: true }, { cli: true })).toEqual({
      docs: true,
    })
    expect(selectContentFiles('cli-demo', { live: true }, { fixture: true }, { demo: true }, { docs: true }, { cli: true })).toEqual({
      cli: true,
    })
  })

  it('loads the site content', () => {
    const repository = new ContentRepository(files)

    expect(repository.getSiteContent().title).toBe('Test Site')
  })

  it('preserves authored presentation order from the index', () => {
    const repository = new ContentRepository(files)

    expect(repository.listPresentations().map((entry) => entry.id)).toEqual(['2025-q4', '2026-q1'])
    expect(repository.listPresentations()[0]).toMatchObject({
      presentation_path: 'presentations/2025-q4/presentation.yaml',
      generated_path: 'presentations/2025-q4/generated.yaml',
    })
  })

  it('returns the merged presentation record for a quarter', () => {
    const repository = new ContentRepository(files)

    expect(repository.getPresentation('2026-q1').presentation.subtitle).toBe('Q1 2026')
  })

  it('throws for unknown presentations', () => {
    const repository = new ContentRepository(files)

    expect(() => repository.getPresentation('missing')).toThrow('Unknown presentation "missing".')
  })

  it('throws when presentation documents do not match the index entry', () => {
    const repository = new ContentRepository({
      ...files,
      '/virtual/presentations/2026-q1/generated.yaml': `
generated:
  id: 2026-q2
  period:
    start: 2026-01-01
    end: 2026-03-31
  stats: {}
  releases: []
  contributors:
    total: 0
    authors: []
`,
    })

    expect(() => repository.getPresentation('2026-q1')).toThrow(
      'Presentation id mismatch between index "2026-q1" and generated "2026-q2".',
    )
  })

  it('throws when a required content file is missing', () => {
    const repository = new ContentRepository({
      '/virtual/site.yaml': files['/virtual/site.yaml'],
    })

    expect(() => repository.listPresentations()).toThrow('Missing content file "presentations/index.yaml".')
  })

  it('can replace content files and increment the content version', () => {
    const repository = new ContentRepository(files)

    expect(repository.getContentVersion().value).toBe(0)

    repository.replaceFiles({
      ...files,
      '/virtual/site.yaml': `
site:
  title: Updated Site
  home_intro: Intro
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

    expect(repository.getContentVersion().value).toBe(1)
    expect(repository.getSiteContent().title).toBe('Updated Site')
  })
})
