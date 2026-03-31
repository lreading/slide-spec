import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { documentationPaths, documentationSections } from './documentation-manifest'

class DocumentationSiteFileGenerator {
  private readonly docsRoot = process.cwd()
  private readonly publicRoot = resolve(this.docsRoot, 'public')

  public async run(): Promise<void> {
    const siteUrl = this.resolveSiteUrl()
    await mkdir(this.publicRoot, { recursive: true })
    await writeFile(resolve(this.publicRoot, 'robots.txt'), this.buildRobots(siteUrl), 'utf8')
    await writeFile(resolve(this.publicRoot, 'sitemap.xml'), this.buildSitemap(siteUrl), 'utf8')
    await writeFile(resolve(this.publicRoot, 'llms.txt'), this.buildLlmsTxt(siteUrl), 'utf8')
  }

  private resolveSiteUrl(): URL {
    const siteUrl = (process.env.DOCS_SITE_URL ?? 'https://docs.slide-spec.dev').replace(/\/$/, '')
    return new URL(`${siteUrl}/`)
  }

  private buildRobots(siteUrl: URL): string {
    return `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', siteUrl).toString()}\n`
  }

  private buildSitemap(siteUrl: URL): string {
    const urlEntries = documentationPaths
      .map((route) => `  <url><loc>${this.escapeXml(new URL(route.replace(/^\//, ''), siteUrl).toString())}</loc></url>`)
      .join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`
  }

  private buildLlmsTxt(siteUrl: URL): string {
    const lines = [
      '# Slide Spec Docs',
      '',
      '> Canonical documentation for Slide Spec, a YAML-first static site and presentation system. Use these pages for the validated file formats, built-in slide templates, CLI workflow, and worked examples.',
      '',
      'Important notes:',
      '- Validation is strict. Prefer the schema reference over inference from examples.',
      '- Read the four project files in order: `site.yaml` -> `presentations/index.yaml` -> `presentation.yaml` -> `generated.yaml`.',
      '- `generated.yaml` may be hand-authored or connector-produced; GitHub is the only built-in fetch source today.',
      '- Template pages explain which values come from authored content versus generated data.',
      '',
    ]

    for (const section of documentationSections) {
      lines.push(`## ${section.title}`, '')

      for (const resource of section.resources) {
        lines.push(`- [${resource.title}](${new URL(resource.path.replace(/^\//, ''), siteUrl).toString()}): ${resource.description}`)
      }

      lines.push('')
    }

    return `${lines.join('\n').trim()}\n`
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
