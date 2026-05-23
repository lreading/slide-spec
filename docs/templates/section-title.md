# Section Title

Lightweight section divider related to Hero, but focused on section-level structure and pacing between dense slides.

## Example

```yaml
- template: section-title
  enabled: true
  content:
    title: Platform Security
    subtitle: Compliance status and upcoming policy rollout
    image_url: content/assets/security-shield.svg
    image_alt: Shield icon
```

## Data sources

| Region | Source |
| --- | --- |
| Section title | `content.title` |
| Supporting subtitle | `content.subtitle` |
| Optional visual | `content.image_url`, `content.image_alt` |

## Fields

| Field | Required | Type |
| --- | --- | --- |
| `content.title` | yes | string |
| `content.subtitle` | | string |
| `content.image_url` | | string |
| `content.image_alt` | | string |

`image_alt` requires `image_url`.
