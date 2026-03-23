export interface CliInvocation {
  argv: string[]
  logPath?: string
}

export class CliInvocationParser {
  public parse(argv: string[]): CliInvocation {
    const remaining: string[] = []
    let logPath: string | undefined

    for (let index = 0; index < argv.length; index += 1) {
      const argument = argv[index]
      if (!argument) {
        continue
      }

      if (argument === '--log-path') {
        const value = argv[index + 1]

        if (!value || value.startsWith('--')) {
          throw new Error('Option "--log-path" must include a file path.')
        }

        if (logPath !== undefined) {
          throw new Error('Specify "--log-path" only once.')
        }

        logPath = value
        index += 1
        continue
      }

      if (argument.startsWith('--log-path=')) {
        const value = argument.slice('--log-path='.length)

        if (value.length === 0) {
          throw new Error('Option "--log-path" must include a file path.')
        }

        if (logPath !== undefined) {
          throw new Error('Specify "--log-path" only once.')
        }

        logPath = value
        continue
      }

      remaining.push(argument)
    }

    return {
      argv: remaining,
      ...(logPath !== undefined ? { logPath } : {}),
    }
  }
}
