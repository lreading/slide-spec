import { defineConfig } from 'vitepress'

const siteUrl = (process.env.DOCS_SITE_URL ?? 'https://docs.slide-spec.dev').replace(/\/$/, '')

export default defineConfig({
  markdown: {
    theme: {
      light: 'github-light-high-contrast',
      dark: 'github-dark-high-contrast',
    },
  },
  title: 'Slide Spec',
  description: 'Open source, YAML-driven slide decks with connectors, templates, and static builds.',
  cleanUrls: true,
  lastUpdated: false,
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#1e1e2e' }],
    ['meta', { property: 'og:title', content: 'Slide Spec documentation' }],
    ['meta', { property: 'og:description', content: 'Open source, YAML-driven slide decks with connectors, templates, and static builds.' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: `${siteUrl}/` }],
    ['meta', { property: 'og:image', content: `${siteUrl}/screenshots/home-reference.png` }],
    ['link', { rel: 'canonical', href: `${siteUrl}/` }],
  ],
  themeConfig: {
    search: {
      provider: 'local',
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quickstart', link: '/quickstart' },
      { text: 'Concepts', link: '/concepts' },
      { text: 'Schema', link: '/schema/', activeMatch: '^/schema' },
      { text: 'Templates', link: '/templates/', activeMatch: '^/templates' },
      { text: 'CLI', link: '/cli/', activeMatch: '^/cli' },
      { text: 'Connectors', link: '/connectors/', activeMatch: '^/connectors' },
      { text: 'Examples', link: '/examples/', activeMatch: '^/examples' },
      { text: 'Meta', link: '/meta/', activeMatch: '^/meta' },
    ],
    sidebar: {
      '/schema/': [
        {
          text: 'Schema',
          items: [
            { text: 'Overview', link: '/schema/' },
            { text: 'site.yaml', link: '/schema/site' },
            { text: 'presentations/index.yaml', link: '/schema/presentations-index' },
            { text: 'presentation.yaml', link: '/schema/presentation' },
            { text: 'generated.yaml', link: '/schema/generated' },
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
            { text: 'init', link: '/cli/init' },
            { text: 'validate', link: '/cli/validate' },
            { text: 'fetch', link: '/cli/fetch' },
            { text: 'build', link: '/cli/build' },
            { text: 'serve', link: '/cli/serve' },
          ],
        },
      ],
      '/connectors/': [
        {
          text: 'Connectors',
          items: [
            { text: 'Overview', link: '/connectors/' },
            { text: 'GitHub', link: '/connectors/github' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Open Source Update', link: '/examples/open-source-update' },
            { text: 'Product Review', link: '/examples/product-review' },
            { text: 'Security Posture', link: '/examples/security-posture' },
            { text: 'Community Update', link: '/examples/community-update' },
            { text: 'Tutorial', link: '/examples/tutorial-example' },
            { text: 'Manual Data', link: '/examples/manual-data-example' },
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
            { text: 'SBOM', link: '/meta/sbom' },
            { text: 'Supply Chain', link: '/meta/supply-chain' },
            { text: 'Agent Assistance', link: '/meta/agent-assistance' },
            { text: 'Cloudflare Pages', link: '/meta/cloudflare-pages' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/lreading/slide-spec' }],
    outline: { level: [2, 3] },
  },
})
