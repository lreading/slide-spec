# AGENTS.md

This file is the repo-level operating contract for coding agents working in Slide Spec.

Agents must also follow [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md). Use this file for agent-specific operating rules and use the contributing guide for the human-facing workflow and expectations.

## Project overview

Slide Spec is a TypeScript-first monorepo for authoring presentations from YAML-driven content and generating static slide sites, docs, and CLI workflows.

The core audience is comfortable with source control, static sites, and YAML data files. Optimize for clarity, explicit configuration, predictable behavior, and secure defaults.

## Repo map

- `app/`: Vue 3 application, static site output, content validation, unit/e2e/a11y/visual testing
- `cli/`: published TypeScript CLI
- `docs/`: VitePress documentation site and docs accessibility checks
- `shared/`: shared TypeScript code
- `content/`, `examples/`, `slides/`: authored content, examples, and slide assets

## Core principles

- Prefer explicit configuration over convention. Avoid hidden behavior and magic defaults.
- Default behavior must be secure and should fit the common case.
- The tool must stay easy to use and easy to understand.
- Accessibility is a first-class feature, not a polish pass.
- All features must be documented. CLI help is necessary but not sufficient.
- Every option, property, command, and user-visible behavior must be explicitly documented.
- Avoid breaking changes. Treat compatibility as a semver concern.
- Consistency with existing architecture is more important than cleverness or saving a few lines.

## Code rules

- Use TypeScript, not JavaScript, for repo code changes.
- Prefer classes over free functions when introducing new non-Vue modules, unless the surrounding code clearly uses a different established pattern.
- Vue 3 single-file components are the exception: follow idiomatic Vue composition patterns there.
- Keep names explicit and descriptive. Optimize for human and agent legibility.
- Keep functions and classes single-purpose.
- Apply DRY when the same logic appears more than twice.
- Most files should stay under 200 lines. If a file needs to exceed that, stop and ask for approval unless there is a strong, demonstrated reason not to split it.
- Avoid unnecessary comments. Only explain unusual constraints, tricky logic, or non-obvious decisions.
- Favor explicit side-effect boundaries and small, testable modules.

## Documentation rules

- If behavior changes, update documentation in the same task.
- If schema, config, CLI flags, generated data, templates, or connector behavior change, update the relevant docs and examples before calling the work complete.
- If the YAML schema changes, update the public JSON Schema files, schema tests, docs, examples, and scaffolded templates in the same task.
- Do not leave placeholder copy, TODO-style public docs, or undocumented options.
- Keep README, package READMEs, docs pages, examples, and CLI help aligned.
- Keep `AGENTS.md`, `CONTRIBUTING.md`, and `CODE_OF_CONDUCT.md` aligned when shared expectations change.
- When docs and code disagree, fix the mismatch rather than documenting around it.
- Keep language concise, clear, and direct.

## Testing rules

- Work is not complete until the full reusable quality workflow is expected to pass. Do not treat a change as done while any repo quality gate is failing.
- Coverage must meet declared thresholds. Current repo thresholds are 80% statements, branches, functions, and lines, enforced per file in `app/`, `cli/`, and `shared/`.
- Prefer one assertion per test when practical.
- Unit tests must isolate one unit of work and mock external dependencies.
- Do not test third-party code in unit tests.
- Add or update e2e tests for user-facing behavior that needs end-to-end confidence.
- Add or update visual regression tests for new pages, templates, or materially changed visual features.
- Never update visual baselines without explicit human permission. Stop and ask first.
- For regressions, prefer adding a failing test first, then fix to green.

## Quality gates

- The source of truth for CI gates is [`.github/workflows/reusable-quality.yml`](./.github/workflows/reusable-quality.yml).
- For PR-ready work, the expectation is that every gate in that workflow passes.
- Install once from the repo root with `pnpm install --frozen-lockfile`.
- Prefer the root quality gates as your local starting point:
  - `pnpm verify`
  - `pnpm verify:ci`
- For focused package checks, use workspace filters:
  - `pnpm --filter @slide-spec/app verify`
  - `pnpm --filter @slide-spec/cli verify`
  - `pnpm --filter @slide-spec/shared verify`
  - `pnpm --filter @slide-spec/docs verify`
- Run any additional commands needed to cover gates that are not included in those scripts.

Before handoff, run every local command needed to give high confidence that the full workflow will pass. If you cannot run a required gate locally, say exactly what was not run and why.

## Dependency management

- Use pnpm from the repo root.
- Add package dependency: `pnpm --filter @slide-spec/app add <package>`.
- Add package dev dependency: `pnpm --filter @slide-spec/app add -D <package>`.
- Add dependency to every workspace package: `pnpm --filter '@slide-spec/*' add <package>`.
- Add root-only tooling: `pnpm add -w -D <package>`.
- Update catalog version: `pnpm -r update <package> --latest`.
- Let pnpm update package manifests, `pnpm-workspace.yaml`, and `pnpm-lock.yaml`.
- Do not bypass the 10-day minimum release age unless a human explicitly approves an urgent security exception.
- For an approved release-age exception, add an exact `minimumReleaseAgeExclude` entry, run the normal add/update command, then run `pnpm verify`.

## Package-specific expectations

### `app/`

- Respect existing Vue 3 and Playwright patterns.
- Any user-visible UI change should trigger review of unit, e2e, a11y, and visual coverage.
- Treat accessibility, deterministic output, and static-site generation as release-quality requirements.
- When adding or changing app routes, update static route entrypoint generation, `sitemap.xml`/`llms.txt` behavior, and route/deep-link tests in the same change.

### `cli/`

- Preserve semver unless the human explicitly approves a breaking change.
- Keep command help, examples, docs, and generated templates in sync with implementation.
- For connector or generated-data changes, update docs and examples in the same task.

### `docs/`

- Docs are product surface, not an afterthought.
- New features or options should land with user-facing documentation.
- Keep docs examples truthful and executable where possible.

### `shared/`

- Keep shared code small, explicit, and stable.
- Avoid leaking package-specific assumptions into shared abstractions.
- Run `pnpm --filter @slide-spec/shared verify` after changing shared code; this package has its own lint, typecheck, and per-file coverage gates.

## Agent behavior

- Never commit, push, or publish. That is for the human developer.
- Do not make risky assumptions. Ask when a requirement is ambiguous and the wrong choice could cause churn or regressions.
- Do not blindly agree with a weak technical direction. Push back with concrete reasoning, then follow the human's final decision.
- Understand the relevant architecture before editing. Read code and nearby docs first.
- Prefer existing repo scripts and conventions over inventing one-off workflows.
- Prefer one task per clean git worktree. Treat the active worktree as the edit boundary unless the human explicitly asks otherwise.
- Keep context narrow and tool-driven: use targeted search and file reads instead of asking the human to paste large repo context.
- Keep routine outputs concise. Report changed files, checks run, and unresolved risks; do not repeat unchanged code or full file contents unless asked.
- Choose model size and reasoning effort deliberately:
  - high-effort, stronger models for documentation, architecture, release policy, and broad synthesis
  - medium effort for most implementation work
  - smaller or lower-effort agents for bounded side tasks to control token and inference cost
- Do not assume model routing happens automatically in the main session. If the selected model or effort is insufficient, say so and ask to switch, or use a scoped subagent only when the task splits cleanly. Inversely, if the selected model or effort is clearly overkill, please stop and ask for permission to continue.
- Do not use fast mode or other more expensive models unless explicitly instructed
- Ask before using an especially expensive high-end model for unusually complex work.

## Done criteria

Do not present work as complete until all of the following are true:

- the relevant code, docs, examples, and help text are updated
- all applicable tests and checks have been run, and applicable quality gates pass
- coverage thresholds still pass
- visual baselines were not changed without explicit approval
- no breaking change was introduced unintentionally
- the final result is readable, explicit, and consistent with repo architecture

If any of the above is not true, the task is still in progress.
