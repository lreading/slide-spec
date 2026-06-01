import { mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { CliPackagePaths } from './CliPackagePaths'

const tempRoots: string[] = []

describe('CliPackagePaths', () => {
  afterEach(async () => {
    await Promise.all(tempRoots.splice(0).map((path) => rm(path, { recursive: true, force: true })))
  })

  it('prefers the built runtime template and falls back to the source template', async () => {
    const root = resolve(tmpdir(), `oss-slides-paths-${Date.now()}`)
    tempRoots.push(root)
    await mkdir(resolve(root, 'dist', 'runtime-template'), { recursive: true })

    const paths = new CliPackagePaths(root)
    expect(paths.getPackageRoot()).toBe(root)
    expect(paths.getNodeModulesRoot()).toBe(resolve(root, 'node_modules'))
    expect(paths.getNodeModulesRoots()).toEqual([resolve(root, 'node_modules')])
    expect(paths.getWorkspaceBaseRoot()).toBe(resolve(root, '.runtime-workspaces'))
    expect(paths.getRuntimeTemplateRoot()).toBe(resolve(root, 'dist', 'runtime-template'))

    await rm(resolve(root, 'dist'), { recursive: true, force: true })
    await mkdir(resolve(root, 'runtime-template'), { recursive: true })
    expect(paths.getRuntimeTemplateRoot()).toBe(resolve(root, 'runtime-template'))
  })

  it('fails clearly when no embedded runtime template exists', () => {
    const root = resolve(tmpdir(), `oss-slides-paths-missing-${Date.now()}`)
    const paths = new CliPackagePaths(root)

    expect(() => paths.getRuntimeTemplateRoot()).toThrow(
      'Missing embedded runtime template. Rebuild the CLI package before using build or serve.',
    )
  })

  it('includes the package-manager node_modules root for scoped npx installs', () => {
    const root = resolve(tmpdir(), 'slide-spec-npx', 'node_modules', '@slide-spec', 'cli')
    const paths = new CliPackagePaths(root)

    expect(paths.getNodeModulesRoots()).toEqual([
      resolve(root, 'node_modules'),
      resolve(tmpdir(), 'slide-spec-npx', 'node_modules'),
    ])
  })

  it('prefers the built examples and falls back to the synced examples', async () => {
    const root = resolve(tmpdir(), `oss-slides-paths-examples-${Date.now()}`)
    tempRoots.push(root)
    await mkdir(resolve(root, 'dist', 'examples'), { recursive: true })

    const paths = new CliPackagePaths(root)
    expect(paths.getExamplesRoot()).toBe(resolve(root, 'dist', 'examples'))

    await rm(resolve(root, 'dist'), { recursive: true, force: true })
    await mkdir(resolve(root, 'examples-synced'), { recursive: true })
    expect(paths.getExamplesRoot()).toBe(resolve(root, 'examples-synced'))
  })

  it('fails clearly when no bundled examples exist', () => {
    const root = resolve(tmpdir(), `oss-slides-paths-examples-missing-${Date.now()}`)
    const paths = new CliPackagePaths(root)

    expect(() => paths.getExamplesRoot()).toThrow(
      'Missing bundled examples. Rebuild the CLI package before using --from-example.',
    )
  })
})
