import type { GitHubRepositoryRef, SiteConfig, SiteDataSource } from './Config.types'

export class DataSourceResolver {
  public resolveGitHubRepository(siteConfig: SiteConfig): GitHubRepositoryRef {
    const githubSources = (siteConfig.data_sources ?? []).filter((source) => source.type === 'github')

    if (githubSources.length === 0) {
      throw new Error('site.data_sources must include exactly one github source.')
    }

    if (githubSources.length > 1) {
      throw new Error('site.data_sources must not include more than one github source.')
    }

    const [githubSource] = githubSources
    if (!githubSource) {
      throw new Error('site.data_sources must include exactly one github source.')
    }

    return this.parseGitHubUrl(githubSource)
  }

  private parseGitHubUrl(source: SiteDataSource): GitHubRepositoryRef {
    let parsedUrl: URL

    try {
      parsedUrl = new URL(source.url)
    } catch {
      throw new Error(`GitHub data source URL "${source.url}" is invalid.`)
    }

    const hostname = parsedUrl.hostname.toLowerCase()
    if (hostname !== 'github.com' && hostname !== 'www.github.com') {
      throw new Error(`GitHub data source URL "${source.url}" must point to github.com.`)
    }

    const segments = parsedUrl.pathname
      .split('/')
      .filter((segment) => segment.length > 0)

    if (segments.length !== 2) {
      throw new Error(`GitHub data source URL "${source.url}" must target a repository root.`)
    }

    const [owner, rawRepo] = segments
    if (!owner || !rawRepo) {
      throw new Error(`GitHub data source URL "${source.url}" must target a repository root.`)
    }

    const repo = rawRepo.endsWith('.git')
      ? rawRepo.slice(0, -4)
      : rawRepo

    if (repo.length === 0) {
      throw new Error(`GitHub data source URL "${source.url}" must target a repository root.`)
    }

    return {
      type: 'github',
      url: `https://github.com/${owner}/${repo}`,
      owner,
      repo,
    }
  }
}
