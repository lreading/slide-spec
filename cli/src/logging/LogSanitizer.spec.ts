import { describe, expect, it } from 'vitest'

import { LogSanitizer } from './LogSanitizer'

describe('LogSanitizer', () => {
  it('redacts bearer tokens and env secrets', () => {
    const sanitizer = new LogSanitizer()

    expect(
      sanitizer.sanitize('Authorization: Bearer secret-token\nGITHUB_PAT=another-token\nGITHUB_TOKEN=fallback'),
    ).toBe('Authorization: Bearer [REDACTED]\nGITHUB_PAT=[REDACTED]\nGITHUB_TOKEN=[REDACTED]')
  })
})
