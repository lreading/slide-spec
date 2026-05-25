# Section List Grid

Grid of titled sections, each with a heading and bullet list.

<figure class="template-doc-shot">
  <img src="/screenshots/template-section-list-grid-reference.png" alt="Section list grid slide showing three content sections with bullets" />
</figure>

## Example

```yaml
- template: section-list-grid
  enabled: true
  title: What shipped
  subtitle: Key changes from this reporting period
  content:
    sections:
      - title: Launch workflow
        fa_icon: fa-check-circle
        bullets:
          - Starter checklists now include task ownership.
          - PDF exports preserve section grouping.
      - title: Documentation
        fa_icon: fa-book
        bullets:
          - New rollout docs cover shared templates.
          - Migration notes map old fields to the new schema.
```

## Fields

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `subtitle` | | string |
| `content.sections` | yes | array |

### `content.sections[]`

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `bullets` | yes | string[] |
| `fa_icon` | | string |

`fa_icon` overrides the section badge icon. Defaults are assigned by section order: `fa-wrench`, `fa-star`, then `fa-users`, with `fa-star` for additional sections. Icon fields use supported values from the [Font Awesome icon reference](/reference/fontawesome).
