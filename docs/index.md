---
layout: home

hero:
  name: slide-spec
  text: Presentation sites from YAML
  tagline: Author slides in reviewable files, pull metrics when you want them, ship static HTML. No slide-deck app required.
  image:
    src: /screenshots/home-reference.png
    alt: Example slide-spec home page with hero title and navigation
  actions:
    - theme: brand
      text: Quickstart
      link: /quickstart
    - theme: alt
      text: Schema reference
      link: /schema/

features:
  - title: Split by design
    details: Slide copy lives in presentation.yaml. Numbers and release metadata live in generated.yaml so humans and automation do not fight over the same lines.
  - title: Actually static
    details: The CLI emits a dist directory you can host anywhere. No Node server in production unless you want one for previews.
  - title: One toolpath
    details: Init a tree, validate YAML, build, serve locally, and optionally fetch GitHub-backed data into generated.yaml—all from the same CLI.
---

## Where to go next

The [quickstart](/quickstart) gets you from `npx @slide-spec/cli init` to a served site. If you already have files open, the [schema](/schema/) pages describe every document, [templates](/templates/) map each slide layout, and the [CLI reference](/cli/) lists commands and flags without extra narration.

Contribution policy and license live in the [GitHub repository](https://github.com/lreading/slide-spec) (`README`, `CONTRIBUTING.md`, `LICENSE`) so this site stays a single technical surface.
