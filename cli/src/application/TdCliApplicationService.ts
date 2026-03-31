import { ExampleRegistry } from '../examples/ExampleRegistry'
import { ContentConfigLoader } from '../config/ContentConfigLoader'
import { DataSourceResolver } from '../config/DataSourceResolver'
import { EnvLoader } from '../config/EnvLoader'
import { FileSystemPaths } from '../io/FileSystemPaths'
import { GeneratedDataBuilder } from '../generation/GeneratedDataBuilder'
import { GeneratedDataStore } from '../generation/GeneratedDataStore'
import { GitHubApiClient } from '../github/GitHubClient'
import { InitPresentationBuilder } from '../init/InitPresentationBuilder'
import { PresentationIndexStore } from '../init/PresentationIndexStore'
import { PresentationIndexLoader } from '../generation/PresentationIndexLoader'
import { ReportingPeriodResolver } from '../generation/ReportingPeriodResolver'
import { YamlWriter } from '../io/YamlWriter'
import { NodeFileSystem } from '../io/FileSystem'
import { ProjectContentValidator } from '../validation/ProjectContentValidator'
import { BrowserOpener } from '../runtime/BrowserOpener'
import { StaticSiteServer } from '../runtime/StaticSiteServer'
import { ViteSiteBuilder } from '../runtime/ViteSiteBuilder'
import type { CliLogger } from '../logging/CliLogger.types'

import type { TdCliService } from './TdCliService'
import type {
  BuildSiteInput,
  BuildSiteResult,
  FetchPresentationDataInput,
  FetchPresentationDataResult,
  InitFromExampleInput,
  InitFromExampleResult,
  InitPresentationInput,
  InitPresentationResult,
  ServeSiteInput,
  ServeSiteResult,
  ValidateContentInput,
  ValidateContentResult,
} from './TdCliService.types'
import type { GitHubClient } from '../github/GitHubClient.types'
import type { FileSystem } from '../io/FileSystem'

interface TdCliApplicationServiceOptions {
  projectRoot?: string
  contentConfigLoader?: ContentConfigLoader
  dataSourceResolver?: DataSourceResolver
  envLoader?: EnvLoader
  presentationIndexLoader?: PresentationIndexLoader
  presentationIndexStore?: PresentationIndexStore
  generatedDataBuilder?: GeneratedDataBuilder
  generatedDataStore?: GeneratedDataStore
  initPresentationBuilder?: InitPresentationBuilder
  reportingPeriodResolver?: ReportingPeriodResolver
  yamlWriter?: YamlWriter
  gitHubClientFactory?: (token?: string) => GitHubClient
  siteBuilder?: ViteSiteBuilder
  staticSiteServer?: StaticSiteServer
  contentValidator?: ProjectContentValidator
  browserOpener?: BrowserOpener
  fileSystem?: FileSystem
  logger?: CliLogger
  exampleRegistry?: ExampleRegistry
}

export class TdCliApplicationService implements TdCliService {
  private static readonly defaultServeHost = '127.0.0.1'
  private static readonly defaultServePort = 5173

  private readonly defaultProjectRoot: string
  private readonly contentConfigLoader: ContentConfigLoader
  private readonly dataSourceResolver: DataSourceResolver
  private readonly envLoader: EnvLoader
  private readonly presentationIndexLoader: PresentationIndexLoader
  private readonly presentationIndexStore: PresentationIndexStore
  private readonly generatedDataBuilder: GeneratedDataBuilder
  private readonly generatedDataStore: GeneratedDataStore
  private readonly initPresentationBuilder: InitPresentationBuilder
  private readonly reportingPeriodResolver: ReportingPeriodResolver
  private readonly yamlWriter: YamlWriter
  private readonly gitHubClientFactory: (token?: string) => GitHubClient
  private readonly siteBuilder: ViteSiteBuilder
  private readonly staticSiteServer: StaticSiteServer
  private readonly contentValidator: ProjectContentValidator
  private readonly browserOpener: BrowserOpener
  private readonly fileSystem: FileSystem
  private readonly logger: CliLogger | undefined
  private readonly exampleRegistry: ExampleRegistry

  public constructor(options: TdCliApplicationServiceOptions = {}) {
    this.defaultProjectRoot = options.projectRoot ?? process.cwd()
    this.contentConfigLoader = options.contentConfigLoader ?? new ContentConfigLoader()
    this.dataSourceResolver = options.dataSourceResolver ?? new DataSourceResolver()
    this.envLoader = options.envLoader ?? new EnvLoader()
    this.presentationIndexLoader = options.presentationIndexLoader ?? new PresentationIndexLoader()
    this.presentationIndexStore = options.presentationIndexStore ?? new PresentationIndexStore()
    this.generatedDataBuilder = options.generatedDataBuilder ?? new GeneratedDataBuilder()
    this.generatedDataStore = options.generatedDataStore ?? new GeneratedDataStore()
    this.initPresentationBuilder = options.initPresentationBuilder ?? new InitPresentationBuilder()
    this.reportingPeriodResolver = options.reportingPeriodResolver ?? new ReportingPeriodResolver()
    this.yamlWriter = options.yamlWriter ?? new YamlWriter()
    this.logger = options.logger
    this.gitHubClientFactory = options.gitHubClientFactory ?? ((token?: string) => new GitHubApiClient({
      ...(token !== undefined ? { token } : {}),
      ...(this.logger !== undefined ? { logger: this.logger } : {}),
    }))
    this.siteBuilder = options.siteBuilder ?? new ViteSiteBuilder()
    this.staticSiteServer = options.staticSiteServer ?? new StaticSiteServer()
    this.contentValidator = options.contentValidator ?? new ProjectContentValidator()
    this.browserOpener = options.browserOpener ?? new BrowserOpener()
    this.fileSystem = options.fileSystem ?? new NodeFileSystem()
    this.exampleRegistry = options.exampleRegistry ?? new ExampleRegistry()
  }

  public async initPresentation(input: InitPresentationInput): Promise<InitPresentationResult> {
    const paths = this.getPaths(input.projectRoot)
    const createdPaths: string[] = []
    const period = this.reportingPeriodResolver.resolve(input.fromDate, input.toDate).current
    const entries = await this.presentationIndexStore.load(paths)
    const existingPresentation = this.presentationIndexStore.findPresentationById(entries, input.presentationId)

    if (existingPresentation && !input.force) {
      throw new Error(
        `Presentation "${input.presentationId}" already exists. Use force to overwrite scaffold files.`,
      )
    }

    const scaffold = {
      presentationId: input.presentationId,
      title: input.title,
      summary: input.summary ?? 'Replace with a summary before publishing.',
      period,
      ...(input.subtitle !== undefined ? { subtitle: input.subtitle } : {}),
    }
    const presentationDocument = this.initPresentationBuilder.buildPresentationDocument(scaffold)
    const generatedDocument = this.initPresentationBuilder.buildGeneratedData(
      scaffold,
    )
    if (!await this.fileSystem.fileExists(paths.getSiteConfigPath())) {
      await this.yamlWriter.writeDocument(paths.getSiteConfigPath(), this.initPresentationBuilder.buildSiteDocument({
        ...(input.repositoryUrl !== undefined ? { repositoryUrl: input.repositoryUrl } : {}),
        ...(input.docsUrl !== undefined ? { docsUrl: input.docsUrl } : {}),
        ...(input.websiteUrl !== undefined ? { websiteUrl: input.websiteUrl } : {}),
        ...(input.githubDataSourceUrl !== undefined ? { githubDataSourceUrl: input.githubDataSourceUrl } : {}),
      }))
      createdPaths.push(paths.getSiteConfigPath())
    }
    const presentationPath = paths.getPresentationPath(input.presentationId)
    const generatedPath = paths.resolveGeneratedPath({
      id: input.presentationId,
    })

    await this.yamlWriter.writeDocument(presentationPath, presentationDocument)
      await this.generatedDataStore.writeGeneratedData(paths, { id: input.presentationId }, generatedDocument)
    createdPaths.push(presentationPath, generatedPath)

    if (!existingPresentation) {
      const isFirstPresentation = entries.length === 0
      await this.presentationIndexStore.write(paths, [
        this.initPresentationBuilder.buildIndexEntry(scaffold, {
          published: true,
          featured: isFirstPresentation,
        }),
        ...entries,
      ])
      createdPaths.push(paths.getPresentationsIndexPath())
    }

    return {
      presentationId: input.presentationId,
      createdPaths,
    }
  }

  public async initFromExample(input: InitFromExampleInput): Promise<InitFromExampleResult> {
    const paths = this.getPaths(input.projectRoot)
    const targetContentPath = paths.getContentRoot()
    const exampleContentPath = this.exampleRegistry.resolveContentPath(input.exampleId)

    if (await this.fileSystem.directoryExists(targetContentPath) && !input.force) {
      throw new Error('content/ already exists. Use --force to overwrite.')
    }

    if (input.force) {
      await this.fileSystem.removeDirectory(targetContentPath)
    }

    await this.fileSystem.copyDirectory(exampleContentPath, targetContentPath)

    return {
      exampleId: input.exampleId,
      targetPath: targetContentPath,
    }
  }

  public async fetchPresentationData(input: FetchPresentationDataInput): Promise<FetchPresentationDataResult> {
    const paths = this.getPaths(input.projectRoot)
    const entries = await this.presentationIndexStore.load(paths)
    const existingPresentation = this.presentationIndexStore.findPresentationById(entries, input.presentationId)

    if (!existingPresentation) {
      throw new Error(`Presentation "${input.presentationId}" was not found in content/presentations/index.yaml.`)
    }

    const generatedPath = paths.resolveGeneratedPath(existingPresentation)
    if (!input.force && await this.fileSystem.fileExists(generatedPath)) {
      throw new Error(
        `generated.yaml already exists for "${input.presentationId}". Use --force to overwrite.`,
      )
    }
    const periods = this.reportingPeriodResolver.resolve(input.fromDate, input.toDate)
    const siteConfig = await this.contentConfigLoader.loadSiteConfig(paths)
    const repository = this.dataSourceResolver.resolveGitHubRepository(siteConfig)
    const environment = await this.envLoader.loadEnvironment(paths)
    const gitHubClient = this.gitHubClientFactory(environment.githubAccessToken)
    const buildResult = await this.generatedDataBuilder.build({
      client: gitHubClient,
      presentationId: input.presentationId,
      currentPeriod: periods.current,
      ...(input.noPreviousPeriod ? {} : { previousPeriod: periods.previous }),
      repository,
    })
    if (input.write !== false) {
      await this.generatedDataStore.writeGeneratedData(paths, existingPresentation, buildResult.generated)
    }
    const warnings = [
      ...buildResult.warnings,
      ...(input.noPreviousPeriod ? ['Previous period comparison disabled; previous values defaulted to 0.'] : []),
    ]

    return {
      presentationId: input.presentationId,
      generatedPath,
      generated: buildResult.generated,
      warnings,
      timings: input.timings ? buildResult.timings : [],
    }
  }

  public async buildSite(input: BuildSiteInput): Promise<BuildSiteResult> {
    const paths = this.getPaths(input.projectRoot)
    const previousDeploymentUrl = process.env.SLIDE_SPEC_DEPLOYMENT_URL
    const previousSitemapEnabled = process.env.SLIDE_SPEC_SITEMAP_ENABLED

    if (input.deploymentUrl !== undefined) {
      process.env.SLIDE_SPEC_DEPLOYMENT_URL = input.deploymentUrl
      process.env.SLIDE_SPEC_SITEMAP_ENABLED = 'true'
    }

    try {
      await this.siteBuilder.build(paths)
    } finally {
      if (previousDeploymentUrl === undefined) {
        delete process.env.SLIDE_SPEC_DEPLOYMENT_URL
      } else {
        process.env.SLIDE_SPEC_DEPLOYMENT_URL = previousDeploymentUrl
      }

      if (previousSitemapEnabled === undefined) {
        delete process.env.SLIDE_SPEC_SITEMAP_ENABLED
      } else {
        process.env.SLIDE_SPEC_SITEMAP_ENABLED = previousSitemapEnabled
      }
    }

    return {
      outputPath: paths.getDistPath(),
    }
  }

  public async serveSite(input: ServeSiteInput): Promise<ServeSiteResult> {
    const paths = this.getPaths(input.projectRoot)
    const host = input.host ?? TdCliApplicationService.defaultServeHost
    const preferredPort = input.port ?? TdCliApplicationService.defaultServePort
    await this.contentValidator.validate(paths)
    await this.siteBuilder.build(paths)

    let port: number

    try {
      port = await this.staticSiteServer.start(paths.getDistPath(), host, preferredPort)
    } catch (error) {
      if (input.port !== undefined || !this.isAddressInUseError(error)) {
        throw error
      }

      port = await this.staticSiteServer.start(paths.getDistPath(), host, 0)
    }

    const url = `http://${host}:${port}/`

    if (input.open) {
      this.browserOpener.open(url)
    }

    return {
      url,
    }
  }

  public async validateContent(input: ValidateContentInput): Promise<ValidateContentResult> {
    const paths = this.getPaths(input.projectRoot)
    await this.contentValidator.validate(paths)

    return {
      valid: true,
      errors: [],
    }
  }

  private getPaths(projectRoot?: string): FileSystemPaths {
    return new FileSystemPaths(projectRoot ?? this.defaultProjectRoot)
  }

  private isAddressInUseError(error: unknown): error is NodeJS.ErrnoException {
    return error instanceof Error && 'code' in error && error.code === 'EADDRINUSE'
  }
}
