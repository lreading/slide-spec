import { describe, expect, it } from 'vitest'

import { TdCliApplicationService } from './TdCliApplicationService'

import type { GitHubClient } from '../github/GitHubClient.types'
import type { SiteConfig } from '../config/Config.types'
import type { GeneratedPresentationData, PresentationIndexEntry, QuarterWindow } from '../generation/Generation.types'

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

class StubPresentationIndexLoader {
  public async loadPresentations(): Promise<PresentationIndexEntry[]> {
    return [
      {
        id: '2025-q4',
        year: 2025,
        quarter: 4,
        title: 'Previous',
        subtitle: 'Q4 2025',
        summary: 'Summary',
        published: true,
        featured: false,
      },
      {
        id: '2026-q1',
        year: 2026,
        quarter: 1,
        title: 'Current',
        subtitle: 'Q1 2026',
        summary: 'Summary',
        published: true,
        featured: true,
      },
    ]
  }

  public findPresentationIdForQuarter(
    entries: PresentationIndexEntry[],
    year: number,
    quarter: number,
  ): string | undefined {
    return entries.find((entry) => entry.year === year && entry.quarter === quarter)?.id
  }
}

class StubQuarterResolver {
  public resolve(): QuarterWindow {
    return {
      year: 2026,
      quarter: 1,
      presentationId: '2026-q1',
      start: '2026-01-01',
      end: '2026-03-31',
      previousYear: 2025,
      previousQuarter: 4,
    }
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
    previousGenerated?: GeneratedPresentationData
    previousPresentationId?: string
    presentationId: string
  }): Promise<GeneratedPresentationData> {
    return {
      id: input.presentationId,
      period: {
        start: '2026-01-01',
        end: '2026-03-31',
      },
      ...(input.previousPresentationId ? { previous_presentation_id: input.previousPresentationId } : {}),
      stats: {},
      releases: [],
      contributors: {
        total: input.previousGenerated ? 1 : 0,
        authors: [],
      },
      merged_prs: [],
    }
  }
}

class StubGitHubClient implements GitHubClient {
  public async getRepositoryMetadata() {
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

describe('TdCliApplicationService', () => {
  it('can be constructed with default dependencies', () => {
    expect(new TdCliApplicationService()).toBeInstanceOf(TdCliApplicationService)
  })

  it('fetches generated data, resolves previous presentation state, and writes output by default', async () => {
    const generatedDataStore = new StubGeneratedDataStore()
    const service = new TdCliApplicationService({
      cliRoot: '/repo/cli',
      contentConfigLoader: new StubContentConfigLoader() as never,
      envLoader: new StubEnvLoader() as never,
      presentationIndexLoader: new StubPresentationIndexLoader() as never,
      quarterResolver: new StubQuarterResolver() as never,
      generatedDataBuilder: new StubGeneratedDataBuilder() as never,
      generatedDataStore: generatedDataStore as never,
      gitHubClientFactory: (_token: string): GitHubClient => new StubGitHubClient(),
    })

    await expect(service.fetchPresentationData({
      year: 2026,
      quarter: 1,
    })).resolves.toMatchObject({
      presentationId: '2026-q1',
      previousPresentationId: '2025-q4',
      generatedPath: '/repo/content/presentations/2026-q1/generated.yaml',
      warnings: [],
    })

    expect(generatedDataStore.writes).toHaveLength(1)
    expect(generatedDataStore.writes[0]?.generated.previous_presentation_id).toBe('2025-q4')
  })

  it('returns the target path without writing when write is false and warns when no previous presentation exists', async () => {
    const generatedDataStore = new StubGeneratedDataStore()
    const service = new TdCliApplicationService({
      cliRoot: '/repo/cli',
      contentConfigLoader: new StubContentConfigLoader() as never,
      envLoader: new StubEnvLoader() as never,
      presentationIndexLoader: {
        async loadPresentations(): Promise<PresentationIndexEntry[]> {
          return []
        },
        findPresentationIdForQuarter(): string | undefined {
          return undefined
        },
      } as never,
      quarterResolver: new StubQuarterResolver() as never,
      generatedDataBuilder: new StubGeneratedDataBuilder() as never,
      generatedDataStore: generatedDataStore as never,
      gitHubClientFactory: (_token: string): GitHubClient => new StubGitHubClient(),
    })

    await expect(service.fetchPresentationData({
      year: 2026,
      quarter: 1,
      write: false,
    })).resolves.toMatchObject({
      presentationId: '2026-q1',
      generatedPath: '/repo/content/presentations/2026-q1/generated.yaml',
      warnings: ['No previous presentation found; previous values defaulted to 0.'],
    })

    expect(generatedDataStore.writes).toHaveLength(0)
  })

  it('keeps non-fetch commands explicitly unimplemented for now', async () => {
    const service = new TdCliApplicationService({
      cliRoot: '/repo/cli',
      contentConfigLoader: new StubContentConfigLoader() as never,
      envLoader: new StubEnvLoader() as never,
      presentationIndexLoader: new StubPresentationIndexLoader() as never,
      quarterResolver: new StubQuarterResolver() as never,
      generatedDataBuilder: new StubGeneratedDataBuilder() as never,
      generatedDataStore: new StubGeneratedDataStore() as never,
      gitHubClientFactory: (_token: string): GitHubClient => new StubGitHubClient(),
    })

    await expect(service.initPresentation({ year: 2026, quarter: 1 })).rejects.toThrow(
      'initPresentation is not implemented yet.',
    )
    await expect(service.buildSite({ mode: 'production' })).rejects.toThrow(
      'buildSite is not implemented yet.',
    )
    await expect(service.serveSite({})).rejects.toThrow('serveSite is not implemented yet.')
    await expect(service.validateContent({})).rejects.toThrow(
      'validateContent is not implemented yet.',
    )
  })
})
