import { ContentConfigLoader } from '../config/ContentConfigLoader'
import { DataSourceResolver } from '../config/DataSourceResolver'
import { EnvLoader } from '../config/EnvLoader'
import { FileSystemPaths } from '../io/FileSystemPaths'
import { GeneratedDataBuilder } from '../generation/GeneratedDataBuilder'
import { GeneratedDataStore } from '../generation/GeneratedDataStore'
import { GitHubApiClient } from '../github/GitHubClient'
import { PresentationIndexLoader } from '../generation/PresentationIndexLoader'
import { QuarterResolver } from '../generation/QuarterResolver'

import type { TdCliService } from './TdCliService'
import type {
  BuildSiteInput,
  BuildSiteResult,
  FetchPresentationDataInput,
  FetchPresentationDataResult,
  InitPresentationInput,
  InitPresentationResult,
  ServeSiteInput,
  ServeSiteResult,
  ValidateContentInput,
  ValidateContentResult,
} from './TdCliService.types'
import type { GitHubClient } from '../github/GitHubClient.types'

interface TdCliApplicationServiceOptions {
  cliRoot?: string
  contentConfigLoader?: ContentConfigLoader
  dataSourceResolver?: DataSourceResolver
  envLoader?: EnvLoader
  presentationIndexLoader?: PresentationIndexLoader
  generatedDataBuilder?: GeneratedDataBuilder
  generatedDataStore?: GeneratedDataStore
  quarterResolver?: QuarterResolver
  gitHubClientFactory?: (token: string) => GitHubClient
}

export class TdCliApplicationService implements TdCliService {
  private readonly paths: FileSystemPaths
  private readonly contentConfigLoader: ContentConfigLoader
  private readonly dataSourceResolver: DataSourceResolver
  private readonly envLoader: EnvLoader
  private readonly presentationIndexLoader: PresentationIndexLoader
  private readonly generatedDataBuilder: GeneratedDataBuilder
  private readonly generatedDataStore: GeneratedDataStore
  private readonly quarterResolver: QuarterResolver
  private readonly gitHubClientFactory: (token: string) => GitHubClient

  public constructor(options: TdCliApplicationServiceOptions = {}) {
    this.paths = new FileSystemPaths(options.cliRoot ?? process.cwd())
    this.contentConfigLoader = options.contentConfigLoader ?? new ContentConfigLoader()
    this.dataSourceResolver = options.dataSourceResolver ?? new DataSourceResolver()
    this.envLoader = options.envLoader ?? new EnvLoader()
    this.presentationIndexLoader = options.presentationIndexLoader ?? new PresentationIndexLoader()
    this.generatedDataBuilder = options.generatedDataBuilder ?? new GeneratedDataBuilder()
    this.generatedDataStore = options.generatedDataStore ?? new GeneratedDataStore()
    this.quarterResolver = options.quarterResolver ?? new QuarterResolver()
    this.gitHubClientFactory = options.gitHubClientFactory ?? ((token: string) => new GitHubApiClient({ token }))
  }

  public async initPresentation(_input: InitPresentationInput): Promise<InitPresentationResult> {
    throw new Error('initPresentation is not implemented yet.')
  }

  public async fetchPresentationData(input: FetchPresentationDataInput): Promise<FetchPresentationDataResult> {
    const quarterWindow = this.quarterResolver.resolve(input.year, input.quarter)
    const siteConfig = await this.contentConfigLoader.loadSiteConfig(this.paths)
    const repository = this.dataSourceResolver.resolveGitHubRepository(siteConfig)
    const environment = await this.envLoader.loadEnvironment(this.paths)
    const gitHubClient = this.gitHubClientFactory(environment.githubAccessToken)
    const presentationIndex = await this.presentationIndexLoader.loadPresentations(this.paths)
    const presentationId = input.presentationId
      ?? this.presentationIndexLoader.findPresentationIdForQuarter(
        presentationIndex,
        input.year,
        input.quarter,
      )
      ?? quarterWindow.presentationId
    const previousPresentationId = this.presentationIndexLoader.findPresentationIdForQuarter(
      presentationIndex,
      quarterWindow.previousYear,
      quarterWindow.previousQuarter,
    )
    const previousGenerated = previousPresentationId
      ? await this.generatedDataStore.loadGeneratedData(this.paths, previousPresentationId)
      : undefined
    const generated = await this.generatedDataBuilder.build({
      client: gitHubClient,
      presentationId,
      ...(previousGenerated ? { previousGenerated } : {}),
      ...(previousPresentationId ? { previousPresentationId } : {}),
      quarterWindow,
      repository,
    })
    const generatedPath = input.write === false
      ? this.paths.getGeneratedPath(presentationId)
      : await this.generatedDataStore.writeGeneratedData(this.paths, presentationId, generated)
    const warnings = previousPresentationId ? [] : ['No previous presentation found; previous values defaulted to 0.']

    return {
      presentationId,
      generatedPath,
      ...(previousPresentationId ? { previousPresentationId } : {}),
      generated,
      warnings,
    }
  }

  public async buildSite(_input: BuildSiteInput): Promise<BuildSiteResult> {
    throw new Error('buildSite is not implemented yet.')
  }

  public async serveSite(_input: ServeSiteInput): Promise<ServeSiteResult> {
    throw new Error('serveSite is not implemented yet.')
  }

  public async validateContent(_input: ValidateContentInput): Promise<ValidateContentResult> {
    throw new Error('validateContent is not implemented yet.')
  }
}
