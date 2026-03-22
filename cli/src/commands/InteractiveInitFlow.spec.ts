import { describe, expect, it, vi } from 'vitest'

import { InteractiveInitFlow } from './InteractiveInitFlow'
import { FileSystemPaths } from '../io/FileSystemPaths'

import type { CliOutput } from './CliCommandRunner'
import type { CliPrompter } from './CliPrompter'
import type { FileSystem } from '../io/FileSystem'
import type { GitHubRepositoryValidationResult, GitHubRepositoryValidator } from '../github/GitHubRepositoryValidator'
import type { TdCliService } from '../application/TdCliService'

class MemoryFileSystem implements FileSystem {
  public readonly writes = new Map<string, string>()

  public constructor(private readonly files: Record<string, string> = {}) {}

  public async fileExists(_path: string): Promise<boolean> {
    return this.files[_path] !== undefined
  }

  public async readTextFile(path: string): Promise<string> {
    const content = this.files[path]

    if (content === undefined) {
      throw new Error('Not used')
    }

    return content
  }

  public async writeTextFile(path: string, content: string): Promise<void> {
    this.writes.set(path, content)
  }
}

function createService(): TdCliService {
  return {
    initPresentation: vi.fn().mockResolvedValue({
      presentationId: '2026-q1',
      createdPaths: [],
    }),
    fetchPresentationData: vi.fn(),
    buildSite: vi.fn(),
    serveSite: vi.fn().mockResolvedValue({
      url: 'http://127.0.0.1:5173/',
    }),
    validateContent: vi.fn(),
  }
}

function createOutput(): CliOutput {
  return {
    info: vi.fn(),
    error: vi.fn(),
  }
}

function createPrompter(overrides: Partial<CliPrompter> = {}): CliPrompter {
  return {
    promptCommand: vi.fn(),
    promptRequired: vi.fn(),
    promptOptional: vi.fn().mockResolvedValue(undefined),
    promptBoolean: vi.fn().mockResolvedValue(false),
    promptNumber: vi.fn(),
    ...overrides,
  }
}

describe('InteractiveInitFlow', () => {
  it('re-prompts invalid GitHub repository URLs, writes PATs, and starts the local server', async () => {
    const service = createService()
    const output = createOutput()
    const prompter = createPrompter({
      promptOptional: vi.fn()
        .mockResolvedValueOnce('/workspace/project')
        .mockResolvedValueOnce('Demo Subtitle')
        .mockResolvedValueOnce('2026-04-30')
        .mockResolvedValueOnce('Summary')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce('https://example.com'),
      promptRequired: vi.fn()
        .mockResolvedValueOnce('demo-id')
        .mockResolvedValueOnce('Demo Title')
        .mockResolvedValueOnce('2026-04-01')
        .mockResolvedValueOnce('https://github.com/OWASP/threat-dragon')
        .mockResolvedValueOnce('https://github.com/OWASP/threat-dragon')
        .mockResolvedValueOnce('secret-token'),
      promptBoolean: vi.fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true),
    })

    const repositoryValidator = {
      validate: vi.fn()
        .mockRejectedValueOnce(new Error('GitHub repository "https://github.com/OWASP/threat-dragon" was not found. Double-check the URL and try again.'))
        .mockResolvedValueOnce({
          repository: {
            type: 'github',
            owner: 'OWASP',
            repo: 'threat-dragon',
            url: 'https://github.com/OWASP/threat-dragon',
          },
          verified: true,
        } satisfies GitHubRepositoryValidationResult),
    } as unknown as GitHubRepositoryValidator

    const fileSystem = new MemoryFileSystem()
    const flow = new InteractiveInitFlow(service, output, prompter, fileSystem, repositoryValidator)

    await expect(flow.run()).resolves.toBeUndefined()

    expect(repositoryValidator.validate).toHaveBeenCalledTimes(2)
    expect(service.initPresentation).toHaveBeenCalledWith({
      projectRoot: '/workspace/project',
      presentationId: 'demo-id',
      title: 'Demo Title',
      subtitle: 'Demo Subtitle',
      fromDate: '2026-04-01',
      toDate: '2026-04-30',
      summary: 'Summary',
      repositoryUrl: 'https://github.com/OWASP/threat-dragon',
      githubDataSourceUrl: 'https://github.com/OWASP/threat-dragon',
      websiteUrl: 'https://example.com',
      force: true,
    })
    expect(service.serveSite).toHaveBeenCalledWith({
      projectRoot: '/workspace/project',
      open: true,
    })

    const envPath = new FileSystemPaths('/workspace/project').getEnvPath()
    expect(fileSystem.writes.get(envPath)).toContain('GITHUB_PAT=secret-token')
    expect(output.info).toHaveBeenCalledWith('Wrote GitHub PAT to .env.')
  })

  it('continues best-effort when the user skips the GitHub PAT', async () => {
    const service = createService()
    const output = createOutput()
    const prompter = createPrompter({
      promptOptional: vi.fn()
        .mockResolvedValueOnce('/workspace/project')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined),
      promptRequired: vi.fn()
        .mockResolvedValueOnce('demo-id')
        .mockResolvedValueOnce('Demo Title')
        .mockResolvedValueOnce('2026-04-01')
        .mockResolvedValueOnce('https://github.com/OWASP/threat-dragon'),
      promptBoolean: vi.fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false),
    })

    const repositoryValidator = {
      validate: vi.fn().mockResolvedValue({
        repository: {
          type: 'github',
          owner: 'OWASP',
          repo: 'threat-dragon',
          url: 'https://github.com/OWASP/threat-dragon',
        },
        verified: false,
        warning: 'GitHub repository could not be verified right now. Continuing best-effort.',
      } satisfies GitHubRepositoryValidationResult),
    } as unknown as GitHubRepositoryValidator

    const flow = new InteractiveInitFlow(service, output, prompter, new MemoryFileSystem(), repositoryValidator)

    await expect(flow.run()).resolves.toBeUndefined()

    expect(service.initPresentation).toHaveBeenCalledWith({
      projectRoot: '/workspace/project',
      presentationId: 'demo-id',
      title: 'Demo Title',
      fromDate: '2026-04-01',
      repositoryUrl: 'https://github.com/OWASP/threat-dragon',
      githubDataSourceUrl: 'https://github.com/OWASP/threat-dragon',
      force: false,
    })
    expect(output.info).toHaveBeenCalledWith(
      'Continuing without a GitHub PAT. GitHub-backed fetches will be best-effort and may be rate-limited. You can add GITHUB_PAT to <project-root>/.env later and rerun fetch.',
    )
  })

  it('merges existing env content, keeps the local server optional, and preserves other keys', async () => {
    const service = createService()
    const output = createOutput()
    const envPath = new FileSystemPaths(process.cwd()).getEnvPath()
    const fileSystem = new MemoryFileSystem({
      [envPath]: 'FOO=bar\nGITHUB_PAT=old-token\n\nBAZ=qux\n',
    })
    const prompter = createPrompter({
      promptOptional: vi.fn()
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined),
      promptRequired: vi.fn()
        .mockResolvedValueOnce('demo-id')
        .mockResolvedValueOnce('Demo Title')
        .mockResolvedValueOnce('2026-04-01')
        .mockResolvedValueOnce('https://github.com/OWASP/threat-dragon')
        .mockResolvedValueOnce('new-token'),
      promptBoolean: vi.fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true),
    })

    const repositoryValidator = {
      validate: vi.fn().mockResolvedValue({
        repository: {
          type: 'github',
          owner: 'OWASP',
          repo: 'threat-dragon',
          url: 'https://github.com/OWASP/threat-dragon',
        },
        verified: true,
      } satisfies GitHubRepositoryValidationResult),
    } as unknown as GitHubRepositoryValidator

    const flow = new InteractiveInitFlow(service, output, prompter, fileSystem, repositoryValidator)

    await expect(flow.run()).resolves.toBeUndefined()

    expect(fileSystem.writes.get(envPath)).toBe('GITHUB_PAT=new-token\nFOO=bar\nBAZ=qux\n')
    expect(service.serveSite).toHaveBeenCalledWith({
      open: true,
    })
    expect(service.initPresentation).toHaveBeenCalledWith({
      presentationId: 'demo-id',
      title: 'Demo Title',
      fromDate: '2026-04-01',
      repositoryUrl: 'https://github.com/OWASP/threat-dragon',
      githubDataSourceUrl: 'https://github.com/OWASP/threat-dragon',
      force: false,
    })
  })
})
