import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { FileSystemPaths } from '../io/FileSystemPaths'
import { ViteSiteBuilder } from './ViteSiteBuilder'

const tempRoots: string[] = []

class StubRuntimeWorkspace {
  public readonly preparedRoots: string[] = []

  public constructor(private readonly workspaceRoot: string) {}

  public async prepare(): Promise<{ appRoot: string; cleanup(): Promise<void> }> {
    this.preparedRoots.push(this.workspaceRoot)
    await mkdir(resolve(this.workspaceRoot, 'app', 'dist'), { recursive: true })
    await writeFile(resolve(this.workspaceRoot, 'app', 'dist', 'index.html'), '<html>built</html>')

    return {
      appRoot: resolve(this.workspaceRoot, 'app'),
      cleanup: async () => {
        await rm(this.workspaceRoot, { recursive: true, force: true })
      },
    }
  }
}

describe('ViteSiteBuilder', () => {
  afterEach(async () => {
    await Promise.all(tempRoots.splice(0).map((path) => rm(path, { recursive: true, force: true })))
  })

  it('builds in a runtime workspace and copies dist to the target project', async () => {
    const projectRoot = await mkdtemp(resolve(tmpdir(), 'oss-slides-builder-project-'))
    const workspaceRoot = await mkdtemp(resolve(tmpdir(), 'oss-slides-builder-workspace-'))
    tempRoots.push(projectRoot, workspaceRoot)
    const viteCalls: Array<{ root: string; postcssConfigured: boolean }> = []
    await mkdir(resolve(projectRoot, 'content', 'presentations'), { recursive: true })
    await writeFile(
      resolve(projectRoot, 'content', 'site.yaml'),
      `site:
  title: Demo
  deployment_url: https://updates.example.com
  sitemap_enabled: true
  home_intro: Intro
  home_cta_label: Open
  presentations_cta_label: Presentations
  links:
    repository:
      label: Repo
      url: https://example.com/repo
    docs:
      label: Docs
      url: https://example.com/docs
    community:
      label: Project
      url: https://example.com/project
`,
    )
    await writeFile(
      resolve(projectRoot, 'content', 'presentations', 'index.yaml'),
      `presentations:
  - id: 2026-q1
    presentation_path: presentations/2026-q1/presentation.yaml
    title: Demo
    subtitle: Example
    summary: Example
    published: true
    featured: true
`,
    )

    const builder = new ViteSiteBuilder(
      new StubRuntimeWorkspace(workspaceRoot) as never,
      async (config) => {
        viteCalls.push({
          root: String(config.root),
          postcssConfigured: Boolean(typeof config.css === 'object' && config.css !== null && config.css.postcss),
        })
      },
    )

    const outputPath = await builder.build(new FileSystemPaths(projectRoot))

    expect(outputPath).toBe(resolve(projectRoot, 'dist'))
    expect(viteCalls).toEqual([{
      root: resolve(workspaceRoot, 'app'),
      postcssConfigured: true,
    }])
    await expect(readFile(resolve(projectRoot, 'dist', 'index.html'), 'utf8')).resolves.toContain('built')
    await expect(readFile(resolve(projectRoot, 'dist', 'robots.txt'), 'utf8')).resolves.toContain(
      'Sitemap: https://updates.example.com/sitemap.xml',
    )
    await expect(readFile(resolve(projectRoot, 'dist', 'sitemap.xml'), 'utf8')).resolves.toContain(
      '/presentations/2026-q1',
    )
  })
})
