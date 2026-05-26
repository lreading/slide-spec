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
    message: |-
      Keep the schema honest and the examples real.

      1. Validate content
      2. Review generated slides
    quote: YAML in, static site out.
    repository_fa_icon: fa-github
    docs_fa_icon: fa-book
    community_fa_icon: fa-shield-alt
```

## Data sources

| Region | Source |
| --- | --- |
| Heading | `content.heading` (rendered with a trailing `!`) |
| Message | `content.message`, with lightweight rich text support |
| Quote | `content.quote` |
| Resource pills | `site.links.repository`, `site.links.docs`, `site.links.community` |
| Mascot | `site.mascot` (hidden if not configured) |

## Fields

| Field | Required | Type |
| --- | --- | --- |
| `content.heading` | yes | string |
| `content.message` | yes | string; supports lightweight rich text |
| `content.quote` | | string |
| `content.repository_fa_icon` | | string |
| `content.docs_fa_icon` | | string |
| `content.community_fa_icon` | | string |

Slide-level `title` is not required. `content.message` accepts the lightweight rich text documented in [Concepts](/concepts#lightweight-rich-text).

Icon defaults are `fa-github` for the repository pill, `fa-book` for the docs pill, and `fa-shield-alt` for the community pill. Icon fields use supported values from the [Font Awesome icon reference](/reference/fontawesome).
