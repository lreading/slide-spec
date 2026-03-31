import { readonly, shallowRef } from 'vue'
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

export { rawContentFiles }

export class ContentRepository {
  private readonly files = shallowRef<Record<string, string>>({})
  private readonly validator: ContentValidator
  private readonly version = shallowRef(0)

  public constructor(files: Record<string, string> = rawContentFiles) {
    this.validator = new ContentValidator()
    this.files.value = files
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

    const presentationDocument = this.readDocument(index.presentation_path)
    const generatedDocument = this.readDocument(index.generated_path ?? `presentations/${id}/generated.yaml`)

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

  public replaceFiles(files: Record<string, string>): void {
    this.files.value = files
    this.version.value += 1
  }

  public getContentVersion() {
    return readonly(this.version)
  }

  private readDocument(suffix: string): unknown {
    const entry = Object.entries(this.files.value).find(([path]) => path.endsWith(suffix))

    if (!entry) {
      throw new Error(`Missing content file "${suffix}".`)
    }

    return parse(entry[1])
  }
}

/* v8 ignore next 2 */
const hotData = import.meta.hot?.data as Record<string, unknown> | undefined
const repository = hotData?.contentRepository as ContentRepository | undefined

export const contentRepository = repository ?? new ContentRepository()
export const contentVersion = contentRepository.getContentVersion()

/* v8 ignore start */
if (import.meta.hot) {
  const data = import.meta.hot.data as Record<string, unknown> | undefined

  if (data) {
    data.contentRepository = contentRepository
  }

  import.meta.hot.accept((nextModule) => {
    contentRepository.replaceFiles(nextModule?.rawContentFiles ?? rawContentFiles)
  })
}
/* v8 ignore stop */
