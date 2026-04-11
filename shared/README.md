# Slide Spec shared

Shared TypeScript types and validation used by the app and CLI. Covers content shapes, site config, template IDs, template checks, and small assertion helpers.

## Getting started

Node 24+ (same as the other packages). No dev server or build step.

1. Edit sources under `src/` as needed.
2. Run `npm install` if `node_modules/` is missing.
3. After changes, run `npm run verify`.

## Commands

| Command | Description |
| --- | --- |
| `npm run lint` | Lint shared TypeScript and config files |
| `npm run typecheck` | Type-check shared TypeScript |
| `npm run test` | Run shared unit tests |
| `npm run coverage` | Run unit tests with per-file 80% coverage thresholds |
| `npm run verify` | Standard local gate: lint, typecheck, and coverage |

## Quality gates

Run `npm run verify` in this package after touching shared code. If the shared change affects app or CLI behavior, also run the relevant consumer package gate.

## Notes

- No dependencies on other monorepo packages. Consumed by `../app` and `../cli`.
- Keep the surface small. If only one consumer needs something, keep it in that consumer.
- Not independently published. The CLI release on npm bundles whatever shared code the build pulls in.
