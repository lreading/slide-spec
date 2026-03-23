# `presentations/index.yaml`

This file controls what appears on the presentations list page.

## Example

```yaml
presentations:
  - id: 2026-spring-briefing
    year: 2026
    title: Acorn Cloud Product Brief
    subtitle: Spring 2026
    summary: Reliability work, platform roadmap, and team highlights for the first half of spring.
    published: true
    featured: true
```

## Field reference

### Root

| Field | Required | Type |
| --- | --- | --- |
| `presentations` | yes | array |

### `presentations[]`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | yes | string | Must be unique across the file. |
| `year` | no | number | Used by filtering and display. |
| `title` | yes | string | List title and route identity checks. |
| `subtitle` | yes | string | Secondary list label and route consistency checks. |
| `summary` | yes | string | Summary shown in the list row. |
| `published` | yes | boolean | Whether the presentation should be treated as published content. |
| `featured` | yes | boolean | Used for "latest presentation" selection. |

## Consistency rules

The validator checks this file against each matching `presentation.yaml` and `generated.yaml`:

- `id` must match
- `title` must match
- `subtitle` must match
- `year` must match when both sides provide it
