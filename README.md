<div align="center">

# Slide Spec

**Create beautiful slides from YAML, not PowerPoint.**

[![CI](https://img.shields.io/github/actions/workflow/status/lreading/slide-spec/main.yml?branch=main&label=CI)](https://github.com/lreading/slide-spec/actions/workflows/main.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](./LICENSE)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/12235/badge)](https://www.bestpractices.dev/en/projects/12235/passing)

[Live Demo](https://www.slide-spec.dev) · [Docs](https://docs.slide-spec.dev) · [Example YAML](content/)

<video src="assets/readme-demo.mp4" controls muted playsinline style="max-width: 100%; border-radius: 12px;"></video>

</div>

<img src="assets/readme-divider.svg" width="100%" height="8" alt="" />

Slide Spec turns structured YAML into a static slide deck you can host anywhere. It is for teams who want presentations that are reviewable in PRs, diffable like code, and generated without proprietary authoring tools.

- Write slides as structured YAML you can diff, lint, and generate
- Build a static site you can deploy to GitHub Pages, S3, or any CDN
- No proprietary file formats or authoring tools
- Validation baked into CI for a GitOps workflow

Example:

```yaml
presentation:
  id: 2026-q1
  title: Q1 Update
  slides:
    - template: hero
      enabled: true
      content:
        title_primary: Slide
        title_accent: Spec
        subtitle_prefix: Quarterly Update

generated:
  id: 2026-q1
  period:
    start: 2026-01-01
    end: 2026-03-31
  stats:
    stars:
      label: GitHub Stars
      current: 123
      previous: 100
      delta: 23
      metadata:
        comparison_status: complete
        warning_codes: []
```

<img src="assets/readme-divider.svg" width="100%" height="8" alt="" />

## ⚡ Quickstart

Prereqs: Node 24+ and npm.

```sh
cd cli
npm install
npm run cli -- init ../my-slides
npm run cli -- serve ../my-slides
```

Open the URL printed in your terminal. If `5173` is busy, `serve` picks another free port. You should have a working deck in under two minutes.

From there, edit the YAML under `../my-slides/content/`, then validate and build:

```sh
npm run cli -- validate ../my-slides
npm run cli -- build ../my-slides      # outputs to ./dist
```

Pass `--deployment-url` to `build` for `sitemap.xml` generation.

Every command accepts an optional directory as its first argument (e.g. `npm run cli -- serve ../my-deck`). When omitted, the current working directory is used.

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

Slide Spec follows [semver](https://semver.org). The CLI is not yet published to npm; the first public release will define the stable package story.

> ⚠️ **Pre-v1** - the project is still stabilizing. Expect a little churn until the first public release lands.

Tagged commits on `main` trigger the release pipeline. CI runs all quality gates and attaches both a source tarball and a CycloneDX SBOM to the [GitHub release](https://github.com/lreading/slide-spec/releases). npm publishing will be added when the package is ready.

<img src="assets/readme-divider.svg" width="100%" height="8" alt="" />

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to report bugs, request features, and submit code.

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## License

[Apache 2.0](LICENSE)
