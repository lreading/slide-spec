export interface DocumentationResource {
  path: string
  title: string
  description: string
}

export interface DocumentationSection {
  title: string
  resources: DocumentationResource[]
}

export const documentationSections: DocumentationSection[] = [
  {
    title: 'Getting Started',
    resources: [
      {
        path: '/',
        title: 'Slide Spec overview',
        description: 'Product overview, core value proposition, and entry points into the docs.',
      },
      {
        path: '/quickstart',
        title: 'Quickstart',
        description: 'Recommended first path from install through init, validate, build, serve, and optional fetch.',
      },
      {
        path: '/concepts',
        title: 'Concepts',
        description: 'Core mental model for content structure, template-driven slides, generated data, and validation.',
      },
    ],
  },
  {
    title: 'Schema Reference',
    resources: [
      {
        path: '/schema/',
        title: 'Schema overview',
        description: 'Explains how site.yaml, presentations/index.yaml, presentation.yaml, and generated.yaml fit together.',
      },
      {
        path: '/schema/site',
        title: 'site.yaml schema',
        description: 'Global branding, navigation labels, external links, and site-level configuration.',
      },
      {
        path: '/schema/presentations-index',
        title: 'presentations/index.yaml schema',
        description: 'Presentation catalog, publish state, featured flags, and file path references.',
      },
      {
        path: '/schema/presentation',
        title: 'presentation.yaml schema',
        description: 'Slide definitions, template ids, authored slide content, and presentation metadata.',
      },
      {
        path: '/schema/generated',
        title: 'generated.yaml schema',
        description: 'Generated or manually authored metrics, releases, contributors, and other computed content.',
      },
    ],
  },
  {
    title: 'Templates',
    resources: [
      {
        path: '/templates/',
        title: 'Template index',
        description: 'Summary of every built-in slide template and how template validation works.',
      },
      {
        path: '/templates/hero',
        title: 'Hero template',
        description: 'Opening slide for project identity, title framing, and top-level messaging.',
      },
      {
        path: '/templates/agenda',
        title: 'Agenda template',
        description: 'Auto-generated table of contents slide driven by the presentation structure.',
      },
      {
        path: '/templates/section-list-grid',
        title: 'Section list grid template',
        description: 'Grid layout for grouped lists, themes, or workstream summaries.',
      },
      {
        path: '/templates/timeline',
        title: 'Timeline template',
        description: 'Release or milestone cards sourced from generated data.',
      },
      {
        path: '/templates/progress-timeline',
        title: 'Progress timeline template',
        description: 'Self-contained staged progress slide authored directly in presentation content.',
      },
      {
        path: '/templates/people',
        title: 'People template',
        description: 'Contributor or team spotlight slide for profiles, roles, and recognition.',
      },
      {
        path: '/templates/metrics-and-links',
        title: 'Metrics and links template',
        description: 'Metric tiles plus linked references for status reporting and supporting resources.',
      },
      {
        path: '/templates/action-cards',
        title: 'Action cards template',
        description: 'Call-to-action card grid for follow-ups, asks, or next-step links.',
      },
      {
        path: '/templates/closing',
        title: 'Closing template',
        description: 'Final slide for wrap-up messaging and outbound links.',
      },
    ],
  },
  {
    title: 'CLI',
    resources: [
      {
        path: '/cli/',
        title: 'CLI overview',
        description: 'Command-line workflow and the relationship between init, validate, fetch, build, and serve.',
      },
      {
        path: '/cli/init',
        title: 'init command',
        description: 'Scaffolds a new Slide Spec project with starter content.',
      },
      {
        path: '/cli/fetch',
        title: 'fetch command',
        description: 'Populates generated.yaml from configured connectors, currently GitHub-backed.',
      },
      {
        path: '/cli/build',
        title: 'build command',
        description: 'Produces the static site output.',
      },
      {
        path: '/cli/serve',
        title: 'serve command',
        description: 'Builds and serves the site locally for preview.',
      },
      {
        path: '/cli/validate',
        title: 'validate command',
        description: 'Runs strict schema and template validation against the project content.',
      },
    ],
  },
  {
    title: 'Connectors',
    resources: [
      {
        path: '/connectors/',
        title: 'Connectors overview',
        description: 'How connectors feed generated.yaml and where external data enters the project.',
      },
      {
        path: '/connectors/github',
        title: 'GitHub connector',
        description: 'Explains the GitHub-backed data source used by fetch and generated.yaml.',
      },
    ],
  },
  {
    title: 'Examples',
    resources: [
      {
        path: '/examples/',
        title: 'Examples index',
        description: 'Overview of the included example projects and how to choose among them.',
      },
      {
        path: '/examples/open-source-update',
        title: 'Open source update example',
        description: 'Quarterly community-update style project with releases, contributors, and roadmap data.',
      },
      {
        path: '/examples/product-review',
        title: 'Product review example',
        description: 'Product-management reporting example focused on milestones, initiatives, and customer themes.',
      },
      {
        path: '/examples/security-posture',
        title: 'Security posture example',
        description: 'Security-reporting example for vulnerabilities, patch status, and compliance metrics.',
      },
      {
        path: '/examples/community-update',
        title: 'Community update example',
        description: 'Community and DevRel example for engagement metrics, events, and highlights.',
      },
      {
        path: '/examples/tutorial-example',
        title: 'Tutorial example',
        description: 'Step-by-step walkthrough aligned with the reference project fixture.',
      },
      {
        path: '/examples/manual-data-example',
        title: 'Manual data example',
        description: 'Example project that authors generated.yaml by hand without a connector.',
      },
    ],
  },
  {
    title: 'Meta',
    resources: [
      {
        path: '/meta/',
        title: 'Meta index',
        description: 'Index of documentation policies, publishing notes, and support guidance.',
      },
      {
        path: '/meta/accessibility',
        title: 'Accessibility notes',
        description: 'Accessibility goals, test coverage, and current expectations for the docs and app.',
      },
      {
        path: '/meta/ai',
        title: 'AI usage notes',
        description: 'Guidance for tools consuming these docs, including stable entry points and common pitfalls.',
      },
      {
        path: '/meta/agent-assistance',
        title: 'Agent assistance policy',
        description: 'How maintainers expect coding agents to work with the repository and generated content.',
      },
      {
        path: '/meta/supply-chain',
        title: 'Supply chain notes',
        description: 'Dependency, provenance, and release-process notes relevant to implementation work.',
      },
      {
        path: '/meta/cloudflare-pages',
        title: 'Cloudflare Pages deployment guide',
        description: 'Recommended deployment model for static Slide Spec sites built from committed source.',
      },
    ],
  },
]

export const documentationPaths = documentationSections.flatMap((section) =>
  section.resources.map((resource) => resource.path),
)
