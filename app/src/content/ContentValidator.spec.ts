import { describe, expect, it } from 'vitest'

import { ContentValidator } from './ContentValidator'

const validator = new ContentValidator()

const createValidPresentationDocument = () => ({
  presentation: {
    id: '2026-q1',
    year: 2026,
    title: 'Quarterly Community Update',
    subtitle: 'Q1 2026',
    roadmap: {
      sections: {
        completed: {
          label: 'Completed',
          summary: 'Done',
          items: ['One'],
          themes: [{ category: 'Theme', target: 'Target' }],
        },
        'in-progress': {
          label: 'In Progress',
          summary: 'Doing',
          items: ['Two'],
          themes: [{ category: 'Theme', target: 'Target' }],
        },
        planned: {
          label: 'Planned',
          summary: 'Soon',
          items: ['Three'],
          themes: [{ category: 'Theme', target: 'Target' }],
        },
        future: {
          label: 'Future',
          summary: 'Later',
          items: ['Four'],
          themes: [{ category: 'Theme', target: 'Target' }],
        },
      },
    },
    slides: [
      {
        template: 'hero',
        enabled: true,
        content: {
          title_primary: 'Threat Dragon',
        },
      },
      {
        template: 'agenda',
        enabled: true,
        title: 'Agenda',
        content: {},
      },
      {
        template: 'section-list-grid',
        enabled: true,
        title: 'Updates',
        content: {
          sections: [
            {
              title: 'Section',
              bullets: ['Bullet'],
            },
          ],
        },
      },
      {
        template: 'timeline',
        enabled: true,
        title: 'Releases',
        content: {
          featured_release_ids: ['v1.0.0'],
          latest_badge_label: 'Latest',
          footer_link_label: 'View all releases on GitHub',
        },
      },
      {
        template: 'progress-timeline',
        enabled: true,
        title: 'Roadmap',
        content: {
          stage: 'completed',
        },
      },
      {
        template: 'people',
        enabled: true,
        title: 'Contributor spotlight',
        content: {
          spotlight: [
            {
              login: 'octocat',
              summary: 'Summary',
            },
          ],
        },
      },
      {
        template: 'metrics-and-links',
        enabled: true,
        title: 'Community highlights',
        content: {
          stat_keys: ['stars'],
          mentions: [
            {
              type: 'Blog post',
              title: 'Community article',
            },
          ],
        },
      },
      {
        template: 'action-cards',
        enabled: true,
        title: 'How to contribute',
        content: {
          cards: [
            {
              title: 'Report bugs',
              description: 'Open an issue',
              url_label: 'Issues',
              url: 'https://github.com/OWASP/threat-dragon/issues',
            },
          ],
        },
      },
      {
        template: 'closing',
        enabled: true,
        content: {
          heading: 'Thank you',
          message: 'See you next quarter.',
        },
      },
    ],
  },
})

describe('ContentValidator', () => {
  it('accepts valid site, presentation index, presentation, and generated documents', () => {
    expect(() =>
      validator.validateSiteDocument({
        site: {
          title: 'Threat Dragon Quarterly Updates',
          data_sources: [
            {
              type: 'github',
              url: 'https://github.com/OWASP/threat-dragon',
            },
          ],
          home_intro: 'Intro',
          home_cta_label: 'View latest presentation',
          presentations_cta_label: 'View all presentations',
          links: {
            repository: {
              label: 'GitHub Repo',
              url: 'https://github.com/OWASP/threat-dragon',
              eyebrow: 'Source Code',
            },
            docs: {
              label: 'Docs',
              url: 'https://example.com/docs',
            },
            owasp: {
              label: 'OWASP',
              url: 'https://example.com/owasp',
            },
          },
        },
      }),
    ).not.toThrow()

    expect(() =>
      validator.validatePresentationIndexDocument({
        presentations: [
          {
            id: '2026-q1',
            year: 2026,
            title: 'Quarterly Community Update',
            subtitle: 'Q1 2026',
            summary: 'Summary',
            published: true,
            featured: true,
          },
        ],
      }),
    ).not.toThrow()

    expect(() => validator.validatePresentationDocument(createValidPresentationDocument())).not.toThrow()

    expect(() =>
      validator.validateGeneratedDocument({
        generated: {
          id: '2026-q1',
          period: {
            start: '2026-01-01',
            end: '2026-03-31',
          },
          stats: {
            stars: {
              label: 'Stars',
              current: 10,
              previous: 9,
              delta: 1,
              metadata: {
                comparison_status: 'complete',
                warning_codes: [],
              },
            },
          },
          releases: [
            {
              id: 'v1.0.0',
              version: 'v1.0.0',
              published_at: '2026-01-31',
              url: 'https://github.com/OWASP/threat-dragon/releases/tag/v1.0.0',
              summary_bullets: ['Bullet'],
            },
          ],
          contributors: {
            total: 1,
            authors: [
              {
                login: 'octocat',
                name: 'Octocat',
                avatar_url: 'https://github.com/images/error/octocat_happy.gif',
                merged_prs: 1,
                first_time: true,
              },
            ],
          },
        },
      }),
    ).not.toThrow()
  })

  it('rejects invalid site documents', () => {
    expect(() =>
      validator.validateSiteDocument({
        site: {
          title: 'Test',
          home_intro: 'Intro',
          home_cta_label: 'Open',
          presentations_cta_label: 'Presentations',
          links: {
            repository: {
              label: 'GitHub Repo',
              url: 42,
            },
            docs: {
              label: 'Docs',
              url: 'https://example.com/docs',
            },
            owasp: {
              label: 'OWASP',
              url: 'https://example.com/owasp',
            },
          },
        },
      }),
    ).toThrow('site.yaml.site.links.repository.url must be a string.')

    expect(() =>
      validator.validateSiteDocument({
        site: {
          title: 'Test',
          data_sources: [
            {
              type: 'gitlab',
              url: 'https://gitlab.com/example/project',
            },
          ],
          home_intro: 'Intro',
          home_cta_label: 'Open',
          presentations_cta_label: 'Presentations',
          links: {
            repository: {
              label: 'GitHub Repo',
              url: 'https://github.com/OWASP/threat-dragon',
            },
            docs: {
              label: 'Docs',
              url: 'https://example.com/docs',
            },
            owasp: {
              label: 'OWASP',
              url: 'https://example.com/owasp',
            },
          },
        },
      }),
    ).toThrow('site.yaml.site.data_sources[0].type must be "github".')
  })

  it('rejects blank authored content and incomplete grouped fields', () => {
    expect(() =>
      validator.validateSiteDocument({
        site: {
          title: 'Test',
          home_intro: 'Intro',
          home_cta_label: 'Open',
          presentations_cta_label: 'Presentations',
          app_footer: {
            repository_label: 'GitHub',
          },
          links: {
            repository: {
              label: 'GitHub Repo',
              url: 'https://example.com/repository',
            },
            docs: {
              label: 'Docs',
              url: 'https://example.com/docs',
            },
            owasp: {
              label: 'OWASP',
              url: 'https://example.com/owasp',
            },
          },
        },
      }),
    ).toThrow(
      'site.yaml.site.app_footer must provide both repository_label and repository_url together.',
    )

    const document = createValidPresentationDocument()
    document.presentation.slides = [
      {
        template: 'agenda',
        enabled: true,
        title: '   ',
        content: {},
      },
    ]

    expect(() => validator.validatePresentationDocument(document)).toThrow(
      'presentation document.presentation.slides[0].title must not be blank.',
    )
  })

  it('rejects unsupported or mismatched template ids', () => {
    const unsupportedTemplateDocument = createValidPresentationDocument()
    unsupportedTemplateDocument.presentation.slides = [
      {
        template: 'not-real',
        enabled: true,
        content: {
          title_primary: 'Threat Dragon',
        },
      } as never,
    ]

    expect(() => validator.validatePresentationDocument(unsupportedTemplateDocument)).toThrow(
      'presentation document.presentation.slides[0].template must be a supported template id.',
    )
  })

  it('rejects duplicate presentation ids in the index', () => {
    expect(() =>
      validator.validatePresentationIndexDocument({
        presentations: [
          {
            id: '2026-q1',
            year: 2026,
            title: 'One',
            subtitle: 'Q1 2026',
            summary: 'Summary',
            published: true,
            featured: false,
          },
          {
            id: '2026-q1',
            year: 2026,
            title: 'Two',
            subtitle: 'Q2 2026',
            summary: 'Summary',
            published: true,
            featured: true,
          },
        ],
      }),
    ).toThrow('presentations/index.yaml.presentations[1].id must be unique.')
  })

  it('rejects missing content blocks', () => {
    const missingContentDocument = createValidPresentationDocument()
    missingContentDocument.presentation.slides = [
      {
        template: 'hero',
        enabled: true,
      } as never,
    ]

    expect(() => validator.validatePresentationDocument(missingContentDocument)).toThrow(
      'presentation document.presentation.slides[0].content must be an object.',
    )
  })

  it('rejects invalid generated metric values', () => {
    expect(() =>
      validator.validateGeneratedDocument({
        generated: {
          id: '2026-q1',
          period: {
            start: '2026-01-01',
            end: '2026-03-31',
          },
          stats: {
            stars: {
              label: 'Stars',
              current: '10',
              previous: 9,
              delta: 1,
              metadata: {
                comparison_status: 'complete',
                warning_codes: [],
              },
            },
          },
          releases: [],
          contributors: {
            total: 0,
            authors: [],
          },
        },
      }),
    ).toThrow('generated document.generated.stats.stars.current must be a number.')
  })

  it('rejects invalid generated metric metadata', () => {
    expect(() =>
      validator.validateGeneratedDocument({
        generated: {
          id: '2026-q1',
          period: {
            start: '2026-01-01',
            end: '2026-03-31',
          },
          stats: {
            stars: {
              label: 'Stars',
              current: 10,
              previous: 9,
              delta: 1,
              metadata: {
                comparison_status: 'unknown',
                warning_codes: [],
              },
            },
          },
          releases: [],
          contributors: {
            total: 0,
            authors: [],
          },
        },
      }),
    ).toThrow(
      'generated document.generated.stats.stars.metadata.comparison_status must be one of complete, partial, skipped, or unavailable.',
    )
  })

  it('rejects inconsistent presentation records', () => {
    expect(() =>
      validator.validatePresentationRecordConsistency(
        {
          id: '2026-q1',
          year: 2026,
          title: 'One',
          subtitle: 'Q1 2026',
          summary: 'Summary',
          published: true,
          featured: true,
        },
        {
          id: '2026-q2',
          year: 2026,
          title: 'Two',
          subtitle: 'Q2 2026',
          slides: [],
        },
        {
          id: '2026-q1',
          period: {
            start: '2026-04-01',
            end: '2026-06-30',
          },
          stats: {},
          releases: [],
          contributors: {
            total: 0,
            authors: [],
          },
        },
      ),
    ).toThrow('Presentation id mismatch between index "2026-q1" and presentation "2026-q2".')
  })
})
