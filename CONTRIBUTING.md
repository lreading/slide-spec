# Contributing to slide-spec

Keep changes focused and keep the gates green. This repo is split into a Vue app, a standalone CLI, and shared schema/validation code.

## Before You Open A PR

Run the relevant gates for what you changed.

For app/UI work:

- `cd app && npm run verify`
- `cd app && npm run coverage`
- `cd app && npm run e2e`
- `cd app && npm run a11y`
- `cd app && npm run visual`

For CLI work:

- `cd cli && npm run verify`
- `cd cli && npm run coverage`
- `cd cli && npm run semgrep`

For docs/legal work:

- update the relevant README or plan file
- run any package-level checks affected by the change

## Working Rules

- Keep TypeScript-only code in the implementation packages.
- Prefer small, reviewable commits.
- Commit updated visual baselines when a visual change is intentional and reviewed.
- Do not skip the automated accessibility audit for user-facing UI changes.
- Do not skip failing tests unless the corresponding behavior was removed.
- Keep documentation aligned with actual runtime behavior.
- Prefer explicit config over hidden defaults for user-facing behavior.

## Workflow Expectations

- Update the relevant plan document when you start or finish a phase.
- Keep the docs and README files accurate when behavior changes.
- If a change affects rendered output, treat screenshots and visual checks as part of the review.

## Security And Quality

This project is working toward stronger OpenSSF-style practices. Keep dependencies, scripts, and docs changes compatible with that direction, and avoid introducing unsupported security or compliance claims.

## Questions

If a change needs a policy or architecture decision, pause and ask before guessing.
