# Slide Spec shared

Shared TypeScript types and validation used by the app and CLI. Covers content shapes, site config, template IDs, template checks, and small assertion helpers.

## Getting started

Node 24+ and pnpm. No dev server.

1. Edit sources under `src/` as needed.
2. From the repo root, `pnpm install`.
3. After changes, run `pnpm --filter @slide-spec/shared verify`.

## Commands

| Command | Description |
| --- | --- |
| `pnpm --filter @slide-spec/shared lint` | Lint shared TypeScript and config files |
| `pnpm --filter @slide-spec/shared typecheck` | Type-check shared TypeScript |
| `pnpm --filter @slide-spec/shared test` | Run shared unit tests |
| `pnpm --filter @slide-spec/shared coverage` | Run unit tests with coverage |
| `pnpm --filter @slide-spec/shared verify` | Standard package gate |

## Quality gates

Run `pnpm --filter @slide-spec/shared verify` after touching shared code. If the change affects app or CLI behavior, also run the relevant consumer gate.

## Notes

- No dependencies on other monorepo packages. Consumed by `../app` and `../cli`.
- Keep the surface small. If only one consumer needs something, keep it in that consumer.
- Not independently published. The CLI release on npm bundles whatever shared code the build pulls in.
