# Metrics And Links

Two columns: authored mention cards (`content.mentions[]`) and metric tiles for each key in `content.stat_keys`, bound to `generated.stats.<key>`.

Reference deck: **`2026-spring-briefing`**, slide **7**, viewport **1440×900**.

## Reference screenshot

<figure class="template-doc-shot">
  <img src="/screenshots/template-metrics-and-links-reference.png" alt="Metrics and links template reference slide from the fixture deck" />
</figure>

## YAML that matches the screenshot

### `presentation.yaml` — this slide

```yaml
- template: metrics-and-links
  enabled: true
  title: Community activity
  subtitle: Signals pulled from generated data and authored references
  content:
    section_heading: External signals
    stats_heading: This period
    trend_suffix: vs previous period
    show_deltas: true
    stat_keys:
      - stars
      - issues_closed
      - prs_merged
      - new_contributors
    mentions:
      - type: Case study
        title: The customer rollout playbook now includes the new checklist workflow and export review cadence.
        url_label: Read the guide
        url: https://example.com/docs/rollout-playbook
      - type: Community post
        title: The release overview highlights how teams use templates to keep product briefings consistent.
        url_label: Read the announcement
        url: https://example.com/blog/spring-release
```

### `generated.yaml` — stats for every `stat_key`

Per-deck file: `content/presentations/<presentation-id>/generated.yaml` (this deck: `.../2026-spring-briefing/generated.yaml`).

```yaml
generated:
  stats:
    stars:
      label: GitHub Stars
      current: 1840
      previous: 1760
      delta: 80
      metadata:
        comparison_status: complete
        warning_codes: []
    issues_closed:
      label: Issues closed
      current: 14
      previous: 9
      delta: 5
      metadata:
        comparison_status: complete
        warning_codes: []
    prs_merged:
      label: PRs Merged
      current: 18
      previous: 11
      delta: 7
      metadata:
        comparison_status: complete
        warning_codes: []
    new_contributors:
      label: New contributors
      current: 3
      previous: 1
      delta: 2
      metadata:
        comparison_status: complete
        warning_codes: []
```

### `site.yaml` — slide chrome

`StandardSlideLayout` reads logo and mark from site content (global `site.yaml`).

```yaml
site:
  presentation_logo:
    url: content/assets/slide-spec-logo.svg
    alt: Slide Spec logo
  presentation_chrome:
    mark_label: Acorn Cloud
```

### `presentation.yaml` — mark subtitle line

```yaml
presentation:
  subtitle: Spring 2026
```

## Screen

| Region | Source |
| --- | --- |
| Title / subtitle | `slide.title`, `slide.subtitle` |
| Mentions column heading | `content.section_heading` |
| Mention cards | `content.mentions[]` (`type`, `title`, optional `url_label` + `url`) |
| Stats column heading | `content.stats_heading` |
| Metric tiles | One per `content.stat_keys[]` → `generated.stats.<key>` (`label`, `current`, `previous`, `delta`, …) |
| Trend text | When `content.show_deltas` is true, trend copy uses `delta` / `previous` and `content.trend_suffix` |

## Field reference

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `subtitle` | no | string |
| `content.section_heading` | no | string |
| `content.stats_heading` | no | string |
| `content.show_deltas` | no | boolean |
| `content.trend_suffix` | no | string |
| `content.stat_keys` | yes | string[] |
| `content.mentions` | yes | array |

### `content.mentions[]`

| Field | Required | Type | Notes |
| --- | --- | --- |
| `type` | yes | string | Card eyebrow / label |
| `title` | yes | string | Main card text |
| `url_label` | no | string | Pair with `url` |
| `url` | no | string | Pair with `url_label` |

## Omitted behavior

`show_deltas: false` hides trend lines. Mention rows without both `url` and `url_label` render as plain text cards. Missing `generated.stats.<key>` for a listed key leaves that tile without values.
