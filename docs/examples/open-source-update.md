# Open Source Project Update

A quarterly community update for an open source CLI tool. This example shows how Slide Spec works for a typical open source project with GitHub-sourced metrics, release timelines, contributor spotlights, and a public roadmap.

The full YAML for this example lives in the [`examples/open-source-update`](https://github.com/lreading/slide-spec/tree/main/examples/open-source-update) directory.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/oss-home.png" alt="Vortex CLI Updates home page" />
</figure>

## The scenario

Vortex CLI is a fictional developer tool. The team publishes quarterly community updates to keep users informed about releases, contributors, and the roadmap. The data in `generated.yaml` could come from the GitHub connector or be authored by hand.

## Site configuration

`site.yaml` sets up branding, navigation labels, and footer links. The `links.community` key is used here as a Discord community link — the three required link keys are flexible in what they point to.

```yaml
site:
  title: Vortex CLI Updates
  mascot:
    url: https://api.dicebear.com/9.x/bottts-neutral/svg?seed=vortex
    alt: Vortex mascot
  project_badge:
    label: Open Source
    fa_icon: fa-code-branch
    icon_position: before
  home_hero:
    title_primary: Vortex
    title_accent: CLI
    subtitle: Community Updates
  home_intro: Quarterly updates on the Vortex CLI open source project.
  home_cta_label: View latest update
  presentations_cta_label: View all updates
  links:
    repository:
      label: GitHub
      url: https://github.com/example/vortex-cli
      eyebrow: Source Code
    docs:
      label: Docs
      url: https://vortex-cli.example.com/docs
      eyebrow: Documentation
    community:
      label: Discord
      url: https://discord.example.com/vortex
      eyebrow: Community
```

## Presentation index

```yaml
presentations:
  - id: 2026-q1-update
    year: 2026
    title: "Vortex CLI: Q1 2026"
    subtitle: Community Update
    summary: New plugin system, improved error messages, and a growing contributor community.
    published: true
    featured: true
```

## Slides

### Hero

The hero slide uses the title split to emphasize the product name. The quote sets the tone for the update.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/oss-hero.png" alt="Vortex CLI hero slide" />
</figure>

```yaml
- template: hero
  enabled: true
  content:
    title_primary: Vortex
    title_accent: CLI
    subtitle_prefix: Q1 2026
    quote: Build tools should be invisible. When they work well, you forget they are there.
```

### What shipped (section-list-grid)

Three sections covering the quarter's major features. Each section has a title and bullet points.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/oss-sections.png" alt="What shipped slide with three feature sections" />
</figure>

```yaml
- template: section-list-grid
  enabled: true
  title: What shipped
  subtitle: Highlights from the past quarter
  content:
    sections:
      - title: Plugin system
        bullets:
          - Local plugins resolve from the project directory
          - Registry plugins install from the public catalog
          - Lifecycle hooks for init, build, and deploy phases
      - title: Error messages
        bullets:
          - Structured output with error codes and fix suggestions
          - Links to relevant documentation in every error
          - Machine-readable JSON output for CI pipelines
      - title: Shell completions
        bullets:
          - Auto-generated completions for bash, zsh, and fish
          - Dynamic completions for project-specific commands
          - Installable via a single CLI command
```

### Releases (timeline)

Release cards reference entries in `generated.yaml` by id. The footer link points to the GitHub releases page.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/oss-timeline.png" alt="Releases timeline slide" />
</figure>

```yaml
- template: timeline
  enabled: true
  title: Releases
  subtitle: Tagged versions from Q1
  content:
    latest_badge_label: Latest
    footer_link_label: All releases on GitHub
    featured_release_ids:
      - v3-2-0
      - v3-1-0
```

### Community health (metrics-and-links)

Metric tiles pull from `generated.stats` by key. Mentions are authored links to blog posts and conference talks.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/oss-metrics.png" alt="Community health slide with metrics and mentions" />
</figure>

```yaml
- template: metrics-and-links
  enabled: true
  title: Community health
  subtitle: Growth signals from Q1
  content:
    section_heading: In the wild
    stats_heading: This quarter
    trend_suffix: vs last quarter
    show_deltas: true
    stat_keys:
      - stars
      - issues_closed
      - prs_merged
      - new_contributors
    mentions:
      - type: Blog post
        title: "How we built the Vortex plugin system"
        url_label: Read on the blog
        url: https://vortex-cli.example.com/blog/plugin-system
      - type: Conference talk
        title: "DevTools Conf: Building extensible CLIs"
        url_label: Watch the recording
        url: https://example.com/talks/extensible-clis
```

### Generated data

The `generated.yaml` contains stats, releases, and contributors. Here is a trimmed version showing the key structure:

```yaml
generated:
  id: 2026-q1-update
  period:
    start: 2026-01-01
    end: 2026-03-31
  stats:
    stars:
      label: GitHub Stars
      current: 4280
      previous: 3910
      delta: 370
      metadata:
        comparison_status: complete
        warning_codes: []
    issues_closed:
      label: Issues closed
      current: 47
      previous: 31
      delta: 16
      metadata:
        comparison_status: complete
        warning_codes: []
  releases:
    - id: v3-2-0
      version: v3.2.0
      published_at: "2026-03-15"
      url: https://github.com/example/vortex-cli/releases/tag/v3.2.0
      summary_bullets:
        - Plugin system with local and registry-based resolution
        - Shell completion generators for bash, zsh, and fish
  contributors:
    total: 12
    authors:
      - login: sarah-plugins
        name: Sarah Chen
        avatar_url: https://api.dicebear.com/9.x/avataaars/svg?seed=sarah
        merged_prs: 11
        first_time: false
```
