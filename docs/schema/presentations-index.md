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
| `id` | yes | non-blank string | Unique across the file. |
| `year` | no | number | If set, must be a finite number. |
| `title` | yes | non-blank string | Must match the presentation document in consistency checks. |
| `subtitle` | yes | non-blank string | Must match the presentation document in consistency checks. |
| `summary` | yes | non-blank string | Shown in the list row. |
| `published` | yes | boolean | |
| `featured` | yes | boolean | |

## Consistency rules

`validatePresentationRecordConsistency` compares each index entry to the matching presentation and generated documents:

- `id` must match.
- `title` must match.
- `subtitle` must match.
- `year` must match when both the index entry and the presentation define it.
