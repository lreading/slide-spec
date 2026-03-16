import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

import { parse } from 'yaml'

import type {
  GeneratedPresentationData,
  PresentationContent,
  PresentationIndexEntry,
  PresentationRecord,
  SiteContent,
} from '../../src/types/content'

interface PresentationIndexDocument {
  presentations: PresentationIndexEntry[]
}

interface SiteDocument {
  site: SiteContent
}

interface PresentationDocument {
  presentation: PresentationContent
}

interface GeneratedDocument {
  generated: GeneratedPresentationData
}

const fixturesRoot = resolve(fileURLToPath(new URL('../fixtures/content/', import.meta.url)))

export class FixtureRepository {
  private readonly root = fixturesRoot

  public getSiteContent(): SiteContent {
    return this.readDocument<SiteDocument>('site.yaml').site
  }

  public listPresentations(): PresentationIndexEntry[] {
    return this.readDocument<PresentationIndexDocument>('presentations/index.yaml').presentations
  }

  public getPresentation(id: string): PresentationRecord {
    const index = this.listPresentations().find((entry) => entry.id === id)

    if (!index) {
      throw new Error(`Unknown fixture presentation "${id}".`)
    }

    return {
      index,
      presentation: this.readDocument<PresentationDocument>(`presentations/${id}/presentation.yaml`).presentation,
      generated: this.readDocument<GeneratedDocument>(`presentations/${id}/generated.yaml`).generated,
    }
  }

  private readDocument<T>(relativePath: string): T {
    const fullPath = resolve(this.root, relativePath)
    const contents = readFileSync(fullPath, 'utf8')

    return parse(contents) as T
  }
}
