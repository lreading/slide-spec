# Progress Timeline

The `progress-timeline` template renders one roadmap stage against the full shared roadmap model.

![Progress timeline reference slide](/screenshots/template-progress-timeline-reference.png)

## Example YAML

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

Allowed `content.stage` values:

- `completed`
- `in-progress`
- `planned`
- `future`

## Also rendered from `presentation.roadmap`

- `agenda_label`
- `deliverables_heading`
- `focus_areas_heading`
- `footer_link_label`
- `sections.completed`
- `sections.in-progress`
- `sections.planned`
- `sections.future`

## Visible regions

1. Shared roadmap timeline with all four stages
2. Active stage highlight from `content.stage`
3. Stage summary from `presentation.roadmap.sections.<stage>.summary`
4. Deliverables list from `items`
5. Focus areas from `themes`

## Omitted behavior

- The template requires `presentation.roadmap`.
- Only one stage is active per slide.
