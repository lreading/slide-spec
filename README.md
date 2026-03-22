# slide-spec

[![Apache-2.0](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/code-TypeScript-3178c6.svg)](https://www.typescriptlang.org/)
[![Vue 3](https://img.shields.io/badge/ui-Vue%203-42b883.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/build-Vite-646cff.svg)](https://vite.dev/)
[![Vitest](https://img.shields.io/badge/tests-Vitest-6e9f18.svg)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/e2e-Playwright-2ead33.svg)](https://playwright.dev/)
[![Accessibility](https://img.shields.io/badge/accessibility-automated%20audit%20passing-2ea44f.svg)](./docs/meta/accessibility.md)

slide-spec is a data-driven slide system for community updates, roadmap reviews, and other recurring presentation decks.

It is built around three ideas:
- authored YAML is the source of truth
- generated data comes from scripts and CLI fetches
- the app stays static so it can be deployed anywhere without a backend

Start here:
- docs: [docs/](./docs/)
- quickstart: [docs/quickstart.md](./docs/quickstart.md)
- app guide: [app/README.md](./app/README.md)
- CLI guide: [cli/README.md](./cli/README.md)

## Project Layout

- `app/`: Vue 3 presentation app and local dev server
- `cli/`: standalone authoring CLI for init, fetch, build, serve, and validate
- `shared/`: shared types and validation used by both app and CLI
- `content/`: authored presentation data and generated outputs
- `docs/`: VitePress docs site
- `agents/`: implementation plans and work tracking

## Quickstart

If you want to see the UI right away:

1. `cd app`
2. `npm install`
3. `npm run dev`

If you want to work on the authoring flow:

1. `cd cli`
2. `npm install`
3. `npm run verify`
4. `npm run build`

For the CLI usage and project-root workflow, see [cli/README.md](./cli/README.md).
For the app commands and visual-regression gate, see [app/README.md](./app/README.md).
For shared schema/validation helpers, see [shared/README.md](./shared/README.md).

## Quality Gates

- `cd app && npm run verify`
- `cd app && npm run coverage`
- `cd app && npm run e2e`
- `cd app && npm run a11y`
- `cd app && npm run visual`
- `cd cli && npm run verify`
- `cd cli && npm run coverage`

## Content Model

- `content/site.yaml`: site-wide branding, links, and UX copy
- `content/presentations/index.yaml`: presentation registry
- `content/presentations/<id>/presentation.yaml`: authored slides and template content
- `content/presentations/<id>/generated.yaml`: fetched/generated data

The docs site under `docs/` is the long-form reference for schema, templates, connectors, and CLI usage.
