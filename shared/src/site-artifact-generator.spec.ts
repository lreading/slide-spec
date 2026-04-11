import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { SiteArtifactGenerator } from './site-artifact-generator'

const roots: string[] = []

const createOutputRoot = async (): Promise<string> => {
  const root = await mkdtemp(resolve(tmpdir(), 'slide-spec-shared-artifacts-'))
  const outputRoot = resolve(root, 'dist')
  roots.push(root)
  await mkdir(outputRoot, { recursive: true })
  await writeFile(resolve(outputRoot, 'index.html'), '<!doctype html><title>Slide Spec</title>', 'utf8')
  return outputRoot
}

describe('SiteArtifactGenerator', () => {
  afterEach(async () => {
    await Promise.all(roots.splice(0).map(async (root) => rm(root, { recursive: true, force: true })))
  })

  it('generates robots, llms, sitemap, and static route entrypoints', async () => {
    const outputRoot = await createOutputRoot()

    await new SiteArtifactGenerator().generate({
      outputRoot,
      siteUrl: 'https://updates.example.test',
      sitemapEnabled: true,
      publishedPresentationIds: ['public-one'],
      llmsText: '# Example\n',
    })

    await expect(readFile(resolve(outputRoot, 'robots.txt'), 'utf8')).resolves.toContain('Sitemap: https://updates.example.test/sitemap.xml')
    await expect(readFile(resolve(outputRoot, 'llms.txt'), 'utf8')).resolves.toBe('# Example\n')
    await expect(readFile(resolve(outputRoot, 'sitemap.xml'), 'utf8')).resolves.toContain('<loc>https://updates.example.test/presentations/public-one</loc>')
    await expect(readFile(resolve(outputRoot, 'presentations', 'index.html'), 'utf8')).resolves.toContain('Slide Spec')
    await expect(readFile(resolve(outputRoot, 'presentations', 'public-one', 'index.html'), 'utf8')).resolves.toContain('Slide Spec')
  })

  it('escapes XML-sensitive sitemap URLs', async () => {
    const generator = new SiteArtifactGenerator() as unknown as { escapeXml(value: string): string }

    expect(generator.escapeXml('a&b<c>d"e\'f')).toBe('a&amp;b&lt;c&gt;d&quot;e&apos;f')
  })

  it('preserves site URLs that already include a trailing slash', async () => {
    const outputRoot = await createOutputRoot()

    await new SiteArtifactGenerator().generate({
      outputRoot,
      siteUrl: 'https://updates.example.test/',
      sitemapEnabled: true,
      publishedPresentationIds: ['public-one'],
    })

    await expect(readFile(resolve(outputRoot, 'robots.txt'), 'utf8')).resolves.toContain('Sitemap: https://updates.example.test/sitemap.xml')
  })

  it('omits optional artifacts when sitemap and llms text are not configured', async () => {
    const outputRoot = await createOutputRoot()

    await new SiteArtifactGenerator().generate({
      outputRoot,
      siteUrl: ' ',
      sitemapEnabled: false,
      publishedPresentationIds: ['offline'],
    })

    await expect(readFile(resolve(outputRoot, 'robots.txt'), 'utf8')).resolves.toBe('User-agent: *\nAllow: /\n')
    await expect(readFile(resolve(outputRoot, 'sitemap.xml'), 'utf8')).rejects.toThrow()
    await expect(readFile(resolve(outputRoot, 'llms.txt'), 'utf8')).rejects.toThrow()
    await expect(readFile(resolve(outputRoot, 'presentations', 'offline', 'index.html'), 'utf8')).resolves.toContain('Slide Spec')
  })

  it('rejects route segments that cannot be written safely', async () => {
    const outputRoot = await createOutputRoot()

    await expect(new SiteArtifactGenerator().generate({
      outputRoot,
      siteUrl: 'https://updates.example.test',
      sitemapEnabled: true,
      publishedPresentationIds: ['../escape'],
    })).rejects.toThrow('Presentation id "../escape" cannot be used as a static route segment.')
  })
})
