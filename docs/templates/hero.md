# Hero

The `hero` template is the title slide.

![Hero reference slide](/screenshots/template-hero-reference.png)

## Visible regions

1. Mascot image from `site.mascot`
2. Title from `content.title_primary` and `content.title_accent`
3. Subtitle line from `content.subtitle_prefix` plus `presentation.subtitle`
4. Quote from `content.quote`
5. Footer links from `site.links.repository`, `site.links.docs`, and `site.links.owasp`

## Example YAML

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

At least one of `title_primary` or `title_accent` must be present.

## Also rendered from `site.yaml`

- `site.mascot.url`
- `site.mascot.alt`
- `site.links.repository`
- `site.links.docs`
- `site.links.owasp`

## Omitted behavior

- If `quote` is omitted, the quote line is removed.
- If `subtitle_prefix` is omitted, the slide still renders using the presentation subtitle.
