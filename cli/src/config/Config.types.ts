export interface SiteDataSource {
  type: 'github'
  url: string
}

export interface SiteConfig {
  data_sources?: SiteDataSource[]
}

export interface SiteDocument {
  site: SiteConfig
}

export interface GitHubRepositoryRef {
  type: 'github'
  url: string
  owner: string
  repo: string
}

export interface CliEnvironment {
  githubToken: string
}
