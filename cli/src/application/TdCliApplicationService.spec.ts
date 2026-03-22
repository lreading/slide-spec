import { describe, expect, it } from 'vitest'

import { TdCliApplicationService } from './TdCliApplicationService'
import { YamlWriter } from '../io/YamlWriter'

import type { GitHubClient } from '../github/GitHubClient.types'
import type { SiteConfig } from '../config/Config.types'
import type { FileSystem } from '../io/FileSystem'
import type { GeneratedPresentationData, PresentationIndexEntry, ResolvedReportingPeriod } from '../generation/Generation.types'

class StubContentConfigLoader {
  public async loadSiteConfig(): Promise<SiteConfig> {
    return {
      data_sources: [
        {
          type: 'github',
          url: 'https://github.com/OWASP/threat-dragon',
        },
      ],
    }
  }
}

class StubEnvLoader {
  public async loadEnvironment() {
    return {
      githubAccessToken: 'secret-token',
    }
  }
}

class StubPresentationIndexStore {
  public readonly writes: PresentationIndexEntry[][] = []

  public constructor(private readonly entries: PresentationIndexEntry[]) {}

  public async load(): Promise<PresentationIndexEntry[]> {
    return this.entries
  }

  public findPresentationById(
    entries: PresentationIndexEntry[],
    id: string,
  ): PresentationIndexEntry | undefined {
    return entries.find((entry) => entry.id === id)
  }

  public async write(_paths: unknown, entries: PresentationIndexEntry[]): Promise<void> {
    this.writes.push(entries)
  }
}

class StubGeneratedDataStore {
  public readonly writes: Array<{ presentationId: string; generated: GeneratedPresentationData }> = []

  public async loadGeneratedData(_paths: unknown, presentationId: string): Promise<GeneratedPresentationData | undefined> {
    if (presentationId !== '2025-q4') {
      return undefined
    }

    return {
      id: '2025-q4',
      period: {
        start: '2025-10-01',
        end: '2025-12-31',
      },
      stats: {},
      releases: [],
      contributors: {
        total: 0,
        authors: [],
      },
      merged_prs: [],
    }
  }

  public async writeGeneratedData(
    _paths: unknown,
    presentationId: string,
    generated: GeneratedPresentationData,
  ): Promise<string> {
    this.writes.push({
      presentationId,
      generated,
    })

    return `/repo/content/presentations/${presentationId}/generated.yaml`
  }
}

class StubGeneratedDataBuilder {
  public async build(input: {
    presentationId: string
    previousPeriod?: { start: string; end: string }
  }) {
    return {
      generated: {
        id: input.presentationId,
        period: {
          start: '2026-01-01',
          end: '2026-03-31',
        },
        stats: {},
        releases: [],
        contributors: {
          total: input.previousPeriod ? 1 : 0,
          authors: [],
        },
        merged_prs: [],
      },
      warnings: [],
    }
  }
}

class StubReportingPeriodResolver {
  public resolve(): ResolvedReportingPeriod {
    return {
      current: {
        start: '2026-01-01',
        end: '2026-03-31',
      },
      previous: {
        start: '2025-10-01',
        end: '2025-12-31',
      },
    }
  }
}

class MemoryFileSystem implements FileSystem {
  public readonly writes = new Map<string, string>()

  public fileExists(_path: string): Promise<boolean> {
    return Promise.resolve(false)
  }

  public readTextFile(_path: string): Promise<string> {
    return Promise.reject(new Error('Not used'))
  }

  public writeTextFile(path: string, content: string): Promise<void> {
    this.writes.set(path, content)
    return Promise.resolve()
  }
}

class StubGitHubClient implements GitHubClient {
  public async getRepositoryMetadata() {
    return Promise.reject(new Error('Not used in service-level test'))
  }
  public async getStargazerCountAt() {
    return Promise.reject(new Error('Not used in service-level test'))
  }
  public async listReleases() {
    return Promise.reject(new Error('Not used in service-level test'))
  }
  public async listMergedPullRequests() {
    return Promise.reject(new Error('Not used in service-level test'))
  }
  public async listMergedPullRequestAuthorsBefore() {
    return Promise.reject(new Error('Not used in service-level test'))
  }
  public async listClosedIssues() {
    return Promise.reject(new Error('Not used in service-level test'))
  }
}

class StubSiteBuilder {
  public readonly builds: string[] = []

  public async build(paths: { getProjectRoot(): string; getDistPath(): string }): Promise<string> {
    this.builds.push(paths.getProjectRoot())
    return paths.getDistPath()
  }
}

class StubStaticSiteServer {
  public readonly starts: Array<{ root: string; host: string; port: number }> = []

  public async start(root: string, host: string, port: number): Promise<void> {
    this.starts.push({ root, host, port })
  }
}

class StubContentValidator {
  public readonly validates: string[] = []

  public async validate(paths: { getProjectRoot(): string }): Promise<void> {
    this.validates.push(paths.getProjectRoot())
  }
}

class StubBrowserOpener {
  public readonly opened: string[] = []

  public open(url: string): void {
    this.opened.push(url)
  }
}

describe('TdCliApplicationService', () => {
  it('can be constructed with default dependencies', () => {
    expect(new TdCliApplicationService()).toBeInstanceOf(TdCliApplicationService)
  })

  it('fetches generated data with previous-period comparison and writes output by default', async () => {
    const generatedDataStore = new StubGeneratedDataStore()
    const service = new TdCliApplicationService({
      projectRoot: '/repo',
      contentConfigLoader: new StubContentConfigLoader() as never,
      envLoader: new StubEnvLoader() as never,
      reportingPeriodResolver: new StubReportingPeriodResolver() as never,
      generatedDataBuilder: new StubGeneratedDataBuilder() as never,
      generatedDataStore: generatedDataStore as never,
      gitHubClientFactory: (_token?: string): GitHubClient => new StubGitHubClient(),
    })

    await expect(service.fetchPresentationData({
      presentationId: '2026-q1',
      fromDate: '2026-01-01',
      toDate: '2026-03-31',
    })).resolves.toMatchObject({
      presentationId: '2026-q1',
      generatedPath: '/repo/content/presentations/2026-q1/generated.yaml',
      warnings: [],
    })

    expect(generatedDataStore.writes).toHaveLength(1)
    expect(generatedDataStore.writes[0]?.generated.contributors.total).toBe(1)
  })

  it('returns the target path without writing and can skip previous-period comparison', async () => {
    const generatedDataStore = new StubGeneratedDataStore()
    const service = new TdCliApplicationService({
      projectRoot: '/repo',
      contentConfigLoader: new StubContentConfigLoader() as never,
      envLoader: new StubEnvLoader() as never,
      reportingPeriodResolver: new StubReportingPeriodResolver() as never,
      generatedDataBuilder: new StubGeneratedDataBuilder() as never,
      generatedDataStore: generatedDataStore as never,
      gitHubClientFactory: (_token?: string): GitHubClient => new StubGitHubClient(),
    })

    await expect(service.fetchPresentationData({
      presentationId: '2026-q1',
      fromDate: '2026-01-01',
      write: false,
      noPreviousPeriod: true,
    })).resolves.toMatchObject({
      presentationId: '2026-q1',
      generatedPath: '/repo/content/presentations/2026-q1/generated.yaml',
      warnings: [
        'Previous period comparison disabled; previous values defaulted to 0.',
      ],
    })

    expect(generatedDataStore.writes).toHaveLength(0)
  })

  it('initializes a new presentation scaffold and updates the index when the presentation id is new', async () => {
    const fileSystem = new MemoryFileSystem()
    const generatedDataStore = new StubGeneratedDataStore()
    const presentationIndexStore = new StubPresentationIndexStore([
      {
        id: '2025-q4',
        year: 2025,
        title: 'Previous',
        subtitle: 'Q4 2025',
        summary: 'Summary',
        published: true,
        featured: false,
      },
    ])
    const service = new TdCliApplicationService({
      projectRoot: '/repo',
      presentationIndexStore: presentationIndexStore as never,
      generatedDataStore: generatedDataStore as never,
      yamlWriter: new YamlWriter(fileSystem),
      reportingPeriodResolver: new StubReportingPeriodResolver() as never,
      fileSystem,
    })

    await expect(service.initPresentation({
      presentationId: '2026-q1',
      title: 'Quarterly Community Update',
      subtitle: 'Q1 2026',
      fromDate: '2026-01-01',
      toDate: '2026-03-31',
      repositoryUrl: 'https://github.com/example/project',
      docsUrl: 'https://example.com/docs',
      websiteUrl: 'https://example.com',
      githubDataSourceUrl: 'https://github.com/example/project',
    })).resolves.toMatchObject({
      presentationId: '2026-q1',
      createdPaths: [
        '/repo/content/site.yaml',
        '/repo/content/presentations/2026-q1/presentation.yaml',
        '/repo/content/presentations/2026-q1/generated.yaml',
        '/repo/content/presentations/index.yaml',
      ],
    })

    expect(fileSystem.writes.get('/repo/content/site.yaml')).toContain('https://github.com/example/project')
    expect(fileSystem.writes.get('/repo/content/site.yaml')).toContain('https://example.com/docs')
    expect(fileSystem.writes.get('/repo/content/site.yaml')).toContain('https://example.com')
    expect(fileSystem.writes.get('/repo/content/site.yaml')).toContain('data_sources:')
    expect(fileSystem.writes.get('/repo/content/presentations/2026-q1/presentation.yaml')).toContain('template: hero')
    expect(generatedDataStore.writes).toHaveLength(1)
    expect(presentationIndexStore.writes).toHaveLength(1)
    expect(presentationIndexStore.writes[0]?.[0]).toMatchObject({
      id: '2026-q1',
      published: true,
      featured: false,
    })
  })

  it('marks the first initialized presentation as featured', async () => {
    const fileSystem = new MemoryFileSystem()
    const presentationIndexStore = new StubPresentationIndexStore([])
    const service = new TdCliApplicationService({
      projectRoot: '/repo',
      presentationIndexStore: presentationIndexStore as never,
      generatedDataStore: new StubGeneratedDataStore() as never,
      yamlWriter: new YamlWriter(fileSystem),
      reportingPeriodResolver: new StubReportingPeriodResolver() as never,
      fileSystem,
    })

    await service.initPresentation({
      presentationId: '2026-q1',
      title: 'Quarterly Community Update',
      subtitle: 'Q1 2026',
      fromDate: '2026-01-01',
    })

    expect(presentationIndexStore.writes[0]?.[0]).toMatchObject({
      id: '2026-q1',
      published: true,
      featured: true,
    })
  })

  it('rejects existing presentation ids unless force is enabled, and force overwrites scaffold files without rewriting the index', async () => {
    const fileSystem = new MemoryFileSystem()
    const generatedDataStore = new StubGeneratedDataStore()
    const presentationIndexStore = new StubPresentationIndexStore([
      {
        id: '2026-q1',
        year: 2026,
        title: 'Existing',
        subtitle: 'Q1 2026',
        summary: 'Summary',
        published: true,
        featured: true,
      },
    ])
    const service = new TdCliApplicationService({
      projectRoot: '/repo',
      presentationIndexStore: presentationIndexStore as never,
      generatedDataStore: generatedDataStore as never,
      yamlWriter: new YamlWriter(fileSystem),
      reportingPeriodResolver: new StubReportingPeriodResolver() as never,
      fileSystem,
    })

    await expect(service.initPresentation({
      presentationId: '2026-q1',
      title: 'Existing',
      subtitle: 'Q1 2026',
      fromDate: '2026-01-01',
      toDate: '2026-03-31',
    })).rejects.toThrow(
      'Presentation "2026-q1" already exists. Use force to overwrite scaffold files.',
    )

    await expect(service.initPresentation({
      presentationId: '2026-q1',
      title: 'Existing',
      subtitle: 'Q1 2026',
      fromDate: '2026-01-01',
      toDate: '2026-03-31',
      force: true,
    })).resolves.toMatchObject({
      presentationId: '2026-q1',
      createdPaths: [
        '/repo/content/site.yaml',
        '/repo/content/presentations/2026-q1/presentation.yaml',
        '/repo/content/presentations/2026-q1/generated.yaml',
      ],
    })

    expect(presentationIndexStore.writes).toHaveLength(0)
  })

  it('builds to dist, serves built assets, and validates content directly', async () => {
    const siteBuilder = new StubSiteBuilder()
    const staticSiteServer = new StubStaticSiteServer()
    const contentValidator = new StubContentValidator()
    const browserOpener = new StubBrowserOpener()
    const service = new TdCliApplicationService({
      projectRoot: '/repo',
      contentConfigLoader: new StubContentConfigLoader() as never,
      envLoader: new StubEnvLoader() as never,
      reportingPeriodResolver: new StubReportingPeriodResolver() as never,
      generatedDataBuilder: new StubGeneratedDataBuilder() as never,
      generatedDataStore: new StubGeneratedDataStore() as never,
      gitHubClientFactory: (_token?: string): GitHubClient => new StubGitHubClient(),
      siteBuilder: siteBuilder as never,
      staticSiteServer: staticSiteServer as never,
      contentValidator: contentValidator as never,
      browserOpener: browserOpener as never,
    })

    await expect(service.buildSite({ mode: 'production' })).resolves.toEqual({
      outputPath: '/repo/dist',
    })
    await expect(service.serveSite({
      host: '0.0.0.0',
      port: 4173,
      open: true,
    })).resolves.toEqual({
      url: 'http://0.0.0.0:4173/',
    })
    await expect(service.validateContent({ strict: true })).resolves.toEqual({
      valid: true,
      errors: [],
    })

    expect(siteBuilder.builds).toEqual([
      '/repo',
      '/repo',
    ])
    expect(staticSiteServer.starts).toEqual([
      {
        root: '/repo/dist',
        host: '0.0.0.0',
        port: 4173,
      },
    ])
    expect(contentValidator.validates).toEqual(['/repo'])
    expect(browserOpener.opened).toEqual(['http://0.0.0.0:4173/'])
  })
})
