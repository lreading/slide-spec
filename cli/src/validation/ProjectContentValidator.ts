import { readFile } from 'node:fs/promises'

import { parse } from 'yaml'

import { ContentValidator } from '../../../shared/src/content-validator'
import type { GeneratedPresentationData, PresentationIndexEntry } from '../../../shared/src/content'

import type { FileSystemPaths } from '../io/FileSystemPaths'

export class ProjectContentValidator {
  private readonly validator: ContentValidator = new ContentValidator()

  public async validate(paths: FileSystemPaths): Promise<void> {
    const siteDocument: { site: Record<string, unknown> } = await this.readYaml(paths.getSiteConfigPath()) as {
      site: Record<string, unknown>
    }
    this.validator.validateSiteDocument(siteDocument)

    const indexDocument: { presentations: PresentationIndexEntry[] } =
      await this.readYaml(paths.getPresentationsIndexPath()) as { presentations: PresentationIndexEntry[] }
    this.validator.validatePresentationIndexDocument(indexDocument)

    for (const entry of indexDocument.presentations) {
      const presentationDocument: { presentation: Record<string, unknown> } =
        await this.readYaml(paths.resolvePresentationPath(entry)) as { presentation: Record<string, unknown> }
      const generatedDocument: { generated: GeneratedPresentationData } =
        await this.readYaml(paths.resolveGeneratedPath(entry)) as { generated: GeneratedPresentationData }

      this.validator.validatePresentationDocument(presentationDocument)
      this.validator.validateGeneratedDocument(generatedDocument)
      this.validator.validatePresentationRecordConsistency(
        entry,
        presentationDocument.presentation,
        generatedDocument.generated,
      )
    }
  }

  private async readYaml(path: string): Promise<unknown> {
    return parse(await readFile(path, 'utf8'))
  }
}
