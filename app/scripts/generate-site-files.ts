import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { parse } from 'yaml'

import {
  buildPresentationSiteLlmsText,
  type PresentationSiteDocument,
  type PresentationSiteIndexDocument,
} from '../../shared/src/presentation-site-llms'
import { SiteArtifactGenerator } from '../../shared/src/site-artifact-generator'
import { ContentValidator } from '../src/content/ContentValidator'

import type { SiteHtmlMetadata } from '../../shared/src/site-html-metadata'

class AppSiteFilesRunner {
  private readonly appRoot = process.cwd()
  private readonly projectRoot = resolve(this.appRoot, '..')
  private readonly outputRoot = resolve(this.appRoot, 'dist')
  private readonly validator = new ContentValidator()

  public async run(): Promise<void> {
    const siteDocument = await this.readYaml<PresentationSiteDocument>(resolve(this.projectRoot, 'content', 'site.yaml'))
    const indexDocument = await this.readYaml<PresentationSiteIndexDocument>(
      resolve(this.projectRoot, 'content', 'presentations', 'index.yaml'),
    )

    this.validator.validateSiteDocument(siteDocument)
    this.validator.validatePresentationIndexDocument(indexDocument)

    const siteUrl = process.env.SLIDE_SPEC_DEPLOYMENT_URL || siteDocument.site.deployment_url

    await new SiteArtifactGenerator().generate({
      outputRoot: this.outputRoot,
      siteUrl,
      sitemapEnabled: process.env.SLIDE_SPEC_SITEMAP_ENABLED === 'true' || siteDocument.site.sitemap_enabled === true,
      publishedPresentationIds: indexDocument.presentations
        .filter((entry) => entry.published)
        .map((entry) => entry.id),
      llmsText: buildPresentationSiteLlmsText(
        siteUrl,
        siteDocument,
        indexDocument,
      ),
      htmlMetadata: this.buildHtmlMetadata(siteUrl, siteDocument),
    })
  }

  private buildHtmlMetadata(siteUrl: string | undefined, siteDocument: PresentationSiteDocument): SiteHtmlMetadata {
    return {
      title: siteDocument.site.metadata?.title ?? siteDocument.site.title,
      description: siteDocument.site.metadata?.description ?? siteDocument.site.home_intro,
      siteUrl,
      imageUrl: siteDocument.site.metadata?.image_url,
      imageAlt: siteDocument.site.metadata?.image_alt,
    }
  }

  private async readYaml<T>(path: string): Promise<T> {
    return parse(await readFile(path, 'utf8')) as T
  }
}

const runner = new AppSiteFilesRunner()

runner.run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exitCode = 1
})
