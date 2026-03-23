export interface CliLogger {
  info(message: string): void
  error(message: string): void
  githubRequest(method: string, url: string): void
  githubResponse(method: string, url: string, status: number, statusText: string): void
  githubSummary(message: string): void
}
