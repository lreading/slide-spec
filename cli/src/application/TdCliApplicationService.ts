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
import { NodeProcessRunner } from '../process/ProcessRunner'

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
import type { ProcessRunner } from '../process/ProcessRunner'

interface TdCliApplicationServiceOptions {
  cliRoot?: string
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
  gitHubClientFactory?: (token: string) => GitHubClient
  processRunner?: ProcessRunner
}

export class TdCliApplicationService implements TdCliService {
  private readonly paths: FileSystemPaths
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
  private readonly gitHubClientFactory: (token: string) => GitHubClient
  private readonly processRunner: ProcessRunner

  public constructor(options: TdCliApplicationServiceOptions = {}) {
    this.paths = new FileSystemPaths(options.cliRoot ?? process.cwd())
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
    this.gitHubClientFactory = options.gitHubClientFactory ?? ((token: string) => new GitHubApiClient({ token }))
    this.processRunner = options.processRunner ?? new NodeProcessRunner()
  }

  public async initPresentation(input: InitPresentationInput): Promise<InitPresentationResult> {
    const period = this.reportingPeriodResolver.resolve(input.fromDate, input.toDate).current
    const entries = await this.presentationIndexStore.load(this.paths)
    const existingPresentation = this.presentationIndexStore.findPresentationById(entries, input.presentationId)

    if (existingPresentation && !input.force) {
      throw new Error(
        `Presentation "${input.presentationId}" already exists. Use force to overwrite scaffold files.`,
      )
    }

    const scaffold = {
      presentationId: input.presentationId,
      title: input.title,
      subtitle: input.subtitle,
      summary: input.summary ?? 'Replace with a summary before publishing.',
      period,
    }
    const presentationDocument = this.initPresentationBuilder.buildPresentationDocument(scaffold)
    const generatedDocument = this.initPresentationBuilder.buildGeneratedData(
      scaffold,
    )
    const presentationPath = this.paths.getPresentationPath(input.presentationId)
    const generatedPath = this.paths.getGeneratedPath(input.presentationId)

    await this.yamlWriter.writeDocument(presentationPath, presentationDocument)
    await this.generatedDataStore.writeGeneratedData(this.paths, input.presentationId, generatedDocument)

    if (!existingPresentation) {
      await this.presentationIndexStore.write(this.paths, [
        this.initPresentationBuilder.buildIndexEntry(scaffold),
        ...entries,
      ])
    }

    return {
      presentationId: input.presentationId,
      createdPaths: [
        presentationPath,
        generatedPath,
        ...(existingPresentation ? [] : [this.paths.getPresentationsIndexPath()]),
      ],
    }
  }

  public async fetchPresentationData(input: FetchPresentationDataInput): Promise<FetchPresentationDataResult> {
    const periods = this.reportingPeriodResolver.resolve(input.fromDate, input.toDate)
    const siteConfig = await this.contentConfigLoader.loadSiteConfig(this.paths)
    const repository = this.dataSourceResolver.resolveGitHubRepository(siteConfig)
    const environment = await this.envLoader.loadEnvironment(this.paths)
    const gitHubClient = this.gitHubClientFactory(environment.githubAccessToken)
    const buildResult = await this.generatedDataBuilder.build({
      client: gitHubClient,
      presentationId: input.presentationId,
      currentPeriod: periods.current,
      ...(input.noPreviousPeriod ? {} : { previousPeriod: periods.previous }),
      repository,
    })
    const generatedPath = input.write === false
      ? this.paths.getGeneratedPath(input.presentationId)
      : await this.generatedDataStore.writeGeneratedData(this.paths, input.presentationId, buildResult.generated)
    const warnings = [
      ...buildResult.warnings,
      ...(input.noPreviousPeriod ? ['Previous period comparison disabled; previous values defaulted to 0.'] : []),
    ]

    return {
      presentationId: input.presentationId,
      generatedPath,
      generated: buildResult.generated,
      warnings,
    }
  }

  public async buildSite(_input: BuildSiteInput): Promise<BuildSiteResult> {
    await this.processRunner.run(this.getNpmCommand(), ['run', 'build'], {
      cwd: this.paths.getAppRoot(),
    })

    return {
      outputPath: `${this.paths.getAppRoot()}/dist`,
    }
  }

  public async serveSite(input: ServeSiteInput): Promise<ServeSiteResult> {
    const host = input.host ?? '127.0.0.1'
    const port = input.port ?? 5173
    const args = [
      'run',
      'dev',
      '--',
      '--host',
      host,
      '--port',
      String(port),
      '--strictPort',
      ...(input.open ? ['--open'] : []),
    ]

    await this.processRunner.start(this.getNpmCommand(), args, {
      cwd: this.paths.getAppRoot(),
    })

    return {
      url: `http://${host}:${port}/`,
    }
  }

  public async validateContent(_input: ValidateContentInput): Promise<ValidateContentResult> {
    await this.processRunner.run(this.getNpmCommand(), ['run', 'validate:content'], {
      cwd: this.paths.getAppRoot(),
    })

    return {
      valid: true,
      errors: [],
    }
  }

  private getNpmCommand(): string {
    return process.platform === 'win32' ? 'npm.cmd' : 'npm'
  }
}
