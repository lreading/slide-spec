const secretPatterns: Array<{ pattern: RegExp; replacement: string }> = [
  {
    pattern: /Authorization:\s*Bearer\s+[^\s]+/gi,
    replacement: 'Authorization: Bearer [REDACTED]',
  },
  {
    pattern: /GITHUB_PAT=[^\s"']+/gi,
    replacement: 'GITHUB_PAT=[REDACTED]',
  },
  {
    pattern: /GITHUB_TOKEN=[^\s"']+/gi,
    replacement: 'GITHUB_TOKEN=[REDACTED]',
  },
  {
    pattern: /GH_TOKEN=[^\s"']+/gi,
    replacement: 'GH_TOKEN=[REDACTED]',
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
