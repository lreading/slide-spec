import { parse } from 'yaml'

import { ContentValidator } from './ContentValidator'

import type {
  PresentationIndexEntry,
  PresentationRecord,
  SiteContent,
} from '../types/content'

export const selectContentFiles = (
  source: string | undefined,
  liveFiles: Record<string, unknown>,
  fixtureFiles: Record<string, unknown>,
  demoFiles: Record<string, unknown>,
  docsReferenceFiles: Record<string, unknown>,
  cliDemoFiles: Record<string, unknown>,
): Record<string, unknown> => {
  if (source === 'fixtures') {
    return fixtureFiles
  }
  if (source === 'demo') {
    return demoFiles
  }
  if (source === 'docs-reference') {
    return docsReferenceFiles
  }
  if (source === 'cli-demo') {
    return cliDemoFiles
  }
  return liveFiles
}

const liveContentFiles = import.meta.glob('../../../content/**/*.yaml', {
  eager: true,
  import: 'default',
  query: '?raw',
})
const fixtureContentFiles = import.meta.glob('../../e2e/fixtures/content/**/*.yaml', {
  eager: true,
  import: 'default',
  query: '?raw',
})
const demoContentFiles = import.meta.glob('../../e2e/fixtures/content-demo/**/*.yaml', {
  eager: true,
  import: 'default',
  query: '?raw',
})
const docsReferenceContentFiles = import.meta.glob('../../../docs/fixtures/reference-project/content/**/*.yaml', {
  eager: true,
  import: 'default',
  query: '?raw',
})
const cliDemoContentFiles = import.meta.glob('../../e2e/fixtures/content-cli-demo/**/*.yaml', {
  eager: true,
  import: 'default',
  query: '?raw',
})
const rawContentFiles = Object.fromEntries(
  Object.entries(
    selectContentFiles(
      import.meta.env.VITE_CONTENT_SOURCE,
      liveContentFiles,
      fixtureContentFiles,
      demoContentFiles,
      docsReferenceContentFiles,
      cliDemoContentFiles,
    ),
  ).map(([path, source]) => [path, String(source)]),
)

export class ContentRepository {
  private readonly files: Record<string, string>
  private readonly validator: ContentValidator

  public constructor(files: Record<string, string> = rawContentFiles) {
    this.files = files
    this.validator = new ContentValidator()
  }

  public getSiteContent(): SiteContent {
    const document = this.readDocument('site.yaml')
    this.validator.validateSiteDocument(document)
    return document.site as unknown as SiteContent
  }

  public listPresentations(): PresentationIndexEntry[] {
    const document = this.readDocument('presentations/index.yaml')
    this.validator.validatePresentationIndexDocument(document)

    return document.presentations.filter((entry) => entry.published)
  }

  public getPresentation(id: string): PresentationRecord {
    const index = this.listPresentations().find((entry) => entry.id === id)

    if (!index) {
      throw new Error(`Unknown presentation "${id}".`)
    }

    const presentationDocument = this.readDocument(`presentations/${id}/presentation.yaml`)
    const generatedDocument = this.readDocument(`presentations/${id}/generated.yaml`)

    this.validator.validatePresentationDocument(presentationDocument)
    this.validator.validateGeneratedDocument(generatedDocument)
    this.validator.validatePresentationRecordConsistency(
      index,
      presentationDocument.presentation,
      generatedDocument.generated,
    )

    return {
      index,
      presentation: presentationDocument.presentation as unknown as PresentationRecord['presentation'],
      generated: generatedDocument.generated,
    }
  }

  private readDocument(suffix: string): unknown {
    const entry = Object.entries(this.files).find(([path]) => path.endsWith(suffix))

    if (!entry) {
      throw new Error(`Missing content file "${suffix}".`)
    }

    return parse(entry[1])
  }
}

export const contentRepository = new ContentRepository()
