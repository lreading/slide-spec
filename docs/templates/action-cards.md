# Action Cards

Grid of CTA cards with an optional footer strip.

<figure class="template-doc-shot">
  <img src="/screenshots/template-action-cards-reference.png" alt="Action cards slide showing three CTA cards with descriptions and links" />
</figure>

## Example

```yaml
- template: action-cards
  enabled: true
  title: How to help
  subtitle: Ways to support the next cycle
  content:
    footer_text: Contribution options stay lightweight on purpose.
    footer_fa_icon: fa-github
    footer_link_fa_icon: fa-code
    cards:
      - title: Review docs
        fa_icon: fa-book
        link_fa_icon: fa-arrow-right
        description: Tighten rollout notes and operator checklists.
        url_label: Open docs backlog
        url: https://example.com/docs/backlog
      - title: Test templates
        description: Run a project through the starter kit and note anything unclear.
        url_label: Report feedback
        url: https://example.com/feedback/templates
      - title: Improve exports
        description: Review PDFs and suggest spacing or readability improvements.
        url_label: Share feedback
        url: https://example.com/feedback/exports
```

## Data sources

| Region | Source |
| --- | --- |
| Cards | `content.cards[]`: `title`, `description`, `url_label` / `url` |
| Footer strip | Shown if `footer_text` or `site.links.repository` exists |
| Footer text | `content.footer_text` |
| Footer button | `site.links.repository.label` / `site.links.repository.url` |

## Fields

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `subtitle` | | string |
| `content.footer_text` | | string |
| `content.footer_fa_icon` | | string |
| `content.footer_link_fa_icon` | | string |
| `content.cards` | yes | array |

### `content.cards[]`

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `description` | yes | string |
| `url_label` | yes | string |
| `url` | yes | string |
| `fa_icon` | | string |
| `link_fa_icon` | | string |

Icon defaults are `fa-bug`, `fa-code-branch`, `fa-book`, and `fa-bullhorn` for cards, `fa-arrow-right`, `fa-arrow-right`, `fa-arrow-right`, and `fa-star` for card links, `fa-github` for the footer strip, and `fa-code` for the footer button. Additional cards default to `fa-star`, and additional card links default to `fa-arrow-right`. Icon fields use supported values from the [Font Awesome icon reference](/reference/fontawesome).
