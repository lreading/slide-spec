# Progress Timeline

One slide focuses a single roadmap stage (`content.stage`). The strip shows all four stages; detail columns use `presentation.roadmap` for the active stage only.

![Progress timeline reference slide](/screenshots/template-progress-timeline-reference.png)

## Screen

| Region | Source |
| --- | --- |
| Title / subtitle | `slide.title`, `slide.subtitle` (subtitle falls back to active stage `summary` when omitted) |
| Progress strip | All stages; labels/summaries from `presentation.roadmap.sections.<status>.label` and `.summary` |
| Active stage | Matches `content.stage` |
| Deliverables column | Heading from roadmap labels; list from `presentation.roadmap.sections.<stage>.items` |
| Focus areas column | Heading from roadmap labels; rows from `presentation.roadmap.sections.<stage>.themes` (`category` / `target`) |
| Footer link | Label from resolved roadmap `footer_link_label`; href `site.links.repository.url` |

## Example

```yaml
template: progress-timeline
enabled: true
title: "Roadmap: Completed"
subtitle: Delivered work
content:
  stage: completed
```

## Field reference

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `subtitle` | no | string |
| `content.stage` | yes | string |

### `content.stage` values

| Value |
| --- |
| `completed` |
| `in-progress` |
| `planned` |
| `future` |

## From `presentation.roadmap`

Data binds from `presentation.roadmap` when it exists. If `roadmap` is omitted, the slide still renders (title/subtitle), but timeline labels, detail cards, and the roadmap footer link are empty or hidden.

| Path | Role |
| --- | --- |
| `agenda_label` | Copy resolved with defaults |
| `deliverables_heading` | Deliverables column title |
| `focus_areas_heading` | Focus areas column title |
| `footer_link_label` | Footer CTA label |
| `sections.completed` | Stage payload |
| `sections.in-progress` | Stage payload |
| `sections.planned` | Stage payload |
| `sections.future` | Stage payload |

Each `sections.<stage>` object: `label`, `summary`, `items` (string[]), `themes` ({ `category`, `target` }[]). Full rules: [presentation.yaml](/schema/presentation).

## Omitted behavior

Exactly one stage matches `content.stage` for the “current” highlight. Stage copy, lists, and the roadmap footer link require `presentation.roadmap.sections` with the four stage keys defined.
