import { describe, expect, it } from 'vitest'

import { ContentValidator } from './ContentValidator'

const validator = new ContentValidator()

const createValidPresentationDocument = () => ({
  schemaVersion: 1,
  presentation: {
    id: '2026-q1',
    year: 2026,
    title: 'Quarterly Community Update',
    subtitle: 'Q1 2026',
    slides: [
      {
        template: 'hero',
        enabled: true,
        content: {
          title_primary: 'Aurora Notes',
        },
      },
      {
        template: 'agenda',
        enabled: true,
        title: 'Agenda',
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
          deliverables_heading: 'Key deliverables',
          focus_areas_heading: 'Focus areas',
          footer_link_label: 'View full roadmap & milestones on GitHub',
          stages: {
            completed: {
              label: 'Completed',
              summary: 'Done',
            },
            'in-progress': {
              label: 'In Progress',
              summary: 'Doing',
            },
            planned: {
              label: 'Planned',
              summary: 'Soon',
            },
            future: {
              label: 'Future',
              summary: 'Later',
            },
          },
          items: ['One'],
          themes: [{ category: 'Theme', target: 'Target' }],
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
              url: 'https://github.com/example-org/aurora-notes/issues',
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
        schemaVersion: 1,
        site: {
          title: 'Aurora Notes Quarterly Updates',
          metadata: {
            title: 'Aurora Notes Updates',
            description: 'Quarterly static slide decks.',
            image_url: '/social-preview.png',
            image_alt: 'Aurora Notes updates preview.',
          },
          data_sources: [
            {
              type: 'github',
              url: 'https://github.com/example-org/aurora-notes',
            },
          ],
          home_intro: 'Intro',
          home_cta_label: 'View latest presentation',
          presentations_cta_label: 'View all presentations',
          links: {
            repository: {
              label: 'GitHub Repo',
              url: 'https://github.com/example-org/aurora-notes',
              eyebrow: 'Source Code',
            },
            docs: {
              label: 'Docs',
              url: 'https://example.com/docs',
            },
            community: {
              label: 'Community',
              url: 'https://example.com/community',
            },
          },
        },
      }),
    ).not.toThrow()

    expect(() =>
      validator.validatePresentationIndexDocument({
        schemaVersion: 1,
        presentations: [
          {
            id: '2026-q1',
            presentation_path: 'presentations/2026-q1/presentation.yaml',
            generated_path: 'presentations/2026-q1/generated.yaml',
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
        schemaVersion: 1,
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
              url: 'https://github.com/example-org/aurora-notes/releases/tag/v1.0.0',
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

  it('rejects missing, invalid, or unsupported schema versions', () => {
    expect(() =>
      validator.validateSiteDocument({
        site: {
          title: 'Test',
          home_intro: 'Intro',
          home_cta_label: 'Open',
          presentations_cta_label: 'Presentations',
          links: {
            repository: { label: 'R', url: 'https://example.com/r' },
            docs: { label: 'D', url: 'https://example.com/d' },
            community: { label: 'C', url: 'https://example.com/c' },
          },
        },
      }),
    ).toThrow('site.yaml.schemaVersion must be a number.')

    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: 2,
        site: {
          title: 'Test',
          home_intro: 'Intro',
          home_cta_label: 'Open',
          presentations_cta_label: 'Presentations',
          links: {
            repository: { label: 'R', url: 'https://example.com/r' },
            docs: { label: 'D', url: 'https://example.com/d' },
            community: { label: 'C', url: 'https://example.com/c' },
          },
        },
      }),
    ).toThrow('site.yaml.schemaVersion must be 1. This Slide Spec release does not support schema version 2.')
  })

  it('rejects invalid site documents', () => {
    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: 1,
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
            community: {
              label: 'Community',
              url: 'https://example.com/community',
            },
          },
        },
      }),
    ).toThrow('site.yaml.site.links.repository.url must be a string.')

    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: 1,
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
              url: 'https://github.com/example-org/aurora-notes',
            },
            docs: {
              label: 'Docs',
              url: 'https://example.com/docs',
            },
            community: {
              label: 'Community',
              url: 'https://example.com/community',
            },
          },
        },
      }),
    ).toThrow('site.yaml.site.data_sources[0].type must be "github".')

    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: 1,
        site: {
          title: 'Test',
          deployment_url: 'not-a-url',
          home_intro: 'Intro',
          home_cta_label: 'Open',
          presentations_cta_label: 'Presentations',
          links: {
            repository: {
              label: 'GitHub Repo',
              url: 'https://github.com/example-org/aurora-notes',
            },
            docs: {
              label: 'Docs',
              url: 'https://example.com/docs',
            },
            community: {
              label: 'Community',
              url: 'https://example.com/community',
            },
          },
        },
      }),
    ).toThrow('site.yaml.site.deployment_url must be a valid URL.')

    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: 1,
        site: {
          title: 'Test',
          sitemap_enabled: true,
          home_intro: 'Intro',
          home_cta_label: 'Open',
          presentations_cta_label: 'Presentations',
          links: {
            repository: {
              label: 'GitHub Repo',
              url: 'https://github.com/example-org/aurora-notes',
            },
            docs: {
              label: 'Docs',
              url: 'https://example.com/docs',
            },
            community: {
              label: 'Community',
              url: 'https://example.com/community',
            },
          },
        },
      }),
    ).toThrow('site.yaml.site.deployment_url is required when site.yaml.site.sitemap_enabled is true.')

    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: 1,
        site: {
          title: 'Test',
          metadata: {
            image_alt: 'Preview',
          },
          home_intro: 'Intro',
          home_cta_label: 'Open',
          presentations_cta_label: 'Presentations',
          links: {
            repository: {
              label: 'GitHub Repo',
              url: 'https://github.com/example-org/aurora-notes',
            },
            docs: {
              label: 'Docs',
              url: 'https://example.com/docs',
            },
            community: {
              label: 'Community',
              url: 'https://example.com/community',
            },
          },
        },
      }),
    ).toThrow('site.yaml.site.metadata.image_alt requires site.yaml.site.metadata.image_url.')
  })

  it('rejects blank authored content and incomplete grouped fields', () => {
    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: 1,
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
            community: {
              label: 'Community',
              url: 'https://example.com/community',
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
      },
    ]

    expect(() => validator.validatePresentationDocument(document)).toThrow(
      'presentation document.presentation.slides[0].title must not be blank.',
    )
  })

  it('accepts agenda slides with no content key', () => {
    const document = createValidPresentationDocument()
    const agendaSlide = document.presentation.slides.find((s) => s.template === 'agenda')
    expect(agendaSlide).toBeDefined()
    expect(Object.prototype.hasOwnProperty.call(agendaSlide, 'content')).toBe(false)
    expect(() => validator.validatePresentationDocument(document)).not.toThrow()
  })

  it('rejects agenda slides with non-empty content', () => {
    const document = createValidPresentationDocument()
    document.presentation.slides = [
      {
        template: 'agenda',
        enabled: true,
        title: 'Agenda',
        content: { unused: true },
      } as never,
    ]

    expect(() => validator.validatePresentationDocument(document)).toThrow(
      'presentation document.presentation.slides[0].content must be omitted or an empty object for agenda slides.',
    )
  })

  it('rejects unsupported or mismatched template ids', () => {
    const unsupportedTemplateDocument = createValidPresentationDocument()
    unsupportedTemplateDocument.presentation.slides = [
      {
        template: 'not-real',
        enabled: true,
        content: {
          title_primary: 'Aurora Notes',
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
        schemaVersion: 1,
        presentations: [
          {
            id: '2026-q1',
            presentation_path: 'presentations/2026-q1/presentation.yaml',
            generated_path: 'presentations/2026-q1/generated.yaml',
            year: 2026,
            title: 'One',
            subtitle: 'Q1 2026',
            summary: 'Summary',
            published: true,
            featured: false,
          },
          {
            id: '2026-q1',
            presentation_path: 'presentations/2026-q1/presentation.yaml',
            generated_path: 'presentations/2026-q1/generated.yaml',
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

  it('rejects duplicate presentation paths in the index', () => {
    expect(() =>
      validator.validatePresentationIndexDocument({
        schemaVersion: 1,
        presentations: [
          {
            id: '2026-q1',
            presentation_path: 'presentations/shared/presentation.yaml',
            generated_path: 'presentations/2026-q1/generated.yaml',
            year: 2026,
            title: 'One',
            subtitle: 'Q1 2026',
            summary: 'Summary',
            published: true,
            featured: false,
          },
          {
            id: '2026-q2',
            presentation_path: 'presentations/shared/presentation.yaml',
            generated_path: 'presentations/2026-q2/generated.yaml',
            year: 2026,
            title: 'Two',
            subtitle: 'Q2 2026',
            summary: 'Summary',
            published: true,
            featured: true,
          },
        ],
      }),
    ).toThrow('presentations/index.yaml.presentations[1].presentation_path must be unique.')
  })

  it('rejects duplicate generated paths in the index', () => {
    expect(() =>
      validator.validatePresentationIndexDocument({
        schemaVersion: 1,
        presentations: [
          {
            id: '2026-q1',
            presentation_path: 'presentations/2026-q1/presentation.yaml',
            generated_path: 'presentations/shared/generated.yaml',
            year: 2026,
            title: 'One',
            subtitle: 'Q1 2026',
            summary: 'Summary',
            published: true,
            featured: false,
          },
          {
            id: '2026-q2',
            presentation_path: 'presentations/2026-q2/presentation.yaml',
            generated_path: 'presentations/shared/generated.yaml',
            year: 2026,
            title: 'Two',
            subtitle: 'Q2 2026',
            summary: 'Summary',
            published: true,
            featured: true,
          },
        ],
      }),
    ).toThrow('presentations/index.yaml.presentations[1].generated_path must be unique.')
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
        schemaVersion: 1,
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
        schemaVersion: 1,
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
          presentation_path: 'presentations/2026-q1/presentation.yaml',
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
