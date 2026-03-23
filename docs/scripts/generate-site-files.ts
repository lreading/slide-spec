import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const documentationRoutes = [
  '/',
  '/quickstart',
  '/schema/',
  '/schema/site',
  '/schema/presentations-index',
  '/schema/presentation',
  '/schema/generated',
  '/templates/',
  '/templates/hero',
  '/templates/agenda',
  '/templates/section-list-grid',
  '/templates/timeline',
  '/templates/progress-timeline',
  '/templates/people',
  '/templates/metrics-and-links',
  '/templates/action-cards',
  '/templates/closing',
  '/cli/',
  '/cli/init',
  '/cli/fetch',
  '/cli/build',
  '/cli/serve',
  '/cli/validate',
  '/connectors/github',
  '/examples/',
  '/examples/tutorial-example',
  '/examples/manual-data-example',
  '/meta/',
  '/meta/accessibility',
  '/meta/ai',
  '/meta/agent-assistance',
  '/meta/supply-chain',
]

class DocumentationSiteFileGenerator {
  private readonly docsRoot = process.cwd()
  private readonly publicRoot = resolve(this.docsRoot, 'public')

  public async run(): Promise<void> {
    const siteUrl = this.resolveSiteUrl()
    await mkdir(this.publicRoot, { recursive: true })
    await writeFile(resolve(this.publicRoot, 'robots.txt'), this.buildRobots(siteUrl), 'utf8')
    await writeFile(resolve(this.publicRoot, 'sitemap.xml'), this.buildSitemap(siteUrl), 'utf8')
  }

  private resolveSiteUrl(): URL {
    const siteUrl = (process.env.DOCS_SITE_URL ?? 'https://slide-spec.dev').replace(/\/$/, '')
    return new URL(`${siteUrl}/`)
  }

  private buildRobots(siteUrl: URL): string {
    return `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', siteUrl).toString()}\n`
  }

  private buildSitemap(siteUrl: URL): string {
    const urlEntries = documentationRoutes
      .map((route) => `  <url><loc>${this.escapeXml(new URL(route.replace(/^\//, ''), siteUrl).toString())}</loc></url>`)
      .join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`
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
}

const generator = new DocumentationSiteFileGenerator()

generator.run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exitCode = 1
})
