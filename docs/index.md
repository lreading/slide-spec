# slide-spec

Build static presentation sites from YAML.

slide-spec is for teams that want project updates, roadmap reviews, release summaries, and briefing decks to behave like source code:

- content stays in reviewable YAML files
- generated metrics stay separate from authored narrative
- the CLI scaffolds, validates, builds, serves, and fetches data
- the final output is a static site with no backend requirement

## Start here

- New user: [Quickstart](/quickstart)
- Need the file model: [Schema reference](/schema/)
- Need a slide layout: [Templates](/templates/)
- Need command details: [CLI reference](/cli/)

## What you get

- A home page and archived presentation index
- A slide renderer driven by templates and YAML content
- Optional generated data from GitHub
- A packaged CLI that can scaffold and build projects outside this repository

## How the pieces fit

1. `site.yaml` defines global branding, links, and page labels.
2. `presentations/index.yaml` controls what appears in the archive.
3. Each `presentation.yaml` defines slide order and authored content.
4. Each `generated.yaml` holds machine-produced metrics and release data.
5. `slide-spec build` turns the project into a static `dist/` directory.

## Screens

![Reference project home page](/screenshots/home-reference.png)

![Reference project presentations index](/screenshots/presentations-reference.png)

## Why this exists

Most slide workflows break down as soon as people need review history, reproducible builds, or generated metrics. slide-spec keeps those concerns separate:

- authored copy lives in YAML
- generated data lives in YAML
- templates stay reusable
- the app runtime stays static

## Included docs

- [Quickstart](/quickstart): zero to working site
- [Schema](/schema/): every current file and field
- [Templates](/templates/): every current template and visible region
- [Examples](/examples/): a tutorial example and a manual-data example
- [Meta](/meta/): AI guidance, accessibility status, and supply-chain notes

## Repository guidance

Contribution policy lives in the repository, not the docs site:

- [README](https://github.com/lreading/slide-spec#readme)
- [CONTRIBUTING.md](https://github.com/lreading/slide-spec/blob/main/CONTRIBUTING.md)
- [LICENSE](https://github.com/lreading/slide-spec/blob/main/LICENSE)
