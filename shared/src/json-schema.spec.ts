import { readdir, readFile } from 'node:fs/promises'
import { resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import Ajv2020 from 'ajv/dist/2020'
import { parse } from 'yaml'
import { describe, expect, it } from 'vitest'

import { ContentValidator } from './content-validator'
import { acceptedFontAwesomeIcons } from './fontawesome'
import { slideSpecSchemaUrls } from './json-schema-urls'

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..')
const publicSchemaRoot = resolve(repoRoot, 'slides', 'public')
const schemaIds = slideSpecSchemaUrls

interface FixtureDocument {
  path: string
  document: unknown
  schemaId: string
}

const fixtureRoots = [
  'app/e2e/fixtures',
  'cli/examples-synced',
  'content',
  'docs/fixtures',
  'examples',
  'slides/content',
]

async function collectYamlFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = resolve(directory, entry.name)

    if (entry.isDirectory()) {
      return collectYamlFiles(entryPath)
    }

    return entry.isFile() && entry.name.endsWith('.yaml') ? [entryPath] : []
  }))

  return files.flat()
}

async function loadSchemas(): Promise<Ajv2020> {
  const ajv = new Ajv2020({ allErrors: true })
  const schemaPaths = [
    'schema.json',
    'schema/defs.schema.json',
    'schema/site.schema.json',
    'schema/presentations-index.schema.json',
    'schema/presentation.schema.json',
    'schema/generated.schema.json',
  ]

  for (const schemaPath of schemaPaths) {
    ajv.addSchema(JSON.parse(await readFile(resolve(publicSchemaRoot, schemaPath), 'utf8')))
  }

  return ajv
}

async function loadFixtureDocuments(): Promise<FixtureDocument[]> {
  const files = (await Promise.all(
    fixtureRoots.map((fixtureRoot) => collectYamlFiles(resolve(repoRoot, fixtureRoot))),
  )).flat()
  const documents: FixtureDocument[] = []

  for (const file of files) {
    documents.push({
      path: relative(repoRoot, file),
      document: parse(await readFile(file, 'utf8')),
      schemaId: resolveSchemaId(file),
    })
  }

  return documents.sort((left, right) => left.path.localeCompare(right.path))
}

function resolveSchemaId(path: string): string {
  if (path.endsWith('/site.yaml')) return schemaIds.site
  if (path.endsWith('/presentations/index.yaml')) return schemaIds.presentationsIndex
  if (path.endsWith('/presentation.yaml')) return schemaIds.presentation
  if (path.endsWith('/generated.yaml')) return schemaIds.generated
  throw new Error(`No Slide Spec schema mapping for ${path}.`)
}

function validateDocument(ajv: Ajv2020, schemaId: string, document: unknown): string[] {
  const validate = ajv.getSchema(schemaId)
  if (!validate) throw new Error(`Missing compiled schema ${schemaId}.`)

  return validate(document)
    ? []
    : (validate.errors ?? []).map((error) => `${error.instancePath || '/'} ${error.message ?? 'failed validation'}`)
}

function validateRuntimeDocument(validator: ContentValidator, fixture: FixtureDocument): void {
  if (fixture.schemaId === schemaIds.site) {
    validator.validateSiteDocument(fixture.document)
    return
  }

  if (fixture.schemaId === schemaIds.presentationsIndex) {
    validator.validatePresentationIndexDocument(fixture.document)
    return
  }

  if (fixture.schemaId === schemaIds.presentation) {
    validator.validatePresentationDocument(fixture.document)
    return
  }

  if (fixture.schemaId === schemaIds.generated) {
    validator.validateGeneratedDocument(fixture.document)
  }
}

describe('public JSON Schemas', () => {
  it('validate every known YAML fixture against its specific schema and the dispatcher', async () => {
    const ajv = await loadSchemas()
    const failures: string[] = []

    for (const fixture of await loadFixtureDocuments()) {
      for (const schemaId of [fixture.schemaId, schemaIds.root]) {
        const errors = validateDocument(ajv, schemaId, fixture.document)
        if (errors.length > 0) {
          failures.push(`${fixture.path} against ${schemaId}:\n${errors.join('\n')}`)
        }
      }
    }

    expect(failures).toEqual([])
  })

  it('keeps the fixture corpus aligned with runtime content validation', async () => {
    const validator = new ContentValidator()
    const failures: string[] = []

    for (const fixture of await loadFixtureDocuments()) {
      try {
        validateRuntimeDocument(validator, fixture)
      } catch (error) {
        failures.push(`${fixture.path}: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    expect(failures).toEqual([])
  })

  it('rejects schema version and template/content mismatches', async () => {
    const ajv = await loadSchemas()
    const invalidDocuments = [
      {
        schemaId: schemaIds.site,
        document: { schemaVersion: 2, site: {} },
      },
      {
        schemaId: schemaIds.presentation,
        document: {
          schemaVersion: 1,
          presentation: {
            id: 'demo',
            title: 'Demo',
            subtitle: 'Example',
            slides: [{ template: 'agenda', enabled: true, title: 'Agenda', content: { extra: true } }],
          },
        },
      },
      {
        schemaId: schemaIds.presentation,
        document: {
          schemaVersion: 1,
          presentation: {
            id: 'demo',
            title: 'Demo',
            subtitle: 'Example',
            slides: [{ template: 'hero', enabled: true, content: { subtitle_prefix: 'Only subtitle' } }],
          },
        },
      },
      {
        schemaId: schemaIds.presentation,
        document: {
          schemaVersion: 1,
          presentation: {
            id: 'demo',
            title: 'Demo',
            subtitle: 'Example',
            slides: [
              {
                template: 'section-title',
                enabled: true,
                content: {
                  title: 'Section',
                  image_alt: 'Only alt',
                },
              },
            ],
          },
        },
      },
      {
        schemaId: schemaIds.presentation,
        document: {
          schemaVersion: 1,
          presentation: {
            id: 'demo',
            title: 'Demo',
            subtitle: 'Example',
            slides: [{
              template: 'card-grid',
              enabled: true,
              title: 'Topics',
              content: { items: [{ title: 'One', marker_text: 'A', fa_icon: 'fa-star' }] },
            }],
          },
        },
      },
      {
        schemaId: schemaIds.generated,
        document: {
          schemaVersion: 1,
          generated: {
            id: 'demo',
            period: { start: '2026-01-01', end: '2026-03-31' },
            stats: {},
            releases: [{}],
            contributors: { total: 0, authors: [] },
          },
        },
      },
    ]

    expect(invalidDocuments.map(({ schemaId, document }) => validateDocument(ajv, schemaId, document).length > 0)).toEqual([
      true,
      true,
      true,
      true,
      true,
      true,
    ])
  })

  it('accepts progress-timeline slides with three authored stages', async () => {
    const ajv = await loadSchemas()
    const document = {
      schemaVersion: 1,
      presentation: {
        id: 'demo',
        title: 'Demo',
        subtitle: 'Example',
        slides: [{
          template: 'progress-timeline',
          enabled: true,
          title: 'Roadmap',
          content: {
            stage: '6-months',
            stages: {
              '3-months': { label: '3 Months', summary: 'Stabilize adoption.' },
              '6-months': { label: '6 Months', summary: 'Expand core workflows.' },
              '12-months': { label: '12 Months', summary: 'Scale the operating model.' },
            },
            sections: [
              {
                title: 'What happened',
                fa_icon: 'fa-check',
                type: 'richtext',
                body: 'Measure adoption',
              },
              {
                title: 'Signals',
                fa_icon: 'fa-bullseye',
                type: 'keyvalue',
                separator_fa_icon: 'fa-arrow-right',
                body: [{ key: 'Adoption', value: 'Make progress explicit' }],
              },
            ],
          },
        }],
      },
    }

    expect(validateDocument(ajv, schemaIds.presentation, document)).toEqual([])
  })

  it('rejects progress-timeline rich text sections with separator icons', async () => {
    const ajv = await loadSchemas()
    const document = {
      schemaVersion: 1,
      presentation: {
        id: 'demo',
        title: 'Demo',
        subtitle: 'Example',
        slides: [{
          template: 'progress-timeline',
          enabled: true,
          title: 'Roadmap',
          content: {
            stage: '6-months',
            stages: {
              '3-months': { label: '3 Months', summary: 'Stabilize adoption.' },
              '6-months': { label: '6 Months', summary: 'Expand core workflows.' },
              '12-months': { label: '12 Months', summary: 'Scale the operating model.' },
            },
            sections: [{
              type: 'richtext',
              separator_fa_icon: 'fa-arrow-right',
              body: 'Measure adoption',
            }],
          },
        }],
      },
    }

    expect(validateDocument(ajv, schemaIds.presentation, document).length).toBeGreaterThan(0)
  })

  it('accepts action-cards slides with informational cards and a disabled footer link', async () => {
    const ajv = await loadSchemas()
    const document = {
      schemaVersion: 1,
      presentation: {
        id: 'demo',
        title: 'Demo',
        subtitle: 'Example',
        slides: [{
          template: 'action-cards',
          enabled: true,
          title: 'Decisions',
          content: {
            footer_text: 'Review locally.',
            footer_link_enabled: false,
            cards: [{ title: 'Partner Scope', description: 'Confirm boundaries before kickoff.' }],
          },
        }],
      },
    }

    expect(validateDocument(ajv, schemaIds.presentation, document)).toEqual([])
  })

  it('accepts card-grid slides with authored rows, markers, icons, and links', async () => {
    const ajv = await loadSchemas()
    const document = {
      schemaVersion: 1,
      presentation: {
        id: 'demo',
        title: 'Demo',
        subtitle: 'Example',
        slides: [{
          template: 'card-grid',
          enabled: true,
          title: 'Initiatives',
          content: {
            card_arrow_fa_icon: 'fa-arrow-right',
            items: [
              { title: 'Detection / Response', fa_icon: 'fa-shield-halved' },
              { title: 'Supply Chain', marker_text: 'B' },
              { title: 'Documentation', url: 'https://example.test/docs' },
            ],
          },
        }],
      },
    }

    expect(validateDocument(ajv, schemaIds.presentation, document)).toEqual([])
  })

  it('rejects card-grid items with both marker text and icon fields', async () => {
    const ajv = await loadSchemas()
    const document = {
      schemaVersion: 1,
      presentation: {
        id: 'demo',
        title: 'Demo',
        subtitle: 'Example',
        slides: [{
          template: 'card-grid',
          enabled: true,
          title: 'Initiatives',
          content: {
            items: [{ title: 'Detection / Response', marker_text: 'D', fa_icon: 'fa-shield-halved' }],
          },
        }],
      },
    }

    expect(validateDocument(ajv, schemaIds.presentation, document).length).toBeGreaterThan(0)
  })

  it('accepts people slides with authored names, summary-only cards, and action cards without descriptions', async () => {
    const ajv = await loadSchemas()
    const document = {
      schemaVersion: 1,
      presentation: {
        id: 'demo',
        title: 'Demo',
        subtitle: 'Example',
        slides: [
          {
            template: 'people',
            enabled: true,
            title: 'Users',
            content: {
              spotlight: [
                { name: 'Security Operator', summary: 'Runs incident response.' },
                { summary: 'Owns a summary-only role.' },
              ],
            },
          },
          {
            template: 'action-cards',
            enabled: true,
            title: 'Actions',
            content: {
              cards: [{ title: 'Decide Scope' }],
            },
          },
        ],
      },
    }

    expect(validateDocument(ajv, schemaIds.presentation, document)).toEqual([])
  })

  it('rejects action-cards slides with partial card links', async () => {
    const ajv = await loadSchemas()
    const document = {
      schemaVersion: 1,
      presentation: {
        id: 'demo',
        title: 'Demo',
        subtitle: 'Example',
        slides: [{
          template: 'action-cards',
          enabled: true,
          title: 'Actions',
          content: {
            cards: [{ title: 'Report', description: 'Open a ticket.', url: 'https://example.test' }],
          },
        }],
      },
    }

    expect(validateDocument(ajv, schemaIds.presentation, document).length).toBeGreaterThan(0)
  })

  it('rejects progress-timeline schemas with too few stage entries', async () => {
    const ajv = await loadSchemas()
    const document = {
      schemaVersion: 1,
      presentation: {
        id: 'demo',
        title: 'Demo',
        subtitle: 'Example',
        slides: [{
          template: 'progress-timeline',
          enabled: true,
          title: 'Roadmap',
          content: {
            stage: 'completed',
            stages: {
              completed: { label: 'Completed', summary: 'Delivered work.' },
            },
            sections: [{
              type: 'richtext',
              body: 'Measure adoption',
            }],
          },
        }],
      },
    }

    expect(validateDocument(ajv, schemaIds.presentation, document).length).toBeGreaterThan(0)
  })

  it('keeps the public Font Awesome icon schema aligned with runtime validation', async () => {
    const definitions = JSON.parse(await readFile(resolve(publicSchemaRoot, 'schema/defs.schema.json'), 'utf8'))
    const fontAwesomeIconEnum = definitions.$defs.fontAwesomeIcon.enum

    expect(fontAwesomeIconEnum).toEqual(acceptedFontAwesomeIcons)
  })
})
