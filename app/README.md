# Slide Spec app

Vue 3 + Vite + TypeScript renderer for Slide Spec. It loads YAML content and outputs a responsive slide deck as a static site. This is the visual layer of the monorepo.

## Getting started

1. Node 24+ and npm. Browser tests also need `npx playwright install chromium`.
2. From this directory, `npm install`
3. `npm run dev`

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm run verify` | Standard local gate (lint + typecheck + unit tests) |
| `npm run coverage` | Unit tests with coverage |
| `npm run e2e` | Playwright end-to-end tests |
| `npm run a11y` | Playwright + axe accessibility audit |
| `npm run visual` | Playwright screenshot baseline comparison |
| `npm run validate:content` | Validate YAML content |
| `npm run demo:record` | Record a Playwright walkthrough (`VITE_CONTENT_SOURCE=demo`) |
| `npm run readme:video` | Rebuild the root README demo video (needs `ffmpeg`) |

## Quality gates

`npm run verify` is the default before you push. For UI work, also run `npm run visual` and `npm run a11y`. All of these run in CI via GitHub Actions.

## Notes

- Uses `../shared` for content types and validation.
- Visual baseline screenshots are local only and should not be committed.
- The app reads YAML from `content/`, or from test fixtures via `VITE_CONTENT_SOURCE`.
- `readme:video` uses the docs-reference fixture and needs `ffmpeg`.
- Not published to npm. The CLI builds sites that this app renders.
