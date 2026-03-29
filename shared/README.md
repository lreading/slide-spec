# Slide Spec shared

Shared TypeScript types and validation used by the app and CLI. Covers content shapes, site config, template IDs, template checks, and small assertion helpers.

## Getting started

Node 24+ (same as the other packages). No dev server or build step.

1. Edit sources under `src/` as needed.
2. After changes, run `npm run verify` in `../app` and `../cli`.

## Commands

No package scripts. Behavior is exercised through `app/` and `cli/`.

## Quality gates

Run `npm run verify` in both `../app` and `../cli` after you touch this package.

## Notes

- No dependencies on other monorepo packages. Consumed by `../app` and `../cli`.
- Keep the surface small. If only one consumer needs something, keep it in that consumer.
- Not independently published. The CLI release on npm bundles whatever shared code the build pulls in.
