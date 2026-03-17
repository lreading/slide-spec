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

export interface InitPresentationContent {
  presentationId: string
  title: string
  subtitle: string
  summary: string
  period: ReportingPeriod
}

export class InitPresentationBuilder {
  public buildIndexEntry(input: InitPresentationContent): PresentationIndexEntry {
    return {
      id: input.presentationId,
      title: input.title,
      subtitle: input.subtitle,
      summary: input.summary,
      published: false,
      featured: false,
    }
  }

  public buildPresentationDocument(input: InitPresentationContent): PresentationDocument {
    return {
      presentation: {
        id: input.presentationId,
        title: input.title,
        subtitle: input.subtitle,
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
            content: {},
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
