import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs'
import type * as NodeFs from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { vi, describe, expect, it } from 'vitest'

vi.mock('node:fs', async () => {
  const actual = await vi.importActual<typeof NodeFs>('node:fs')
  return {
    ...actual,
    chmodSync: vi.fn(() => {
      throw new Error('chmod failed')
    }),
  }
})

import { FileCliLogger } from './FileCliLogger'

describe('FileCliLogger chmod fallback', () => {
  it('continues when chmod fails in best-effort mode', () => {
    const directory = mkdtempSync(join(tmpdir(), 'slide-spec-cli-log-chmod-'))
    const logPath = join(directory, 'slide-spec.log')
    writeFileSync(logPath, 'existing\n', 'utf8')

    const logger = new FileCliLogger(logPath)
    logger.info('next line')

    const content = readFileSync(logPath, 'utf8')
    expect(content).toContain('existing')
    expect(content).toContain('next line')
  })
})
