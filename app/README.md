# Slide Spec app

Vue 3 + Vite + TypeScript renderer for Slide Spec. It loads YAML content and outputs a responsive slide deck as a static site. This is the visual layer of the monorepo.

## Getting started

1. Node 24+ and pnpm.
2. From the repo root, `pnpm install`.
3. `pnpm --filter @slide-spec/app dev`

## Commands

| Command | Description |
| --- | --- |
| `pnpm --filter @slide-spec/app dev` | Start local dev server |
| `pnpm --filter @slide-spec/app build` | Production build |
| `pnpm --filter @slide-spec/app verify` | Standard local gate |
| `pnpm --filter @slide-spec/app coverage` | Unit tests with coverage |
| `pnpm --filter @slide-spec/app e2e` | Playwright end-to-end tests |
| `pnpm --filter @slide-spec/app a11y` | Playwright + axe accessibility audit |
| `pnpm --filter @slide-spec/app visual` | Playwright screenshot baseline comparison |
| `pnpm --filter @slide-spec/app validate:content` | Validate YAML content |
| `pnpm --filter @slide-spec/app demo:record` | Record a Playwright walkthrough (`VITE_CONTENT_SOURCE=demo`) |
| `pnpm --filter @slide-spec/app readme:video` | Rebuild the root README demo video (needs `ffmpeg`) |

## Quality gates

`pnpm --filter @slide-spec/app verify` is the package gate. For UI work, also run `visual` and `a11y`. CI runs both.

## Notes

- Uses `../shared` for content types and validation.
- Visual baseline screenshots are local only and should not be committed.
- The app reads YAML from `content/`, or from test fixtures via `VITE_CONTENT_SOURCE`.
- `readme:video` uses the docs-reference fixture and needs `ffmpeg`.
- Not published to npm. The CLI builds sites that this app renders.
