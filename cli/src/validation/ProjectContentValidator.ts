import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

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
        await this.readYaml(paths.getPresentationPath(entry.id)) as { presentation: Record<string, unknown> }
      const generatedDocument: { generated: GeneratedPresentationData } =
        await this.readYaml(paths.getGeneratedPath(entry.id)) as { generated: GeneratedPresentationData }

      this.validator.validatePresentationDocument(presentationDocument)
      this.validator.validateGeneratedDocument(generatedDocument)
      this.validator.validatePresentationRecordConsistency(
        entry,
        presentationDocument.presentation,
        generatedDocument.generated,
      )
    }

    const directories = await this.listPresentationDirectories(paths)
    const indexedIds = new Set(indexDocument.presentations.map((entry) => entry.id))
    directories.forEach((directory) => {
      if (!indexedIds.has(directory)) {
        throw new Error(`Presentation directory "${directory}" is missing from content/presentations/index.yaml.`)
      }
    })
  }

  private async listPresentationDirectories(paths: FileSystemPaths): Promise<string[]> {
    const entries = await readdir(resolve(paths.getContentRoot(), 'presentations'), {
      withFileTypes: true,
    })

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right))
  }

  private async readYaml(path: string): Promise<unknown> {
    return parse(await readFile(path, 'utf8'))
  }
}
