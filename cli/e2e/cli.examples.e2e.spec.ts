import { afterEach, describe, expect, it } from 'vitest'

import { createTempDirectory, projectPath, readText, removePath, runCli } from './cli-e2e-helpers'

const cleanupPaths: string[] = []
const examples = ['open-source-update', 'product-review', 'security-posture', 'community-update'] as const

afterEach(async () => {
  await Promise.all(cleanupPaths.splice(0).map((path) => removePath(path)))
})

async function createProjectRoot(name: string): Promise<string> {
  const projectRoot = await createTempDirectory(name)
  cleanupPaths.push(projectRoot)
  return projectRoot
}

describe('built CLI bundled example e2e', () => {
  it.each(examples)('initializes, validates, and builds %s', async (exampleId) => {
    const projectRoot = await createProjectRoot(`example-${exampleId}`)
    const init = await runCli(['init', projectRoot, '--from-example', exampleId])
    const validate = await runCli(['validate', projectRoot])
    const build = await runCli(['build', projectRoot], { timeoutMs: 90000 })

    expect(init.status).toBe(0)
    expect(init.stdout).toContain(`Initialized from example "${exampleId}".`)
    expect(validate.status).toBe(0)
    expect(validate.stdout).toContain('Content is valid')
    expect(build.status).toBe(0)
    await expect(readText(projectPath(projectRoot, 'dist', 'index.html'))).resolves.toContain('<div id="app"></div>')
  })
})
