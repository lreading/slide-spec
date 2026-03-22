import { FileSystemPaths } from '../io/FileSystemPaths'
import { NodeFileSystem } from '../io/FileSystem'
import { GitHubRepositoryValidator } from '../github/GitHubRepositoryValidator'

import type { CliOutput } from './CliCommandRunner'
import type { CliPrompter } from './CliPrompter'
import type { FileSystem } from '../io/FileSystem'
import type { TdCliService } from '../application/TdCliService'

export class InteractiveInitFlow {
  public constructor(
    private readonly service: TdCliService,
    private readonly output: CliOutput,
    private readonly prompter: CliPrompter,
    private readonly fileSystem: FileSystem = new NodeFileSystem(),
    private readonly repositoryValidator: GitHubRepositoryValidator = new GitHubRepositoryValidator(),
  ) {}

  public async run(): Promise<void> {
    this.output.info('Interactive init creates a minimal scaffold first, then lets you fill in optional details.')

    const projectRoot = await this.promptOptional(
      'Target presentation project root. Leave blank to use the current working directory.',
      'Project root (optional)',
    )
    const presentationId = await this.promptRequired(
      'Unique presentation id used for content/presentations/<id>/',
      'Presentation id',
    )
    const title = await this.promptRequired(
      'Presentation title shown in listings and the app.',
      'Title',
    )
    const subtitle = await this.promptOptional(
      'Short subtitle shown in listings and slide chrome. Leave blank to use a placeholder.',
      'Subtitle (optional)',
    )
    const fromDate = await this.promptRequired(
      'Reporting-period start date in YYYY-MM-DD format.',
      'From date (YYYY-MM-DD)',
    )
    const toDate = await this.promptOptional(
      'Reporting-period end date in YYYY-MM-DD format. Leave blank if unknown.',
      'To date (YYYY-MM-DD, optional)',
    )
    const summary = await this.promptOptional(
      'Listing summary shown on the presentations page. Leave blank to use the scaffold summary.',
      'Summary (optional)',
    )

    this.output.info('Optional advanced setup: GitHub import, repository/docs links, and generated-data defaults.')
    const wantsGitHubImport = await this.promptBoolean(
      'Import statistics from a GitHub repository?',
      'Import GitHub statistics',
      false,
    )

    let githubRepositoryUrl: string | undefined
    let githubDataSourceUrl: string | undefined
    if (wantsGitHubImport) {
      githubRepositoryUrl = await this.promptValidatedGitHubRepository()
      githubDataSourceUrl = githubRepositoryUrl

      const wantsGitHubPat = await this.promptBoolean(
        'Provide a GitHub PAT now so the CLI can fetch stats without rate limits when possible? If you already have one, paste it now and the CLI will write <project-root>/.env for you as GITHUB_PAT.',
        'Provide GitHub PAT',
        false,
      )

      if (wantsGitHubPat) {
        const token = await this.promptRequired(
          'Paste a GitHub PAT. It will be written to <project-root>/.env as GITHUB_PAT.',
          'GitHub PAT',
        )
        await this.writeGitHubPat(projectRoot, token)
        this.output.info('Wrote GitHub PAT to .env.')
      } else {
        this.output.info('Continuing without a GitHub PAT. GitHub-backed fetches will be best-effort and may be rate-limited. You can add GITHUB_PAT to <project-root>/.env later and rerun fetch.')
      }
    }

    const repositoryUrl = await this.promptOptional(
      'Project repository link. Leave blank to use the GitHub repository URL if one was provided.',
      'Repository URL (optional)',
    ) ?? githubRepositoryUrl
    const docsUrl = await this.promptOptional(
      'Project documentation link. Leave blank to keep the scaffold placeholder.',
      'Docs URL (optional)',
    )
    const websiteUrl = await this.promptOptional(
      'Project website or foundation link. Leave blank to keep the scaffold placeholder.',
      'Website URL (optional)',
    )
    const force = await this.promptBoolean(
      'Overwrite the existing scaffold files if this presentation id already exists.',
      'Overwrite existing scaffold files',
      false,
    )

    const result = await this.service.initPresentation({
      ...(projectRoot !== undefined ? { projectRoot } : {}),
      presentationId,
      title,
      ...(subtitle !== undefined ? { subtitle } : {}),
      fromDate,
      ...(toDate !== undefined ? { toDate } : {}),
      ...(summary !== undefined ? { summary } : {}),
      ...(force !== undefined ? { force } : {}),
      ...(repositoryUrl !== undefined ? { repositoryUrl } : {}),
      ...(docsUrl !== undefined ? { docsUrl } : {}),
      ...(websiteUrl !== undefined ? { websiteUrl } : {}),
      ...(githubDataSourceUrl !== undefined ? { githubDataSourceUrl } : {}),
    })

    this.output.info(`Initialized ${result.presentationId}`)

    const shouldServe = await this.promptBoolean(
      'Start the local server now so you can review what was created?',
      'Start local server',
      true,
    )

    if (shouldServe) {
      const serveResult = await this.service.serveSite({
        ...(projectRoot !== undefined ? { projectRoot } : {}),
        open: true,
      })
      this.output.info(`Serving at ${serveResult.url}`)
    }
  }

  private async promptValidatedGitHubRepository(): Promise<string> {
    while (true) {
      const repositoryUrl = await this.promptRequired(
        'GitHub repository URL to import statistics from. Example: https://github.com/owner/repo',
        'GitHub repository URL',
      )

      try {
        const validation = await this.repositoryValidator.validate(repositoryUrl)

        if (!validation.verified && validation.warning) {
          this.output.info(validation.warning)
        }

        return validation.repository.url
      } catch (error) {
        this.output.error(error instanceof Error ? error.message : String(error))
      }
    }
  }

  private async writeGitHubPat(projectRoot: string | undefined, token: string): Promise<void> {
    const paths = new FileSystemPaths(projectRoot ?? process.cwd())
    const envPath = paths.getEnvPath()
    const existingContent = (await this.fileSystem.fileExists(envPath))
      ? await this.fileSystem.readTextFile(envPath)
      : ''
    const nextContent = this.mergeEnvContent(existingContent, token)

    await this.fileSystem.writeTextFile(envPath, nextContent)
  }

  private mergeEnvContent(existingContent: string, token: string): string {
    const lines = existingContent
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0 && !line.startsWith('GITHUB_PAT='))

    return ['GITHUB_PAT=' + token, ...lines, ''].join('\n')
  }

  private async promptRequired(helpText: string, label: string): Promise<string> {
    this.output.info(helpText)
    return this.prompter.promptRequired(label)
  }

  private async promptOptional(helpText: string, label: string): Promise<string | undefined> {
    this.output.info(helpText)
    return this.prompter.promptOptional(label)
  }

  private async promptBoolean(
    helpText: string,
    label: string,
    defaultValue?: boolean,
  ): Promise<boolean | undefined> {
    this.output.info(helpText)
    return this.prompter.promptBoolean(label, defaultValue)
  }
}
