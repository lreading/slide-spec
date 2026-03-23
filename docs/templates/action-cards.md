# Action Cards

Grid of linked cards (`content.cards[]`) and optional `content.footer_text`.

![Action cards reference slide](/screenshots/template-action-cards-reference.png)

## Screen

| Region | Source |
| --- | --- |
| Title / subtitle | `slide.title`, `slide.subtitle` |
| Cards | `content.cards[]` |
| Card title | `cards[].title` |
| Card body | `cards[].description` |
| Card CTA | `cards[].url_label` → `cards[].url` |
| Footer line | `content.footer_text` |

## Example

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

Omitting `footer_text` removes the footer strip.
