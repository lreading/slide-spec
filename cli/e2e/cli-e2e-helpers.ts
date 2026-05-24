import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { delimiter, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parse } from 'yaml'

const helperDirectory = dirname(fileURLToPath(import.meta.url))

export const cliRoot = resolve(helperDirectory, '..')
export const repoRoot = resolve(cliRoot, '..')
export const cliBin = resolve(cliRoot, 'dist', 'index.js')

export interface CliResult {
  readonly status: number | null
  readonly stdout: string
  readonly stderr: string
}

interface RunCliOptions {
  readonly cwd?: string
  readonly env?: Record<string, string | undefined>
  readonly input?: string
  readonly inputLines?: readonly string[]
  readonly timeoutMs?: number
}

interface StartedCli {
  readonly child: ChildProcessWithoutNullStreams
  stdout(): string
  stderr(): string
  stop(): Promise<void>
}

export async function createTempDirectory(name: string): Promise<string> {
  return mkdtemp(join(tmpdir(), `slide-spec-${name}-`))
}

export async function runCli(args: readonly string[], options: RunCliOptions = {}): Promise<CliResult> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, [cliBin, ...args], {
      cwd: options.cwd ?? cliRoot,
      env: {
        ...process.env,
        ...options.env,
      },
      stdio: 'pipe',
    })
    let stdout = ''
    let stderr = ''
    const timeout = setTimeout(() => {
      child.kill('SIGTERM')
      reject(new Error(`CLI timed out: ${args.join(' ')}`))
    }, options.timeoutMs ?? 30000)

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8')
    })
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8')
    })
    child.on('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })
    child.on('close', (status) => {
      clearTimeout(timeout)
      resolvePromise({ status, stdout, stderr })
    })
    if (options.inputLines) {
      let lineIndex = 0
      let inputPending = false
      const writeNextLine = (): void => {
        if (inputPending) {
          return
        }

        const line = options.inputLines?.[lineIndex]

        if (line === undefined) {
          child.stdin.end()
          return
        }

        inputPending = true
        setTimeout(() => {
          child.stdin.write(`${line}\n`)
          lineIndex += 1
          inputPending = false
        }, 10)
      }

      child.stdout.on('data', writeNextLine)
      child.stderr.on('data', writeNextLine)
    } else {
      child.stdin.end(options.input ?? '')
    }
  })
}

export async function startCliUntil(
  args: readonly string[],
  pattern: RegExp,
  options: RunCliOptions = {},
): Promise<StartedCli> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, [cliBin, ...args], {
      cwd: options.cwd ?? cliRoot,
      env: {
        ...process.env,
        ...options.env,
      },
      stdio: 'pipe',
    })
    let stdout = ''
    let stderr = ''
    let settled = false
    const timeout = setTimeout(() => {
      child.kill('SIGTERM')
      reject(new Error(`CLI did not reach expected output: ${args.join(' ')}`))
    }, options.timeoutMs ?? 45000)
    const finish = (): void => {
      if (!settled && pattern.test(stdout + stderr)) {
        settled = true
        clearTimeout(timeout)
        resolvePromise({
          child,
          stdout: () => stdout,
          stderr: () => stderr,
          stop: () => stopProcess(child),
        })
      }
    }

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8')
      finish()
    })
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8')
      finish()
    })
    child.on('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })
    child.on('close', (status) => {
      clearTimeout(timeout)
      if (!settled) {
        reject(new Error(`CLI exited with ${status}: ${stdout}${stderr}`))
      }
    })
    child.stdin.end(options.input ?? '')
  })
}

export async function readYamlFile<T>(path: string): Promise<T> {
  return parse(await readFile(path, 'utf8')) as T
}

export async function readText(path: string): Promise<string> {
  return readFile(path, 'utf8')
}

export async function removePath(path: string): Promise<void> {
  await rm(path, { recursive: true, force: true })
}

export function projectPath(projectRoot: string, ...segments: string[]): string {
  return resolve(projectRoot, ...segments)
}

export async function createFakeBrowserCommand(): Promise<Record<string, string>> {
  const binRoot = await createTempDirectory('fake-browser-bin')
  const command = process.platform === 'darwin' ? 'open' : 'xdg-open'
  const commandPath = join(binRoot, command)

  await mkdir(binRoot, { recursive: true })
  await writeFile(commandPath, '#!/usr/bin/env sh\nexit 0\n', { mode: 0o755 })

  return {
    PATH: `${binRoot}${delimiter}${process.env.PATH ?? ''}`,
  }
}

async function stopProcess(child: ChildProcessWithoutNullStreams): Promise<void> {
  if (child.exitCode !== null) {
    return
  }

  await new Promise<void>((resolvePromise) => {
    child.once('close', () => resolvePromise())
    child.kill('SIGTERM')
  })
}
