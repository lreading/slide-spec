import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
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
    await writeFile(resolve(outputRoot, 'index.html'), '<!doctype html><title>Slide Spec</title>', 'utf8')

    await new SiteArtifactGenerator().generate({
      outputRoot,
      siteUrl: 'https://updates.example.test',
      sitemapEnabled: true,
      publishedPresentationIds: ['public-one'],
      llmsText: '# Example\n\n> Example summary.\n',
    })

    await expect(readFile(resolve(outputRoot, 'robots.txt'), 'utf8')).resolves.toContain(
      'Sitemap: https://updates.example.test/sitemap.xml',
    )
    await expect(readFile(resolve(outputRoot, 'llms.txt'), 'utf8')).resolves.toBe('# Example\n\n> Example summary.\n')
    await expect(readFile(resolve(outputRoot, '404.html'), 'utf8')).resolves.toContain('Slide not found.')
    await expect(readFile(resolve(outputRoot, 'sitemap.xml'), 'utf8')).resolves.toContain(
      '<loc>https://updates.example.test/presentations/public-one</loc>',
    )
    await expect(readFile(resolve(outputRoot, 'sitemap.xml'), 'utf8')).resolves.not.toContain('draft-two')
    await expect(readFile(resolve(outputRoot, 'presentations', 'index.html'), 'utf8')).resolves.toBe(
      '<!doctype html><title>Slide Spec</title>',
    )
    await expect(readFile(resolve(outputRoot, 'presentations', 'public-one', 'index.html'), 'utf8')).resolves.toBe(
      '<!doctype html><title>Slide Spec</title>',
    )
    await expect(readFile(resolve(outputRoot, 'presentations', 'draft-two', 'index.html'), 'utf8')).rejects.toThrow()
  })

  it('omits the sitemap when no deployment url is configured', async () => {
    const projectRoot = await workspace.create()
    const outputRoot = resolve(projectRoot, 'dist')
    await mkdir(outputRoot, { recursive: true })
    await writeFile(resolve(outputRoot, 'index.html'), '<!doctype html><title>Slide Spec</title>', 'utf8')

    await new SiteArtifactGenerator().generate({
      outputRoot,
      siteUrl: undefined,
      sitemapEnabled: false,
      publishedPresentationIds: ['offline-deck'],
    })

    await expect(readFile(resolve(outputRoot, 'robots.txt'), 'utf8')).resolves.toBe('User-agent: *\nAllow: /\n')
    await expect(readFile(resolve(outputRoot, '404.html'), 'utf8')).resolves.toContain('Slide not found.')
    await expect(readFile(resolve(outputRoot, 'llms.txt'), 'utf8')).rejects.toThrow()
    await expect(readFile(resolve(outputRoot, 'sitemap.xml'), 'utf8')).rejects.toThrow()
    await expect(readFile(resolve(outputRoot, 'presentations', 'index.html'), 'utf8')).resolves.toBe(
      '<!doctype html><title>Slide Spec</title>',
    )
    await expect(readFile(resolve(outputRoot, 'presentations', 'offline-deck', 'index.html'), 'utf8')).resolves.toBe(
      '<!doctype html><title>Slide Spec</title>',
    )
  })

  it('rejects presentation ids that cannot be written as static route segments', async () => {
    const projectRoot = await workspace.create()
    const outputRoot = resolve(projectRoot, 'dist')
    await mkdir(outputRoot, { recursive: true })
    await writeFile(resolve(outputRoot, 'index.html'), '<!doctype html><title>Slide Spec</title>', 'utf8')

    await expect(new SiteArtifactGenerator().generate({
      outputRoot,
      siteUrl: 'https://updates.example.test',
      sitemapEnabled: true,
      publishedPresentationIds: ['../escape'],
    })).rejects.toThrow('Presentation id "../escape" cannot be used as a static route segment.')
  })
})
