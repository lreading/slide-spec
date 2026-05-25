import { describe, expect, it } from 'vitest'

import { validateTemplateSlide } from './validation'

describe('template validation', () => {
  it('accepts every supported template shape', () => {
    const validSlides = {
      hero: { content: { title_primary: 'Slide', title_accent: 'Spec' } },
      'section-title': {
        content: {
          title: 'Platform Security',
          subtitle: 'Compliance and governance update',
          image_url: 'content/assets/security-shield.svg',
          image_alt: 'Shield icon',
        },
      },
      agenda: { title: 'Agenda', content: { card_arrow_fa_icon: 'fa-chevron-right' } },
      'section-list-grid': {
        title: 'Sections',
        content: { sections: [{ title: 'One', bullets: ['A'], fa_icon: 'fa-star' }] },
      },
      timeline: {
        title: 'Timeline',
        content: {
          latest_badge_label: 'Latest',
          footer_link_label: 'All releases',
          empty_state_title: 'No releases',
          empty_state_message: 'Nothing yet',
          latest_release_fa_icon: 'fa-tag',
          release_fa_icon: 'fa-code-branch',
          footer_link_fa_icon: 'fa-brands fa-github',
          featured_release_ids: ['v1'],
        },
      },
      'progress-timeline': {
        title: 'Progress',
        content: {
          stage: 'planned',
          deliverables_heading: 'Deliverables',
          focus_areas_heading: 'Focus',
          footer_link_label: 'Roadmap',
          item_fa_icon: 'fa-chevron-right',
          focus_areas_fa_icon: 'fa-bullseye',
          theme_fa_icon: 'fa-check',
          footer_link_fa_icon: 'fa-github',
          stages: {
            completed: { label: 'Done', summary: 'Completed work' },
            'in-progress': { label: 'Now', summary: 'Current work' },
            planned: { label: 'Next', summary: 'Planned work' },
            future: { label: 'Later', summary: 'Future work' },
          },
          items: ['Ship it'],
          themes: [{ category: 'Quality', target: 'Keep gates green' }],
        },
      },
      people: {
        title: 'People',
        content: {
          banner_prefix: 'Thanks',
          contributors_link_label: 'Contributors',
          banner_suffix: 'team',
          github_fa_icon: 'fa-github',
          quote_fa_icon: 'fa-quote-left',
          banner_fa_icon: 'fa-heart',
          spotlight: [{ login: 'octocat', summary: 'Shipped a fix', fa_icon: 'fa-user-astronaut' }],
        },
      },
      'metrics-and-links': {
        title: 'Metrics',
        content: {
          section_heading: 'Mentions',
          stats_heading: 'Stats',
          show_deltas: true,
          trend_suffix: 'from last period',
          section_heading_fa_icon: 'fa-bullhorn',
          stats_heading_fa_icon: 'fa-chart-line',
          stat_fa_icons: ['fa-star'],
          trend_up_fa_icon: 'fa-arrow-up',
          trend_down_fa_icon: 'fa-arrow-down',
          stat_keys: ['stars'],
          mentions: [{
            type: 'release',
            title: 'v1',
            url_label: 'Read',
            url: 'https://example.test',
            fa_icon: 'fa-rss',
            link_fa_icon: 'fa-external-link-alt',
          }],
        },
      },
      'image-and-bullets': {
        title: 'Highlights',
        content: {
          image_side: 'left',
          image: {
            src: '/assets/highlights.png',
            alt: 'Dashboard summary screenshot',
            description: 'Q1 rollout summary',
          },
          bullets: ['One', 'Two'],
        },
      },
      'action-cards': {
        title: 'Actions',
        content: {
          footer_text: 'Get involved',
          footer_fa_icon: 'fa-github',
          footer_link_fa_icon: 'fa-code',
          cards: [{
            title: 'Try it',
            description: 'Run the CLI',
            url_label: 'Docs',
            url: 'https://example.test',
            fa_icon: 'fa-bug',
            link_fa_icon: 'fa-arrow-right',
          }],
        },
      },
      closing: {
        content: {
          heading: 'Thanks',
          message: 'Questions?',
          quote: 'Ship clear slides.',
          repository_fa_icon: 'fa-github',
          docs_fa_icon: 'fa-book',
          community_fa_icon: 'fa-shield-alt',
        },
      },
    } as const

    for (const [templateId, slide] of Object.entries(validSlides)) {
      expect(() => validateTemplateSlide(templateId as keyof typeof validSlides, slide, `slides.${templateId}`)).not.toThrow()
    }
  })

  it('rejects invalid template content', () => {
    expect(() =>
      validateTemplateSlide('section-title', { content: { subtitle: 'Only subtitle' } }, 'slides[0]'),
    ).toThrow('slides[0].content.title must be a string.')
    expect(() =>
      validateTemplateSlide('section-title', { content: { title: 'Title', image_alt: 'Only alt' } }, 'slides[0]'),
    ).toThrow('slides[0].content.image_alt requires slides[0].content.image_url.')
    expect(() =>
      validateTemplateSlide('hero', { content: { subtitle_prefix: 'Only subtitle' } }, 'slides[0]'),
    ).toThrow('slides[0].content must include title_primary or title_accent.')
    expect(() =>
      validateTemplateSlide('section-title', { content: { title: 'Title', subtitle: 'Support' } }, 'slides[0]'),
    ).not.toThrow()
    expect(() =>
      validateTemplateSlide('progress-timeline', { title: 'Progress', content: { stage: 'blocked' } }, 'slides[1]'),
    ).toThrow('slides[1].content.stage must be one of completed, in-progress, planned, or future.')
    expect(() =>
      validateTemplateSlide('metrics-and-links', { title: 'Metrics', content: { stat_keys: [], mentions: [{ type: 'post', title: 'Post', url: 'https://example.test' }] } }, 'slides[2]'),
    ).toThrow('slides[2].content.mentions[0] must provide url and url_label together.')
    expect(() =>
      validateTemplateSlide('metrics-and-links', { title: 'Metrics', content: { stat_keys: [], mentions: [{ type: 'post', title: 'Post' }] } }, 'slides[3]'),
    ).not.toThrow()
    expect(() =>
      validateTemplateSlide('image-and-bullets', { title: 'Highlights', content: { image_side: 'center', bullets: ['One'] } }, 'slides[4]'),
    ).toThrow('slides[4].content.image_side must be left or right.')
    expect(() =>
      validateTemplateSlide('image-and-bullets', { title: 'Highlights', content: {} }, 'slides[5]'),
    ).toThrow('slides[5].content must include image or bullets.')
    expect(() =>
      validateTemplateSlide('image-and-bullets', { title: 'Highlights', content: { bullets: [] } }, 'slides[6]'),
    ).toThrow('slides[6].content.bullets must include at least one item.')
    expect(() =>
      validateTemplateSlide('agenda', { title: 'Agenda', content: { card_arrow_fa_icon: 'fa-nope' } }, 'slides[7]'),
    ).toThrow('slides[7].content.card_arrow_fa_icon must be a supported Font Awesome icon.')
  })
})
