import type {
  BuildSiteInput,
  BuildSiteResult,
  FetchPresentationDataInput,
  FetchPresentationDataResult,
  InitPresentationInput,
  InitPresentationResult,
  ServeSiteInput,
  ServeSiteResult,
  ValidateContentInput,
  ValidateContentResult,
} from './TdCliService.types'

export interface TdCliService {
  initPresentation(input: InitPresentationInput): Promise<InitPresentationResult>
  fetchPresentationData(input: FetchPresentationDataInput): Promise<FetchPresentationDataResult>
  buildSite(input: BuildSiteInput): Promise<BuildSiteResult>
  serveSite(input: ServeSiteInput): Promise<ServeSiteResult>
  validateContent(input: ValidateContentInput): Promise<ValidateContentResult>
}
