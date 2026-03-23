# Agenda

Lists later enabled slides in deck order. Row text is **derived** from those slides (and `presentation.roadmap.agenda_label` for the first `progress-timeline`), not from `slide.content`.

Reference deck: **`2026-spring-briefing`**, slide **2**, viewport **1440×900**.

## Reference screenshot

<figure class="template-doc-shot">
  <img src="/screenshots/template-agenda-reference.png" alt="Agenda template reference slide from the fixture deck" />
</figure>

## YAML that matches the screenshot

### `presentation.yaml` — this slide

```yaml
- template: agenda
  enabled: true
  title: Agenda
  subtitle: What this briefing covers
```

There is no `content` block; the template does not read `slide.content`.

### `presentation.yaml` — roadmap label (progress row)

The row for the roadmap slide uses **`presentation.roadmap.agenda_label`**, not that slide’s `title`:

```yaml
presentation:
  roadmap:
    agenda_label: Roadmap
```

### `presentation.yaml` — later slides (row labels)

These entries (after the agenda slide in the same file) supply the other card titles. Order matches deck order:

```yaml
  slides:
    # … hero + agenda omitted …
    - template: section-list-grid
      enabled: true
      title: What shipped
    - template: timeline
      enabled: true
      title: Releases
    - template: progress-timeline
      enabled: true
      title: "Roadmap: Completed"
    - template: people
      enabled: true
      title: Contributor spotlight
    - template: metrics-and-links
      enabled: true
      title: Community activity
    - template: action-cards
      enabled: true
      title: How to help
    - template: closing
      enabled: true
      content:
        heading: Thank you
```

The closing row uses `slide.content.heading` when `title` is omitted (`getSlideLabel` in `app/src/content/slideLabels.ts`).

### `site.yaml` — chrome

```yaml
site:
  presentation_logo:
    url: content/assets/slide-spec-logo.svg
    alt: Slide Spec logo
  presentation_chrome:
    mark_label: Acorn Cloud
```

### `presentation` — mark subtitle

```yaml
presentation:
  subtitle: Spring 2026
```

## Screen

| Region | Source |
| --- | --- |
| Title / subtitle | `slide.title`, `slide.subtitle` |
| Each row | Labels from later slides + `roadmap.agenda_label` for the first `progress-timeline` |
| Logo / mark | `site.presentation_logo`, `site.presentation_chrome`, `presentation.subtitle` |

## Field reference

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `subtitle` | no | string |
| `content` | no | Omit or `{}` only |

## Omitted behavior

Without `subtitle`, that line is hidden. Disabled slides are skipped. Without `roadmap.agenda_label`, the first `progress-timeline` adds no row.
