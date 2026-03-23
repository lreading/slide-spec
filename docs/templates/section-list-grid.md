# Section List Grid

Grid of titled sections; each section is a heading plus a bullet list.

![Section list grid reference slide](/screenshots/template-section-list-grid-reference.png)

## Screen

| Region | Source |
| --- | --- |
| Title | `slide.title` |
| Subtitle | `slide.subtitle` |
| Section cards | One per `content.sections[]` |
| Card heading | `sections[].title` |
| Bullets | `sections[].bullets` |

## Example

```yaml
template: section-list-grid
enabled: true
title: What shipped
subtitle: The highest-signal changes from this reporting period
content:
  sections:
    - title: Launch workflow
      bullets:
        - Starter checklists now include task ownership and sign-off states.
        - PDF exports now preserve section grouping for external reviews.
```

## Field reference

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `subtitle` | no | string |
| `content.sections` | yes | array |

### `content.sections[]`

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `bullets` | yes | string[] |

## Omitted behavior

Each `sections[]` entry must define `bullets` as an array; each element is a non-blank string. An empty `bullets` array validates. Layout scales with section count.
