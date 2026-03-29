import { describe, expect, it } from 'vitest'

import { InitPresentationBuilder } from './InitPresentationBuilder'

describe('InitPresentationBuilder', () => {
  const builder = new InitPresentationBuilder()
  const initInput = {
    presentationId: '2026-q1',
    title: 'Quarterly Community Update',
    summary: 'Replace with a summary before publishing.',
    period: {
      start: '2026-01-01',
      end: '2026-03-31',
    },
  }

  it('builds placeholder index, presentation, and generated documents', () => {
    expect(
      builder.buildIndexEntry(initInput, {
        published: true,
        featured: true,
      }),
    ).toEqual({
      id: '2026-q1',
      title: 'Quarterly Community Update',
      subtitle: 'Replace with a subtitle before publishing.',
      summary: 'Replace with a summary before publishing.',
      published: true,
      featured: true,
    })

    const presentationDocument = builder.buildPresentationDocument(initInput)
    expect(presentationDocument.presentation.slides).toHaveLength(9)
    expect(presentationDocument.presentation.slides[0]).toMatchObject({
      template: 'hero',
      enabled: true,
    })
    expect(presentationDocument.presentation.subtitle).toBe('Replace with a subtitle before publishing.')

    expect(builder.buildSiteDocument()).toMatchObject({
      site: {
        title: 'Slide Spec',
        home_intro: 'Create and publish data-driven slide decks.',
      },
    })
    expect(builder.buildSiteDocument({
      repositoryUrl: 'https://github.com/example/project',
      docsUrl: 'https://example.com/docs',
      websiteUrl: 'https://example.com',
      githubDataSourceUrl: 'https://github.com/OWASP/threat-dragon',
    })).toMatchObject({
      site: {
        data_sources: [
          {
            type: 'github',
            url: 'https://github.com/OWASP/threat-dragon',
          },
        ],
        links: {
          repository: {
            label: 'Project repository',
            url: 'https://github.com/example/project',
          },
          docs: {
            label: 'Project documentation',
            url: 'https://example.com/docs',
          },
          community: {
            label: 'Project website',
            url: 'https://example.com',
          },
        },
      },
    })

    expect(builder.buildGeneratedData(initInput, '2025-q4')).toMatchObject({
      id: '2026-q1',
      previous_presentation_id: '2025-q4',
      merged_prs: [],
    })
  })
})
