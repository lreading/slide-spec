# Contributing to Slide Spec

Thanks for your interest. Slide Spec is a small monorepo with room for many kinds of help: filing bugs, proposing features, tightening docs, and shipping code in [app/](app/), [cli/](cli/), [docs/](docs/), or [shared/](shared/). We are glad you are here.

## Use the templates

Bug reports must use the bug report template. Feature requests must use the feature request template. Pull requests must use the PR template. This is required so triage and review stay predictable.

## Reporting bugs

Open an issue with the bug report template and include steps someone else can follow to reproduce the problem. The template walks you through what we need.

## Requesting features

Use the feature request issue template. Lead with the problem or workflow you are trying to improve, not only the API or UI you imagine. That context makes tradeoffs easier to discuss.

## AI-assisted work

Contributions produced or assisted by AI are fine when they meet the same bar as everything else in this file. You are responsible for correctness, style, and security of every line in your PR, no matter how it was written.

## When we may close without a long reply

Issues and PRs that ignore these guidelines may be closed without extra back-and-forth. That is not personal; it keeps maintainer time on substantive work.

## Code contributions

All quality checks must pass before merge. Each project documents its own gates:

- [app/README.md](app/README.md)
- [cli/README.md](cli/README.md)
- [docs/README.md](docs/README.md)

You own every line in your PR. Run the relevant gates locally, read the diff, and manually test the behavior you touched. There should be an existing issue assigned to you before you open a PR so work is tracked and nobody duplicates effort. If CI checks fail, that's yours to fix. Tag a maintainer when you're stuck.

Keep PRs small and focused on one change. Update docs when behavior changes. Only bump or add dependencies when your change actually requires them since Dependabot handles routine updates and large `package-lock.json` diffs clutter review. New dependencies are fine when they earn their weight, but skip tiny packages for anything you could write in 15-20 lines.

Prefer explicit configuration over hidden defaults for anything users interact with. Defaults should be secure and should let the quickstart work without extra setup. The project follows semver (currently v0/alpha), so flag breaking changes clearly in your PR.

TypeScript only. Follow [OpenSSF](https://best.openssf.org/) expectations: no problematic licenses, no proprietary code, no unnecessary supply-chain surface.

## Community

Please read our [Code of Conduct](CODE_OF_CONDUCT.md). We expect everyone to follow it in issues, PRs, and discussion.
