# Agenda

Lists the remaining enabled slides in deck order. Rows are **derived** from other slides (titles or labels), not from hand-authored list items.

![Agenda reference slide](/screenshots/template-agenda-reference.png)

## Screen

| Region | Source |
| --- | --- |
| Title | `slide.title` |
| Subtitle | `slide.subtitle` |
| Each row | Label for the next enabled slide (see below) |
| Logo / mark | `site.presentation_logo`, `site.presentation_chrome.mark_label` |

### How row labels are chosen

For each later slide that is enabled (excluding `hero` and `agenda`), the card text is:

- **`progress-timeline`:** only the first enabled `progress-timeline` slide contributes a row. The label is **`presentation.roadmap.agenda_label` only** (trimmed); the slide’s `title` is not used here. If the label is missing, that slide adds no row.
- **Everything else:** `getSlideLabel` in `app/src/content/slideLabels.ts`—typically `slide.title`, or for `closing` without a title, `slide.content.heading`.

So the only “configuration” for the agenda list is how you title your other slides (plus optional `presentation.roadmap.agenda_label` for the collapsed roadmap entry).

## Example

```yaml
template: agenda
enabled: true
title: Agenda
subtitle: What this briefing covers
```

No `content` block: the template does not read `slide.content` at all.

## Field reference

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `subtitle` | no | string |
| `content` | no | Omit entirely, or `{}` only. Any other keys are rejected. |

## Omitted behavior

Without `subtitle`, that line is hidden. Disabled slides are excluded from the list.
