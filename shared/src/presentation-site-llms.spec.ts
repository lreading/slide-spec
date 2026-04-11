import { describe, expect, it } from 'vitest'

import { buildPresentationSiteLlmsText } from './presentation-site-llms'

describe('buildPresentationSiteLlmsText', () => {
  it('builds absolute links for published and featured presentations', () => {
    const text = buildPresentationSiteLlmsText(
      'https://updates.example.test',
      {
        site: {
          title: 'Slide Spec',
          navigation: { brand_title: 'Launch Decks' },
          home_intro: 'Structured slide decks.',
          links: {
            repository: { label: 'GitHub', url: 'https://github.com/example/project', eyebrow: 'Open source' },
          },
        },
      },
      {
        presentations: [
          { id: 'launch', title: 'Launch', subtitle: 'Spring 2026', summary: 'Launch plan.', published: true, featured: true },
          { id: 'draft', title: 'Draft', published: false },
        ],
      },
    )

    expect(text).toContain('# Launch Decks')
    expect(text).toContain('[Featured presentation: Launch (Spring 2026)](https://updates.example.test/presentations/launch): Launch plan.')
    expect(text).toContain('[GitHub](https://github.com/example/project): Open source link for the project behind this presentation site.')
    expect(text).not.toContain('draft')
  })

  it('falls back to relative links and default summaries', () => {
    const text = buildPresentationSiteLlmsText(
      undefined,
      { site: { title: 'Slide Spec' } },
      { presentations: [{ id: 'first', title: 'First', published: true }] },
    )

    expect(text).toContain('Static presentation site generated with Slide Spec')
    expect(text).toContain('[Presentations](/presentations)')
    expect(text).toContain('[First](/presentations/first): Published presentation.')
  })

  it('handles no featured presentation and fallback external link labels', () => {
    const text = buildPresentationSiteLlmsText(
      'https://updates.example.test/',
      {
        site: {
          title: 'Slide Spec',
          home_intro: ' ',
          links: {
            docs: { url: 'https://docs.example.test', eyebrow: 'Docs' },
            community: { url: 'https://community.example.test' },
          },
        },
      },
      { presentations: [] },
    )

    expect(text).not.toContain('Featured presentation:')
    expect(text).toContain('[Docs](https://docs.example.test): Docs link for the project behind this presentation site.')
    expect(text).toContain('[External resource](https://community.example.test): Related project resource.')
  })
})
