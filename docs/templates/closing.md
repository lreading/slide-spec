# Closing

Final slide with heading, message, optional quote, resource links, and optional mascot.

<figure class="template-doc-shot">
  <img src="/screenshots/template-closing-reference.png" alt="Closing slide with thank-you heading, message, resource links, and mascot" />
</figure>

## Example

```yaml
- template: closing
  enabled: true
  content:
    heading: Thank you
    message: Keep the schema honest and the examples real.
    quote: YAML in, static site out.
```

## Data sources

| Region | Source |
| --- | --- |
| Heading | `content.heading` (rendered with a trailing `!`) |
| Message | `content.message` |
| Quote | `content.quote` |
| Resource pills | `site.links.repository`, `site.links.docs`, `site.links.community` |
| Mascot | `site.mascot` (hidden if not configured) |

## Fields

| Field | Required | Type |
| --- | --- | --- |
| `content.heading` | yes | string |
| `content.message` | yes | string |
| `content.quote` | | string |

Slide-level `title` is not required.
