import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

export interface SiteArtifactGeneratorOptions {
  outputRoot: string
  siteUrl: string
  publishedPresentationIds: string[]
}

export class SiteArtifactGenerator {
  public async generate(options: SiteArtifactGeneratorOptions): Promise<void> {
    const siteUrl = this.resolveSiteUrl(options.siteUrl)
    const sitemapXml = this.buildSitemap(siteUrl, options.publishedPresentationIds)
    const robotsTxt = this.buildRobots(siteUrl)

    await this.writeOutput(resolve(options.outputRoot, 'sitemap.xml'), sitemapXml)
    await this.writeOutput(resolve(options.outputRoot, 'robots.txt'), robotsTxt)
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

  private buildRobots(siteUrl: URL): string {
    return `User-agent: *\nAllow: /\nSitemap: ${this.toUrl(siteUrl, '/sitemap.xml')}\n`
  }

  private resolveSiteUrl(siteUrl: string): URL {
    const candidate = siteUrl.trim() || 'https://example.invalid'
    const normalizedCandidate = candidate.endsWith('/') ? candidate : `${candidate}/`

    return new URL(normalizedCandidate)
  }

  private toUrl(siteUrl: URL, path: string): string {
    return new URL(path.replace(/^\//, ''), siteUrl).toString()
  }

  private escapeXml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;')
  }

  private async writeOutput(path: string, contents: string): Promise<void> {
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, contents, 'utf8')
  }
}
