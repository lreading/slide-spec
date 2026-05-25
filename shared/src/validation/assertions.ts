import { SLIDE_SPEC_SCHEMA_VERSION } from '../schema-version'
import { isFontAwesomeIcon } from '../fontawesome'

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

export function assertString(value: unknown, path: string): asserts value is string {
  assert(typeof value === 'string', `${path} must be a string.`)
}

export function assertNonBlankString(value: unknown, path: string): asserts value is string {
  assertString(value, path)
  assert(value.trim().length > 0, `${path} must not be blank.`)
}

export function assertOptionalString(value: unknown, path: string): void {
  if (value !== undefined) {
    assertNonBlankString(value, path)
  }
}

export function assertFontAwesomeIcon(value: unknown, path: string): asserts value is string {
  assertNonBlankString(value, path)
  assert(isFontAwesomeIcon(value), `${path} must be a supported Font Awesome icon.`)
}

export function assertOptionalFontAwesomeIcon(value: unknown, path: string): void {
  if (value !== undefined) {
    assertFontAwesomeIcon(value, path)
  }
}

export function assertBoolean(value: unknown, path: string): asserts value is boolean {
  assert(typeof value === 'boolean', `${path} must be a boolean.`)
}

export function assertOptionalBoolean(value: unknown, path: string): void {
  if (value !== undefined) {
    assertBoolean(value, path)
  }
}

export function assertNumber(value: unknown, path: string): asserts value is number {
  assert(typeof value === 'number' && Number.isFinite(value), `${path} must be a number.`)
}

export function assertOptionalNumber(value: unknown, path: string): void {
  if (value !== undefined) {
    assertNumber(value, path)
  }
}

export function assertStringArray(value: unknown, path: string): asserts value is string[] {
  assert(Array.isArray(value), `${path} must be an array.`)
  const entries = value as unknown[]
  entries.forEach((entry, index) => assertNonBlankString(entry, `${path}[${index}]`))
}

export function assertNoUnexpectedKeys(
  value: Record<string, unknown>,
  allowedKeys: readonly string[],
  path: string,
): void {
  const allowed = new Set(allowedKeys)
  Object.keys(value).forEach((key) => {
    assert(allowed.has(key), `${path}.${key} is not allowed.`)
  })
}

export function assertSchemaVersion(value: unknown, path: string): void {
  assertNumber(value, path)
  assert(Number.isInteger(value), `${path} must be an integer.`)
  assert(
    value === SLIDE_SPEC_SCHEMA_VERSION,
    `${path} must be ${String(SLIDE_SPEC_SCHEMA_VERSION)}. This Slide Spec release does not support schema version ${String(value)}.`,
  )
}
