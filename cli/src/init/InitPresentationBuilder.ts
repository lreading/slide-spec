import type {
  GeneratedPresentationData,
  PresentationIndexEntry,
  ReportingPeriod,
} from '../generation/Generation.types'

export interface PresentationDocument {
  presentation: {
    id: string
    title: string
    subtitle: string
    slides: Array<Record<string, unknown>>
  }
}

export interface SiteDocument {
  site: {
    title: string
    home_intro: string
    home_cta_label: string
    presentations_cta_label: string
    data_sources?: Array<{
      type: 'github'
      url: string
    }>
    links: {
      repository: {
        label: string
        url: string
      }
      docs: {
        label: string
        url: string
      }
      community: {
        label: string
        url: string
      }
    }
  }
}

export interface InitSiteContent {
  repositoryUrl?: string
  docsUrl?: string
  websiteUrl?: string
  githubDataSourceUrl?: string
}

export interface InitPresentationContent {
  presentationId: string
  title: string
  subtitle?: string
  summary: string
  period: ReportingPeriod
}

interface IndexEntryOptions {
  featured: boolean
  published: boolean
}

export class InitPresentationBuilder {
  public buildSiteDocument(input: InitSiteContent = {}): SiteDocument {
    const links = {
      repository: {
        label: 'Project repository',
        url: input.repositoryUrl ?? 'https://example.com/repository',
      },
      docs: {
        label: 'Project documentation',
        url: input.docsUrl ?? 'https://example.com/docs',
      },
      community: {
        label: 'Project website',
        url: input.websiteUrl ?? 'https://example.com',
      },
    }

    return {
      site: {
        title: 'Slide Spec',
        home_intro: 'Create and publish data-driven slide decks.',
        home_cta_label: 'View latest presentation',
        presentations_cta_label: 'All presentations',
        ...(input.githubDataSourceUrl
          ? {
              data_sources: [
                {
                  type: 'github',
                  url: input.githubDataSourceUrl,
                },
              ],
            }
          : {}),
        links,
      },
    }
  }

  public buildIndexEntry(
    input: InitPresentationContent,
    options: IndexEntryOptions,
  ): PresentationIndexEntry {
    return {
      id: input.presentationId,
      title: input.title,
      summary: input.summary,
      published: options.published,
      featured: options.featured,
      subtitle: input.subtitle ?? 'Replace with a subtitle before publishing.',
    }
  }

  public buildPresentationDocument(input: InitPresentationContent): PresentationDocument {
    const subtitle = input.subtitle ?? 'Replace with a subtitle before publishing.'

    return {
      presentation: {
        id: input.presentationId,
        title: input.title,
        subtitle,
        slides: [
          {
            template: 'hero',
            enabled: true,
            content: {
              title_primary: 'Project',
              title_accent: 'Updates',
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
            title: 'Recent Updates',
            content: {
              sections: [],
            },
          },
          {
            template: 'timeline',
            enabled: true,
            title: 'Releases',
            content: {
              featured_release_ids: [],
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
            title: 'Contributors',
            content: {
              spotlight: [],
            },
          },
          {
            template: 'metrics-and-links',
            enabled: true,
            title: 'Community Highlights',
            content: {
              stat_keys: [],
              mentions: [],
            },
          },
          {
            template: 'action-cards',
            enabled: true,
            title: 'How to Contribute',
            content: {
              cards: [],
            },
          },
          {
            template: 'closing',
            enabled: true,
            content: {
              heading: 'Thank you',
              message: 'See you next time.',
            },
          },
        ],
      },
    }
  }

  public buildGeneratedData(
    input: InitPresentationContent,
    previousPresentationId?: string,
  ): GeneratedPresentationData {
    return {
      id: input.presentationId,
      period: {
        start: input.period.start,
        end: input.period.end,
      },
      ...(previousPresentationId ? { previous_presentation_id: previousPresentationId } : {}),
      stats: {
        stars: {
          label: 'GitHub Stars',
          current: 0,
          previous: 0,
          delta: 0,
          metadata: {
            comparison_status: 'unavailable',
            warning_codes: ['placeholder_data'],
          },
        },
        issues_closed: {
          label: 'Issues closed',
          current: 0,
          previous: 0,
          delta: 0,
          metadata: {
            comparison_status: 'unavailable',
            warning_codes: ['placeholder_data'],
          },
        },
        prs_merged: {
          label: 'PRs Merged',
          current: 0,
          previous: 0,
          delta: 0,
          metadata: {
            comparison_status: 'unavailable',
            warning_codes: ['placeholder_data'],
          },
        },
        new_contributors: {
          label: 'New contributors',
          current: 0,
          previous: 0,
          delta: 0,
          metadata: {
            comparison_status: 'unavailable',
            warning_codes: ['placeholder_data'],
          },
        },
      },
      releases: [],
      contributors: {
        total: 0,
        authors: [],
      },
      merged_prs: [],
    }
  }
}
