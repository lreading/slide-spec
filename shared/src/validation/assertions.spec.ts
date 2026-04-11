import { describe, expect, it } from 'vitest'

import {
  assertBoolean,
  assertNoUnexpectedKeys,
  assertNonBlankString,
  assertNumber,
  assertOptionalBoolean,
  assertOptionalNumber,
  assertOptionalString,
  assertSchemaVersion,
  assertStringArray,
  isRecord,
} from './assertions'

describe('validation assertions', () => {
  it('accepts valid primitive values', () => {
    expect(isRecord({ value: true })).toBe(true)
    expect(isRecord(null)).toBe(false)
    expect(() => assertNonBlankString('value', 'field')).not.toThrow()
    expect(() => assertOptionalString(undefined, 'field')).not.toThrow()
    expect(() => assertOptionalBoolean(false, 'flag')).not.toThrow()
    expect(() => assertOptionalNumber(3, 'count')).not.toThrow()
    expect(() => assertBoolean(true, 'enabled')).not.toThrow()
    expect(() => assertNumber(4, 'count')).not.toThrow()
    expect(() => assertStringArray(['one'], 'items')).not.toThrow()
    expect(() => assertNoUnexpectedKeys({ one: 1 }, ['one'], 'record')).not.toThrow()
  })

  it('rejects invalid primitive values with path-specific messages', () => {
    expect(() => assertNonBlankString(' ', 'field')).toThrow('field must not be blank.')
    expect(() => assertOptionalString(1, 'field')).toThrow('field must be a string.')
    expect(() => assertOptionalBoolean('yes', 'flag')).toThrow('flag must be a boolean.')
    expect(() => assertOptionalNumber(Number.NaN, 'count')).toThrow('count must be a number.')
    expect(() => assertStringArray(['ok', ''], 'items')).toThrow('items[1] must not be blank.')
    expect(() => assertNoUnexpectedKeys({ extra: true }, ['allowed'], 'record')).toThrow('record.extra is not allowed.')
  })

  it('validates schema major version', () => {
    expect(() => assertSchemaVersion(1, 'doc.schemaVersion')).not.toThrow()
    expect(() => assertSchemaVersion(2, 'doc.schemaVersion')).toThrow(
      'doc.schemaVersion must be 1. This Slide Spec release does not support schema version 2.',
    )
    expect(() => assertSchemaVersion(1.2, 'doc.schemaVersion')).toThrow('doc.schemaVersion must be an integer.')
  })
})
