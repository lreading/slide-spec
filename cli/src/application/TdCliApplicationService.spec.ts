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
          url: 'https://github.com/example-org/aurora-notes',
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

  public async loadGeneratedData(
    _paths: unknown,
    entry: Pick<PresentationIndexEntry, 'id' | 'generated_path'>,
  ): Promise<GeneratedPresentationData | undefined> {
    if (entry.id !== '2025-q4') {
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
    entry: Pick<PresentationIndexEntry, 'id' | 'generated_path'>,
    generated: GeneratedPresentationData,
  ): Promise<string> {
    this.writes.push({
      presentationId: entry.id,
      generated,
    })

    return `/repo/content/presentations/${entry.id}/generated.yaml`
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
      timings: [
        {
          name: 'repository_metadata',
          duration_ms: 12.5,
        },
      ],
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
  public readonly removedDirectories: string[] = []

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

  public async directoryExists(_path: string): Promise<boolean> {
    return false
  }

  public async copyDirectory(_source: string, _destination: string): Promise<void> {
    // no-op
  }

  public async removeDirectory(path: string): Promise<void> {
    this.removedDirectories.push(path)
  }
}

class TrackingFileSystem extends MemoryFileSystem {
  public readonly copies: Array<{ source: string; destination: string }> = []

  public override async copyDirectory(source: string, destination: string): Promise<void> {
    this.copies.push({ source, destination })
  }
}

class ExistsDirectoryFileSystem extends TrackingFileSystem {
  public override async directoryExists(_path: string): Promise<boolean> {
    return true
  }
}

class StubExampleRegistry {
  public resolveContentPath(id: string): string {
    return `/bundled/examples/${id}`
  }
}

class StubGitHubClient implements GitHubClient {
  public async getRepositoryMetadata() {
    return Promise.reject(new Error('Not used in service-level test'))
  }
  public async getStargazerCountAt() {
    return Promise.reject(new Error('Not used in service-level test'))
  }
  public async getStargazerCountsAt() {
    return Promise.reject(new Error('Not used in service-level test'))
  }
  public async hasMergedPullRequestByAuthorBefore() {
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

class StubViteSiteDevServer {
  public readonly starts: Array<{ root: string; host: string; port: number }> = []
  public readonly startResults: number[]
  public readonly startErrors: Error[]

  public constructor(options: { startResults?: number[]; startErrors?: Error[] } = {}) {
    this.startResults = [...(options.startResults ?? [])]
    this.startErrors = [...(options.startErrors ?? [])]
  }

  public async start(
    paths: { getProjectRoot(): string },
    host: string,
    port: number,
  ): Promise<number> {
    this.starts.push({ root: paths.getProjectRoot(), host, port })

    const nextError = this.startErrors.shift()

    if (nextError) {
      throw nextError
    }

    return this.startResults.shift() ?? port
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
    const presentationIndexStore = new StubPresentationIndexStore([
      {
        id: '2026-q1',
        year: 2026,
        title: 'Quarterly Community Update',
        subtitle: 'Q1 2026',
        summary: 'Summary',
        published: true,
        featured: false,
        presentation_path: 'presentations/2026-q1/presentation.yaml',
        generated_path: 'presentations/2026-q1/generated.yaml',
      },
    ])
    const service = new TdCliApplicationService({
      projectRoot: '/repo',
      presentationIndexStore: presentationIndexStore as never,
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
      timings: [],
    })

    expect(generatedDataStore.writes).toHaveLength(1)
    expect(generatedDataStore.writes[0]?.generated.contributors.total).toBe(1)
  })

  it('returns the target path without writing and can skip previous-period comparison', async () => {
    const generatedDataStore = new StubGeneratedDataStore()
    const presentationIndexStore = new StubPresentationIndexStore([
      {
        id: '2026-q1',
        year: 2026,
        title: 'Quarterly Community Update',
        subtitle: 'Q1 2026',
        summary: 'Summary',
        published: true,
        featured: false,
        presentation_path: 'presentations/2026-q1/presentation.yaml',
        generated_path: 'presentations/2026-q1/generated.yaml',
      },
    ])
    const service = new TdCliApplicationService({
      projectRoot: '/repo',
      presentationIndexStore: presentationIndexStore as never,
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
      timings: [],
    })

    expect(generatedDataStore.writes).toHaveLength(0)
  })

  it('includes fetch timings when explicitly requested', async () => {
    const presentationIndexStore = new StubPresentationIndexStore([
      {
        id: '2026-q1',
        year: 2026,
        title: 'Quarterly Community Update',
        subtitle: 'Q1 2026',
        summary: 'Summary',
        published: true,
        featured: false,
        presentation_path: 'presentations/2026-q1/presentation.yaml',
        generated_path: 'presentations/2026-q1/generated.yaml',
      },
    ])
    const service = new TdCliApplicationService({
      projectRoot: '/repo',
      presentationIndexStore: presentationIndexStore as never,
      contentConfigLoader: new StubContentConfigLoader() as never,
      envLoader: new StubEnvLoader() as never,
      reportingPeriodResolver: new StubReportingPeriodResolver() as never,
      generatedDataBuilder: new StubGeneratedDataBuilder() as never,
      generatedDataStore: new StubGeneratedDataStore() as never,
      gitHubClientFactory: (_token?: string): GitHubClient => new StubGitHubClient(),
    })

    await expect(service.fetchPresentationData({
      presentationId: '2026-q1',
      fromDate: '2026-01-01',
      timings: true,
      write: false,
    })).resolves.toMatchObject({
      timings: [
        {
          name: 'repository_metadata',
          duration_ms: 12.5,
        },
      ],
    })
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
        presentation_path: 'presentations/2025-q4/presentation.yaml',
        generated_path: 'presentations/2025-q4/generated.yaml',
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

    expect(fileSystem.writes.get('/repo/content/site.yaml')).toContain('schemaVersion:')
    expect(fileSystem.writes.get('/repo/content/site.yaml')?.startsWith(
      '# Slide Spec\n# https://www.slide-spec.dev/\n# Documentation: https://docs.slide-spec.dev/\n',
    )).toBe(true)
    expect(fileSystem.writes.get('/repo/content/site.yaml')).toContain(
      '# yaml-language-server: $schema=https://slide-spec.dev/schema/site.schema.json',
    )
    expect(fileSystem.writes.get('/repo/content/site.yaml')).toContain('https://github.com/example/project')
    expect(fileSystem.writes.get('/repo/content/site.yaml')).toContain('https://example.com/docs')
    expect(fileSystem.writes.get('/repo/content/site.yaml')).toContain('https://example.com')
    expect(fileSystem.writes.get('/repo/content/site.yaml')).toContain('data_sources:')
    expect(fileSystem.writes.get('/repo/content/presentations/2026-q1/presentation.yaml')).toContain('schemaVersion:')
    expect(fileSystem.writes.get('/repo/content/presentations/2026-q1/presentation.yaml')?.startsWith(
      '# Slide Spec\n# https://www.slide-spec.dev/\n# Documentation: https://docs.slide-spec.dev/\n',
    )).toBe(true)
    expect(fileSystem.writes.get('/repo/content/presentations/2026-q1/presentation.yaml')).toContain(
      '# yaml-language-server: $schema=https://slide-spec.dev/schema/presentation.schema.json',
    )
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
        presentation_path: 'presentations/2026-q1/presentation.yaml',
        generated_path: 'presentations/2026-q1/generated.yaml',
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

  it('initFromExample copies the example content to the target project root', async () => {
    const fileSystem = new TrackingFileSystem()
    const exampleRegistry = new StubExampleRegistry()
    const service = new TdCliApplicationService({
      projectRoot: '/repo',
      fileSystem,
      exampleRegistry: exampleRegistry as never,
    })

    const result = await service.initFromExample({ exampleId: 'open-source-update' })

    expect(result).toEqual({
      exampleId: 'open-source-update',
      targetPath: '/repo/content',
    })
    expect(fileSystem.copies).toEqual([
      { source: '/bundled/examples/open-source-update', destination: '/repo/content' },
    ])
  })

  it('initFromExample refuses if content/ already exists without --force', async () => {
    const fileSystem = new ExistsDirectoryFileSystem()
    const exampleRegistry = new StubExampleRegistry()
    const service = new TdCliApplicationService({
      projectRoot: '/repo',
      fileSystem,
      exampleRegistry: exampleRegistry as never,
    })

    await expect(service.initFromExample({ exampleId: 'open-source-update' })).rejects.toThrow(
      'content/ already exists. Use --force to overwrite.',
    )
  })

  it('initFromExample overwrites with --force even when content/ exists', async () => {
    const fileSystem = new ExistsDirectoryFileSystem()
    const exampleRegistry = new StubExampleRegistry()
    const service = new TdCliApplicationService({
      projectRoot: '/repo',
      fileSystem,
      exampleRegistry: exampleRegistry as never,
    })

    const result = await service.initFromExample({ exampleId: 'open-source-update', force: true })

    expect(result).toEqual({
      exampleId: 'open-source-update',
      targetPath: '/repo/content',
    })
    expect(fileSystem.removedDirectories).toEqual(['/repo/content'])
    expect(fileSystem.copies).toEqual([
      { source: '/bundled/examples/open-source-update', destination: '/repo/content' },
    ])
  })

  it('builds to dist, serves built assets, and validates content directly', async () => {
    const siteBuilder = new StubSiteBuilder()
    const devSiteServer = new StubViteSiteDevServer()
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
      devSiteServer: devSiteServer as never,
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
    ])
    expect(devSiteServer.starts).toEqual([
      {
        root: '/repo',
        host: '0.0.0.0',
        port: 4173,
      },
    ])
    expect(contentValidator.validates).toEqual([
      '/repo',
      '/repo',
    ])
    expect(browserOpener.opened).toEqual(['http://0.0.0.0:4173/'])
  })

  it('falls back to an available port when the default serve port is busy', async () => {
    const contentValidator = new StubContentValidator()
    const devSiteServer = new StubViteSiteDevServer({
      startErrors: [Object.assign(new Error('Port already in use'), { code: 'EADDRINUSE' })],
      startResults: [58123],
    })
    const service = new TdCliApplicationService({
      projectRoot: '/repo',
      devSiteServer: devSiteServer as never,
      contentValidator: contentValidator as never,
    })

    await expect(service.serveSite({})).resolves.toEqual({
      url: 'http://127.0.0.1:58123/',
    })

    expect(contentValidator.validates).toEqual(['/repo'])
    expect(devSiteServer.starts).toEqual([
      {
        root: '/repo',
        host: '127.0.0.1',
        port: 5173,
      },
      {
        root: '/repo',
        host: '127.0.0.1',
        port: 0,
      },
    ])
  })

  it('does not retry when an explicit serve port is busy', async () => {
    const contentValidator = new StubContentValidator()
    const busyPortError = Object.assign(new Error('Port already in use'), { code: 'EADDRINUSE' })
    const devSiteServer = new StubViteSiteDevServer({
      startErrors: [busyPortError],
    })
    const service = new TdCliApplicationService({
      projectRoot: '/repo',
      devSiteServer: devSiteServer as never,
      contentValidator: contentValidator as never,
    })

    await expect(service.serveSite({ port: 4173 })).rejects.toBe(busyPortError)

    expect(contentValidator.validates).toEqual(['/repo'])
    expect(devSiteServer.starts).toEqual([
      {
        root: '/repo',
        host: '127.0.0.1',
        port: 4173,
      },
    ])
  })

  it('validates content before serving', async () => {
    const devSiteServer = new StubViteSiteDevServer()
    const contentValidator = new StubContentValidator()
    const service = new TdCliApplicationService({
      projectRoot: '/repo',
      devSiteServer: devSiteServer as never,
      contentValidator: contentValidator as never,
    })

    await expect(service.serveSite({})).resolves.toEqual({
      url: 'http://127.0.0.1:5173/',
    })

    expect(contentValidator.validates).toEqual(['/repo'])
    expect(devSiteServer.starts).toEqual([
      {
        root: '/repo',
        host: '127.0.0.1',
        port: 5173,
      },
    ])
  })
})
