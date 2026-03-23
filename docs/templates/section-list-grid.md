# Section list grid

Grid of titled sections; each section is a heading plus bullets.

Reference deck: **`2026-spring-briefing`**, slide **3**, viewport **1440×900**.

## Reference screenshot

<figure class="template-doc-shot">
  <img src="/screenshots/template-section-list-grid-reference.png" alt="Section list grid reference slide from the fixture deck" />
</figure>

## YAML that matches the screenshot

### `presentation.yaml` — this slide

```yaml
- template: section-list-grid
  enabled: true
  title: What shipped
  subtitle: The highest-signal changes from this reporting period
  content:
    sections:
      - title: Launch workflow
        bullets:
          - Starter checklists now include task ownership and sign-off states.
          - PDF exports now preserve section grouping for external reviews.
          - Deployment notes are easier to scan on large screens.
      - title: Documentation
        bullets:
          - New rollout docs cover shared templates and review-mode exports.
          - Migration notes now map old checklist fields to the new schema.
          - Internal examples now match the live generated data model.
      - title: Quality
        bullets:
          - Shared rendering components now have broader test coverage.
          - Example data fixtures were refreshed to match the current schema.
          - Release checks now catch broken links before build output is published.
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

### `presentation.yaml` — mark line

```yaml
presentation:
  subtitle: Spring 2026
```

## Screen

| Region | Source |
| --- | --- |
| Title / subtitle | `slide.title`, `slide.subtitle` |
| Section cards | `content.sections[]` |
| Sidebar logo | `site.presentation_logo` |
| Corner mark | `site.presentation_chrome.mark_label` + `presentation.subtitle` |

## Field reference

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `subtitle` | no | string |
| `content.sections` | yes | array |

### `content.sections[]`

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `bullets` | yes | string[] |

## Omitted behavior

`bullets` may be an empty array; each string must be non-blank when present.
