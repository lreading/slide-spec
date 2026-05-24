import { afterEach, describe, expect, it } from 'vitest'
import { mkdir, writeFile } from 'node:fs/promises'

import {
  createTempDirectory,
  projectPath,
  readText,
  removePath,
  runCli,
} from './cli-e2e-helpers'

const cleanupPaths: string[] = []

afterEach(async () => {
  await Promise.all(cleanupPaths.splice(0).map((path) => removePath(path)))
})

async function createProjectRoot(name: string): Promise<string> {
  const projectRoot = await createTempDirectory(name)
  cleanupPaths.push(projectRoot)
  return projectRoot
}

async function initBlankProject(projectRoot: string): Promise<void> {
  const result = await runCli([
    'init',
    projectRoot,
    '--presentation-id',
    '2026-q1',
    '--title',
    'Quarterly Update',
    '--subtitle',
    'Spring 2026',
    '--from-date',
    '2026-03-01',
    '--to-date',
    '2026-05-31',
    '--summary',
    'A focused project update.',
    '--github-data-source-url',
    'https://github.com/lreading/slide-spec',
    '--force',
  ])

  expect(result.status).toBe(0)
}
describe('built CLI command e2e', () => {
  it('prints global, command-specific, and unknown-topic help matrix', async () => {
    const checks: Array<readonly [readonly string[], string]> = [
      [['--help'], 'Usage: slide-spec <command> [options]'],
      [['-h'], 'Usage: slide-spec <command> [options]'],
      [['help'], 'Commands:'],
      [['help', 'init'], 'Usage: slide-spec init'],
      [['help', 'fetch'], 'Usage: slide-spec fetch'],
      [['help', 'validate'], 'Usage: slide-spec validate'],
      [['help', 'serve'], 'Usage: slide-spec serve'],
      [['help', 'build'], 'Usage: slide-spec build'],
      [['init', '-h'], 'Usage: slide-spec init'],
      [['fetch', '-h'], 'Usage: slide-spec fetch'],
      [['validate', '-h'], 'Usage: slide-spec validate'],
      [['serve', '-h'], 'Usage: slide-spec serve'],
      [['build', '-h'], 'Usage: slide-spec build'],
    ]
    for (const [args, expected] of checks) {
      const result = await runCli(args)
      expect(result.status).toBe(0)
      expect(result.stdout).toContain(expected)
    }
    const unknownTopic = await runCli(['help', 'wat'])
    expect(unknownTopic.status).toBe(0)
    expect(unknownTopic.stdout).toContain('Unknown help topic "wat".')
  })

  it('validates global log-path parsing and sanitizes log output', async () => {
    const projectRoot = await createProjectRoot('log-path')
    const logPath = projectPath(projectRoot, 'cli.log')
    const logPathWithEquals = projectPath(projectRoot, 'with-equals.log')
    const helpResult = await runCli(['--log-path', logPath, 'help', 'validate'])
    const equalsResult = await runCli([`--log-path=${logPathWithEquals}`, 'help', 'build'])
    const missingPath = await runCli(['--log-path'])
    const emptyPath = await runCli(['--log-path='])
    const unwritablePath = await runCli(['--log-path', '/proc/1/mem', 'help'])
    const duplicatePath = await runCli(['--log-path', logPath, '--log-path=another.log', 'help'])
    const sanitized = await runCli(['--log-path', logPath, 'GH_TOKEN=secret-token'])

    expect(helpResult.status).toBe(0)
    expect(equalsResult.status).toBe(0)
    expect(await readText(logPath)).toContain('Usage: slide-spec validate')
    expect(await readText(logPathWithEquals)).toContain('Usage: slide-spec build')
    expect(missingPath.status).toBe(1)
    expect(missingPath.stderr).toContain('Option "--log-path" must include a file path.')
    expect(emptyPath.status).toBe(1)
    expect(emptyPath.stderr).toContain('Option "--log-path" must include a file path.')
    expect(unwritablePath.status).toBe(1)
    expect(unwritablePath.stderr).toMatch(/EACCES|permission/i)
    expect(duplicatePath.status).toBe(1)
    expect(duplicatePath.stderr).toContain('Specify "--log-path" only once.')
    expect(sanitized.status).toBe(1)
    expect(sanitized.stderr).toContain('Unknown command "GH_TOKEN=[REDACTED]".')
  })
  it('rejects unknown commands, root conflicts, and unexpected positionals', async () => {
    const projectRoot = await createProjectRoot('root-conflict')
    const unknown = await runCli(['totally-unknown'])
    const conflict = await runCli(['validate', projectRoot, '--project-root', projectRoot])
    const unexpected = await runCli(['build', projectRoot, 'extra'])
    expect(unknown.status).toBe(1)
    expect(unknown.stderr).toContain('Unknown command "totally-unknown".')
    expect(conflict.status).toBe(1)
    expect(conflict.stderr).toContain('Specify the project root either positionally or with --project-root, not both.')
    expect(unexpected.status).toBe(1)
    expect(unexpected.stderr).toContain('Unexpected argument "extra".')
  })
  it('validates strict flag/value behavior, cwd default, and spaces in project roots', async () => {
    const projectRoot = await createProjectRoot('validate')
    const parent = await createProjectRoot('validate-space-parent')
    const spaceRoot = projectPath(parent, 'project with spaces')
    await mkdir(spaceRoot)
    await initBlankProject(projectRoot)
    await initBlankProject(spaceRoot)

    const accidentalBooleanValue = await runCli(['validate', projectRoot, '--strict', 'unexpected'])
    const cwdDefault = await runCli(['validate'], { cwd: projectRoot })
    const withSpacePath = await runCli(['validate', spaceRoot])
    expect(accidentalBooleanValue.status).toBe(0)
    expect(accidentalBooleanValue.stdout).toContain('Content is valid')
    expect(cwdDefault.status).toBe(0)
    expect(cwdDefault.stdout).toContain('Content is valid')
    expect(withSpacePath.status).toBe(0)
    expect(withSpacePath.stdout).toContain('Content is valid')
  })
  it('reports validate schema/content failures for generated and presentation files', async () => {
    const generatedInvalidRoot = await createProjectRoot('generated-invalid')
    await initBlankProject(generatedInvalidRoot)
    await writeFile(projectPath(generatedInvalidRoot, 'content/presentations/2026-q1/generated.yaml'), 'schemaVersion: 2\n')
    const generatedInvalid = await runCli(['validate', generatedInvalidRoot])
    const presentationInvalidRoot = await createProjectRoot('presentation-invalid')
    await initBlankProject(presentationInvalidRoot)
    await writeFile(projectPath(presentationInvalidRoot, 'content/presentations/2026-q1/presentation.yaml'), 'schemaVersion: 2\n')
    const presentationInvalid = await runCli(['validate', presentationInvalidRoot])
    expect(generatedInvalid.status).toBe(1)
    expect(generatedInvalid.stderr).toContain('schemaVersion')
    expect(presentationInvalid.status).toBe(1)
    expect(presentationInvalid.stderr).toContain('schemaVersion')
  })
  it('rejects invalid serve and fetch option combinations and fetch default/root errors', async () => {
    const projectRoot = await createProjectRoot('errors')
    const noSourceProjectRoot = await createProjectRoot('fetch-no-source')
    await initBlankProject(projectRoot)

    const invalidPort = await runCli(['serve', projectRoot, '--port', 'not-a-port'])
    const missingFetchId = await runCli(['fetch', projectRoot, '--from-date', '2026-01-01'])
    const missingFromDate = await runCli(['fetch', projectRoot, '--presentation-id', '2026-q1'])
    const fetchRootConflict = await runCli(['fetch', projectRoot, '--project-root', projectRoot, '--presentation-id', '2026-q1', '--from-date', '2026-01-01'])
    const initWithoutDataSource = await runCli([
      'init',
      noSourceProjectRoot,
      '--presentation-id',
      '2026-q1',
      '--title',
      'No Source',
      '--from-date',
      '2026-01-01',
    ])
    const missingDataSource = await runCli([
      'fetch',
      noSourceProjectRoot,
      '--presentation-id',
      '2026-q1',
      '--from-date',
      '2026-01-01',
      '--force',
    ])
    const missingDataSourceFromCwd = await runCli([
      'fetch',
      '--presentation-id',
      '2026-q1',
      '--from-date',
      '2026-01-01',
      '--force',
    ], { cwd: noSourceProjectRoot })
    expect(invalidPort.status).toBe(1)
    expect(invalidPort.stderr).toContain('Option "--port" must be a number.')
    expect(missingFetchId.status).toBe(1)
    expect(missingFetchId.stderr).toContain('Missing required option: --presentation-id.')
    expect(missingFromDate.status).toBe(1)
    expect(missingFromDate.stderr).toContain('Missing required option: --from-date.')
    expect(fetchRootConflict.status).toBe(1)
    expect(fetchRootConflict.stderr).toContain('Specify the project root either positionally or with --project-root, not both.')
    expect(initWithoutDataSource.status).toBe(0)
    expect(missingDataSource.status).toBe(1)
    expect(missingDataSource.stderr).toContain('site.data_sources must include exactly one github source.')
    expect(missingDataSourceFromCwd.status).toBe(1)
    expect(missingDataSourceFromCwd.stderr).toContain('site.data_sources must include exactly one github source.')
  })
})
