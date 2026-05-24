import { mkdir, writeFile } from 'node:fs/promises'

import { afterEach, describe, expect, it } from 'vitest'

import { createTempDirectory, projectPath, readText, readYamlFile, removePath, runCli } from './cli-e2e-helpers'

interface PresentationIndexDocument {
  readonly presentations: Array<{
    readonly id: string
    readonly featured: boolean
  }>
}

interface PresentationDocument {
  readonly presentation: {
    readonly title?: string
    readonly subtitle?: string
  }
}

interface GeneratedDocument {
  readonly generated: {
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

async function initBlank(projectRoot: string, args: readonly string[]): Promise<void> {
  const result = await runCli(['init', projectRoot, ...args])
  expect(result.status).toBe(0)
}

describe('built CLI init existing-content e2e', () => {
  it('fails for existing presentation without force and succeeds with force overwrite', async () => {
    const projectRoot = await createProjectRoot('init-existing-force')
    await initBlank(projectRoot, [
      '--presentation-id', '2026-q1', '--title', 'Original', '--subtitle', 'Orig Sub', '--summary', 'Orig Sum', '--from-date', '2026-01-01',
    ])

    const fail = await runCli([
      'init', projectRoot, '--presentation-id', '2026-q1', '--title', 'Updated', '--subtitle', 'New Sub', '--summary', 'New Sum', '--from-date', '2026-02-01', '--to-date', '2026-03-31',
    ])
    const pass = await runCli([
      'init', projectRoot, '--presentation-id', '2026-q1', '--title', 'Updated', '--subtitle', 'New Sub', '--summary', 'New Sum', '--from-date', '2026-02-01', '--to-date', '2026-03-31', '--force',
    ])
    const presentation = await readYamlFile<PresentationDocument>(
      projectPath(projectRoot, 'content', 'presentations', '2026-q1', 'presentation.yaml'),
    )
    const generated = await readYamlFile<GeneratedDocument>(
      projectPath(projectRoot, 'content', 'presentations', '2026-q1', 'generated.yaml'),
    )

    expect(fail.status).toBe(1)
    expect(fail.stderr).toContain('Presentation "2026-q1" already exists. Use force to overwrite scaffold files.')
    expect(pass.status).toBe(0)
    expect(presentation.presentation).toMatchObject({ title: 'Updated', subtitle: 'New Sub' })
    expect(generated.generated.period).toEqual({ start: '2026-02-01', end: '2026-03-31' })
  })

  it('preserves first featured presentation when adding a second presentation', async () => {
    const projectRoot = await createProjectRoot('init-second-presentation')
    await initBlank(projectRoot, ['--presentation-id', '2026-first', '--title', 'First', '--from-date', '2026-01-01'])
    await initBlank(projectRoot, ['--presentation-id', '2026-second', '--title', 'Second', '--from-date', '2026-02-01'])
    const index = await readYamlFile<PresentationIndexDocument>(
      projectPath(projectRoot, 'content', 'presentations', 'index.yaml'),
    )
    const byId = new Map(index.presentations.map((entry) => [entry.id, entry]))

    expect(index.presentations).toHaveLength(2)
    expect(byId.get('2026-first')).toMatchObject({ featured: true })
    expect(byId.get('2026-second')).toMatchObject({ featured: false })
  })

  it('does not overwrite existing content/site.yaml on later blank init without link/data-source flags', async () => {
    const projectRoot = await createProjectRoot('init-preserve-site')
    await initBlank(projectRoot, ['--presentation-id', '2026-first', '--title', 'First', '--from-date', '2026-01-01'])
    const sitePath = projectPath(projectRoot, 'content', 'site.yaml')
    const custom = (await readText(sitePath)).replace('https://example.com/repository', 'https://example.com/custom-repo')
    await writeFile(sitePath, custom, 'utf8')

    await initBlank(projectRoot, ['--presentation-id', '2026-second', '--title', 'Second', '--from-date', '2026-02-01'])

    expect(await readText(sitePath)).toContain('https://example.com/custom-repo')
  })

  it('fails from-example when content exists without force and overwrites with force', async () => {
    const projectRoot = await createProjectRoot('init-example-force')
    await initBlank(projectRoot, ['--presentation-id', 'seed', '--title', 'Seed', '--from-date', '2026-01-01'])

    const fail = await runCli(['init', projectRoot, '--from-example', 'open-source-update'])
    await writeFile(projectPath(projectRoot, 'content', 'marker.txt'), 'remove-me', 'utf8')
    const pass = await runCli(['init', projectRoot, '--from-example', 'open-source-update', '--force'])

    expect(fail.status).toBe(1)
    expect(fail.stderr).toContain('content/ already exists. Use --force to overwrite.')
    expect(pass.status).toBe(0)
    expect(await readText(projectPath(projectRoot, 'content', 'site.yaml'))).toContain('Vortex CLI Updates')
    expect(await readText(projectPath(projectRoot, 'content', 'presentations', 'index.yaml'))).toContain('2026-q1')
  })

  it('retries invalid example id in from-example prompt and succeeds with valid id', async () => {
    const projectRoot = await createProjectRoot('init-example-retry')
    const result = await runCli(['init', projectRoot, '--from-example'], {
      inputLines: ['not-a-real-example', 'product-review'],
    })

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Unknown example "not-a-real-example". Valid IDs:')
    expect(await readText(projectPath(projectRoot, 'content', 'site.yaml'))).toContain('Meridian')
  })

  it('supports spaces in project roots and uses cwd as default project root', async () => {
    const parent = await createProjectRoot('init-space-parent')
    const projectRoot = projectPath(parent, 'project with spaces')
    const cwdRoot = await createProjectRoot('init-cwd-default')
    await mkdir(projectRoot, { recursive: true })
    const spaceResult = await runCli([
      'init', projectRoot, '--presentation-id', 'space-path', '--title', 'Space Path', '--from-date', '2026-01-01',
    ])
    const cwdResult = await runCli(
      ['init', '--presentation-id', 'cwd-default', '--title', 'Cwd Default', '--from-date', '2026-01-01'],
      { cwd: cwdRoot },
    )

    expect(spaceResult.status).toBe(0)
    expect(cwdResult.status).toBe(0)
    expect(await readText(projectPath(projectRoot, 'content', 'presentations', 'space-path', 'presentation.yaml'))).toContain('presentation:')
    expect(await readText(projectPath(cwdRoot, 'content', 'presentations', 'cwd-default', 'generated.yaml'))).toContain('generated:')
  })

  it('rejects malformed and inverted reporting periods during init', async () => {
    const projectRoot = await createProjectRoot('init-invalid-dates')
    const malformed = await runCli([
      'init', projectRoot, '--presentation-id', 'bad-date', '--title', 'Bad Date', '--from-date', '01-01-2026',
    ])
    const inverted = await runCli([
      'init', projectRoot, '--presentation-id', 'bad-range', '--title', 'Bad Range', '--from-date', '2026-03-01', '--to-date', '2026-01-01',
    ])

    expect(malformed.status).toBe(1)
    expect(malformed.stderr).toContain('fromDate must be in YYYY-MM-DD format.')
    expect(inverted.status).toBe(1)
    expect(inverted.stderr).toContain('fromDate must be on or before toDate.')
  })

  it('rejects presentation ids that are not path-safe', async () => {
    const projectRoot = await createProjectRoot('init-invalid-id')
    const result = await runCli([
      'init', projectRoot, '--presentation-id', '../escape', '--title', 'Escape', '--from-date', '2026-01-01',
    ])

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('presentationId must be path-safe')
  })
})
