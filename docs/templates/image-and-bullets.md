# Image and Bullets

Balanced slide layout for an image block and a bullet list, with support for image-only and bullets-only states.

## Example

```yaml
- template: image-and-bullets
  enabled: true
  title: Platform Migration Highlights
  subtitle: What changed and why it matters
  content:
    image_side: right
    image:
      src: /assets/migration-overview.png
      alt: Diagram of migration architecture
      description: Migration architecture captured during rollout week.
    bullets:
      - New ingress path reduced deployment time by 28%.
      - Authoring defaults now preserve explicit review ownership.
      - Validation rules enforce either image or bullet content.
```

## Fields

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `title` | yes | string | |
| `subtitle` | | string | |
| `content.image_side` | | string | `left` or `right`; defaults to `right` |
| `content.image` | conditional | object | Required when `content.bullets` is omitted |
| `content.bullets` | conditional | string[] | Required when `content.image` is omitted; must include at least one item when present |

### `content.image`

| Field | Required | Type |
| --- | --- | --- |
| `src` | yes | string |
| `alt` | | string |
| `description` | | string |
