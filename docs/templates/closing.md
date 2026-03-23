# Closing

The `closing` template is the final slide.

![Closing reference slide](/screenshots/template-closing-reference.png)

## Visible regions

1. Optional closing mascot from `site.mascot`
2. Heading from `content.heading`
3. Message from `content.message`
4. Footer resource pills from `site.links.repository`, `site.links.docs`, and `site.links.owasp`
5. Optional quote from `content.quote`
6. Bottom-right mark from `site.presentation_chrome.mark_label`

## Example YAML

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

## Also rendered from `site.yaml`

- `site.links.repository`
- `site.links.docs`
- `site.links.owasp`
- `site.presentation_chrome.mark_label`

## Omitted behavior

- If `quote` is omitted, the closing quote line is removed.
