# Progress Timeline

One slide focuses a single roadmap stage (`content.stage`). The strip shows all four stages; detail columns use `presentation.roadmap` for the active stage only. The footer CTA label comes from roadmap copy; the **href** is `site.links.repository.url`.

Reference deck: **`2026-spring-briefing`**, slide **5**, viewport **1440×900**.

## Reference screenshot

<figure class="template-doc-shot">
  <img src="/screenshots/template-progress-timeline-reference.png" alt="Progress timeline template reference slide from the fixture deck" />
</figure>

## YAML that matches the screenshot

### `presentation.yaml` — this slide

```yaml
- template: progress-timeline
  enabled: true
  title: "Roadmap: Completed"
  subtitle: Delivered work
  content:
    stage: completed
```

### `presentation.yaml` — `subtitle` and full `roadmap` (same file, under `presentation:`)

The strip and both detail cards read from `presentation.roadmap.sections`. Labels for the deliverables column, focus areas column, and footer link come from `deliverables_heading`, `focus_areas_heading`, and `footer_link_label`.

```yaml
presentation:
  subtitle: Spring 2026
  roadmap:
    agenda_label: Roadmap
    deliverables_heading: Key deliverables
    focus_areas_heading: Focus areas
    footer_link_label: View roadmap on GitHub
    sections:
      completed:
        label: Completed
        summary: Platform work that shipped before the end of the reporting period.
        items:
          - Published a new starter kit for customer launch checklists.
          - Added exportable PDF summaries for customer-facing review decks.
          - Reworked the deployment checklist UI for operators.
        themes:
          - category: Operator UX
            target: Make release review and launch readiness easier to audit.
          - category: Exportability
            target: Support polished handoff artifacts without manual cleanup.
      in-progress:
        label: In Progress
        summary: Work that is underway and expected to continue into the next update.
        items:
          - Hardening permission-aware dashboards for large customer teams.
          - Finalizing API examples and migration notes for rollout.
          - Improving test coverage for shared rendering components.
        themes:
          - category: Access Control
            target: Support larger teams with clearer role boundaries.
          - category: Documentation
            target: Reduce rollout friction for new customer projects.
      planned:
        label: Planned
        summary: Near-term roadmap items already scoped for the next cycle.
        items:
          - Add environment-aware checklists for staging and production.
          - Introduce richer audit exports for compliance reviews.
          - Expand starter templates for finance and healthcare teams.
        themes:
          - category: Templates
            target: Shorten setup time for common rollout patterns.
          - category: Compliance
            target: Improve audit readiness for regulated teams.
      future:
        label: Future
        summary: Longer-term work that depends on the current architecture pass.
        items:
          - Build shared APIs for third-party integrations.
          - Add review-mode comments directly to exported briefing decks.
          - Support theme packs for organization-specific branding.
        themes:
          - category: Integrations
            target: Make the system easier to embed into existing workflows.
          - category: Theming
            target: Support white-label deployments later without rewriting templates.
```

### `site.yaml` — repository URL for the footer CTA

```yaml
site:
  links:
    repository:
      label: Product Repo
      url: https://github.com/example/acorn-cloud
```

### `site.yaml` — slide chrome (logo + mark)

```yaml
site:
  presentation_logo:
    url: content/assets/slide-spec-logo.svg
    alt: Slide Spec logo
  presentation_chrome:
    mark_label: Acorn Cloud
```

## Screen

| Region | Source |
| --- | --- |
| Title / subtitle | `slide.title`, `slide.subtitle` (subtitle falls back to active stage `summary` when omitted) |
| Progress strip | All stages; labels/summaries from `presentation.roadmap.sections.<status>.label` and `.summary` |
| Active stage | Matches `content.stage` |
| Deliverables column | Heading from `deliverables_heading`; list from `presentation.roadmap.sections.<stage>.items` |
| Focus areas column | Heading from `focus_areas_heading`; rows from `presentation.roadmap.sections.<stage>.themes` (`category` / `target`) |
| Footer link | Label from `footer_link_label` (with defaults); href `site.links.repository.url` |

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

## Omitted behavior

If `presentation.roadmap` is missing, the slide still renders title/subtitle, but timeline labels, detail cards, and the roadmap footer link are empty or hidden. Exactly one stage matches `content.stage` for the current highlight.
