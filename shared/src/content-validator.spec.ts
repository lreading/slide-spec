import { describe, expect, it } from 'vitest'

import { ContentValidator } from './content-validator'
import { SLIDE_SPEC_SCHEMA_VERSION, type GeneratedPresentationData, type PresentationIndexEntry } from './content'

const validator = new ContentValidator()

const validSiteDocument = {
  schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
  site: {
    title: 'Slide Spec',
    deployment_url: 'https://www.slide-spec.dev',
    sitemap_enabled: true,
    data_sources: [{ type: 'github', url: 'https://github.com/lreading/slide-spec' }],
    home_intro: 'Structured slide decks.',
    home_cta_label: 'Open deck',
    presentations_cta_label: 'Browse decks',
    mascot: { url: '/mascot.png', alt: 'Mascot' },
    project_badge: { label: 'Open source', fa_icon: 'fa-brands fa-github', icon_position: 'before' },
    presentation_logo: { url: '/logo.png', alt: 'Logo' },
    navigation: {
      brand_title: 'Slide Spec',
      home_label: 'Home',
      presentations_label: 'Decks',
      latest_presentation_label: 'Latest',
      docs_enabled: true,
      toggle_label: 'Menu',
    },
    app_footer: { repository_label: 'GitHub', repository_url: 'https://github.com/lreading/slide-spec' },
    attribution: { enabled: true, label: 'Built with Slide Spec', url: 'https://www.slide-spec.dev' },
    presentation_chrome: { mark_label: 'Slide Spec' },
    presentation_toolbar: {
      navigation_label: 'Slides',
      previous_slide_label: 'Previous',
      next_slide_label: 'Next',
      presentation_mode_label: 'Present',
      shortcut_help_title: 'Shortcuts',
      shortcut_help_body: 'Use arrow keys.',
      shortcut_help_dismiss_label: 'Dismiss',
    },
    home_hero: { title_primary: 'Slide', title_accent: 'Spec', subtitle: 'Decks as data' },
    presentations_page: {
      title: 'Presentations',
      search_label: 'Search',
      search_placeholder: 'Find decks',
      year_label: 'Year',
      all_years_label: 'All',
      open_presentation_label: 'Open',
      empty_title: 'No decks',
      empty_message: 'Try another search.',
      previous_page_label: 'Previous',
      next_page_label: 'Next',
      page_label: 'Page',
      page_of_label: 'of',
      showing_label: 'Showing',
      total_label: 'total',
      presentation_singular_label: 'presentation',
      presentation_plural_label: 'presentations',
    },
    links: {
      repository: { label: 'GitHub', url: 'https://github.com/lreading/slide-spec' },
      docs: { label: 'Docs', url: 'https://docs.slide-spec.dev' },
      community: { label: 'Community', url: 'https://github.com/lreading/slide-spec/discussions' },
    },
  },
}

const validPresentationDocument = {
  schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
  presentation: {
    id: 'launch',
    year: 2026,
    title: 'Launch',
    subtitle: 'Spring',
    slides: [
      {
        template: 'hero',
        enabled: true,
        title: 'Launch',
        subtitle: 'Spring',
        content: { title_primary: 'Slide', title_accent: 'Spec' },
      },
      {
        template: 'agenda',
        enabled: true,
        title: 'Agenda',
        content: {},
      },
    ],
  },
}

const validGeneratedDocument = {
  schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
  generated: {
    id: 'launch',
    period: { start: '2026-01-01', end: '2026-03-31' },
    previous_presentation_id: 'preview',
    stats: {
      stars: {
        label: 'Stars',
        current: 10,
        previous: 8,
        delta: 2,
        metadata: { comparison_status: 'complete', warning_codes: [] },
      },
    },
    releases: [
      {
        id: 'v1.0.0',
        version: 'v1.0.0',
        published_at: '2026-01-31T00:00:00Z',
        url: 'https://github.com/lreading/slide-spec/releases/tag/v1.0.0',
        summary_bullets: ['First release'],
      },
    ],
    contributors: {
      total: 1,
      authors: [
        {
          login: 'octocat',
          name: 'Octocat',
          avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
          merged_prs: 2,
          first_time: true,
        },
      ],
    },
    merged_prs: [
      {
        number: 42,
        title: 'Ship launch content',
        merged_at: '2026-01-30T00:00:00Z',
        author_login: 'octocat',
      },
    ],
  },
} satisfies { schemaVersion: number, generated: GeneratedPresentationData }

describe('ContentValidator', () => {
  it('accepts valid site, index, presentation, generated, and consistency records', () => {
    const indexEntry: PresentationIndexEntry = {
      id: 'launch',
      year: 2026,
      title: 'Launch',
      subtitle: 'Spring',
      summary: 'Launch update',
      presentation_path: 'presentations/launch/presentation.yaml',
      published: true,
      featured: true,
    }

    expect(() => validator.validateSiteDocument(validSiteDocument)).not.toThrow()
    expect(() =>
      validator.validatePresentationIndexDocument({ schemaVersion: SLIDE_SPEC_SCHEMA_VERSION, presentations: [indexEntry] }),
    ).not.toThrow()
    expect(() => validator.validatePresentationDocument(validPresentationDocument)).not.toThrow()
    expect(() => validator.validateGeneratedDocument(validGeneratedDocument)).not.toThrow()
    expect(() =>
      validator.validatePresentationRecordConsistency(indexEntry, validPresentationDocument.presentation, validGeneratedDocument.generated),
    ).not.toThrow()
  })

  it('accepts minimal site options and explicit generated paths', () => {
    const minimalSite = {
      schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
      site: {
        title: 'Slide Spec',
        home_intro: 'Structured slide decks.',
        home_cta_label: 'Open deck',
        presentations_cta_label: 'Browse decks',
        links: validSiteDocument.site.links,
      },
    }

    expect(() => validator.validateSiteDocument(minimalSite)).not.toThrow()
    expect(() =>
      validator.validatePresentationIndexDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        presentations: [
          {
            id: 'launch',
            title: 'Launch',
            subtitle: 'Spring',
            summary: 'Launch update',
            presentation_path: 'presentations/launch/presentation.yaml',
            generated_path: 'generated/launch.yaml',
            published: true,
            featured: true,
          },
        ],
      }),
    ).not.toThrow()
    expect(() =>
      validator.validatePresentationDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        presentation: {
          ...validPresentationDocument.presentation,
          slides: [{ template: 'agenda', enabled: true, title: 'Agenda' }],
        },
      }),
    ).not.toThrow()
  })

  it('rejects invalid site configuration', () => {
    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        site: { ...validSiteDocument.site, deployment_url: 'not a url' },
      }),
    ).toThrow('site.yaml.site.deployment_url must be a valid URL.')
    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        site: { ...validSiteDocument.site, mascot: { alt: 'Mascot' } },
      }),
    ).toThrow('site.yaml.site.mascot.alt requires site.yaml.site.mascot.url.')
    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        site: { ...validSiteDocument.site, presentation_logo: { alt: 'Logo' } },
      }),
    ).toThrow('site.yaml.site.presentation_logo.alt requires site.yaml.site.presentation_logo.url.')
    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        site: { ...validSiteDocument.site, project_badge: { icon_position: 'middle' } },
      }),
    ).toThrow('site.yaml.site.project_badge must include label or fa_icon.')
    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        site: { ...validSiteDocument.site, project_badge: { label: 'Badge', icon_position: 'middle' } },
      }),
    ).toThrow('site.yaml.site.project_badge.icon_position must be "before" or "after".')
    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        site: { ...validSiteDocument.site, navigation: { docs_enabled: 'true' } },
      }),
    ).toThrow('site.yaml.site.navigation.docs_enabled must be a boolean.')
    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        site: { ...validSiteDocument.site, deployment_url: undefined, sitemap_enabled: true },
      }),
    ).toThrow('site.yaml.site.deployment_url is required when site.yaml.site.sitemap_enabled is true.')
    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        site: { ...validSiteDocument.site, data_sources: [{ type: 'github', url: 'https://example.test/repo' }] },
      }),
    ).toThrow('site.yaml.site.data_sources[0].url must point to github.com.')
    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        site: { ...validSiteDocument.site, data_sources: [{ type: 'github', url: 'not a url' }] },
      }),
    ).toThrow('site.yaml.site.data_sources[0].url must be a valid URL.')
    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        site: { ...validSiteDocument.site, data_sources: [{ type: 'gitlab', url: 'https://github.com/lreading/slide-spec' }] },
      }),
    ).toThrow('site.yaml.site.data_sources[0].type must be "github".')
    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        site: { ...validSiteDocument.site, data_sources: 'github' },
      }),
    ).toThrow('site.yaml.site.data_sources must be an array.')
    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        site: { ...validSiteDocument.site, app_footer: { repository_label: 'GitHub' } },
      }),
    ).toThrow('site.yaml.site.app_footer must provide both repository_label and repository_url together.')
    expect(() =>
      validator.validateSiteDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        site: { ...validSiteDocument.site, attribution: { label: 'Built with' } },
      }),
    ).toThrow('site.yaml.site.attribution must provide both label and url together.')
  })

  it('rejects duplicate presentation index paths', () => {
    const entry = {
      id: 'launch',
      title: 'Launch',
      subtitle: 'Spring',
      summary: 'Launch update',
      presentation_path: 'presentations/launch/presentation.yaml',
      published: true,
      featured: true,
    }

    expect(() =>
      validator.validatePresentationIndexDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        presentations: [entry, { ...entry, id: 'other' }],
      }),
    ).toThrow('presentations/index.yaml.presentations[1].presentation_path must be unique.')
    expect(() =>
      validator.validatePresentationIndexDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        presentations: [entry, { ...entry, presentation_path: 'presentations/other/presentation.yaml' }],
      }),
    ).toThrow('presentations/index.yaml.presentations[1].id must be unique.')
    expect(() =>
      validator.validatePresentationIndexDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        presentations: [
          { ...entry, generated_path: 'generated.yaml' },
          { ...entry, id: 'other', presentation_path: 'presentations/other/presentation.yaml', generated_path: 'generated.yaml' },
        ],
      }),
    ).toThrow('presentations/index.yaml.presentations[1].generated_path must be unique.')
  })

  it('rejects invalid presentation and generated documents', () => {
    expect(() =>
      validator.validatePresentationDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        presentation: { ...validPresentationDocument.presentation, extra: true },
      }),
    ).toThrow('presentation document.presentation.extra is not allowed.')
    expect(() =>
      validator.validatePresentationDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        presentation: { ...validPresentationDocument.presentation, slides: [{ template: 'unknown', enabled: true }] },
      }),
    ).toThrow('presentation document.presentation.slides[0].template must be a supported template id.')
    expect(() =>
      validator.validatePresentationDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        presentation: {
          ...validPresentationDocument.presentation,
          slides: [{ template: 'agenda', enabled: true, title: 'Agenda', content: { extra: true } }],
        },
      }),
    ).toThrow('presentation document.presentation.slides[0].content must be omitted or an empty object for agenda slides.')
    expect(() =>
      validator.validateGeneratedDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        generated: { ...validGeneratedDocument.generated, stats: { stars: { label: 'Stars' } } },
      }),
    ).toThrow('generated document.generated.stats.stars.current must be a number.')
    expect(() =>
      validator.validateGeneratedDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        generated: {
          ...validGeneratedDocument.generated,
          stats: {
            stars: {
              ...validGeneratedDocument.generated.stats.stars,
              metadata: { comparison_status: 'stale', warning_codes: [] },
            },
          },
        },
      }),
    ).toThrow('generated document.generated.stats.stars.metadata.comparison_status must be one of complete, partial, skipped, or unavailable.')
    expect(() =>
      validator.validateGeneratedDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        generated: { ...validGeneratedDocument.generated, merged_prs: 'not an array' },
      }),
    ).toThrow('generated document.generated.merged_prs must be an array.')
    expect(() =>
      validator.validateGeneratedDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        generated: { ...validGeneratedDocument.generated, releases: [{ id: 'v1.0.0' }] },
      }),
    ).toThrow('generated document.generated.releases[0].version must be a string.')
    expect(() =>
      validator.validateGeneratedDocument({
        schemaVersion: SLIDE_SPEC_SCHEMA_VERSION,
        generated: {
          ...validGeneratedDocument.generated,
          contributors: { total: 1, authors: [{ login: 'octocat' }] },
        },
      }),
    ).toThrow('generated document.generated.contributors.authors[0].name must be a string.')
  })

  it('rejects inconsistent presentation ids', () => {
    const indexEntry: PresentationIndexEntry = {
      id: 'launch',
      title: 'Launch',
      subtitle: 'Spring',
      summary: 'Launch update',
      presentation_path: 'presentations/launch/presentation.yaml',
      published: true,
      featured: true,
    }

    expect(() =>
      validator.validatePresentationRecordConsistency(indexEntry, { id: 'other' }, validGeneratedDocument.generated),
    ).toThrow('Presentation id mismatch between index "launch" and presentation "other".')
    expect(() =>
      validator.validatePresentationRecordConsistency(indexEntry, { id: 'launch' }, { ...validGeneratedDocument.generated, id: 'other' }),
    ).toThrow('Presentation id mismatch between index "launch" and generated "other".')
  })
})
