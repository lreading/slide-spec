# Hero

Title slide: primary/accent titles, optional subtitle line and quote, plus site chrome.

![Hero reference slide](/screenshots/template-hero-reference.png)

## Screen

| Region | Source |
| --- | --- |
| Mascot | `site.mascot.url`, `site.mascot.alt` |
| Title | `content.title_primary`, `content.title_accent` |
| Subtitle line | `content.subtitle_prefix` and `presentation.subtitle` |
| Quote | `content.quote` |
| Footer links | `site.links.repository`, `site.links.docs`, `site.links.owasp` |

## Example

```yaml
template: hero
enabled: true
content:
  title_primary: Acorn
  title_accent: Cloud
  subtitle_prefix: Product Brief
  quote: Teams ship clearer launch updates when the layout is declarative.
```

## Field reference

| Field | Required | Type |
| --- | --- | --- |
| `content.title_primary` | no | string |
| `content.title_accent` | no | string |
| `content.subtitle_prefix` | no | string |
| `content.quote` | no | string |

At least one of `title_primary` or `title_accent` must be set.

## From `site.yaml`

| Path | Role |
| --- | --- |
| `site.mascot` | Image and alt text |
| `site.links.repository` | Footer link |
| `site.links.docs` | Footer link |
| `site.links.owasp` | Footer link |

## Omitted behavior

Omitting `quote` removes the quote line. Omitting `subtitle_prefix` still leaves the line driven by `presentation.subtitle`.
