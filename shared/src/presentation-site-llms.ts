import type { SiteMetadataConfig } from './content'

export interface PresentationSiteDocument {
  site: {
    title: string
    deployment_url?: string
    sitemap_enabled?: boolean
    metadata?: SiteMetadataConfig
    navigation?: {
      brand_title?: string
    }
    home_intro?: string
    links?: Record<string, {
      label?: string
      url: string
      eyebrow?: string
    }>
  }
}

export interface PresentationSiteIndexDocument {
  presentations: Array<{
    id: string
    title: string
    subtitle?: string
    summary?: string
    published: boolean
    featured?: boolean
  }>
}

export const buildPresentationSiteLlmsText = (
  siteUrlCandidate: string | undefined,
  siteDocument: PresentationSiteDocument,
  indexDocument: PresentationSiteIndexDocument,
): string => {
  const siteUrl = resolveSiteUrl(siteUrlCandidate)
  const siteTitle = siteDocument.site.navigation?.brand_title?.trim() || siteDocument.site.title.trim()
  const siteSummary = siteDocument.site.home_intro?.trim()
    || 'Static presentation site generated with Slide Spec and backed by structured YAML content.'
  const publishedPresentations = indexDocument.presentations.filter((entry) => entry.published)
  const featuredPresentation = publishedPresentations.find((entry) => entry.featured) ?? publishedPresentations[0]
  const externalLinks = Object.values(siteDocument.site.links ?? {}).filter((entry) => entry.url?.trim())

  const lines = [
    `# ${siteTitle}`,
    '',
    `> ${siteSummary}`,
    '',
    'Important notes:',
    '- This site is the rendered presentation output, not the authoring schema or CLI documentation.',
    '- Use the presentations index to discover published decks; each presentation route is stable by id.',
    '- Presentation content combines authored YAML with generated data when the project uses connectors.',
    '',
    '## Navigation',
    '',
    `- [Home](${toLink(siteUrl, '/')}): Landing page for the presentation site and project overview.`,
    `- [Presentations](${toLink(siteUrl, '/presentations')}): Catalog of published presentations with search and filtering.`,
  ]

  if (featuredPresentation) {
    lines.push(
      `- [Featured presentation: ${presentationLabel(featuredPresentation)}](${toLink(siteUrl, `/presentations/${featuredPresentation.id}`)}): ${featuredPresentation.summary?.trim() || 'Primary featured presentation for this site.'}`,
    )
  }

  lines.push('', '## Presentations', '')

  for (const presentation of publishedPresentations) {
    lines.push(
      `- [${presentationLabel(presentation)}](${toLink(siteUrl, `/presentations/${presentation.id}`)}): ${presentation.summary?.trim() || 'Published presentation.'}`,
    )
  }

  if (externalLinks.length > 0) {
    lines.push('', '## Optional', '')

    for (const entry of externalLinks) {
      const label = entry.label?.trim() || entry.eyebrow?.trim() || 'External resource'
      const description = entry.eyebrow?.trim()
        ? `${entry.eyebrow.trim()} link for the project behind this presentation site.`
        : 'Related project resource.'
      lines.push(`- [${label}](${entry.url}): ${description}`)
    }
  }

  return `${lines.join('\n').trim()}\n`
}

const resolveSiteUrl = (siteUrl: string | undefined): URL | undefined => {
  const candidate = siteUrl?.trim()
  if (!candidate) {
    return undefined
  }

  return new URL(candidate.endsWith('/') ? candidate : `${candidate}/`)
}

const toUrl = (siteUrl: URL, path: string): string => new URL(path.replace(/^\//, ''), siteUrl).toString()

const toLink = (siteUrl: URL | undefined, path: string): string => (siteUrl ? toUrl(siteUrl, path) : path)

const presentationLabel = (presentation: PresentationSiteIndexDocument['presentations'][number]): string => {
  const subtitle = presentation.subtitle?.trim()
  return subtitle ? `${presentation.title} (${subtitle})` : presentation.title
}
