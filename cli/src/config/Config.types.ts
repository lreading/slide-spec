import type { DataSource } from '../../../shared/src/content'

export type SiteDataSource = DataSource

export interface SiteConfig {
  data_sources?: DataSource[]
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
  githubAccessToken?: string
}
