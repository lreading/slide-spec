# Section List Grid

The `section-list-grid` template renders multiple titled bullet sections in a grid.

![Section list grid reference slide](/screenshots/template-section-list-grid-reference.png)

## Example YAML

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

## Visible regions

1. Slide title
2. Optional slide subtitle
3. One card per `content.sections[]`
4. Section heading from `sections[].title`
5. Bullet list from `sections[].bullets`

## Omitted behavior

- Empty sections are invalid because `bullets` must be an array.
- The grid grows or shrinks with the number of sections provided.
