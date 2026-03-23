# Action Cards

Grid of linked cards (`content.cards[]`) and an optional footer strip. The footer appears when **`content.footer_text`** is set **or** `site.links.repository` exists: the strip can show the text alone, the repository CTA alone, or both.

Reference deck: **`2026-spring-briefing`**, slide **8**, viewport **1440×900**.

## Reference screenshot

<figure class="template-doc-shot">
  <img src="/screenshots/template-action-cards-reference.png" alt="Action cards template reference slide from the fixture deck" />
</figure>

## YAML that matches the screenshot

### `presentation.yaml` — this slide

```yaml
- template: action-cards
  enabled: true
  title: How to help
  subtitle: Ways the wider team can support the next cycle
  content:
    footer_text: Contribution options stay lightweight on purpose.
    cards:
      - title: Review docs
        description: Tighten rollout notes, migration steps, and operator checklists before the next update ships.
        url_label: Open docs backlog
        url: https://example.com/docs/backlog
      - title: Test templates
        description: Run a real project through the starter kit and record anything that feels unclear or repetitive.
        url_label: Report template feedback
        url: https://example.com/feedback/templates
      - title: Improve exports
        description: Review generated PDFs and suggest improvements to spacing, hierarchy, and readability.
        url_label: Share export feedback
        url: https://example.com/feedback/exports
```

### `site.yaml` — repository CTA in the footer strip

The footer action uses `site.links.repository.url` and `site.links.repository.label`.

```yaml
site:
  links:
    repository:
      label: Product Repo
      url: https://github.com/example/acorn-cloud
```

### `site.yaml` — slide chrome

```yaml
site:
  presentation_logo:
    url: content/assets/slide-spec-logo.svg
    alt: Slide Spec logo
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
| Title / subtitle | `slide.title`, `slide.subtitle` |
| Cards | `content.cards[]` |
| Card title / body | `cards[].title`, `cards[].description` |
| Card CTA | `cards[].url_label` → `cards[].url` |
| Footer strip | Shown if `footer_text` **or** `site.links.repository` |
| Footer copy | `content.footer_text` (optional) |
| Footer button | `site.links.repository.label` → `site.links.repository.url` |
| Sidebar logo / mark | `site.presentation_logo`, `site.presentation_chrome.mark_label`, `presentation.subtitle` |

## Field reference

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `subtitle` | no | string |
| `content.footer_text` | no | string |
| `content.cards` | yes | array |

### `content.cards[]`

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `description` | yes | string |
| `url_label` | yes | string |
| `url` | yes | string |

## Omitted behavior

Omitting `footer_text` still leaves the footer strip when `site.links.repository` is configured (repository CTA only). Omitting both `footer_text` and a repository link removes the footer strip entirely.
