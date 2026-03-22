# Metrics and Links

This template combines numeric stats with curated community mentions.

## Example YAML

```yaml
template: metrics-and-links
enabled: true
title: Community Highlights
subtitle: Project signals from the reporting period
content:
  section_heading: Community Activity
  stats_heading: Stats This Quarter
  show_deltas: true
  trend_suffix: vs previous period
  stat_keys:
    - stars
    - issues_closed
    - prs_merged
    - new_contributors
  mentions:
    - type: Public roadmap
      title: The roadmap discussion opened in GitHub.
      url_label: Open the discussion
      url: https://github.com/example/repo/discussions/1
```

## Screenshot

![Metrics and links slide](/screenshots/templates/metrics-and-links-slide.png)

## Behavior

- `show_deltas` controls whether trend text appears.
- Deltas should be shown only when authored config allows it.
- Mentions are curated and can link out when a URL is provided.
