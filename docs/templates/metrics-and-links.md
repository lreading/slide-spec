# Metrics And Links

The `metrics-and-links` template combines generated metrics with authored community or ecosystem references.

![Metrics and links reference slide](/screenshots/template-metrics-and-links-reference.png)

## Visible regions

1. Slide title and optional subtitle
2. Optional left-column section heading from `content.section_heading`
3. One mention card per `content.mentions[]`
4. Mention type label from `content.mentions[].type`
5. Mention body from `content.mentions[].title`
6. Optional mention link label from `content.mentions[].url_label`
7. Optional right-column stats heading from `content.stats_heading`
8. One metric card per key listed in `content.stat_keys`
9. Metric value and label from `generated.stats.<metric>`
10. Optional trend line from generated delta plus `content.trend_suffix`

## Example YAML

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
| `type` | yes | string | Small label on the mention card. |
| `title` | yes | string | Main card copy. |
| `url_label` | no | string | Must be paired with `url` when present. |
| `url` | no | string | Must be paired with `url_label` when present. |

## Also rendered from `generated.yaml`

- metric keys named in `content.stat_keys`
- each metric uses `label`, `current`, `previous`, `delta`, and `metadata`

## Omitted behavior

- If `show_deltas` is `false`, trend lines are hidden.
- Mention cards without `url` and `url_label` remain non-clickable.
