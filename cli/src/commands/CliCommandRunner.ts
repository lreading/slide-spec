import { TdCliApplicationService } from '../application/TdCliApplicationService'
import { ReadlineCliPrompter } from './CliPrompter'

import type { TdCliService } from '../application/TdCliService'
import type { CliCommandName, CliPrompter } from './CliPrompter'

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

const CLI_BIN_NAME = 'oss-slides'

export class CliCommandRunner {
  public constructor(
    private readonly service: TdCliService = new TdCliApplicationService(),
    private readonly output: CliOutput = console,
    private readonly prompter: CliPrompter = new ReadlineCliPrompter(),
  ) {}

  public async run(argv: string[]): Promise<number> {
    if (argv.length === 0) {
      try {
        const command = await this.runInteractive()

        if (command === 'help') {
          this.output.info(this.getHelpText())
        }

        return 0
      } catch (error) {
        this.output.error(error instanceof Error ? error.message : String(error))
        return 1
      }
    }

    const command = argv[0]

    if (command === 'help' || command === '--help' || command === '-h') {
      const topic = argv[1]
      this.output.info(this.getHelpText(topic))
      return 0
    }

    try {
      if (this.hasHelpFlag(argv.slice(1))) {
        this.output.info(this.getHelpText(command))
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
        case 'build':
          await this.runBuild(this.readProjectRoot(this.parseCommandInput(argv.slice(1))))
          return 0
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
      this.output.error(error instanceof Error ? error.message : String(error))
      return 1
    }
  }

  private async runInteractive(): Promise<CliCommandName> {
    this.output.info('No command provided. Starting interactive mode.')
    this.output.info(this.getCommandOverviewText())
    this.output.info('Choose the command you want to run.')
    const command = await this.prompter.promptCommand()

    switch (command) {
      case 'init': {
        this.output.info(this.getHelpText('init'))
        await this.runInteractiveInit()
        break
      }
      case 'fetch': {
        this.output.info(this.getHelpText('fetch'))
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
          ...(dryRun ? { write: false } : {}),
        })
        this.output.info(`Fetched ${result.presentationId}`)
        break
      }
      case 'build': {
        this.output.info(this.getHelpText('build'))
        const projectRoot = await this.promptOptional(
          'Target presentation project root. Leave blank to use the current working directory.',
          'Project root (optional)',
        )
        await this.runBuild(projectRoot)
        break
      }
      case 'serve': {
        this.output.info(this.getHelpText('serve'))
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
        this.output.info(`Serving at ${result.url}`)
        break
      }
      case 'validate': {
        this.output.info(this.getHelpText('validate'))
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
        this.output.info(result.valid ? 'Content is valid' : 'Content validation failed')
        break
      }
      case 'help':
        break
    }

    return command
  }

  private async runInit(args: string[]): Promise<void> {
    const parsed = this.parseCommandInput(args)
    const required = this.requireStringOptions(parsed.options, ['presentation-id', 'title', 'subtitle', 'from-date'])
    const projectRoot = this.readProjectRoot(parsed)
    const force = this.readBooleanOption(parsed.options, 'force')
    const toDate = this.readStringOption(parsed.options, 'to-date')
    const summary = this.readStringOption(parsed.options, 'summary')
    const result = await this.service.initPresentation({
      ...(projectRoot !== undefined ? { projectRoot } : {}),
      presentationId: required['presentation-id'],
      title: required.title,
      subtitle: required.subtitle,
      fromDate: required['from-date'],
      ...(toDate !== undefined ? { toDate } : {}),
      ...(summary !== undefined ? { summary } : {}),
      ...(force !== undefined ? { force } : {}),
    })
    this.output.info(`Initialized ${result.presentationId}`)
  }

  private async runInteractiveInit(): Promise<void> {
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
    const subtitle = await this.promptRequired(
      'Secondary label shown in listings and slide chrome.',
      'Subtitle',
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
      'Listing summary shown on the presentations page. Leave blank to use the default scaffold summary.',
      'Summary (optional)',
    )
    const force = await this.promptBoolean(
      'Overwrite the existing scaffold files if this presentation id already exists.',
      'Overwrite existing scaffold files',
      false,
    )

    await this.service.initPresentation({
      ...(projectRoot !== undefined ? { projectRoot } : {}),
      presentationId,
      title,
      subtitle,
      fromDate,
      ...(toDate !== undefined ? { toDate } : {}),
      ...(summary !== undefined ? { summary } : {}),
      ...(force !== undefined ? { force } : {}),
    })
    this.output.info(`Initialized ${presentationId}`)
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

  private async promptNumber(
    helpText: string,
    label: string,
    defaultValue?: number,
  ): Promise<number | undefined> {
    this.output.info(helpText)
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
    const result = await this.service.fetchPresentationData({
      ...(projectRoot !== undefined ? { projectRoot } : {}),
      fromDate: required['from-date'],
      ...(toDate !== undefined ? { toDate } : {}),
      presentationId,
      ...(noPreviousPeriod !== undefined ? { noPreviousPeriod } : {}),
      ...(write !== undefined ? { write } : {}),
    })
    this.output.info(`Fetched ${result.presentationId}`)
  }

  private async runBuild(projectRoot?: string): Promise<void> {
    const result = await this.service.buildSite({
      ...(projectRoot !== undefined ? { projectRoot } : {}),
      mode: 'production',
    })
    this.output.info(`Built site to ${result.outputPath}`)
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
    this.output.info(`Serving at ${result.url}`)
  }

  private async runValidate(args: string[]): Promise<void> {
    const parsed = this.parseCommandInput(args)
    const projectRoot = this.readProjectRoot(parsed)
    const strict = this.readBooleanOption(parsed.options, 'strict')
    const result = await this.service.validateContent({
      ...(projectRoot !== undefined ? { projectRoot } : {}),
      ...(strict !== undefined ? { strict } : {}),
    })
    this.output.info(result.valid ? 'Content is valid' : 'Content validation failed')
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
    switch (topic) {
      case 'init':
        return [
          `Usage: ${CLI_BIN_NAME} init [project-root] [--project-root <path>] --presentation-id <id> --title <title> --subtitle <subtitle> --from-date <YYYY-MM-DD> [--to-date <YYYY-MM-DD>] [--summary <summary>] [--force]`,
          '',
          'Create a new presentation scaffold with starter presentation and generated YAML files.',
          'Use this before fetch when you are starting a new presentation id.',
          '',
          'Options:',
          '  [project-root]          Optional. Positional presentation project root',
          '  --project-root <path>   Optional. Named presentation project root',
          '  --presentation-id <id>   Required. Unique presentation id used for content/presentations/<id>/',
          '  --title <title>          Required. Presentation title shown in listings and the app',
          '  --subtitle <subtitle>    Required. Secondary label shown in listings and slide chrome',
          '  --from-date <date>       Required. Period start date in YYYY-MM-DD format',
          '  --to-date <date>         Optional. Period end date in YYYY-MM-DD format',
          '  --summary <summary>      Optional. Listing summary text for the presentations page',
          '  --force                  Optional. Overwrite scaffold files if the presentation already exists',
          '',
          'Examples:',
          `  ${CLI_BIN_NAME} init`,
          `  ${CLI_BIN_NAME} init /path/to/project --presentation-id 2026-apr --title "Community Update" --subtitle "April 2026" --from-date 2026-04-01 --to-date 2026-04-30`,
        ].join('\n')
      case 'fetch':
        return [
          `Usage: ${CLI_BIN_NAME} fetch [project-root] [--project-root <path>] --presentation-id <id> --from-date <YYYY-MM-DD> [--to-date <YYYY-MM-DD>] [--no-previous-period] [--dry-run]`,
          '',
          'Pull GitHub-derived metrics and write generated data for an existing presentation.',
          'Use this after init, once the presentation scaffold exists.',
          '',
          'Options:',
          '  [project-root]          Optional. Positional presentation project root',
          '  --project-root <path>   Optional. Named presentation project root',
          '  --presentation-id <id>   Required. Target presentation id to update',
          '  --from-date <date>       Required. Period start date in YYYY-MM-DD format',
          '  --to-date <date>         Optional. Period end date in YYYY-MM-DD format. Defaults to today when omitted',
          '  --no-previous-period     Optional. Skip previous-period comparison and force previous values to 0',
          '  --dry-run                Optional. Compute data without writing generated.yaml',
          '',
          'Examples:',
          `  ${CLI_BIN_NAME} fetch /path/to/project --presentation-id 2026-q1 --from-date 2026-01-01 --to-date 2026-03-31`,
          `  ${CLI_BIN_NAME} fetch --presentation-id 2026-mar --from-date 2026-03-01 --dry-run`,
        ].join('\n')
      case 'build':
        return [
          `Usage: ${CLI_BIN_NAME} build [project-root] [--project-root <path>]`,
          '',
          'Build the packaged presentation app and write static output to dist/ in the target project.',
          '',
          'Options:',
          '  [project-root]          Optional. Positional presentation project root',
          '  --project-root <path>   Optional. Named presentation project root',
        ].join('\n')
      case 'serve':
        return [
          `Usage: ${CLI_BIN_NAME} serve [project-root] [--project-root <path>] [--host <host>] [--port <port>] [--open]`,
          '',
          'Build the static site, then serve dist/ locally so you can review it in a browser.',
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
      '  1. init      Create a new presentation scaffold',
      '  2. fetch     Populate generated data for the presentation',
      '  3. validate  Confirm the content is still valid',
      '  4. serve     Build and review locally',
      '  5. build     Produce the static site output',
      '',
      this.getCommandOverviewText(),
      '',
      'Command-specific help:',
      `  ${CLI_BIN_NAME} help <command>`,
      `  ${CLI_BIN_NAME} <command> --help`,
      '',
      'Commands:',
      '  init [project-root] [--project-root <path>] --presentation-id <id> --title <title> --subtitle <subtitle> --from-date <YYYY-MM-DD> [--to-date <YYYY-MM-DD>] [--summary <summary>] [--force]',
      '    Create a new presentation scaffold with starter presentation and generated YAML files. Run `init` with no flags for an interactive prompt.',
      '  fetch [project-root] [--project-root <path>] --presentation-id <id> --from-date <YYYY-MM-DD> [--to-date <YYYY-MM-DD>] [--no-previous-period] [--dry-run]',
      '    Pull GitHub-derived metrics and write generated data for an existing presentation.',
      '  validate [project-root] [--project-root <path>] [--strict]',
      '    Validate authored and generated content against the current app schema.',
      '  serve [project-root] [--project-root <path>] [--host <host>] [--port <port>] [--open]',
      '    Build the site and serve dist/ locally so you can review the presentation in a browser.',
      '  build [project-root] [--project-root <path>]',
      '    Build the packaged app runtime and write dist/ to the target project.',
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
}
