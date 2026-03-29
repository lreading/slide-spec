<div align="center">

# Slide Spec

**Create beautiful slides from YAML, not PowerPoint.**

<img src="assets/slide-spec-logo.svg" width="140" alt="Slide Spec logo" />

[![npm](https://img.shields.io/npm/v/@slide-spec/cli)](https://www.npmjs.com/package/@slide-spec/cli)
[![CI](https://img.shields.io/github/actions/workflow/status/lreading/slide-spec/main.yml?branch=main&label=CI)](https://github.com/lreading/slide-spec/actions/workflows/main.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](./LICENSE)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/12235/badge)](https://www.bestpractices.dev/projects/12235)

<!-- TODO: replace placeholder URLs for demo and docs once deployed -->
[Live Demo](https://TODO-demo-url) · [Docs](https://TODO-docs-url) · [Example YAML](content/)

<video src="https://github.com/lreading/slide-spec/raw/main/assets/readme-demo.mp4" controls muted width="600"></video>

</div>

<img src="assets/readme-divider.svg" width="100%" height="8" alt="" />

Slide Spec turns structured YAML into a static slide deck you can host anywhere. Keep your presentations in the same repo as your code, reviewable in PRs and diffable like everything else.

- Write slides as structured YAML you can diff, lint, and generate
- Build a static site you can deploy to GitHub Pages, S3, or any CDN
- No proprietary file formats or authoring tools
- Validation baked into CI for a GitOps workflow

<img src="assets/readme-divider.svg" width="100%" height="8" alt="" />

## ⚡ Quickstart

Prereqs: Node 24+ and npm.

```sh
npx @slide-spec/cli init
npx @slide-spec/cli serve
```

Open the URL printed in your terminal. You should have a working deck in under two minutes.

From there, edit the YAML under `content/`, then validate and build:

```sh
npx @slide-spec/cli validate
npx @slide-spec/cli build      # outputs to ./dist
```

Pass `--deployment-url` to `build` for `sitemap.xml` generation.

Every command accepts an optional directory as its first argument (e.g. `npx @slide-spec/cli serve ./my-deck`). When omitted, the current working directory is used.

<img src="assets/readme-divider.svg" width="100%" height="8" alt="" />

## Repository layout

Monorepo with independent packages. Each has its own README with setup, development, and testing details.

| Directory | Purpose | |
|---|---|---|
| [`app/`](app/) | Vue 3 + Vite presentation renderer | [README](app/README.md) |
| [`cli/`](cli/) | Scaffold, validate, build, and serve | [README](cli/README.md) |
| [`docs/`](docs/) | VitePress documentation site | [README](docs/README.md) |
| [`shared/`](shared/) | Shared TypeScript types and validation | [README](shared/README.md) |
| [`content/`](content/) | YAML for this repo's own slide decks | |

<img src="assets/readme-divider.svg" width="100%" height="8" alt="" />

## Releases

Slide Spec follows [semver](https://semver.org). The CLI is published to npm as [`@slide-spec/cli`](https://www.npmjs.com/package/@slide-spec/cli).

> ⚠️ **v0 / alpha** - the project is pre-1.0 and minor versions may contain breaking changes without prior deprecation. Pin your version if you need stability.

Tagged commits on `main` trigger the release pipeline. CI runs all quality gates, publishes to npm, and attaches a source tarball to the [GitHub release](https://github.com/lreading/slide-spec/releases).

<img src="assets/readme-divider.svg" width="100%" height="8" alt="" />

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to report bugs, request features, and submit code.

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## License

[Apache 2.0](LICENSE)
