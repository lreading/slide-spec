# slide-spec app

This package is the Vue 3 + TypeScript presentation app.

It renders authored slide content, reads generated data, and provides the responsive presentation experience used for local development and deployed static hosting.

Commands:

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run verify`
- `npm run coverage`
- `npm run e2e`
- `npm run a11y`
- `npm run visual`
- `npm run validate:content`

Notes:

- `npm run visual` runs local Playwright screenshot baselines.
- `npm run a11y` runs the automated Playwright + axe accessibility audit.
- Visual baseline files are stored locally and should not be committed.
- `verify` is the standard local gate before changing app/UI behavior.
