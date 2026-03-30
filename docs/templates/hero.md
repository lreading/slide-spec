# Hero

Title slide with primary/accent title split, optional subtitle and quote, mascot, badge, and footer links.

<figure class="template-doc-shot">
  <img src="/screenshots/template-hero-reference.png" alt="Hero slide showing title, mascot, badge, and footer links" />
</figure>

## Example

```yaml
- template: hero
  enabled: true
  content:
    title_primary: Acorn
    title_accent: Cloud
    subtitle_prefix: Product Brief
    quote: Teams ship clearer updates when the layout is declarative.
```

The subtitle line combines `subtitle_prefix` and `presentation.subtitle`. If `subtitle_prefix` is omitted, no subtitle appears.

## Data sources

| Region | Source |
| --- | --- |
| Title | `content.title_primary`, `content.title_accent` |
| Subtitle line | `content.subtitle_prefix` + `presentation.subtitle` |
| Quote | `content.quote` |
| Mascot | `site.mascot` |
| Badge | `site.project_badge` |
| Footer links | `site.links.repository`, `site.links.docs`, `site.links.community` |

## Fields

| Field | Required | Type |
| --- | --- | --- |
| `content.title_primary` | | string |
| `content.title_accent` | | string |
| `content.subtitle_prefix` | | string |
| `content.quote` | | string |

At least one of `title_primary` or `title_accent` must be set. Slide-level `title` is not required.
