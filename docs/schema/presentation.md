# `presentation.yaml`

This file defines authored presentation content and slide order.

## Example

See the full reference file:

- [`docs/fixtures/reference-project/content/presentations/2026-spring-briefing/presentation.yaml`](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/presentation.yaml)

## Root fields

| Field | Required | Type |
| --- | --- | --- |
| `presentation.id` | yes | string |
| `presentation.year` | no | number |
| `presentation.title` | yes | string |
| `presentation.subtitle` | yes | string |
| `presentation.roadmap` | no | object |
| `presentation.slides` | yes | array |

## `presentation.roadmap`

| Field | Required | Type |
| --- | --- | --- |
| `agenda_label` | no | string |
| `deliverables_heading` | no | string |
| `focus_areas_heading` | no | string |
| `footer_link_label` | no | string |
| `sections` | yes | object |

### `presentation.roadmap.sections`

Required keys:

- `completed`
- `in-progress`
- `planned`
- `future`

Each stage object uses:

| Field | Required | Type |
| --- | --- | --- |
| `label` | yes | string |
| `summary` | yes | string |
| `items` | yes | string[] |
| `themes` | yes | array |

Each `themes[]` item uses:

| Field | Required | Type |
| --- | --- | --- |
| `category` | yes | string |
| `target` | yes | string |

## `presentation.slides[]`

Every slide shares the same envelope:

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `template` | yes | string | Must be a supported template id. |
| `enabled` | yes | boolean | Disabled slides are skipped by the renderer. |
| `title` | sometimes | string | Required by most templates except `hero` and `closing`. |
| `subtitle` | no | string | Optional template subtitle. |
| `content` | yes | object | Template-specific content block. |

Current template ids:

- `hero`
- `agenda`
- `section-list-grid`
- `timeline`
- `progress-timeline`
- `people`
- `metrics-and-links`
- `action-cards`
- `closing`

## Template-specific `content`

The `content` block is different for each template. Those fields are fully documented on the matching template pages:

- [Hero](/templates/hero)
- [Agenda](/templates/agenda)
- [Section List Grid](/templates/section-list-grid)
- [Timeline](/templates/timeline)
- [Progress Timeline](/templates/progress-timeline)
- [People](/templates/people)
- [Metrics and Links](/templates/metrics-and-links)
- [Action Cards](/templates/action-cards)
- [Closing](/templates/closing)

## Validation notes

- `template` must be one of the supported template ids.
- Template-specific required fields are enforced.
- Empty optional fields may be omitted.
