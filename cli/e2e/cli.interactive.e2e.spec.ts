import { spawn } from 'node:child_process'

import { afterEach, describe, expect, it } from 'vitest'

import { cliBin, createTempDirectory, projectPath, readText, removePath, runCli } from './cli-e2e-helpers'

const cleanupPaths: string[] = []

afterEach(async () => {
  await Promise.all(cleanupPaths.splice(0).map((path) => removePath(path)))
})

async function createProjectRoot(name: string): Promise<string> {
  const projectRoot = await createTempDirectory(name)
  cleanupPaths.push(projectRoot)
  return projectRoot
}

async function initProject(projectRoot: string, withSource = false): Promise<void> {
  const result = await runCli([
    'init',
    projectRoot,
    '--presentation-id',
    '2026-q1',
    '--title',
    'Interactive Matrix',
    '--from-date',
    '2026-01-01',
    ...(withSource ? ['--github-data-source-url', 'https://github.com/lreading/slide-spec'] : []),
    '--force',
  ])
  expect(result.status).toBe(0)
}

async function startInteractiveServe(projectRoot: string): Promise<{ output: string; stop(): Promise<void> }> {
  const child = spawn(process.execPath, [cliBin], { stdio: 'pipe' })
  let output = ''
  const sent = new Set<string>()

  return new Promise((resolvePromise, reject) => {
    const timeout = setTimeout(() => {
      child.kill('SIGTERM')
      reject(new Error(`Interactive serve timed out:\n${output}`))
    }, 45000)
    const answer = (key: string, pattern: string, value: string): void => {
      if (!sent.has(key) && output.includes(pattern)) {
        sent.add(key)
        child.stdin.write(`${value}\n`)
      }
    }
    const onData = (chunk: Buffer): void => {
      output += chunk.toString('utf8')
      answer('command', 'Command (init, fetch, build, serve, validate, help):', 'serve')
      answer('root', 'Project root (optional):', projectRoot)
      answer('host', 'Host (optional):', '')
      answer('port', 'Port [5173]:', '0')
      answer('open', 'Open in browser (y/N):', 'n')
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
    child.on('close', (status) => {
      if (!/Serving at http:\/\/127\.0\.0\.1:\d+\//.test(output)) {
        clearTimeout(timeout)
        reject(new Error(`Interactive serve exited with ${status}:\n${output}`))
      }
    })
  })
}

describe('built CLI root interactive e2e', () => {
  it('prints help when the user chooses help', async () => {
    const result = await runCli([], { inputLines: ['help'] })

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('No command provided. Starting interactive mode.')
    expect(result.stdout).toContain('Usage: slide-spec <command> [options]')
  })

  it('runs validate, build, fetch, and init from root interactive command selection', async () => {
    const validateRoot = await createProjectRoot('interactive-validate')
    const buildRoot = await createProjectRoot('interactive-build')
    const fetchRoot = await createProjectRoot('interactive-fetch')
    const initRoot = await createProjectRoot('interactive-init-root')
    await initProject(validateRoot)
    await initProject(buildRoot)
    await initProject(fetchRoot)
    await removePath(projectPath(fetchRoot, 'content', 'presentations', '2026-q1', 'generated.yaml'))

    const validate = await runCli([], { inputLines: ['validate', validateRoot, 'y'] })
    const build = await runCli([], { inputLines: ['build', buildRoot, ''] },)
    const fetch = await runCli([], {
      inputLines: ['fetch', fetchRoot, '2026-q1', '2026-01-01', '', 'n', 'n', 'n'],
    })
    const init = await runCli([], {
      inputLines: [
        'init',
        'n',
        initRoot,
        'interactive-created',
        'Interactive Created',
        '',
        '2026-02-01',
        '',
        '',
        'n',
        '',
        '',
        '',
        'n',
        'n',
      ],
    })

    expect(validate.status).toBe(0)
    expect(validate.stdout).toContain('Content is valid')
    expect(build.status).toBe(0)
    expect(build.stdout).toContain(projectPath(buildRoot, 'dist'))
    expect(fetch.status).toBe(1)
    expect(fetch.stderr).toContain('site.data_sources must include exactly one github source.')
    expect(init.status).toBe(0)
    await expect(readText(projectPath(initRoot, 'content', 'presentations', 'interactive-created', 'generated.yaml'))).resolves.toContain('generated:')
  })

  it('runs interactive init GitHub import retry and writes a redacted PAT file', async () => {
    const projectRoot = await createProjectRoot('interactive-init-github')
    const result = await runCli(['init'], {
      inputLines: [
        'init',
        'n',
        projectRoot,
        'github-import',
        'GitHub Import',
        '',
        '2026-03-01',
        '',
        '',
        'y',
        'https://github.com/lreading/definitely-not-a-real-slide-spec-repo',
        'https://github.com/lreading/slide-spec',
        'y',
        'fake-secret-token',
        '',
        '',
        '',
        'n',
        'n',
      ],
    })

    expect(result.status).toBe(0)
    expect(result.stdout + result.stderr).toContain('was not found. Double-check the URL and try again.')
    expect(result.stdout).toContain('Wrote GitHub PAT to .env.')
    expect(result.stdout).not.toContain('fake-secret-token')
    await expect(readText(projectPath(projectRoot, '.env'))).resolves.toContain('GITHUB_PAT=fake-secret-token')
    await expect(readText(projectPath(projectRoot, 'content', 'site.yaml'))).resolves.toContain('https://github.com/lreading/slide-spec')
  })

  it('runs serve from root interactive command selection', async () => {
    const projectRoot = await createProjectRoot('interactive-serve')
    await initProject(projectRoot)
    const serve = await startInteractiveServe(projectRoot)
    const url = serve.output.match(/Serving at (http:\/\/127\.0\.0\.1:\d+\/)/)?.[1]

    try {
      expect(url).toBeDefined()
      const response = await fetch(url as string)
      expect(response.status).toBe(200)
      await expect(response.text()).resolves.toContain('<div id="app"></div>')
    } finally {
      await serve.stop()
    }
  })
})
