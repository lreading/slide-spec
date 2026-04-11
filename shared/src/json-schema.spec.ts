import { readdir, readFile } from 'node:fs/promises'
import { resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import Ajv2020 from 'ajv/dist/2020'
import { parse } from 'yaml'
import { describe, expect, it } from 'vitest'

import { ContentValidator } from './content-validator'
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
    ])
  })
})
