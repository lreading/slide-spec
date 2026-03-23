# Action Cards

The `action-cards` template renders a grid of CTA cards with optional footer text.

![Action cards reference slide](/screenshots/template-action-cards-reference.png)

## Visible regions

1. Slide title and optional subtitle
2. One surface card per `content.cards[]`
3. Card title from `content.cards[].title`
4. Card body from `content.cards[].description`
5. Card action label from `content.cards[].url_label`
6. Optional footer line from `content.footer_text`

## Example YAML

```yaml
template: action-cards
enabled: true
title: How to help
subtitle: Ways the wider team can support the next cycle
content:
  footer_text: Contribution options stay lightweight on purpose.
  cards:
    - title: Review docs
      description: Tighten rollout notes, migration steps, and operator checklists before the next update ships.
      url_label: Open docs backlog
      url: https://example.com/docs/backlog
```

## Field reference

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `subtitle` | no | string |
| `content.footer_text` | no | string |
| `content.cards` | yes | array |

### `content.cards[]`

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `description` | yes | string |
| `url_label` | yes | string |
| `url` | yes | string |

## Omitted behavior

- If `footer_text` is omitted, the footer callout disappears.
