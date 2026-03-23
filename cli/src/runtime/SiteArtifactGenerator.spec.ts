import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { SiteArtifactGenerator } from '../../../shared/src/site-artifact-generator'

class TestWorkspace {
  private readonly roots: string[] = []

  public async create(): Promise<string> {
    const root = await mkdtemp(resolve(tmpdir(), 'site-artifact-generator-'))
    this.roots.push(root)
    return root
  }

  public async cleanup(): Promise<void> {
    await Promise.all(this.roots.map(async (root) => rm(root, { recursive: true, force: true })))
  }
}

describe('SiteArtifactGenerator', () => {
  const workspace = new TestWorkspace()

  afterEach(async () => {
    await workspace.cleanup()
  })

  it('generates robots.txt and sitemap.xml from published presentations', async () => {
    const projectRoot = await workspace.create()
    const outputRoot = resolve(projectRoot, 'dist')
    await mkdir(outputRoot, { recursive: true })

    await new SiteArtifactGenerator().generate({
      outputRoot,
      siteUrl: 'https://updates.example.test',
      publishedPresentationIds: ['public-one'],
    })

    await expect(readFile(resolve(outputRoot, 'robots.txt'), 'utf8')).resolves.toContain(
      'Sitemap: https://updates.example.test/sitemap.xml',
    )
    await expect(readFile(resolve(outputRoot, 'sitemap.xml'), 'utf8')).resolves.toContain(
      '<loc>https://updates.example.test/presentations/public-one</loc>',
    )
    await expect(readFile(resolve(outputRoot, 'sitemap.xml'), 'utf8')).resolves.not.toContain('draft-two')
  })

  it('falls back to example.invalid when no site url is configured', async () => {
    const projectRoot = await workspace.create()
    const outputRoot = resolve(projectRoot, 'dist')
    await mkdir(outputRoot, { recursive: true })

    await new SiteArtifactGenerator().generate({
      outputRoot,
      siteUrl: '',
      publishedPresentationIds: [],
    })

    await expect(readFile(resolve(outputRoot, 'sitemap.xml'), 'utf8')).resolves.toContain(
      '<loc>https://example.invalid/</loc>',
    )
  })
})
