# Closing

Final slide: heading, message, optional quote, site links, optional mascot, presentation mark.

![Closing reference slide](/screenshots/template-closing-reference.png)

## Screen

| Region | Source |
| --- | --- |
| Mascot | `site.mascot` (optional) |
| Heading | `content.heading` |
| Message | `content.message` |
| Resource links | `site.links.repository`, `site.links.docs`, `site.links.owasp` |
| Quote | `content.quote` |
| Corner mark | `site.presentation_chrome.mark_label` |

## Example

```yaml
template: closing
enabled: true
content:
  heading: Thank you
  message: Keep the schema honest, keep the examples real, and the slides stay easy to trust.
  quote: YAML in, static site out.
```

## Field reference

| Field | Required | Type |
| --- | --- | --- |
| `content.heading` | yes | string |
| `content.message` | yes | string |
| `content.quote` | no | string |

## From `site.yaml`

| Path | Role |
| --- | --- |
| `site.links.repository` | Pill link |
| `site.links.docs` | Pill link |
| `site.links.owasp` | Pill link |
| `site.presentation_chrome.mark_label` | Mark in chrome |

## Omitted behavior

Omitting `quote` removes the quote line.
