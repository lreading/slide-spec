import { describe, expect, it } from 'vitest'

import { SiteHtmlMetadataBuilder } from './site-html-metadata'

describe('SiteHtmlMetadataBuilder', () => {
  const builder = new SiteHtmlMetadataBuilder()

  it('replaces loading titles with canonical and social metadata', () => {
    const html = builder.apply(
      '<!doctype html>\n<head>\n    <title>Loading...</title>\n</head>',
      {
        title: 'Leo & "Friends"',
        description: 'Decks <from> YAML.',
        siteUrl: 'https://leosucks.com',
        imageUrl: '/preview.png',
        imageAlt: 'Preview image.',
      },
    )

    expect(html).toContain('<title>Leo &amp; &quot;Friends&quot;</title>')
    expect(html).toContain('<meta name="description" content="Decks &lt;from&gt; YAML." />')
    expect(html).toContain('<link rel="canonical" href="https://leosucks.com/" />')
    expect(html).toContain('<meta property="og:image" content="https://leosucks.com/preview.png" />')
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />')
    expect(html).toContain('<meta name="twitter:image:alt" content="Preview image." />')
    expect(html).not.toContain('Loading...')
  })

  it('omits deployment-only values when no site URL is configured', () => {
    const html = builder.apply(
      '<!doctype html><head><title>Loading...</title></head>',
      {
        title: 'Offline Deck',
        description: 'Local preview.',
        imageUrl: '/preview.png',
        imageAlt: 'Unresolved image.',
      },
    )

    expect(html).toContain('<title>Offline Deck</title>')
    expect(html).toContain('<meta property="og:description" content="Local preview." />')
    expect(html).toContain('<meta name="twitter:card" content="summary" />')
    expect(html).not.toContain('canonical')
    expect(html).not.toContain('og:url')
    expect(html).not.toContain('og:image')
    expect(html).not.toContain('twitter:image')
  })

  it('inserts metadata into documents without a title element', () => {
    const html = builder.apply(
      '<!doctype html><head></head>',
      {
        title: 'Static Deck',
        siteUrl: 'https://example.test/',
        imageUrl: 'https://cdn.example.test/preview.png',
      },
    )

    expect(html).toContain('<head>\n    <title>Static Deck</title>')
    expect(html).toContain('<meta property="og:url" content="https://example.test/" />')
    expect(html).toContain('<meta name="twitter:image" content="https://cdn.example.test/preview.png" />')
  })
})
