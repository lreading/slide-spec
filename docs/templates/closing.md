# Closing

Final slide: heading, message, optional quote, resource pill links from `site.links`, optional mascot, and the presentation mark (`site.presentation_chrome.mark_label` + `presentation.subtitle`).

Reference deck: **`2026-spring-briefing`**, slide **9**, viewport **1440×900**.

## Reference screenshot

<figure class="template-doc-shot">
  <img src="/screenshots/template-closing-reference.png" alt="Closing template reference slide from the fixture deck" />
</figure>

## YAML that matches the screenshot

### `presentation.yaml` — this slide

```yaml
- template: closing
  enabled: true
  content:
    heading: Thank you
    message: Keep the schema honest, keep the examples real, and the slides stay easy to trust.
    quote: YAML in, static site out.
```

### `site.yaml` — mascot and resource pills

Eyebrow + label + URL for each pill:

```yaml
site:
  mascot:
    url: content/assets/slide-spec-mascot.svg
    alt: Slide Spec mascot
  links:
    repository:
      label: Product Repo
      url: https://github.com/example/acorn-cloud
      eyebrow: Source Code
    docs:
      label: User Docs
      url: https://example.com/docs
      eyebrow: Documentation
    owasp:
      label: Community Hub
      url: https://example.com/community
      eyebrow: Website
```

### `site.yaml` — mark line (primary label)

```yaml
site:
  presentation_chrome:
    mark_label: Acorn Cloud
```

### `presentation.yaml` — mark subtitle line

```yaml
presentation:
  subtitle: Spring 2026
```

## Screen

| Region | Source |
| --- | --- |
| Mascot | `site.mascot` (optional; hidden if `url` missing) |
| Heading | `content.heading` (rendered with a trailing `!` in the template) |
| Message | `content.message` |
| Resource pills | `site.links.repository`, `site.links.docs`, `site.links.owasp` (`eyebrow`, `label`, `url`) |
| Quote | `content.quote` |
| Corner mark | `site.presentation_chrome.mark_label` and `presentation.subtitle` |

## Field reference

| Field | Required | Type |
| --- | --- | --- |
| `content.heading` | yes | string |
| `content.message` | yes | string |
| `content.quote` | no | string |

## Omitted behavior

Omitting `quote` removes the quote line. Omitting `site.mascot.url` removes the mascot. Pill links still expect the three `site.links.*` entries in a typical site configuration.
