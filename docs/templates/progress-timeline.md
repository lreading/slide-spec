# Progress Timeline

Focuses a single stage. Each slide carries its own stage headings and stage strip entries in `content`. The progress strip shows the authored stages in order; the detail columns use the slide's own `items` and `themes` for the active stage only.

<figure class="template-doc-shot">
  <img src="/screenshots/template-progress-timeline-reference.png" alt="Progress timeline slide showing roadmap stages with the active stage expanded" />
</figure>

## Example

### Slide (in `presentation.yaml`)

```yaml
- template: progress-timeline
  enabled: true
  title: "Roadmap: 6 Months"
  subtitle: Current roadmap focus
  content:
    stage: 6-months
    deliverables_heading: Key deliverables
    focus_areas_heading: Focus areas
    footer_link_label: View roadmap on GitHub
    item_fa_icon: fa-check
    focus_areas_fa_icon: fa-bullseye
    theme_fa_icon: fa-chevron-right
    footer_link_fa_icon: fa-github
    stages:
      3-months:
        label: 3 Months
        summary: Stabilize adoption.
      6-months:
        label: 6 Months
        summary: Expand core workflows.
      12-months:
        label: 12 Months
        summary: Scale the operating model.
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
| `content.stage` | yes | string | Must match one key in `content.stages` |
| `content.deliverables_heading` | | string | |
| `content.focus_areas_heading` | | string | |
| `content.footer_link_label` | | string | |
| `content.item_fa_icon` | | string | Defaults to `fa-chevron-right` |
| `content.focus_areas_fa_icon` | | string | Defaults to `fa-bullseye` |
| `content.theme_fa_icon` | | string | Defaults to `fa-chevron-right` |
| `content.footer_link_fa_icon` | | string | Defaults to `fa-github` |
| `content.stages` | yes | object | 2 to 6 stage strip entries, rendered in authored order |
| `content.items` | yes | string[] | Active stage items |
| `content.themes` | yes | array | Active stage themes |

Stage keys may use the existing `completed`, `in-progress`, `planned`, and `future` shape, or custom labels such as `3-months`, `6-months`, and `12-months`. The progress timeline schema is documented in [presentation.yaml](/schema/presentation#progress-timeline).

Icon fields use supported values from the [Font Awesome icon reference](/reference/fontawesome).
