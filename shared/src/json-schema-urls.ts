export const SLIDE_SPEC_SCHEMA_BASE_URL = 'https://slide-spec.dev' as const

export const slideSpecSchemaUrls = {
  generated: `${SLIDE_SPEC_SCHEMA_BASE_URL}/schema/generated.schema.json`,
  presentation: `${SLIDE_SPEC_SCHEMA_BASE_URL}/schema/presentation.schema.json`,
  presentationsIndex: `${SLIDE_SPEC_SCHEMA_BASE_URL}/schema/presentations-index.schema.json`,
  root: `${SLIDE_SPEC_SCHEMA_BASE_URL}/schema.json`,
  site: `${SLIDE_SPEC_SCHEMA_BASE_URL}/schema/site.schema.json`,
} as const
