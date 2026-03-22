import type { GeneratedPresentationData } from '../generation/Generation.types'

export interface InitPresentationInput {
  projectRoot?: string
  presentationId: string
  title: string
  subtitle: string
  fromDate: string
  toDate?: string
  summary?: string
  force?: boolean
}

export interface InitPresentationResult {
  presentationId: string
  createdPaths: string[]
}

export interface FetchPresentationDataInput {
  projectRoot?: string
  fromDate: string
  toDate?: string
  presentationId: string
  noPreviousPeriod?: boolean
  write?: boolean
}

export interface FetchPresentationDataResult {
  presentationId: string
  generatedPath: string
  previousPresentationId?: string
  generated: GeneratedPresentationData
  warnings: string[]
}

export interface BuildSiteInput {
  projectRoot?: string
  mode?: 'production'
}

export interface BuildSiteResult {
  outputPath: string
}

export interface ServeSiteInput {
  projectRoot?: string
  host?: string
  port?: number
  open?: boolean
}

export interface ServeSiteResult {
  url: string
}

export interface ValidateContentInput {
  projectRoot?: string
  strict?: boolean
}

export interface ValidateContentResult {
  valid: boolean
  errors: string[]
}
