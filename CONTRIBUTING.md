# Contributing to Slide Spec

Thanks for your interest in Slide Spec! Contributions of all sizes are welcome: bug reports, docs improvements, examples, tests, design feedback, and code in [`app/`](app/), [`cli/`](cli/), [`docs/`](docs/), and [`shared/`](shared/).

Please also read our [Code of Conduct](CODE_OF_CONDUCT.md). We want the project to be clear, respectful, and easy to contribute to.

## TL;DR

If you only read one section, read this one:

- Be respectful and follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- Use the issue and pull request templates.
- Prefer small, focused pull requests with clear descriptions.
- Update docs when behavior changes.
- Run the relevant local checks before you open or update a PR.
- You are responsible for every change in your PR, including work assisted by AI or agents.
- Signed commits are required.
- `main` is protected. Outside contributor workflows may need maintainer approval before GitHub Actions can run.

## Before you start

- Bug reports should use the bug report template.
- Feature requests should use the feature request template.
- Pull requests should use the PR template.
- For larger changes, start with an issue or discussion first so the work is aligned before you spend time implementing it.

## What good contributions look like

- Clear problem statement or motivation
- Small, reviewable scope
- Readable TypeScript code
- Explicit configuration instead of magic behavior
- Secure defaults
- Updated docs, examples, or help text when user-facing behavior changes
- Tests that cover the behavior you changed

Slide Spec is primarily for people comfortable with source control and YAML data files. That means clarity matters more than cleverness.

## AI-assisted contributions

AI-assisted work is allowed. Human accountability does not change.

If you use AI, agents, or other code-generation tools:

- review the output carefully
- verify correctness, security, licensing, and style
- make sure docs and tests are updated when needed
- do not assume generated code is acceptable because it compiles

The person opening the PR is responsible for the full change, regardless of who or what produced the draft.

## Development expectations

We aim for a high quality bar without making the process harder than it needs to be.

High-level expectations:

- TypeScript, not JavaScript
- Accessibility is a first-class feature
- Avoid unnecessary breaking changes
- Keep code readable and explicit
- Update docs in the same change when behavior changes
- Do not update visual baselines unless a maintainer explicitly agrees that the change is intentional

The repo-level agent contract lives in [AGENTS.md](AGENTS.md). This contributing guide is for our fellow humans.

## Running checks locally

Start with the package you changed:

- `cd app && npm run verify`
- `cd cli && npm run verify`
- `cd docs && npm run verify`

Depending on the change, you may also need additional commands that are part of GitHub Actions but not included in a package `verify` script. The full source of truth is [`.github/workflows/reusable-quality.yml`](.github/workflows/reusable-quality.yml).

As a practical rule:

- If you changed product code, run the relevant package verify command and any missing checks needed for confidence.
- If you changed docs, make sure docs build cleanly and the markdown, spellcheck, and link checks still make sense.
- If you changed UI or rendering, think about unit tests, e2e coverage, accessibility, and visual regression impact together.
- If you changed app routes, make sure direct links and hard refreshes work in static builds and update sitemap/LLM metadata behavior if the public route surface changed.

## Common GitHub Actions failures

### Spellcheck

We run `cspell` to catch obvious typos in documentation and contributor-facing text. This is useful, but dictionaries are never perfect.

If spellcheck fails because of a valid word:

1. Confirm the spelling is correct and intentional.
2. Add the word to [`.cspell.json`](.cspell.json) if it is a legitimate project term, brand, product, or technical word.
3. Keep the ignore list focused. Do not use it to hide real typos.

Example valid words already in the ignore list include `OpenSSF`, `VitePress`, and `Dependabot`.

### Link checker

We run Lychee to catch broken links. Some sites block crawlers, CI runners, or automated requests with a WAF or similar network control. Those failures often show up as `403` responses even when the link is valid in a browser.

If link checking fails:

1. Verify the URL manually in a browser.
2. If the link is valid but blocks automation, add it to the exclude list in [`.github/lychee.toml`](.github/lychee.toml).
3. Keep the exclude list narrow and comment in the PR why the exclusion is needed.

## Pull request and repository rules

- Signed commits are required.
- `main` is branch protected.
- Tags are restricted to maintainers.
- For PRs from outside contributors, GitHub Actions may require a maintainer to approve the run before checks start.
- Over time, consistent high-quality contributions can lead to direct contributor access.

These controls are there to protect releases and keep review predictable, not to make contribution difficult.

## Review and merge expectations

- Read your own diff before asking for review.
- Keep PR descriptions concrete: what changed, why, and any follow-up work.
- If CI fails, please investigate and push a fix before asking a maintainer to spend time on it.
- Tag a maintainer when you are blocked, need a decision, or if you need help!

We may close issues or PRs that ignore these guidelines, but the goal is to help contributors succeed, not to create unnecessary friction.
