import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

export interface SiteArtifactGeneratorOptions {
  outputRoot: string
  siteUrl?: string | undefined
  sitemapEnabled?: boolean
  publishedPresentationIds: string[]
  llmsText?: string | undefined
}

export class SiteArtifactGenerator {
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
}
