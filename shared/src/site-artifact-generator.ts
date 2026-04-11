import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

import { SiteHtmlMetadataBuilder, type SiteHtmlMetadata } from './site-html-metadata'
import { buildSiteNotFoundPage } from './site-not-found-page'

export interface SiteArtifactGeneratorOptions {
  outputRoot: string
  siteUrl?: string | undefined
  sitemapEnabled?: boolean
  publishedPresentationIds: string[]
  llmsText?: string | undefined
  htmlMetadata?: SiteHtmlMetadata | undefined
}

export class SiteArtifactGenerator {
  public constructor(private readonly htmlMetadataBuilder: SiteHtmlMetadataBuilder = new SiteHtmlMetadataBuilder()) {}

  public async generate(options: SiteArtifactGeneratorOptions): Promise<void> {
    const siteUrl = this.resolveSiteUrl(options.siteUrl)
    const robotsTxt = this.buildRobots(siteUrl, options.sitemapEnabled === true)

    await this.writeOutput(resolve(options.outputRoot, 'robots.txt'), robotsTxt)
    if (options.llmsText) {
      await this.writeOutput(resolve(options.outputRoot, 'llms.txt'), options.llmsText)
    }
    if (siteUrl && options.sitemapEnabled === true) {
      const sitemapXml = this.buildSitemap(siteUrl, options.publishedPresentationIds)
      await this.writeOutput(resolve(options.outputRoot, 'sitemap.xml'), sitemapXml)
    }
    if (options.htmlMetadata) {
      await this.updateIndexHtml(options.outputRoot, options.htmlMetadata)
    }
    await this.writeOutput(resolve(options.outputRoot, '404.html'), buildSiteNotFoundPage())
    await this.writeRouteEntrypoints(options.outputRoot, options.publishedPresentationIds)
  }

  private buildSitemap(siteUrl: URL, publishedPresentationIds: string[]): string {
    const pageUrls = [
      this.toUrl(siteUrl, '/'),
      this.toUrl(siteUrl, '/presentations'),
      ...publishedPresentationIds.map((presentationId) => this.toUrl(siteUrl, `/presentations/${presentationId}`)),
    ]

    const urlEntries = pageUrls.map((url) => `  <url><loc>${this.escapeXml(url)}</loc></url>`).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`
  }

  private buildRobots(siteUrl: URL | undefined, includeSitemap: boolean): string {
    const sitemapLine = siteUrl && includeSitemap ? `Sitemap: ${this.toUrl(siteUrl, '/sitemap.xml')}\n` : ''
    return `User-agent: *\nAllow: /\n${sitemapLine}`
  }

  private resolveSiteUrl(siteUrl: string | undefined): URL | undefined {
    const candidate = siteUrl?.trim()
    if (!candidate) {
      return undefined
    }
    const normalizedCandidate = candidate.endsWith('/') ? candidate : `${candidate}/`

    return new URL(normalizedCandidate)
  }

  private toUrl(siteUrl: URL, path: string): string {
    return new URL(path.replace(/^\//, ''), siteUrl).toString()
  }

  private escapeXml(value: string): string {
    return value.replace(/[&<>"']/g, (character) => {
      switch (character) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      default:
        return '&apos;'
      }
    })
  }

  private async writeOutput(path: string, contents: string): Promise<void> {
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, contents, 'utf8')
  }

  private async updateIndexHtml(outputRoot: string, metadata: SiteHtmlMetadata): Promise<void> {
    const indexPath = resolve(outputRoot, 'index.html')
    const indexHtml = await readFile(indexPath, 'utf8')
    await this.writeOutput(indexPath, this.htmlMetadataBuilder.apply(indexHtml, metadata))
  }

  private async writeRouteEntrypoints(outputRoot: string, publishedPresentationIds: string[]): Promise<void> {
    const indexHtml = await readFile(resolve(outputRoot, 'index.html'), 'utf8')

    await this.writeOutput(resolve(outputRoot, 'presentations', 'index.html'), indexHtml)
    await Promise.all(
      publishedPresentationIds.map(async (presentationId) => {
        this.assertSafeRouteSegment(presentationId)
        await this.writeOutput(resolve(outputRoot, 'presentations', presentationId, 'index.html'), indexHtml)
      }),
    )
  }

  private assertSafeRouteSegment(segment: string): void {
    if (segment === '.' || segment === '..' || segment.includes('/') || segment.includes('\\')) {
      throw new Error(`Presentation id "${segment}" cannot be used as a static route segment.`)
    }
  }
}
