export interface SiteHtmlMetadata {
  title: string
  description?: string | undefined
  siteUrl?: string | undefined
  imageUrl?: string | undefined
  imageAlt?: string | undefined
}

export class SiteHtmlMetadataBuilder {
  public apply(html: string, metadata: SiteHtmlMetadata): string {
    const title = metadata.title.trim()
    const description = metadata.description?.trim()
    const siteUrl = this.resolveSiteUrl(metadata.siteUrl)
    const imageUrl = this.resolveImageUrl(metadata.imageUrl, siteUrl)
    const imageAlt = metadata.imageAlt?.trim()
    const tags = this.buildTags({
      title,
      description,
      siteUrl,
      imageUrl,
      imageAlt,
    })

    if (/^[ \t]*<title>[\s\S]*?<\/title>/im.test(html)) {
      return html.replace(/^[ \t]*<title>[\s\S]*?<\/title>/im, tags)
    }

    return html.replace(/<head>/i, `<head>\n${tags}`)
  }

  private buildTags(metadata: {
    title: string
    description?: string | undefined
    siteUrl?: URL | undefined
    imageUrl?: string | undefined
    imageAlt?: string | undefined
  }): string {
    const lines = [
      `    <title>${this.escapeHtml(metadata.title)}</title>`,
    ]

    if (metadata.description) {
      lines.push(
        `    <meta name="description" content="${this.escapeHtml(metadata.description)}" />`,
        `    <meta property="og:description" content="${this.escapeHtml(metadata.description)}" />`,
        `    <meta name="twitter:description" content="${this.escapeHtml(metadata.description)}" />`,
      )
    }

    if (metadata.siteUrl) {
      const siteUrl = this.escapeHtml(metadata.siteUrl.toString())
      lines.push(
        `    <link rel="canonical" href="${siteUrl}" />`,
        `    <meta property="og:url" content="${siteUrl}" />`,
      )
    }

    lines.push(
      '    <meta property="og:type" content="website" />',
      `    <meta property="og:title" content="${this.escapeHtml(metadata.title)}" />`,
      `    <meta name="twitter:card" content="${metadata.imageUrl ? 'summary_large_image' : 'summary'}" />`,
      `    <meta name="twitter:title" content="${this.escapeHtml(metadata.title)}" />`,
    )

    if (metadata.imageUrl) {
      const imageUrl = this.escapeHtml(metadata.imageUrl)
      lines.push(
        `    <meta property="og:image" content="${imageUrl}" />`,
        `    <meta name="twitter:image" content="${imageUrl}" />`,
      )
    }

    if (metadata.imageUrl && metadata.imageAlt) {
      lines.push(
        `    <meta property="og:image:alt" content="${this.escapeHtml(metadata.imageAlt)}" />`,
        `    <meta name="twitter:image:alt" content="${this.escapeHtml(metadata.imageAlt)}" />`,
      )
    }

    return lines.join('\n')
  }

  private resolveSiteUrl(siteUrl: string | undefined): URL | undefined {
    const candidate = siteUrl?.trim()
    if (!candidate) {
      return undefined
    }

    return new URL(candidate.endsWith('/') ? candidate : `${candidate}/`)
  }

  private resolveImageUrl(imageUrl: string | undefined, siteUrl: URL | undefined): string | undefined {
    const candidate = imageUrl?.trim()
    if (!candidate) {
      return undefined
    }

    if (/^https?:\/\//i.test(candidate)) {
      return new URL(candidate).toString()
    }

    if (!siteUrl) {
      return undefined
    }

    return new URL(candidate.replace(/^\//, ''), siteUrl).toString()
  }

  private escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (character) => {
      switch (character) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      default:
        return '&#39;'
      }
    })
  }
}
