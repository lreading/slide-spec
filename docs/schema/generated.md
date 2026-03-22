# `generated.yaml`

This file holds the data that the CLI derives from external sources.

## Purpose

Generated data keeps extracted metrics separate from authored copy so the deck stays reviewable.

## Minimal example

```yaml
generated:
  id: demo-2026-q1
  period:
    start: 2026-01-01
    end: 2026-03-31
  previous_presentation_id: demo-2025-q4
  stats:
    stars:
      current: 0
      previous: 0
      delta: 0
      comparison_status: unavailable
      warning_codes: []
```

## Field reference

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Matches the presentation id. |
| `period` | yes | Current reporting period start/end. |
| `previous_presentation_id` | no | Helpful for comparisons and lineage. |
| `stats` | yes | Metric data keyed by metric id. |
| `releases` | yes | Release candidates and release metadata. |
| `merged_prs` | yes | Merged pull request data used by slides and summaries. |
| `contributors` | yes | Contributor totals and lists. |

## Metric metadata

Each metric includes:
- `current`
- `previous`
- `delta`
- `comparison_status`
- `warning_codes`

The UI uses authored content to decide whether to display a delta, while the metadata is available for review and debugging.
