import { createServer, type Server } from 'node:http'
import { writeFile } from 'node:fs/promises'

import { afterEach, describe, expect, it } from 'vitest'

import { createTempDirectory, projectPath, readText, removePath, runCli, startCliUntil } from './cli-e2e-helpers'

const cleanupPaths: string[] = []

afterEach(async () => {
  await Promise.all(cleanupPaths.splice(0).map((path) => removePath(path)))
})

async function createProjectRoot(name: string): Promise<string> {
  const projectRoot = await createTempDirectory(name)
  cleanupPaths.push(projectRoot)
  return projectRoot
}

async function initBlankProject(projectRoot: string): Promise<void> {
  const result = await runCli([
    'init',
    projectRoot,
    '--presentation-id',
    '2026-q1',
    '--title',
    'Quarterly Update',
    '--from-date',
    '2026-03-01',
    '--to-date',
    '2026-05-31',
    '--force',
  ])
  expect(result.status).toBe(0)
}

async function breakContentYaml(projectRoot: string): Promise<void> {
  const filePath = projectPath(projectRoot, 'content', 'presentations', 'index.yaml')
  await writeFile(filePath, 'schemaVersion: [\n', 'utf8')
}

function getServeUrl(output: string): string {
  const match = output.match(/Serving at (http:\/\/127\.0\.0\.1:\d+\/)$/m)
  if (!match) {
    throw new Error(`Missing serve URL in output:\n${output}`)
  }
  return match[1] as string
}

async function serveAndFetch(args: string[], cwd?: string): Promise<string> {
  const serve = await startCliUntil(
    args,
    /Serving at http:\/\/127\.0\.0\.1:\d+\//,
    cwd === undefined ? {} : { cwd },
  )
  try {
    const response = await fetch(getServeUrl(serve.stdout() + serve.stderr()))
    const html = await response.text()
    expect(response.status).toBe(200)
    expect(html).toContain('<div id="app"></div>')
    return serve.stdout() + serve.stderr()
  } finally {
    await serve.stop()
  }
}

describe('built CLI runtime e2e', () => {
  it('build supports cwd default, paths with spaces, positional and --project-root', async () => {
    const cwdProject = await createProjectRoot('build-cwd')
    const spacedProject = await createProjectRoot('build path with spaces')
    const projectRootFlagProject = await createProjectRoot('build-project-root-flag')
    await Promise.all([initBlankProject(cwdProject), initBlankProject(spacedProject), initBlankProject(projectRootFlagProject)])

    const cwdBuild = await runCli(['build'], { cwd: cwdProject, timeoutMs: 90000 })
    const spacedBuild = await runCli(['build', spacedProject], { timeoutMs: 90000 })
    const rootFlagBuild = await runCli(['build', '--project-root', projectRootFlagProject], { timeoutMs: 90000 })

    expect(cwdBuild.status).toBe(0)
    expect(spacedBuild.status).toBe(0)
    expect(rootFlagBuild.status).toBe(0)
    await expect(readText(projectPath(cwdProject, 'dist', 'index.html'))).resolves.toContain('Slide Spec')
    await expect(readText(projectPath(spacedProject, 'dist', 'index.html'))).resolves.toContain('Slide Spec')
    await expect(readText(projectPath(projectRootFlagProject, 'dist', 'index.html'))).resolves.toContain('Slide Spec')
  })

  it('build writes deployment URL into generated index metadata', async () => {
    const projectRoot = await createProjectRoot('build-deployment-url')
    await initBlankProject(projectRoot)

    const result = await runCli(
      ['build', projectRoot, '--deployment-url', 'https://updates.example.com/slides'],
      { timeoutMs: 90000 },
    )

    expect(result.status).toBe(0)
    await expect(readText(projectPath(projectRoot, 'dist', 'index.html'))).resolves.toContain(
      'https://updates.example.com/slides/',
    )
  })

  it('build fails for invalid content and does not emit usable dist', async () => {
    const projectRoot = await createProjectRoot('build-invalid-content')
    await initBlankProject(projectRoot)
    await breakContentYaml(projectRoot)

    const result = await runCli(['build', projectRoot], { timeoutMs: 90000 })

    expect(result.status).toBe(1)
    expect(result.stdout + result.stderr).toContain('schemaVersion')
  })

  it('serve responds over HTTP for explicit root and cwd default', async () => {
    const explicitProject = await createProjectRoot('serve-http-explicit')
    const cwdProject = await createProjectRoot('serve-http-cwd')
    await Promise.all([initBlankProject(explicitProject), initBlankProject(cwdProject)])

    await expect(serveAndFetch(['serve', explicitProject, '--port', '0'])).resolves.toContain('Serving at http://127.0.0.1:')
    await expect(serveAndFetch(['serve', '--port', '0'], cwdProject)).resolves.toContain('Serving at http://127.0.0.1:')
  })

  it('serve with explicit busy port exits 1 with busy-port error', async () => {
    const projectRoot = await createProjectRoot('serve-busy-port')
    await initBlankProject(projectRoot)

    const blocker: Server = await new Promise((resolve) => {
      const server = createServer((_request, response) => response.end('busy'))
      server.listen(0, '127.0.0.1', () => resolve(server))
    })

    try {
      const address = blocker.address()
      const port = typeof address === 'object' && address ? address.port : 0
      const result = await runCli(['serve', projectRoot, '--host', '127.0.0.1', '--port', String(port)])

      expect(result.status).toBe(1)
      expect(result.stdout + result.stderr).toMatch(/EADDRINUSE|already in use|address in use/i)
    } finally {
      await new Promise<void>((resolve) => blocker.close(() => resolve()))
    }
  })

  it('serve fails for invalid content', async () => {
    const projectRoot = await createProjectRoot('serve-invalid-content')
    await initBlankProject(projectRoot)
    await breakContentYaml(projectRoot)

    const result = await runCli(['serve', projectRoot, '--port', '0'])

    expect(result.status).toBe(1)
  })
})
