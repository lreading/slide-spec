# Metrics And Links

Two columns: authored “mentions” cards and metric tiles driven by `content.stat_keys` and `generated.stats`.

![Metrics and links reference slide](/screenshots/template-metrics-and-links-reference.png)

## Screen

| Region | Source |
| --- | --- |
| Title / subtitle | `slide.title`, `slide.subtitle` |
| Mentions column heading | `content.section_heading` |
| Mention cards | `content.mentions[]`; type label `type`, body `title`, optional link `url_label` + `url` |
| Stats column heading | `content.stats_heading` |
| Metric tiles | One per key in `content.stat_keys`; values from `generated.stats.<key>` |
| Trend text | Shown when `content.show_deltas` is true; copy uses delta from generated data plus `content.trend_suffix` |

## Example

```yaml
template: metrics-and-links
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
```

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
| --- | --- | --- | --- |
| `type` | yes | string | Card eyebrow / label |
| `title` | yes | string | Main card text |
| `url_label` | no | string | Pair with `url` |
| `url` | no | string | Pair with `url_label` |

## From `generated.yaml`

For each key in `content.stat_keys`, `generated.stats.<key>` supplies (at minimum) `label`, `current`, `previous`, `delta`, and `metadata` as produced by the generator.

## Omitted behavior

`show_deltas: false` hides trend lines. Mention rows without both `url` and `url_label` render as plain text cards.
