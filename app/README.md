# Slide Spec app

This package is the Vue 3 + TypeScript presentation app for Slide Spec.

It renders authored slide content, reads generated data, and provides the responsive presentation experience used for local development and deployed static hosting.

Commands:

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run verify`
- `npm run coverage`
- `npm run e2e`
- `npm run a11y`
- `npm run demo:record`
- `npm run readme:gif`
- `npm run visual`
- `npm run validate:content`

Notes:

- `npm run visual` runs local Playwright screenshot baselines and is a required gate for UI/UX changes.
- `npm run a11y` runs the automated Playwright + axe accessibility audit and is a required gate for UI/UX changes.
- `npm run demo:record` drives a short Playwright walkthrough with `VITE_CONTENT_SOURCE=demo` (for local experiments).
- `npm run readme:gif` rebuilds `../assets/readme-demo.gif` using the docs reference fixture (`VITE_CONTENT_SOURCE=docs-reference`); requires `ffmpeg` on your `PATH`.
- Visual baseline files are stored locally and should not be committed.
- `verify` is the standard local gate before changing app/UI behavior.
- The app is static and expects authored/generated content from `content/`.
