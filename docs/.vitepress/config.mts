import { defineConfig } from 'vitepress'

export default defineConfig({
  markdown: {
    theme: {
      light: 'github-light-high-contrast',
      dark: 'github-dark-high-contrast',
    },
  },
  title: 'slide-spec',
  description: 'Declarative presentation docs for YAML-driven slides, GitHub data, and reusable templates.',
  cleanUrls: true,
  lastUpdated: false,
  head: [
    ['meta', { name: 'theme-color', content: '#1e1e2e' }],
    ['meta', { property: 'og:title', content: 'slide-spec documentation' }],
    ['meta', { property: 'og:description', content: 'YAML-first static presentation documentation for slide-spec.' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://slide-spec.dev/' }],
    ['meta', { property: 'og:image', content: 'https://slide-spec.dev/screenshots/home-reference.png' }],
    ['link', { rel: 'canonical', href: 'https://slide-spec.dev/' }],
  ],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quickstart', link: '/quickstart' },
      { text: 'Schema', link: '/schema/' },
      { text: 'Templates', link: '/templates/' },
      { text: 'CLI', link: '/cli/' },
      { text: 'Connectors', link: '/connectors/github' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Meta', link: '/meta/' },
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
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Tutorial Example', link: '/examples/tutorial-example' },
            { text: 'Manual Data Example', link: '/examples/manual-data-example' },
          ],
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
