---
layout: home
hero:
  name: slide-spec
  text: Declarative presentations for YAML-driven updates
  tagline: Build, fetch, and publish static slide decks with a repo-friendly workflow that stays easy for humans and machines to read.
  actions:
    - theme: brand
      text: Quickstart
      link: /quickstart
    - theme: alt
      text: Templates
      link: /templates/
features:
  - title: Config-first
    details: Presentation structure, chrome, and data sources live in YAML so updates stay reviewable in git.
  - title: Template-driven
    details: Slides render from reusable templates, which keeps future deck types easy to add and document.
  - title: Git-aware
    details: GitHub can be used as a source for releases, contributors, stars, and other generated data.
---

## Why slide-spec

slide-spec is built for teams that want presentations to behave like source code: reviewable, reproducible, and easy to regenerate.

It fits a simple model:

1. Write configuration and slide content in YAML.
2. Pull in data from GitHub when needed.
3. Generate a static presentation that can ship anywhere a static site can.

## What it gives you

<div class="hero-flow">
<div class="hero-step">
<strong>Static by default</strong>
No backend, no runtime database, no deployment glue.
</div>
<div class="hero-step">
<strong>Reusable templates</strong>
Each slide uses a declared template, so the same shape can be reused across different projects.
</div>
<div class="hero-step">
<strong>Human review stays central</strong>
Generated data seeds the deck, but editorial content stays easy to edit.
</div>
</div>

## A practical flow

Start with a minimal scaffold, fetch what can be gathered automatically, then review and polish the authored slide content before publishing.

The docs in this site walk through the schema, the templates, the CLI, and the connector model in that order.
