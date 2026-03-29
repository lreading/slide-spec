import { TdCliApplicationService } from '../application/TdCliApplicationService'
import { ReadlineCliPrompter } from './CliPrompter'
import { InteractiveInitFlow } from './InteractiveInitFlow'
import { LogSanitizer } from '../logging/LogSanitizer'

import type { TdCliService } from '../application/TdCliService'
import type { CliCommandName, CliPrompter } from './CliPrompter'
import type { CliLogger } from '../logging/CliLogger.types'

export interface CliOutput {
  info(message: string): void
  error(message: string): void
}

interface CommandOptions {
  [key: string]: string | boolean | undefined
}

interface ParsedCommandInput {
  options: CommandOptions
  positionals: string[]
}

const CLI_BIN_NAME = 'slide-spec'
const fetchProgressIntervalMs = 5000
const largeRepositoryFetchNotice = 'Fetching GitHub-derived data. Large repositories can take up to about two minutes.'
const fetchProgressMessage = 'Still fetching GitHub-derived data...'

export class CliCommandRunner {
  private readonly interactiveInitFlow: InteractiveInitFlow
  private readonly logger: CliLogger | undefined
  private readonly sanitizer: LogSanitizer

  public constructor(
    private readonly service: TdCliService = new TdCliApplicationService(),
    private readonly output: CliOutput = console,
    private readonly prompter: CliPrompter = new ReadlineCliPrompter(),
    logger?: CliLogger,
  ) {
    this.logger = logger
    this.sanitizer = new LogSanitizer()
    this.interactiveInitFlow = new InteractiveInitFlow(
      this.service,
      this.output,
      this.prompter,
      undefined,
      undefined,
      this.logger,
    )
  }

  public async run(argv: string[]): Promise<number> {
    if (argv.length === 0) {
      try {
        const command = await this.runInteractive()

        if (command === 'help') {
          this.info(this.getHelpText())
        }

        return 0
      } catch (error) {
        this.error(error instanceof Error ? error.message : String(error))
        return 1
      }
    }

    const command = argv[0]

    if (command === 'help' || command === '--help' || command === '-h') {
      const topic = argv[1]
      this.info(this.getHelpText(topic))
      return 0
    }

    try {
      if (this.hasHelpFlag(argv.slice(1))) {
        this.info(this.getHelpText(command))
        return 0
      }

      switch (command) {
      case 'init':
        if (argv.slice(1).length === 0) {
          await this.runInteractiveInit()
          return 0
        }
        await this.runInit(argv.slice(1))
        return 0
      case 'fetch':
        await this.runFetch(argv.slice(1))
        return 0
      case 'build': {
        const parsed = this.parseCommandInput(argv.slice(1))
        await this.runBuild(
          this.readProjectRoot(parsed),
          this.readStringOption(parsed.options, 'deployment-url'),
        )
        return 0
      }
      case 'serve':
        await this.runServe(argv.slice(1))
        return 0
      case 'validate':
        await this.runValidate(argv.slice(1))
        return 0
      default:
        throw new Error(`Unknown command "${command}".`)
      }
    } catch (error) {
      this.error(error instanceof Error ? error.message : String(error))
      return 1
    }
  }

  private async runInteractive(): Promise<CliCommandName> {
    this.info('No command provided. Starting interactive mode.')
    this.info(this.getCommandOverviewText())
    this.info('Choose the command you want to run.')
    const command = await this.prompter.promptCommand()

    switch (command) {
      case 'init': {
        this.info(this.getHelpText('init'))
        await this.runInteractiveInit()
        break
      }
      case 'fetch': {
        this.info(this.getHelpText('fetch'))
        const projectRoot = await this.promptOptional(
          'Target presentation project root. Leave blank to use the current working directory.',
          'Project root (optional)',
        )
        const presentationId = await this.promptRequired(
          'Target presentation id to update. This must already exist under content/presentations/.',
          'Presentation id',
        )
        const fromDate = await this.promptRequired(
          'Reporting-period start date in YYYY-MM-DD format.',
          'From date (YYYY-MM-DD)',
        )
        const toDate = await this.promptOptional(
          'Reporting-period end date in YYYY-MM-DD format. Leave blank to use today.',
          'To date (YYYY-MM-DD, optional)',
        )
        const noPreviousPeriod = await this.promptBoolean(
          'Skip previous-period comparison and force previous values to 0.',
          'Disable previous-period comparison',
          false,
        )
        const timings = await this.promptBoolean(
          'Show per-step fetch timings after the run completes.',
          'Show timings',
          false,
        )
        const dryRun = await this.promptBoolean(
          'Compute data without writing generated.yaml.',
          'Dry run',
          false,
        )

        const result = await this.service.fetchPresentationData({
          ...(projectRoot !== undefined ? { projectRoot } : {}),
          presentationId,
          fromDate,
          ...(toDate !== undefined ? { toDate } : {}),
          ...(noPreviousPeriod !== undefined ? { noPreviousPeriod } : {}),
          ...(timings ? { timings } : {}),
          ...(dryRun ? { write: false } : {}),
        })
        this.reportFetchResult(result)
        break
      }
      case 'build': {
        this.info(this.getHelpText('build'))
        const projectRoot = await this.promptOptional(
          'Target presentation project root. Leave blank to use the current working directory.',
          'Project root (optional)',
        )
        const deploymentUrl = await this.promptOptional(
          'Optional public deployment URL used for sitemap.xml. Leave blank to skip sitemap generation.',
          'Deployment URL (optional)',
        )
        await this.runBuild(projectRoot, deploymentUrl)
        break
      }
      case 'serve': {
        this.info(this.getHelpText('serve'))
        const projectRoot = await this.promptOptional(
          'Target presentation project root. Leave blank to use the current working directory.',
          'Project root (optional)',
        )
        const host = await this.promptOptional(
          'Host interface to bind to. Leave blank to use the default local host.',
          'Host (optional)',
        )
        const port = await this.promptNumber(
          'Port to serve on. Leave blank to use the default port.',
          'Port',
          5173,
        )
        const open = await this.promptBoolean(
          'Open the site in your default browser after the static server starts.',
          'Open in browser',
          false,
        )
        const result = await this.service.serveSite({
          ...(projectRoot !== undefined ? { projectRoot } : {}),
          ...(host !== undefined ? { host } : {}),
          ...(port !== undefined ? { port } : {}),
          ...(open !== undefined ? { open } : {}),
        })
        this.info(`Serving at ${result.url}`)
        break
      }
      case 'validate': {
        this.info(this.getHelpText('validate'))
        const projectRoot = await this.promptOptional(
          'Target presentation project root. Leave blank to use the current working directory.',
          'Project root (optional)',
        )
        const strict = await this.promptBoolean(
          'Enable stricter validation behavior when available.',
          'Strict validation',
          false,
        )
        const result = await this.service.validateContent({
          ...(projectRoot !== undefined ? { projectRoot } : {}),
          ...(strict !== undefined ? { strict } : {}),
        })
        this.info(result.valid ? 'Content is valid' : 'Content validation failed')
        break
      }
      case 'help':
        break
    }

    return command
  }

  private async runInit(args: string[]): Promise<void> {
    const parsed = this.parseCommandInput(args)
    const required = this.requireStringOptions(parsed.options, ['presentation-id', 'title', 'from-date'])
    const projectRoot = this.readProjectRoot(parsed)
    const force = this.readBooleanOption(parsed.options, 'force')
    const toDate = this.readStringOption(parsed.options, 'to-date')
    const summary = this.readStringOption(parsed.options, 'summary')
    const subtitle = this.readStringOption(parsed.options, 'subtitle')
    const result = await this.service.initPresentation({
      ...(projectRoot !== undefined ? { projectRoot } : {}),
      presentationId: required['presentation-id'],
      title: required.title,
      fromDate: required['from-date'],
      ...(subtitle !== undefined ? { subtitle } : {}),
      ...(toDate !== undefined ? { toDate } : {}),
      ...(summary !== undefined ? { summary } : {}),
      ...(force !== undefined ? { force } : {}),
    })
    this.info(`Initialized ${result.presentationId}`)
  }

  private async runInteractiveInit(): Promise<void> {
    await this.interactiveInitFlow.run()
  }

  private info(message: string): void {
    const sanitized = this.sanitizer.sanitize(message)
    this.output.info(sanitized)
    this.logger?.info(sanitized)
  }

  private error(message: string): void {
    const sanitized = this.sanitizer.sanitize(message)
    this.output.error(sanitized)
    this.logger?.error(sanitized)
  }

  private async promptRequired(helpText: string, label: string): Promise<string> {
    this.info(helpText)
    return this.prompter.promptRequired(label)
  }

  private async promptOptional(helpText: string, label: string): Promise<string | undefined> {
    this.info(helpText)
    return this.prompter.promptOptional(label)
  }

  private async promptBoolean(
    helpText: string,
    label: string,
    defaultValue?: boolean,
  ): Promise<boolean | undefined> {
    this.info(helpText)
    return this.prompter.promptBoolean(label, defaultValue)
  }

  private async promptNumber(
    helpText: string,
    label: string,
    defaultValue?: number,
  ): Promise<number | undefined> {
    this.info(helpText)
    return this.prompter.promptNumber(label, defaultValue)
  }

  private async runFetch(args: string[]): Promise<void> {
    const parsed = this.parseCommandInput(args)
    const required = this.requireStringOptions(parsed.options, ['presentation-id', 'from-date'])
    const projectRoot = this.readProjectRoot(parsed)
    const presentationId = required['presentation-id']
    const write = this.readBooleanOption(parsed.options, 'dry-run') ? false : undefined
    const toDate = this.readStringOption(parsed.options, 'to-date')
    const noPreviousPeriod = this.readBooleanOption(parsed.options, 'no-previous-period')
    const timings = this.readBooleanOption(parsed.options, 'timings')
    const force = this.readBooleanOption(parsed.options, 'force')
    this.info(largeRepositoryFetchNotice)
    const result = await this.runWithFetchProgress(() =>
      this.service.fetchPresentationData({
        ...(projectRoot !== undefined ? { projectRoot } : {}),
        fromDate: required['from-date'],
        ...(toDate !== undefined ? { toDate } : {}),
        presentationId,
        ...(noPreviousPeriod !== undefined ? { noPreviousPeriod } : {}),
        ...(timings !== undefined ? { timings } : {}),
        ...(write !== undefined ? { write } : {}),
        ...(force !== undefined ? { force } : {}),
      }))
    this.reportFetchResult(result)
  }

  private reportFetchResult(
    result: Awaited<ReturnType<TdCliService['fetchPresentationData']>>,
  ): void {
    this.info(`Fetched ${result.presentationId}`)
    result.warnings.forEach((warning) => {
      this.info(`Warning: ${warning}`)
    })

    if (result.timings.length === 0) {
      return
    }

    this.info('Fetch timings:')
    result.timings.forEach((timing) => {
      this.info(`  ${timing.name}: ${timing.duration_ms.toFixed(2)}ms`)
    })
  }

  private async runWithFetchProgress<T>(work: () => Promise<T>): Promise<T> {
    const interval = setInterval(() => {
      this.info(fetchProgressMessage)
    }, fetchProgressIntervalMs)

    try {
      return await work()
    } finally {
      clearInterval(interval)
    }
  }

  private async runBuild(projectRoot?: string, deploymentUrl?: string): Promise<void> {
    const result = await this.service.buildSite({
      ...(projectRoot !== undefined ? { projectRoot } : {}),
      mode: 'production',
      ...(deploymentUrl !== undefined ? { deploymentUrl } : {}),
    })
    this.info(`Built site to ${result.outputPath}`)
  }

  private async runServe(args: string[]): Promise<void> {
    const parsed = this.parseCommandInput(args)
    const projectRoot = this.readProjectRoot(parsed)
    const host = this.readStringOption(parsed.options, 'host')
    const port = this.readNumberOption(parsed.options, 'port')
    const open = this.readBooleanOption(parsed.options, 'open')
    const result = await this.service.serveSite({
      ...(projectRoot !== undefined ? { projectRoot } : {}),
      ...(host !== undefined ? { host } : {}),
      ...(port !== undefined ? { port } : {}),
      ...(open !== undefined ? { open } : {}),
    })
    this.info(`Serving at ${result.url}`)
  }

  private async runValidate(args: string[]): Promise<void> {
    const parsed = this.parseCommandInput(args)
    const projectRoot = this.readProjectRoot(parsed)
    const strict = this.readBooleanOption(parsed.options, 'strict')
    const result = await this.service.validateContent({
      ...(projectRoot !== undefined ? { projectRoot } : {}),
      ...(strict !== undefined ? { strict } : {}),
    })
    this.info(result.valid ? 'Content is valid' : 'Content validation failed')
  }

  private hasHelpFlag(args: string[]): boolean {
    return args.includes('--help') || args.includes('-h')
  }

  private parseCommandInput(args: string[]): ParsedCommandInput {
    const options: CommandOptions = {}
    const positionals: string[] = []

    for (let index = 0; index < args.length; index += 1) {
      const argument = args[index]
      if (!argument) {
        continue
      }

      if (!argument?.startsWith('--')) {
        positionals.push(argument)
        continue
      }

      const key = argument.slice(2)
      const nextValue = args[index + 1]
      if (!nextValue || nextValue.startsWith('--')) {
        options[key] = true
        continue
      }

      options[key] = nextValue
      index += 1
    }

    return {
      options,
      positionals,
    }
  }

  private requireStringOptions<TKeys extends string>(
    options: CommandOptions,
    keys: TKeys[],
  ): Record<TKeys, string> {
    const missing = keys.filter((key) => this.readStringOption(options, key) === undefined)

    if (missing.length > 0) {
      const flags = missing.map((key) => `--${key}`).join(', ')
      throw new Error(
        `Missing required option${missing.length > 1 ? 's' : ''}: ${flags}.`,
      )
    }

    return Object.fromEntries(
      keys.map((key) => [key, this.readStringOption(options, key) as string]),
    ) as Record<TKeys, string>
  }

  private readNumberOption(options: CommandOptions, key: string): number | undefined {
    const value = options[key]
    if (value === undefined || typeof value === 'boolean') {
      return undefined
    }

    const parsed = Number(value)
    if (!Number.isFinite(parsed)) {
      throw new Error(`Option "--${key}" must be a number.`)
    }

    return parsed
  }

  private readStringOption(options: CommandOptions, key: string): string | undefined {
    const value = options[key]
    return typeof value === 'string' ? value : undefined
  }

  private readBooleanOption(options: CommandOptions, key: string): boolean | undefined {
    const value = options[key]
    return typeof value === 'boolean' ? value : undefined
  }

  private readProjectRoot(parsed: ParsedCommandInput): string | undefined {
    const optionValue = this.readStringOption(parsed.options, 'project-root')
    const [positionalValue, ...remainingPositionals] = parsed.positionals

    if (optionValue && positionalValue) {
      throw new Error('Specify the project root either positionally or with --project-root, not both.')
    }

    if (remainingPositionals.length > 0) {
      throw new Error(`Unexpected argument "${remainingPositionals[0]}".`)
    }

    return optionValue ?? positionalValue
  }

  private getHelpText(topic?: string): string {
    const globalOptions = this.getGlobalOptionsText()

    switch (topic) {
      case 'init':
        return [
          `Usage: ${CLI_BIN_NAME} init [project-root] [--project-root <path>] --presentation-id <id> --title <title> [--subtitle <subtitle>] --from-date <YYYY-MM-DD> [--to-date <YYYY-MM-DD>] [--summary <summary>] [--repository-url <url>] [--docs-url <url>] [--website-url <url>] [--github-data-source-url <url>] [--force]`,
          '',
          'Create a new presentation scaffold with starter presentation and generated YAML files.',
          'Use this before fetch when you are starting a new presentation id.',
          'Run `init` with no flags for an interactive essentials-first prompt flow.',
          'Interactive init collects essentials first, then offers GitHub import, links, and local server startup.',
          '',
          globalOptions,
          '',
          'Options:',
          '  [project-root]          Optional. Positional presentation project root',
          '  --project-root <path>   Optional. Named presentation project root',
          '  --presentation-id <id>        Required. Unique presentation id used for content/presentations/<id>/',
          '  --title <title>               Required. Presentation title shown in listings and the app',
          '  --subtitle <subtitle>         Optional. Secondary label shown in listings and slide chrome',
          '  --from-date <date>            Required. Period start date in YYYY-MM-DD format',
          '  --to-date <date>              Optional. Period end date in YYYY-MM-DD format',
          '  --summary <summary>           Optional. Listing summary text for the presentations page',
          '  --repository-url <url>        Optional. Repository link for site links',
          '  --docs-url <url>              Optional. Documentation link for site links',
          '  --website-url <url>           Optional. Project website/foundation link for site links',
          '  --github-data-source-url <url> Optional. GitHub repository to import stats from',
          '  --force                       Optional. Overwrite scaffold files if the presentation already exists',
          '',
          'Examples:',
          `  ${CLI_BIN_NAME} init`,
          `  ${CLI_BIN_NAME} init /path/to/project --presentation-id 2026-apr --title "Community Update" --from-date 2026-04-01 --to-date 2026-04-30`,
        ].join('\n')
      case 'fetch':
        return [
          `Usage: ${CLI_BIN_NAME} fetch [project-root] [--project-root <path>] --presentation-id <id> --from-date <YYYY-MM-DD> [--to-date <YYYY-MM-DD>] [--no-previous-period] [--timings] [--dry-run] [--force]`,
          '',
          'Pull GitHub-derived metrics and write generated data for an existing presentation.',
          'Use this after init, once the presentation scaffold exists.',
          'If generated.yaml already exists, the command exits with an error. Use --force to overwrite.',
          'If no PAT is available, the CLI will continue best-effort and may be rate-limited.',
          'Large repositories can take up to about two minutes before the CLI falls back on unavailable snapshot metadata.',
          '',
          globalOptions,
          '',
          'Options:',
          '  [project-root]          Optional. Positional presentation project root',
          '  --project-root <path>   Optional. Named presentation project root',
          '  --presentation-id <id>    Required. Target presentation id to update',
          '  --from-date <date>        Required. Period start date in YYYY-MM-DD format',
          '  --to-date <date>          Optional. Period end date in YYYY-MM-DD format. Defaults to today when omitted',
          '  --no-previous-period      Optional. Skip previous-period comparison and force previous values to 0',
          '  --timings                 Optional. Print per-step fetch timings after the run completes',
          '  --dry-run                 Optional. Compute data without writing generated.yaml',
          '  --force                   Optional. Overwrite generated.yaml if it already exists',
          '',
          'Examples:',
          `  ${CLI_BIN_NAME} fetch /path/to/project --presentation-id 2026-q1 --from-date 2026-01-01 --to-date 2026-03-31`,
          `  ${CLI_BIN_NAME} fetch --presentation-id 2026-mar --from-date 2026-03-01 --dry-run`,
          `  ${CLI_BIN_NAME} fetch --presentation-id 2026-q1 --from-date 2026-01-01 --force`,
        ].join('\n')
      case 'build':
        return [
          `Usage: ${CLI_BIN_NAME} build [project-root] [--project-root <path>] [--deployment-url <url>]`,
          '',
          'Build the packaged presentation app and write static output to dist/ in the target project.',
          'Sitemap generation is disabled by default. Provide --deployment-url or enable it in site.yaml when you have a real deployment URL.',
          '',
          globalOptions,
          '',
          'Options:',
          '  [project-root]          Optional. Positional presentation project root',
          '  --project-root <path>   Optional. Named presentation project root',
          '  --deployment-url <url>  Optional. Public deployment URL used for sitemap.xml generation',
          '',
          'Examples:',
          `  ${CLI_BIN_NAME} build`,
          `  ${CLI_BIN_NAME} build /path/to/project --deployment-url https://updates.example.com`,
        ].join('\n')
      case 'serve':
        return [
          `Usage: ${CLI_BIN_NAME} serve [project-root] [--project-root <path>] [--host <host>] [--port <port>] [--open]`,
          '',
          'Build the static site, then serve dist/ locally so you can review it in a browser.',
          '',
          globalOptions,
          '',
          'Options:',
          '  [project-root]          Optional. Positional presentation project root',
          '  --project-root <path>   Optional. Named presentation project root',
          '  --host <host>            Optional. Host interface to bind to. Defaults to 127.0.0.1',
          '  --port <port>            Optional. Port to serve on. Defaults to 5173',
          '  --open                   Optional. Open the browser automatically',
          '',
          'Examples:',
          `  ${CLI_BIN_NAME} serve`,
          `  ${CLI_BIN_NAME} serve --host 0.0.0.0 --port 4173 --open`,
        ].join('\n')
      case 'validate':
        return [
          `Usage: ${CLI_BIN_NAME} validate [project-root] [--project-root <path>] [--strict]`,
          '',
          'Validate authored and generated content against the current app schema.',
          '',
          globalOptions,
          '',
          'Options:',
          '  [project-root]          Optional. Positional presentation project root',
          '  --project-root <path>   Optional. Named presentation project root',
          '  --strict                 Optional. Reserved for stricter validation behavior',
        ].join('\n')
      case 'help':
      case undefined:
        break
      default:
        return `Unknown help topic "${topic}".`
    }

    return [
      `Usage: ${CLI_BIN_NAME} <command> [options]`,
      '',
      'Typical flow:',
      '  1. init      Create a new presentation scaffold with essentials-first prompts',
      '  2. fetch     Populate generated data for the presentation',
      '  3. validate  Confirm the content is still valid',
      '  4. serve     Build and review locally',
      '  5. build     Produce the static site output',
      '',
      this.getGlobalOptionsText(),
      '',
      this.getCommandOverviewText(),
      '',
      'Command-specific help:',
      `  ${CLI_BIN_NAME} help <command>`,
      `  ${CLI_BIN_NAME} <command> --help`,
      '',
      'Commands:',
      '  init [project-root] [--project-root <path>] --presentation-id <id> --title <title> [--subtitle <subtitle>] --from-date <YYYY-MM-DD> [--to-date <YYYY-MM-DD>] [--summary <summary>] [--force]',
      '    Create a new presentation scaffold with starter presentation and generated YAML files. Run `init` with no flags for an interactive essentials-first prompt.',
      '  fetch [project-root] [--project-root <path>] --presentation-id <id> --from-date <YYYY-MM-DD> [--to-date <YYYY-MM-DD>] [--no-previous-period] [--dry-run]',
      '    Pull GitHub-derived metrics and write generated data for an existing presentation.',
      '  validate [project-root] [--project-root <path>] [--strict]',
      '    Validate authored and generated content against the current app schema.',
      '  serve [project-root] [--project-root <path>] [--host <host>] [--port <port>] [--open]',
      '    Build the site and serve dist/ locally so you can review the presentation in a browser.',
      '  build [project-root] [--project-root <path>] [--deployment-url <url>]',
      '    Build the packaged app runtime and write dist/ to the target project. Sitemap generation is opt-in.',
    ].join('\n')
  }

  private getCommandOverviewText(): string {
    return [
      'Command overview:',
      '  init      Create a new presentation scaffold before you have any generated data.',
      '  fetch     Pull GitHub data into generated.yaml for a presentation that already exists.',
      '  validate  Check that authored and generated content still matches the schema.',
      '  serve     Build dist/ and serve it locally for review.',
      '  build     Produce dist/ static site output.',
      '  help      Show usage and command details.',
    ].join('\n')
  }

  private getGlobalOptionsText(): string {
    return [
      'Global options:',
      '  --log-path <file>   Optional. Write sanitized CLI and GitHub logs to a file. Logging is off by default.',
    ].join('\n')
  }
}
