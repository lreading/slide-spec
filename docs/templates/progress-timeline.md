# Progress Timeline

Focuses a single stage. Each slide carries its own stage headings and four stage strip entries in `content`. The progress strip shows all four stages; the detail columns use the slide's own `items` and `themes` for the active stage only.

<figure class="template-doc-shot">
  <img src="/screenshots/template-progress-timeline-reference.png" alt="Progress timeline slide showing roadmap stages with the active stage expanded" />
</figure>

## Example

### Slide (in `presentation.yaml`)

```yaml
- template: progress-timeline
  enabled: true
  title: "Roadmap: Completed"
  subtitle: Delivered work
  content:
    stage: completed
    deliverables_heading: Key deliverables
    focus_areas_heading: Focus areas
    footer_link_label: View roadmap on GitHub
    stages:
      completed:
        label: Completed
        summary: Work that shipped during this period.
      in-progress:
        label: In Progress
        summary: Active work continuing into the next cycle.
      planned:
        label: Planned
        summary: Scoped for the next cycle.
      future:
        label: Future
        summary: Depends on the current architecture pass.
    items:
      - Published a new starter kit for launch checklists.
      - Added exportable PDF summaries.
    themes:
      - category: Operator UX
        target: Make release review easier to audit.
      - category: Exportability
        target: Support polished handoff artifacts.
```

## Data sources

| Region | Source |
| --- | --- |
| Progress strip | All stages from `content.stages` |
| Active stage highlight | Matches `content.stage` |
| Deliverables column | `content.deliverables_heading` + `content.items` |
| Focus areas column | `content.focus_areas_heading` + `content.themes` |
| Footer link | `content.footer_link_label` with href `site.links.repository.url` |

If `subtitle` is omitted, the active stage's `summary` is used instead.

## Fields

| Field | Required | Type | Values |
| --- | --- | --- | --- |
| `title` | yes | string | |
| `subtitle` | | string | |
| `content.stage` | yes | string | `completed`, `in-progress`, `planned`, `future` |
| `content.deliverables_heading` | | string | |
| `content.focus_areas_heading` | | string | |
| `content.footer_link_label` | | string | |
| `content.stages` | yes | object | Four stage strip entries |
| `content.items` | yes | string[] | Active stage items |
| `content.themes` | yes | array | Active stage themes |

The progress timeline schema is documented in [presentation.yaml](/schema/presentation#progress-timeline).
