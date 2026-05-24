import { spawn } from 'node:child_process'

import { afterEach, describe, expect, it } from 'vitest'

import { cliBin, createTempDirectory, projectPath, readText, removePath } from './cli-e2e-helpers'

const cleanupPaths: string[] = []

afterEach(async () => {
  await Promise.all(cleanupPaths.splice(0).map((path) => removePath(path)))
})

async function createProjectRoot(name: string): Promise<string> {
  const projectRoot = await createTempDirectory(name)
  cleanupPaths.push(projectRoot)
  return projectRoot
}

async function runInteractiveInitAndServe(projectRoot: string): Promise<{ output: string; stop(): Promise<void> }> {
  const child = spawn(process.execPath, [cliBin, 'init'], { stdio: 'pipe' })
  const answers = new Map<string, string>([
    ['Start from an example (y/N):', 'n'],
    ['Project root (optional):', projectRoot],
    ['Presentation id:', 'post-init-serve'],
    ['Title:', 'Post Init Serve'],
    ['Subtitle (optional):', ''],
    ['From date (YYYY-MM-DD):', '2026-04-01'],
    ['To date (YYYY-MM-DD, optional):', ''],
    ['Summary (optional):', ''],
    ['Import GitHub statistics (y/N):', 'n'],
    ['Repository URL (optional):', ''],
    ['Docs URL (optional):', ''],
    ['Website URL (optional):', ''],
    ['Overwrite existing scaffold files (y/N):', 'n'],
    ['Start local server (Y/n):', 'y'],
  ])
  const sent = new Set<string>()
  let output = ''

  return new Promise((resolvePromise, reject) => {
    const timeout = setTimeout(() => {
      child.kill('SIGTERM')
      reject(new Error(`Interactive init serve timed out:\n${output}`))
    }, 45000)
    const onData = (chunk: Buffer): void => {
      output += chunk.toString('utf8')
      for (const [prompt, answer] of answers) {
        if (!sent.has(prompt) && output.includes(prompt)) {
          sent.add(prompt)
          child.stdin.write(`${answer}\n`)
        }
      }
      if (/Serving at http:\/\/127\.0\.0\.1:\d+\//.test(output)) {
        clearTimeout(timeout)
        resolvePromise({
          output,
          stop: async () => {
            child.kill('SIGTERM')
            await new Promise<void>((resolve) => child.once('close', () => resolve()))
          },
        })
      }
    }

    child.stdout.on('data', onData)
    child.stderr.on('data', onData)
    child.on('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })
  })
}

describe('built CLI interactive init server e2e', () => {
  it('starts the local server after interactive init when requested', async () => {
    const projectRoot = await createProjectRoot('interactive-init-serve')
    const serve = await runInteractiveInitAndServe(projectRoot)
    const url = serve.output.match(/Serving at (http:\/\/127\.0\.0\.1:\d+\/)/)?.[1]

    try {
      expect(url).toBeDefined()
      expect(await readText(projectPath(projectRoot, 'content', 'presentations', 'post-init-serve', 'generated.yaml'))).toContain('generated:')
      const response = await fetch(url as string)
      expect(response.status).toBe(200)
    } finally {
      await serve.stop()
    }
  })
})
