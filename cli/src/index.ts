#!/usr/bin/env node

import { CliInvocationParser } from './commands/CliInvocationParser'
import { CliCommandRunner } from './commands/CliCommandRunner'
import { TdCliApplicationService } from './application/TdCliApplicationService'
import { FileCliLogger } from './logging/FileCliLogger'
import { LogSanitizer } from './logging/LogSanitizer'

const sanitizer = new LogSanitizer()

try {
  const invocation = new CliInvocationParser().parse(process.argv.slice(2))
  const logger = invocation.logPath ? new FileCliLogger(invocation.logPath) : undefined
  const service = new TdCliApplicationService({
    ...(logger !== undefined ? { logger } : {}),
  })
  const runner = new CliCommandRunner(service, console, undefined, logger)

  runner.run(invocation.argv).then((exitCode) => {
    process.exitCode = exitCode
  }).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error(sanitizer.sanitize(message))
    process.exitCode = 1
  })
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(sanitizer.sanitize(message))
  process.exitCode = 1
}
