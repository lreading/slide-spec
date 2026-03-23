import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { parse } from 'yaml'

import { SiteArtifactGenerator } from '../../shared/src/site-artifact-generator'
import { ContentValidator } from '../src/content/ContentValidator'

interface SiteDocument {
  site: {
    site_url?: string
  }
}

interface PresentationIndexDocument {
  presentations: Array<{
    id: string
    published: boolean
  }>
}

class AppSiteFilesRunner {
  private readonly appRoot = process.cwd()
  private readonly projectRoot = resolve(this.appRoot, '..')
  private readonly outputRoot = resolve(this.appRoot, 'dist')
  private readonly validator = new ContentValidator()

  public async run(): Promise<void> {
    const siteDocument = await this.readYaml<SiteDocument>(resolve(this.projectRoot, 'content', 'site.yaml'))
    const indexDocument = await this.readYaml<PresentationIndexDocument>(
      resolve(this.projectRoot, 'content', 'presentations', 'index.yaml'),
    )

    this.validator.validateSiteDocument(siteDocument)
    this.validator.validatePresentationIndexDocument(indexDocument)

    await new SiteArtifactGenerator().generate({
      outputRoot: this.outputRoot,
      siteUrl: process.env.SLIDE_SPEC_SITE_URL || siteDocument.site.site_url || 'https://example.invalid',
      publishedPresentationIds: indexDocument.presentations
        .filter((entry) => entry.published)
        .map((entry) => entry.id),
    })
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
