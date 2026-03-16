import type {
  GeneratedPresentationData,
  PresentationIndexEntry,
  QuarterWindow,
} from '../generation/Generation.types'

export interface PresentationDocument {
  presentation: {
    id: string
    year: number
    quarter: number
    title: string
    subtitle: string
    slides: Array<Record<string, unknown>>
  }
}

export class InitPresentationBuilder {
  public buildIndexEntry(quarterWindow: QuarterWindow): PresentationIndexEntry {
    return {
      id: quarterWindow.presentationId,
      year: quarterWindow.year,
      quarter: quarterWindow.quarter,
      title: 'Quarterly Community Update',
      subtitle: `Q${quarterWindow.quarter} ${quarterWindow.year}`,
      summary: 'Replace with a summary before publishing.',
      published: false,
      featured: false,
    }
  }

  public buildPresentationDocument(quarterWindow: QuarterWindow): PresentationDocument {
    return {
      presentation: {
        id: quarterWindow.presentationId,
        year: quarterWindow.year,
        quarter: quarterWindow.quarter,
        title: 'Quarterly Community Update',
        subtitle: `Q${quarterWindow.quarter} ${quarterWindow.year}`,
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
    quarterWindow: QuarterWindow,
    previousPresentationId?: string,
  ): GeneratedPresentationData {
    return {
      id: quarterWindow.presentationId,
      period: {
        start: quarterWindow.start,
        end: quarterWindow.end,
      },
      ...(previousPresentationId ? { previous_presentation_id: previousPresentationId } : {}),
      stats: {
        stars: {
          label: 'GitHub Stars',
          current: 0,
          previous: 0,
          delta: 0,
        },
        issues_closed: {
          label: 'Issues closed',
          current: 0,
          previous: 0,
          delta: 0,
        },
        prs_merged: {
          label: 'PRs Merged',
          current: 0,
          previous: 0,
          delta: 0,
        },
        new_contributors: {
          label: 'New contributors',
          current: 0,
          previous: 0,
          delta: 0,
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
