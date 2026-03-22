import { describe, expect, it, vi } from 'vitest'

import { CliCommandRunner } from './CliCommandRunner'

import type { TdCliService } from '../application/TdCliService'
import type { CliPrompter } from './CliPrompter'

function createService(): TdCliService {
  return {
    initPresentation: vi.fn().mockResolvedValue({
      presentationId: '2026-q1',
      createdPaths: [],
    }),
    fetchPresentationData: vi.fn().mockResolvedValue({
      presentationId: '2026-q1',
      generatedPath: '/tmp/generated.yaml',
      generated: {
        id: '2026-q1',
        period: {
          start: '2026-01-01',
          end: '2026-03-31',
        },
        stats: {},
        releases: [],
        contributors: {
          total: 0,
          authors: [],
        },
        merged_prs: [],
      },
      warnings: [],
    }),
    buildSite: vi.fn().mockResolvedValue({
      outputPath: '/repo/app/dist',
    }),
    serveSite: vi.fn().mockResolvedValue({
      url: 'http://127.0.0.1:5173/',
    }),
    validateContent: vi.fn().mockResolvedValue({
      valid: true,
      errors: [],
    }),
  }
}

function createOutput() {
  return {
    info: vi.fn(),
    error: vi.fn(),
  }
}

function createPrompter(overrides: Partial<CliPrompter> = {}): CliPrompter {
  return {
    promptCommand: vi.fn().mockResolvedValue('help'),
    promptRequired: vi.fn(),
    promptOptional: vi.fn().mockResolvedValue(undefined),
    promptBoolean: vi.fn().mockResolvedValue(undefined),
    promptNumber: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

describe('CliCommandRunner', () => {
  it('starts interactive mode when no command is provided', async () => {
    const output = createOutput()
    const prompter = createPrompter({
      promptCommand: vi.fn().mockResolvedValue('help'),
    })
    const runner = new CliCommandRunner(createService(), output, prompter)

    await expect(runner.run([])).resolves.toBe(0)
    expect(output.info).toHaveBeenCalledWith('No command provided. Starting interactive mode.')
    expect(output.info).toHaveBeenCalledWith(expect.stringContaining('Usage: oss-slides'))
  })

  it('prints help for explicit help flags', async () => {
    const output = createOutput()
    const runner = new CliCommandRunner(createService(), output)

    await expect(runner.run(['--help'])).resolves.toBe(0)
    await expect(runner.run(['-h'])).resolves.toBe(0)
    await expect(runner.run(['help', 'fetch'])).resolves.toBe(0)
    await expect(runner.run(['init', '--help'])).resolves.toBe(0)
    expect(output.info).toHaveBeenCalledWith(expect.stringContaining('Commands:'))
    expect(output.info).toHaveBeenCalledWith(expect.stringContaining('Usage: oss-slides fetch'))
    expect(output.info).toHaveBeenCalledWith(expect.stringContaining('Usage: oss-slides init'))
  })

  it('dispatches init with parsed options', async () => {
    const service = createService()
    const output = createOutput()
    const runner = new CliCommandRunner(service, output)

    await expect(runner.run([
      'init',
      '/workspace/project',
      '--presentation-id',
      '2026-q1',
      '--title',
      'Quarterly Community Update',
      '--subtitle',
      'Q1 2026',
      '--from-date',
      '2026-01-01',
      '--to-date',
      '2026-03-31',
      '--summary',
      'Summary',
      '--force',
    ])).resolves.toBe(0)

    expect(service.initPresentation).toHaveBeenCalledWith({
      projectRoot: '/workspace/project',
      presentationId: '2026-q1',
      title: 'Quarterly Community Update',
      subtitle: 'Q1 2026',
      fromDate: '2026-01-01',
      toDate: '2026-03-31',
      summary: 'Summary',
      force: true,
    })
    expect(output.info).toHaveBeenCalledWith('Initialized 2026-q1')
  })

  it('dispatches interactive init when the init subcommand has no flags', async () => {
    const service = createService()
    const output = createOutput()
    const prompter = createPrompter({
      promptOptional: vi.fn()
        .mockResolvedValueOnce('/workspace/project')
        .mockResolvedValueOnce('2026-04-30')
        .mockResolvedValueOnce('Summary'),
      promptRequired: vi.fn()
        .mockResolvedValueOnce('demo-id')
        .mockResolvedValueOnce('Demo Title')
        .mockResolvedValueOnce('Demo Subtitle')
        .mockResolvedValueOnce('2026-04-01'),
      promptBoolean: vi.fn().mockResolvedValueOnce(true),
    })
    const runner = new CliCommandRunner(service, output, prompter)

    await expect(runner.run(['init'])).resolves.toBe(0)

    expect(service.initPresentation).toHaveBeenCalledWith({
      projectRoot: '/workspace/project',
      presentationId: 'demo-id',
      title: 'Demo Title',
      subtitle: 'Demo Subtitle',
      fromDate: '2026-04-01',
      toDate: '2026-04-30',
      summary: 'Summary',
      force: true,
    })
    expect(output.info).toHaveBeenCalledWith('Initialized demo-id')
  })

  it('dispatches init and fetch with only required options', async () => {
    const service = createService()
    const output = createOutput()
    const runner = new CliCommandRunner(service, output, createPrompter())

    await expect(runner.run([
      'init',
      '--project-root',
      '/workspace/project',
      '--presentation-id',
      '2026-q1',
      '--title',
      'Quarterly Community Update',
      '--subtitle',
      'Q1 2026',
      '--from-date',
      '2026-01-01',
    ])).resolves.toBe(0)

    await expect(runner.run([
      'fetch',
      '--project-root',
      '/workspace/project',
      '--presentation-id',
      'custom-id',
      '--from-date',
      '2026-01-01',
    ])).resolves.toBe(0)

    expect(service.initPresentation).toHaveBeenCalledWith({
      projectRoot: '/workspace/project',
      presentationId: '2026-q1',
      title: 'Quarterly Community Update',
      subtitle: 'Q1 2026',
      fromDate: '2026-01-01',
    })
    expect(service.fetchPresentationData).toHaveBeenCalledWith({
      projectRoot: '/workspace/project',
      fromDate: '2026-01-01',
      presentationId: 'custom-id',
    })
  })

  it('dispatches interactive fetch when no args are provided', async () => {
    const service = createService()
    const output = createOutput()
    const prompter = createPrompter({
      promptCommand: vi.fn().mockResolvedValue('fetch'),
      promptOptional: vi.fn()
        .mockResolvedValueOnce('/workspace/project')
        .mockResolvedValueOnce('2026-03-31'),
      promptRequired: vi.fn()
        .mockResolvedValueOnce('2026-q1')
        .mockResolvedValueOnce('2026-01-01'),
      promptBoolean: vi.fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true),
    })
    const runner = new CliCommandRunner(service, output, prompter)

    await expect(runner.run([])).resolves.toBe(0)

    expect(service.fetchPresentationData).toHaveBeenCalledWith({
      projectRoot: '/workspace/project',
      presentationId: '2026-q1',
      fromDate: '2026-01-01',
      toDate: '2026-03-31',
      noPreviousPeriod: false,
      write: false,
    })
    expect(output.info).toHaveBeenCalledWith('Fetched 2026-q1')
    expect(output.info).toHaveBeenCalledWith(expect.stringContaining('Usage: oss-slides fetch'))
  })

  it('dispatches interactive init and validate paths', async () => {
    const service = createService()
    const initOutput = createOutput()
    const initPrompter = createPrompter({
      promptCommand: vi.fn().mockResolvedValue('init'),
      promptOptional: vi.fn()
        .mockResolvedValueOnce('/workspace/project')
        .mockResolvedValueOnce('2026-04-30')
        .mockResolvedValueOnce('Summary'),
      promptRequired: vi.fn()
        .mockResolvedValueOnce('demo-id')
        .mockResolvedValueOnce('Demo Title')
        .mockResolvedValueOnce('Demo Subtitle')
        .mockResolvedValueOnce('2026-04-01'),
      promptBoolean: vi.fn().mockResolvedValueOnce(true),
    })
    const initRunner = new CliCommandRunner(service, initOutput, initPrompter)

    await expect(initRunner.run([])).resolves.toBe(0)
    expect(service.initPresentation).toHaveBeenCalledWith({
      projectRoot: '/workspace/project',
      presentationId: 'demo-id',
      title: 'Demo Title',
      subtitle: 'Demo Subtitle',
      fromDate: '2026-04-01',
      toDate: '2026-04-30',
      summary: 'Summary',
      force: true,
    })
    expect(initOutput.info).toHaveBeenCalledWith(expect.stringContaining('Usage: oss-slides init'))

    const validateOutput = createOutput()
    const validatePrompter = createPrompter({
      promptCommand: vi.fn().mockResolvedValue('validate'),
      promptOptional: vi.fn().mockResolvedValueOnce('/workspace/project'),
      promptBoolean: vi.fn().mockResolvedValueOnce(true),
    })
    const validateRunner = new CliCommandRunner(service, validateOutput, validatePrompter)

    await expect(validateRunner.run([])).resolves.toBe(0)
    expect(service.validateContent).toHaveBeenCalledWith({ projectRoot: '/workspace/project', strict: true })
    expect(validateOutput.info).toHaveBeenCalledWith(expect.stringContaining('Usage: oss-slides validate'))
  })

  it('dispatches interactive build and serve paths', async () => {
    const service = createService()
    const buildOutput = createOutput()
    const buildRunner = new CliCommandRunner(
      service,
      buildOutput,
      createPrompter({
        promptCommand: vi.fn().mockResolvedValue('build'),
        promptOptional: vi.fn().mockResolvedValueOnce('/workspace/project'),
      }),
    )

    await expect(buildRunner.run([])).resolves.toBe(0)
    expect(service.buildSite).toHaveBeenCalledWith({ projectRoot: '/workspace/project', mode: 'production' })
    expect(buildOutput.info).toHaveBeenCalledWith(expect.stringContaining('Usage: oss-slides build'))

    const serveOutput = createOutput()
    const serveRunner = new CliCommandRunner(
      service,
      serveOutput,
      createPrompter({
        promptCommand: vi.fn().mockResolvedValue('serve'),
        promptOptional: vi.fn()
          .mockResolvedValueOnce('/workspace/project')
          .mockResolvedValueOnce('0.0.0.0'),
        promptNumber: vi.fn().mockResolvedValueOnce(4173),
        promptBoolean: vi.fn().mockResolvedValueOnce(true),
      }),
    )

    await expect(serveRunner.run([])).resolves.toBe(0)
    expect(service.serveSite).toHaveBeenCalledWith({
      projectRoot: '/workspace/project',
      host: '0.0.0.0',
      port: 4173,
      open: true,
    })
    expect(serveOutput.info).toHaveBeenCalledWith(expect.stringContaining('Usage: oss-slides serve'))
  })

  it('returns a non-zero exit code when interactive mode fails', async () => {
    const output = createOutput()
    const runner = new CliCommandRunner(
      createService(),
      output,
      createPrompter({
        promptCommand: vi.fn().mockRejectedValue(new Error('Prompt failed')),
      }),
    )

    await expect(runner.run([])).resolves.toBe(1)
    expect(output.error).toHaveBeenCalledWith('Prompt failed')
  })

  it('prints non-Error thrown values in both interactive and command modes', async () => {
    const service = createService()
    vi.mocked(service.buildSite).mockRejectedValueOnce('build exploded')
    vi.mocked(service.fetchPresentationData).mockRejectedValueOnce('fetch exploded')

    const interactiveOutput = createOutput()
    const interactiveRunner = new CliCommandRunner(
      service,
      interactiveOutput,
      createPrompter({
        promptCommand: vi.fn().mockResolvedValue('build'),
      }),
    )

    await expect(interactiveRunner.run([])).resolves.toBe(1)
    expect(interactiveOutput.error).toHaveBeenCalledWith('build exploded')

    const commandOutput = createOutput()
    const commandRunner = new CliCommandRunner(service, commandOutput, createPrompter())

    await expect(commandRunner.run([
      'fetch',
      '--presentation-id',
      'custom-id',
      '--from-date',
      '2026-01-01',
    ])).resolves.toBe(1)
    expect(commandOutput.error).toHaveBeenCalledWith('fetch exploded')
  })

  it('dispatches fetch with optional arguments', async () => {
    const service = createService()
    const output = createOutput()
    const runner = new CliCommandRunner(service, output)

    await expect(runner.run([
      'fetch',
      '--project-root',
      '/workspace/project',
      '--presentation-id',
      'custom-id',
      '--from-date',
      '2026-01-01',
      '--to-date',
      '2026-03-31',
      '--no-previous-period',
      '--dry-run',
    ])).resolves.toBe(0)

    expect(service.fetchPresentationData).toHaveBeenCalledWith({
      projectRoot: '/workspace/project',
      fromDate: '2026-01-01',
      toDate: '2026-03-31',
      presentationId: 'custom-id',
      noPreviousPeriod: true,
      write: false,
    })
  })

  it('dispatches build, serve, and validate', async () => {
    const service = createService()
    const output = createOutput()
    const runner = new CliCommandRunner(service, output)

    await expect(runner.run(['build', '--project-root', '/workspace/project'])).resolves.toBe(0)
    await expect(runner.run(['serve', '--project-root', '/workspace/project', '--host', '0.0.0.0', '--port', '4173', '--open'])).resolves.toBe(0)
    await expect(runner.run(['validate', '--project-root', '/workspace/project', '--strict'])).resolves.toBe(0)

    expect(service.buildSite).toHaveBeenCalledWith({ projectRoot: '/workspace/project', mode: 'production' })
    expect(service.serveSite).toHaveBeenCalledWith({
      projectRoot: '/workspace/project',
      host: '0.0.0.0',
      port: 4173,
      open: true,
    })
    expect(service.validateContent).toHaveBeenCalledWith({ projectRoot: '/workspace/project', strict: true })
  })

  it('treats a valueless numeric option as omitted', async () => {
    const service = createService()
    const output = createOutput()
    const runner = new CliCommandRunner(service, output, createPrompter())

    await expect(runner.run(['serve', '--port'])).resolves.toBe(0)

    expect(service.serveSite).toHaveBeenCalledWith({})
  })

  it('prints the failed validation message when validation returns invalid', async () => {
    const service = createService()
    const output = createOutput()
    vi.mocked(service.validateContent).mockResolvedValue({
      valid: false,
      errors: ['broken'],
    })
    const runner = new CliCommandRunner(service, output)

    await expect(runner.run(['validate'])).resolves.toBe(0)
    expect(output.info).toHaveBeenCalledWith('Content validation failed')
  })

  it('returns a non-zero exit code for unknown commands or invalid options', async () => {
    const output = createOutput()
    const runner = new CliCommandRunner(createService(), output, createPrompter())

    await expect(runner.run(['unknown'])).resolves.toBe(1)
    await expect(runner.run(['build', '/workspace/project', 'extra'])).resolves.toBe(1)
    await expect(runner.run(['serve', '/workspace/project', 'extra'])).resolves.toBe(1)
    await expect(runner.run(['init', '--presentation-id', 'demo'])).resolves.toBe(1)
    await expect(runner.run(['fetch', '--from-date', '2026-01-01'])).resolves.toBe(1)
    await expect(runner.run(['serve', '--port', 'oops'])).resolves.toBe(1)
    expect(output.error).toHaveBeenCalled()
  })

  it('reports all missing required options for init and fetch', async () => {
    const output = createOutput()
    const runner = new CliCommandRunner(createService(), output, createPrompter())

    await expect(runner.run(['init', '--presentation-id', 'demo'])).resolves.toBe(1)
    await expect(runner.run(['fetch'])).resolves.toBe(1)

    expect(output.error).toHaveBeenCalledWith(
      'Missing required options: --title, --subtitle, --from-date.',
    )
    expect(output.error).toHaveBeenCalledWith(
      'Missing required options: --presentation-id, --from-date.',
    )
  })

  it('supports a positional project root and rejects mixing it with --project-root', async () => {
    const service = createService()
    const output = createOutput()
    const runner = new CliCommandRunner(service, output, createPrompter())

    await expect(runner.run([
      'fetch',
      '/workspace/project',
      '--presentation-id',
      'custom-id',
      '--from-date',
      '2026-01-01',
    ])).resolves.toBe(0)

    expect(service.fetchPresentationData).toHaveBeenCalledWith({
      projectRoot: '/workspace/project',
      presentationId: 'custom-id',
      fromDate: '2026-01-01',
    })

    await expect(runner.run([
      'fetch',
      '/workspace/project',
      '--project-root',
      '/another/project',
      '--presentation-id',
      'custom-id',
      '--from-date',
      '2026-01-01',
    ])).resolves.toBe(1)

    expect(output.error).toHaveBeenCalledWith(
      'Specify the project root either positionally or with --project-root, not both.',
    )
  })
})
