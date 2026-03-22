import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'slide-spec',
  description: 'Declarative presentation docs for YAML-driven slides, GitHub data, and reusable templates.',
  cleanUrls: true,
  lastUpdated: false,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quickstart', link: '/quickstart' },
      { text: 'Schema', link: '/schema/' },
      { text: 'Templates', link: '/templates/' },
      { text: 'CLI', link: '/cli/' },
      { text: 'Connectors', link: '/connectors/github' },
      { text: 'Examples', link: '/examples/happy-path' },
      { text: 'Meta', link: '/meta/' },
      { text: 'Contributing', link: '/contributing' },
    ],
    sidebar: {
      '/schema/': [
        {
          text: 'Schema',
          items: [
            { text: 'Overview', link: '/schema/' },
            { text: 'Site', link: '/schema/site' },
            { text: 'Presentations Index', link: '/schema/presentations-index' },
            { text: 'Presentation', link: '/schema/presentation' },
            { text: 'Generated', link: '/schema/generated' },
          ],
        },
      ],
      '/templates/': [
        {
          text: 'Templates',
          items: [
            { text: 'Overview', link: '/templates/' },
            { text: 'Hero', link: '/templates/hero' },
            { text: 'Agenda', link: '/templates/agenda' },
            { text: 'Section List Grid', link: '/templates/section-list-grid' },
            { text: 'Timeline', link: '/templates/timeline' },
            { text: 'Progress Timeline', link: '/templates/progress-timeline' },
            { text: 'People', link: '/templates/people' },
            { text: 'Metrics and Links', link: '/templates/metrics-and-links' },
            { text: 'Action Cards', link: '/templates/action-cards' },
            { text: 'Closing', link: '/templates/closing' },
          ],
        },
      ],
      '/cli/': [
        {
          text: 'CLI',
          items: [
            { text: 'Overview', link: '/cli/' },
            { text: 'Init', link: '/cli/init' },
            { text: 'Fetch', link: '/cli/fetch' },
            { text: 'Build', link: '/cli/build' },
            { text: 'Serve', link: '/cli/serve' },
            { text: 'Validate', link: '/cli/validate' },
          ],
        },
      ],
      '/connectors/': [
        {
          text: 'Connectors',
          items: [{ text: 'GitHub', link: '/connectors/github' }],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [{ text: 'Happy Path', link: '/examples/happy-path' }],
        },
      ],
      '/meta/': [
        {
          text: 'Meta',
          items: [
            { text: 'Overview', link: '/meta/' },
            { text: 'Accessibility', link: '/meta/accessibility' },
            { text: 'AI-Friendly Docs', link: '/meta/ai' },
            { text: 'Supply Chain', link: '/meta/supply-chain' },
            { text: 'Agent Help', link: '/meta/agent-assistance' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/lreading/slide-spec' }],
    outline: { level: [2, 3] },
  },
})
