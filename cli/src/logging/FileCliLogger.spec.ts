import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { FileCliLogger } from './FileCliLogger'

describe('FileCliLogger', () => {
  it('writes sanitized log entries to disk only when a path is provided', () => {
    const directory = mkdtempSync(join(tmpdir(), 'slide-spec-cli-log-'))
    const logPath = join(directory, 'slide-spec.log')
    const logger = new FileCliLogger(logPath)

    logger.info('Created project scaffold')
    logger.githubRequest('GET', 'https://api.github.com/repos/owner/repo')
    logger.githubResponse('GET', 'https://api.github.com/repos/owner/repo', 200, 'OK')
    logger.error('Authorization: Bearer secret-token')
    logger.githubSummary('GITHUB_PAT=secret-token')

    const content = readFileSync(logPath, 'utf8')

    expect(content).toContain('Created project scaffold')
    expect(content).toContain('[github-request] GET https://api.github.com/repos/owner/repo')
    expect(content).toContain('[github-response] GET https://api.github.com/repos/owner/repo -> 200 OK')
    expect(content).toContain('Authorization: Bearer [REDACTED]')
    expect(content).toContain('GITHUB_PAT=[REDACTED]')
  })

  it('reuses an existing log file path without failing', () => {
    const directory = mkdtempSync(join(tmpdir(), 'slide-spec-cli-log-existing-'))
    const logPath = join(directory, 'slide-spec.log')
    writeFileSync(logPath, 'existing\n', 'utf8')

    const logger = new FileCliLogger(logPath)
    logger.info('next line')

    const content = readFileSync(logPath, 'utf8')
    expect(content).toContain('existing')
    expect(content).toContain('next line')
  })
})
