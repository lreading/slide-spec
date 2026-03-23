const secretPatterns: Array<{ pattern: RegExp; replacement: string }> = [
  {
    pattern: /Authorization:\s*Bearer\s+[^\s]+/gi,
    replacement: 'Authorization: Bearer [REDACTED]',
  },
  {
    pattern: /GITHUB_PAT=[^\r\n]*/gi,
    replacement: 'GITHUB_PAT=[REDACTED]',
  },
  {
    pattern: /GITHUB_TOKEN=[^\r\n]*/gi,
    replacement: 'GITHUB_TOKEN=[REDACTED]',
  },
]

export class LogSanitizer {
  public sanitize(message: string): string {
    return secretPatterns.reduce(
      (current, entry) => current.replace(entry.pattern, entry.replacement),
      message,
    )
  }
}
