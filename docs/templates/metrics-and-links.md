# Metrics and Links

Two-column layout: authored mention cards on the left, metric tiles on the right. Metrics are pulled from `generated.stats` by key.

<figure class="template-doc-shot">
  <img src="/screenshots/template-metrics-and-links-reference.png" alt="Metrics and links slide showing mention cards and stat tiles" />
</figure>

## Example

### Slide (in `presentation.yaml`)

```yaml
- template: metrics-and-links
  enabled: true
  title: Community activity
  subtitle: Signals from generated data and authored references
  content:
    section_heading: External signals
    stats_heading: This period
    trend_suffix: vs previous period
    show_deltas: true
    section_heading_fa_icon: fa-bullhorn
    stats_heading_fa_icon: fa-chart-line
    stat_fa_icons:
      - fa-star
      - fa-check-circle
      - fa-code-branch
      - fa-user-plus
    stat_keys:
      - stars
      - issues_closed
      - prs_merged
      - new_contributors
    mentions:
      - type: Case study
        fa_icon: fa-rss
        link_fa_icon: fa-external-link-alt
        title: The rollout playbook now includes the new checklist workflow.
        url_label: Read the guide
        url: https://example.com/docs/rollout-playbook
      - type: Community post
        title: Release overview on how teams use templates for consistent briefings.
        url_label: Read the announcement
        url: https://example.com/blog/spring-release
```

### Matching data (in `generated.yaml`)

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
```

## Data sources

| Region | Source |
| --- | --- |
| Mentions column | `content.section_heading` + `mentions[]` |
| Mention cards | `type` (eyebrow), `title`, optional `url_label` + `url` |
| Stats column | `content.stats_heading` + one tile per `stat_keys[]` |
| Metric tiles | `generated.stats.<key>`: `label`, `current`, `previous`, `delta` |
| Trend line | Shown when `show_deltas` is true. Uses `delta`/`previous` + `trend_suffix` |

## Fields

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `subtitle` | | string |
| `content.stat_keys` | yes | string[] |
| `content.mentions` | yes | array |
| `content.section_heading` | | string |
| `content.stats_heading` | | string |
| `content.show_deltas` | | boolean |
| `content.trend_suffix` | | string |
| `content.section_heading_fa_icon` | | string |
| `content.stats_heading_fa_icon` | | string |
| `content.stat_fa_icons` | | string[] |
| `content.trend_up_fa_icon` | | string |
| `content.trend_down_fa_icon` | | string |

### `content.mentions[]`

| Field | Required | Type |
| --- | --- | --- |
| `type` | yes | string |
| `title` | yes | string |
| `url_label` | | string |
| `url` | | string |
| `fa_icon` | | string |
| `link_fa_icon` | | string |

`url` and `url_label` are paired: set both or omit both. Mentions without links render as plain text cards.

Icon defaults are `fa-bullhorn` for the mentions heading, `fa-chart-line` for the stats heading, `fa-microphone-alt`, `fa-rss`, and `fa-podcast` for mention cards, `fa-external-link-alt` for mention links, `fa-star`, `fa-check-circle`, `fa-code-branch`, and `fa-user-plus` for stat cards, and `fa-arrow-up` / `fa-arrow-down` for trends. Additional mentions default to `fa-rss`; additional stats default to `fa-star`. Icon fields use supported values from the [Font Awesome icon reference](/reference/fontawesome).
