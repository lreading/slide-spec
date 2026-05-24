import { afterEach, describe, expect, it } from 'vitest'
import { createTempDirectory, projectPath, readYamlFile, removePath, runCli } from './cli-e2e-helpers'

interface SiteDocument {
  readonly site: {
    readonly data_sources?: Array<{ type: string; url: string }>
    readonly links: {
      readonly repository: { url: string }
      readonly docs: { url: string }
      readonly community: { url: string }
    }
  }
}

interface PresentationIndexDocument {
  readonly presentations: Array<{
    readonly id: string
    readonly title: string
    readonly subtitle: string
    readonly summary: string
    readonly featured: boolean
  }>
}

interface PresentationDocument {
  readonly presentation: {
    readonly title?: string
    readonly subtitle?: string
    readonly summary?: string
    readonly slides: unknown[]
  }
}

interface GeneratedDocument {
  readonly generated: {
    readonly id: string
    readonly period: {
      readonly start: string
      readonly end: string
    }
  }
}

const cleanupPaths: string[] = []

afterEach(async () => {
  await Promise.all(cleanupPaths.splice(0).map((path) => removePath(path)))
})

async function createProjectRoot(name: string): Promise<string> {
  const projectRoot = await createTempDirectory(name)
  cleanupPaths.push(projectRoot)
  return projectRoot
}

describe('built CLI init e2e', () => {
  it('scaffolds a blank project with every init flag and preserves documented defaults', async () => {
    const projectRoot = await createProjectRoot('init-all-flags')
    const result = await runCli([
      'init',
      '--project-root',
      projectRoot,
      '--presentation-id',
      '2026-spring',
      '--title',
      'Spring Product Brief',
      '--subtitle',
      'Spring 2026',
      '--from-date',
      '2026-03-01',
      '--to-date',
      '2026-05-31',
      '--summary',
      'Spring release and community update.',
      '--repository-url',
      'https://github.com/lreading/slide-spec',
      '--docs-url',
      'https://www.slide-spec.dev/',
      '--website-url',
      'https://example.com/community',
      '--github-data-source-url',
      'https://github.com/lreading/slide-spec',
      '--force',
    ])
    const site = await readYamlFile<SiteDocument>(projectPath(projectRoot, 'content', 'site.yaml'))
    const index = await readYamlFile<PresentationIndexDocument>(
      projectPath(projectRoot, 'content', 'presentations', 'index.yaml'),
    )
    const presentation = await readYamlFile<PresentationDocument>(
      projectPath(projectRoot, 'content', 'presentations', '2026-spring', 'presentation.yaml'),
    )
    const generated = await readYamlFile<GeneratedDocument>(
      projectPath(projectRoot, 'content', 'presentations', '2026-spring', 'generated.yaml'),
    )

    expect(result.stdout).toContain('Initialized 2026-spring')
    expect(site.site.links.repository.url).toBe('https://github.com/lreading/slide-spec')
    expect(site.site.links.docs.url).toBe('https://www.slide-spec.dev/')
    expect(site.site.links.community.url).toBe('https://example.com/community')
    expect(site.site.data_sources).toEqual([{ type: 'github', url: 'https://github.com/lreading/slide-spec' }])
    expect(index.presentations[0]).toMatchObject({
      id: '2026-spring',
      title: 'Spring Product Brief',
      subtitle: 'Spring 2026',
      summary: 'Spring release and community update.',
      featured: true,
    })
    expect(presentation.presentation.slides.length).toBeGreaterThan(5)
    expect(generated.generated.period).toEqual({ start: '2026-03-01', end: '2026-05-31' })
  })

  it('scaffolds init with only required flags and default placeholder fields', async () => {
    const projectRoot = await createProjectRoot('init-required')
    const result = await runCli([
      'init',
      projectRoot,
      '--presentation-id',
      '2026-minimal',
      '--title',
      'Minimal Brief',
      '--from-date',
      '2026-01-15',
    ])
    const site = await readYamlFile<SiteDocument>(projectPath(projectRoot, 'content', 'site.yaml'))
    const index = await readYamlFile<PresentationIndexDocument>(
      projectPath(projectRoot, 'content', 'presentations', 'index.yaml'),
    )
    const generated = await readYamlFile<GeneratedDocument>(
      projectPath(projectRoot, 'content', 'presentations', '2026-minimal', 'generated.yaml'),
    )

    expect(result.status).toBe(0)
    expect(site.site.data_sources).toBeUndefined()
    expect(site.site.links.repository.url).toBe('https://example.com/repository')
    expect(index.presentations[0]?.summary).toBe('Replace with a summary before publishing.')
    expect(index.presentations[0]?.subtitle).toBe('Replace with a subtitle before publishing.')
    expect(generated.generated.id).toBe('2026-minimal')
  })

  it.each([
    ['--presentation-id', ['--title', 'Missing ID', '--from-date', '2026-01-01']],
    ['--title', ['--presentation-id', 'missing-title', '--from-date', '2026-01-01']],
    ['--from-date', ['--presentation-id', 'missing-date', '--title', 'Missing Date']],
  ])('rejects init when %s is missing', async (flag, args) => {
    const projectRoot = await createProjectRoot('init-missing')
    const result = await runCli(['init', projectRoot, ...args])

    expect(result.status).toBe(1)
    expect(result.stderr).toContain(`Missing required option: ${flag}.`)
  })

  it('runs the full interactive blank init flow', async () => {
    const projectRoot = await createProjectRoot('interactive-init')
    const result = await runCli(['init'], {
      inputLines: [
        'n',
        projectRoot,
        'interactive-brief',
        'Interactive Brief',
        '',
        '2026-04-01',
        '',
        'Interactive summary.',
        'n',
        'https://github.com/lreading/slide-spec',
        '',
        '',
        'n',
        'n',
      ],
    })
    const index = await readYamlFile<PresentationIndexDocument>(
      projectPath(projectRoot, 'content', 'presentations', 'index.yaml'),
    )

    expect(result.status).toBe(0)
    expect(index.presentations[0]?.id).toBe('interactive-brief')
    expect(index.presentations[0]?.summary).toBe('Interactive summary.')
  })
})
