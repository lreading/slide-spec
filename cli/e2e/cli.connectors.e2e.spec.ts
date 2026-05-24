import { afterAll, describe, expect, it } from 'vitest'
import { writeFile } from 'node:fs/promises'

import {
  cliRoot,
  createTempDirectory,
  projectPath,
  readText,
  readYamlFile,
  removePath,
  runCli,
} from './cli-e2e-helpers'

interface GeneratedDocument {
  readonly generated: {
    readonly id: string
    readonly period: { readonly start: string; readonly end: string }
    readonly stats: {
      readonly issues_closed: { current: number; previous: number; delta: number }
      readonly new_contributors: { current: number; previous: number; delta: number }
      readonly prs_merged: { current: number; previous: number; delta: number }
      readonly stars: { current: number; previous: number; delta: number; metadata?: { comparison_status?: string } }
    }
    readonly releases: unknown[]
    readonly contributors: {
      readonly total: number
      readonly authors: unknown[]
    }
    readonly merged_prs: unknown[]
  }
}

const cleanupPaths: string[] = []

afterAll(async () => {
  await Promise.all(cleanupPaths.map((path) => removePath(path)))
})

async function resolveTokenFromCliEnv(): Promise<string | undefined> {
  for (const key of ['GH_TOKEN', 'GITHUB_TOKEN', 'GITHUB_PAT'] as const) {
    if (process.env[key]) {
      return process.env[key]
    }
  }
  const envText = await readText(projectPath(cliRoot, '.env'))
  for (const key of ['GH_TOKEN', 'GITHUB_TOKEN', 'GITHUB_PAT'] as const) {
    const match = envText.match(new RegExp(`^\\s*${key}\\s*=\\s*(.*)\\s*$`, 'm'))
    if (match?.[1]) {
      return match[1].replace(/^['"]|['"]$/g, '').trim() || undefined
    }
  }
  return undefined
}

async function createLiveProject(): Promise<{ projectRoot: string; presentationId: string }> {
  const projectRoot = await createTempDirectory('connectors')
  const presentationId = 'live-github'
  const repository = process.env.GITHUB_REPOSITORY ?? 'lreading/slide-spec'
  cleanupPaths.push(projectRoot)

  const initResult = await runCli([
    'init',
    projectRoot,
    '--presentation-id',
    presentationId,
    '--title',
    'Live GitHub Connector',
    '--from-date',
    '2026-01-01',
    '--to-date',
    '2026-05-24',
    '--github-data-source-url',
    `https://github.com/${repository}`,
  ])

  expect(initResult.status).toBe(0)

  return {
    projectRoot,
    presentationId,
  }
}

describe('built CLI generated.yaml connector e2e', () => {
  it('dry-run does not write generated.yaml and timings only print when requested', async () => {
    const token = await resolveTokenFromCliEnv()
    if (!token) throw new Error('Connector e2e requires GH_TOKEN, GITHUB_TOKEN, or GITHUB_PAT.')
    const { projectRoot, presentationId } = await createLiveProject()
    const generatedPath = projectPath(projectRoot, 'content', 'presentations', presentationId, 'generated.yaml')
    await removePath(generatedPath)

    const dryRunResult = await runCli([
      'fetch', projectRoot, '--presentation-id', presentationId, '--from-date', '2026-01-01', '--to-date', '2026-05-24', '--dry-run', '--force',
    ], { env: { GH_TOKEN: token }, timeoutMs: 180000 })
    expect(dryRunResult.status).toBe(0)
    expect(dryRunResult.stdout).toContain(`Fetched ${presentationId}`)
    expect(dryRunResult.stdout).not.toContain('Fetch timings:')
    await expect(readText(generatedPath)).rejects.toThrow()

    const withTimingsResult = await runCli([
      'fetch', '--project-root', projectRoot, '--presentation-id', presentationId, '--from-date', '2026-01-01', '--to-date', '2026-05-24', '--timings', '--force',
    ], { env: { GH_TOKEN: token }, timeoutMs: 180000 })
    expect(withTimingsResult.status).toBe(0)
    expect(withTimingsResult.stdout).toContain('Fetch timings:')
  })

  it('fails without --force when generated.yaml exists and succeeds with --force then validate', async () => {
    const token = await resolveTokenFromCliEnv()
    if (!token) throw new Error('Connector e2e requires GH_TOKEN, GITHUB_TOKEN, or GITHUB_PAT.')
    const { projectRoot, presentationId } = await createLiveProject()
    const generatedPath = projectPath(projectRoot, 'content', 'presentations', presentationId, 'generated.yaml')
    const withoutForceResult = await runCli([
      'fetch', projectRoot, '--presentation-id', presentationId, '--from-date', '2026-01-01', '--to-date', '2026-05-24',
    ], { env: { GH_TOKEN: token }, timeoutMs: 180000 })
    expect(withoutForceResult.status).toBe(1)
    expect(withoutForceResult.stderr).toContain('generated.yaml already exists')
    expect(withoutForceResult.stderr).toContain('Use --force')

    const withForceResult = await runCli([
      'fetch', projectRoot, '--presentation-id', presentationId, '--from-date', '2026-01-01', '--to-date', '2026-05-24', '--force',
    ], { env: { GH_TOKEN: token }, timeoutMs: 180000 })
    expect(withForceResult.status).toBe(0)
    const validateResult = await runCli(['validate', projectRoot], { timeoutMs: 120000 })
    expect(validateResult.status).toBe(0)
    expect(validateResult.stdout).toContain('Content is valid')
    expect((await readText(generatedPath)).length).toBeGreaterThan(0)
  })

  it('prefers explicit shell token over invalid project .env token', async () => {
    const token = await resolveTokenFromCliEnv()
    if (!token) throw new Error('Connector e2e requires GH_TOKEN, GITHUB_TOKEN, or GITHUB_PAT.')
    const { projectRoot, presentationId } = await createLiveProject()
    await writeFile(projectPath(projectRoot, '.env'), 'GITHUB_PAT=invalid-token\n', 'utf8')
    const result = await runCli([
      'fetch', projectRoot, '--presentation-id', presentationId, '--from-date', '2026-01-01', '--to-date', '2026-05-24', '--dry-run', '--force',
    ], { env: { GH_TOKEN: token, GITHUB_PAT: undefined, GITHUB_TOKEN: undefined }, timeoutMs: 180000 })
    expect(result.status).toBe(0)
  })

  it('accepts GITHUB_TOKEN and GITHUB_PAT env names and writes valid generated.yaml shape', async () => {
    const token = await resolveTokenFromCliEnv()
    if (!token) throw new Error('Connector e2e requires GH_TOKEN, GITHUB_TOKEN, or GITHUB_PAT.')
    const { projectRoot, presentationId } = await createLiveProject()
    const generatedPath = projectPath(projectRoot, 'content', 'presentations', presentationId, 'generated.yaml')
    for (const [name, otherA, otherB] of [
      ['GITHUB_TOKEN', 'GITHUB_PAT', 'GH_TOKEN'],
      ['GITHUB_PAT', 'GITHUB_TOKEN', 'GH_TOKEN'],
    ] as const) {
      const authResult = await runCli([
        'fetch', projectRoot, '--presentation-id', presentationId, '--from-date', '2026-01-01', '--to-date', '2026-05-24', '--dry-run', '--force',
      ], { env: { [name]: token, [otherA]: undefined, [otherB]: undefined }, timeoutMs: 180000 })
      expect(authResult.status).toBe(0)
    }
    const result = await runCli([
      'fetch', '--project-root', projectRoot, '--presentation-id', presentationId, '--from-date', '2026-01-01', '--to-date', '2026-05-24', '--no-previous-period', '--timings', '--force',
    ], { env: { GH_TOKEN: token }, timeoutMs: 180000 })
    const generated = await readYamlFile<GeneratedDocument>(generatedPath)

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Previous period comparison disabled; previous values defaulted to 0.')
    expect(result.stdout).toContain('Fetch timings:')
    expect(Object.keys(generated.generated.stats).sort()).toEqual([
      'issues_closed',
      'new_contributors',
      'prs_merged',
      'stars',
    ])
    expect(generated.generated.id).toBe(presentationId)
    expect(generated.generated.period).toEqual({ start: '2026-01-01', end: '2026-05-24' })
    expect(generated.generated.stats.stars.current).toBeGreaterThanOrEqual(0)
    expect(generated.generated.stats.stars.metadata?.comparison_status).toBe('skipped')
    expect(Array.isArray(generated.generated.releases)).toBe(true)
    expect(generated.generated.contributors.total).toBeGreaterThanOrEqual(0)
    expect(Array.isArray(generated.generated.contributors.authors)).toBe(true)
    expect(Array.isArray(generated.generated.merged_prs)).toBe(true)
    const validateResult = await runCli(['validate', projectRoot], { timeoutMs: 120000 })
    expect(validateResult.status).toBe(0)
  })
})
