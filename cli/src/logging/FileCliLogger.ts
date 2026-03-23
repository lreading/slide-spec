import { appendFileSync, chmodSync, existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

import { LogSanitizer } from './LogSanitizer'

import type { CliLogger } from './CliLogger.types'

export class FileCliLogger implements CliLogger {
  private readonly sanitizer: LogSanitizer

  public constructor(
    private readonly logPath: string,
    sanitizer: LogSanitizer = new LogSanitizer(),
  ) {
    this.sanitizer = sanitizer
    mkdirSync(dirname(this.logPath), { recursive: true })
    try {
      if (existsSync(this.logPath)) {
        chmodSync(this.logPath, 0o600)
      }
      /* c8 ignore next 3 */
    } catch {
      // Best effort only. On some platforms, chmod is unavailable or ignored.
    }
  }

  public info(message: string): void {
    this.write('info', message)
  }

  public error(message: string): void {
    this.write('error', message)
  }

  public githubRequest(method: string, url: string): void {
    this.write('github-request', `${method} ${url}`)
  }

  public githubResponse(method: string, url: string, status: number, statusText: string): void {
    this.write('github-response', `${method} ${url} -> ${status} ${statusText}`)
  }

  public githubSummary(message: string): void {
    this.write('github-summary', message)
  }

  private write(level: string, message: string): void {
    const timestamp = new Date().toISOString()
    const sanitized = this.sanitizer.sanitize(message)
    appendFileSync(this.logPath, `[${timestamp}] [${level}] ${sanitized}\n`, {
      encoding: 'utf8',
      mode: 0o600,
    })
  }
}
