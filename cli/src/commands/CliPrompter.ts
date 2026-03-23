import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

export type CliCommandName = 'init' | 'fetch' | 'build' | 'serve' | 'validate' | 'help'

export interface CliPrompter {
  promptCommand(): Promise<CliCommandName>
  promptRequired(label: string): Promise<string>
  promptSecret(label: string): Promise<string>
  promptOptional(label: string): Promise<string | undefined>
  promptBoolean(label: string, defaultValue?: boolean): Promise<boolean | undefined>
  promptNumber(label: string, defaultValue?: number): Promise<number | undefined>
}

/* c8 ignore start */
async function defaultAskQuestion(question: string): Promise<string> {
  const readline = createInterface({ input, output })

  try {
    return await readline.question(question)
  } finally {
    readline.close()
  }
}

async function promptSecretFromTerminal(
  question: string,
  fallbackQuestion: (question: string) => Promise<string>,
): Promise<string> {
  if (!input.isTTY || !output.isTTY) {
    return fallbackQuestion(question)
  }

  const previousRawMode = input.isRaw
  const buffer: string[] = []

  return new Promise<string>((resolve, reject) => {
    let settled = false

    const cleanup = (): void => {
      input.off('data', onData)

      if (input.isTTY && input.setRawMode) {
        input.setRawMode(previousRawMode)
      }

      input.pause()
    }

    const finish = (value: string): void => {
      if (settled) {
        return
      }

      settled = true
      cleanup()
      output.write('\n')
      resolve(value)
    }

    const fail = (error: Error): void => {
      if (settled) {
        return
      }

      settled = true
      cleanup()
      reject(error)
    }

    const onData = (chunk: Buffer | string): void => {
      const characters = chunk.toString('utf8').split('')

      for (const character of characters) {
        if (character === '\r' || character === '\n') {
          finish(buffer.join(''))
          return
        }

        if (character === '\u0003') {
          fail(new Error('Prompt cancelled.'))
          return
        }

        if (character === '\u0008' || character === '\u007f') {
          if (buffer.length > 0) {
            buffer.pop()
            output.write('\b \b')
          }

          continue
        }

        buffer.push(character)
        output.write('*')
      }
    }

    if (input.setRawMode) {
      input.setRawMode(true)
    }

    output.write(question)
    input.resume()
    input.on('data', onData)
  })
}
/* c8 ignore stop */

export class ReadlineCliPrompter implements CliPrompter {
  public constructor(
    private readonly askQuestion: (question: string) => Promise<string> = defaultAskQuestion,
    askSecret?: (question: string) => Promise<string>,
  ) {
    this.askSecret = askSecret ?? ((question: string) => promptSecretFromTerminal(question, this.askQuestion))
  }

  private readonly askSecret: (question: string) => Promise<string>

  public async promptCommand(): Promise<CliCommandName> {
    while (true) {
      const value = await this.ask(
        'Command (init, fetch, build, serve, validate, help): ',
      )
      const normalized = value.trim().toLowerCase()

      if (this.isCommandName(normalized)) {
        return normalized
      }
    }
  }

  public async promptRequired(label: string): Promise<string> {
    while (true) {
      const value = (await this.ask(`${label}: `)).trim()

      if (value.length > 0) {
        return value
      }
    }
  }

  public async promptOptional(label: string): Promise<string | undefined> {
    const value = (await this.ask(`${label}: `)).trim()
    return value.length > 0 ? value : undefined
  }

  public async promptSecret(label: string): Promise<string> {
    while (true) {
      const value = (await this.askSecret(`${label}: `)).trim()

      if (value.length > 0) {
        return value
      }
    }
  }

  public async promptBoolean(label: string, defaultValue?: boolean): Promise<boolean | undefined> {
    const suffix = defaultValue === undefined ? 'y/n' : defaultValue ? 'Y/n' : 'y/N'

    while (true) {
      const value = (await this.ask(`${label} (${suffix}): `)).trim().toLowerCase()

      if (value.length === 0) {
        return defaultValue
      }

      if (value === 'y' || value === 'yes') {
        return true
      }

      if (value === 'n' || value === 'no') {
        return false
      }
    }
  }

  public async promptNumber(label: string, defaultValue?: number): Promise<number | undefined> {
    while (true) {
      const suffix = defaultValue === undefined ? '' : ` [${defaultValue}]`
      const value = (await this.ask(`${label}${suffix}: `)).trim()

      if (value.length === 0) {
        return defaultValue
      }

      const parsed = Number(value)

      if (Number.isFinite(parsed)) {
        return parsed
      }
    }
  }

  private async ask(question: string): Promise<string> {
    return this.askQuestion(question)
  }

  private isCommandName(value: string): value is CliCommandName {
    return ['init', 'fetch', 'build', 'serve', 'validate', 'help'].includes(value)
  }
}
