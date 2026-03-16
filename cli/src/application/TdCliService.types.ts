export interface InitPresentationInput {
  year: number
  quarter: number
  force?: boolean
}

export interface InitPresentationResult {
  presentationId: string
  createdPaths: string[]
}

export interface FetchPresentationDataInput {
  year: number
  quarter: number
  presentationId?: string
  write?: boolean
}

export interface FetchPresentationDataResult {
  presentationId: string
  generatedPath: string
  previousPresentationId?: string
  warnings: string[]
}

export interface BuildSiteInput {
  mode?: 'production'
}

export interface BuildSiteResult {
  outputPath: string
}

export interface ServeSiteInput {
  host?: string
  port?: number
  open?: boolean
}

export interface ServeSiteResult {
  url: string
}

export interface ValidateContentInput {
  strict?: boolean
}

export interface ValidateContentResult {
  valid: boolean
  errors: string[]
}
