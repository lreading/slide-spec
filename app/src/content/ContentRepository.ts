import { parse } from 'yaml'

import type {
  GeneratedPresentationData,
  PresentationDeck,
  PresentationIndexEntry,
  PresentationRecord,
  SiteContent,
} from '../types/content'

const globbedContentFiles = import.meta.glob('../../../content/**/*.yaml', {
  eager: true,
  import: 'default',
  query: '?raw',
})
const rawContentFiles = Object.fromEntries(
  Object.entries(globbedContentFiles).map(([path, source]) => [path, String(source)]),
)

interface PresentationIndexDocument {
  presentations: PresentationIndexEntry[]
}

interface SiteDocument {
  site: SiteContent
}

interface DeckDocument {
  presentation: PresentationDeck
}

interface GeneratedDocument {
  generated: GeneratedPresentationData
}

export class ContentRepository {
  private readonly files: Record<string, string>

  public constructor(files: Record<string, string> = rawContentFiles) {
    this.files = files
  }

  public getSiteContent(): SiteContent {
    return this.readDocument<SiteDocument>('site.yaml').site
  }

  public listPresentations(): PresentationIndexEntry[] {
    return this.readDocument<PresentationIndexDocument>('presentations/index.yaml').presentations
      .filter((entry) => entry.published)
      .sort((left, right) => this.toSortValue(right) - this.toSortValue(left))
  }

  public getPresentation(id: string): PresentationRecord {
    const index = this.listPresentations().find((entry) => entry.id === id)

    if (!index) {
      throw new Error(`Unknown presentation "${id}".`)
    }

    return {
      index,
      presentation: this.readDocument<DeckDocument>(`presentations/${id}/deck.yaml`).presentation,
      generated: this.readDocument<GeneratedDocument>(`presentations/${id}/generated.yaml`).generated,
    }
  }

  private readDocument<T>(suffix: string): T {
    const entry = Object.entries(this.files).find(([path]) => path.endsWith(suffix))

    if (!entry) {
      throw new Error(`Missing content file "${suffix}".`)
    }

    return parse(entry[1]) as T
  }

  private toSortValue(entry: PresentationIndexEntry): number {
    return entry.year * 10 + entry.quarter
  }
}

export const contentRepository = new ContentRepository()
