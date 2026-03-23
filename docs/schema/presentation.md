# `presentation.yaml`

This file defines authored presentation content and slide order. Validation is `ContentValidator.validatePresentationDocument` in `shared/src/content-validator.ts`, plus per-template checks from `validateTemplateSlide` in `shared/src/templates/validation.ts`.

## Example

See the full reference file:

- [`docs/fixtures/reference-project/content/presentations/2026-spring-briefing/presentation.yaml`](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/presentation.yaml)

## Document root

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| (root) | yes | object | Single top-level object. |
| `presentation` | yes | object | All fields below live under this key. |

## `presentation`

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `presentation.id` | yes | string | Non-blank. |
| `presentation.year` | no | number | Finite number when present. |
| `presentation.title` | yes | string | Non-blank. |
| `presentation.subtitle` | yes | string | Non-blank. |
| `presentation.roadmap` | no | object | Validated only when present; see below. |
| `presentation.slides` | yes | array | Each element validated as a slide; see below. |

Other keys under `presentation` are not read by this validator (they are effectively ignored for validation).

## `presentation.roadmap`

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `agenda_label` | no | string | Non-blank when present. |
| `deliverables_heading` | no | string | Non-blank when present. |
| `focus_areas_heading` | no | string | Non-blank when present. |
| `footer_link_label` | no | string | Non-blank when present. |
| `sections` | yes | object | Must contain exactly the four stage keys below. |

### `presentation.roadmap.sections`

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `sections.completed` | yes | object | Stage object; see next table. |
| `sections.in-progress` | yes | object | Key is the literal string `in-progress`. |
| `sections.planned` | yes | object | Stage object. |
| `sections.future` | yes | object | Stage object. |

### Each roadmap stage (`sections.completed`, `sections.in-progress`, …)

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `label` | yes | string | Non-blank. |
| `summary` | yes | string | Non-blank. |
| `items` | yes | string[] | Each entry non-blank string. |
| `themes` | yes | array | Each element an object; see below. |

### Each `themes[]` entry

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `category` | yes | string | Non-blank. |
| `target` | yes | string | Non-blank. |

## `presentation.slides[]` (envelope)

Every slide is an object. Template-specific rules apply to `title`, `subtitle`, and `content`.

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `template` | yes | string | Non-blank; must be one of the supported template ids (see below). |
| `enabled` | yes | boolean | |
| `title` | varies | string | Optional at envelope level (non-blank if present). Several templates require a non-blank `title` via their template validator. |
| `subtitle` | no | string | Non-blank when present. |
| `content` | usually yes | object | Required for every template except `agenda` (see below). Shape depends on `template`. |

Supported template ids (from `shared/src/templates/templateIds.ts`): `hero`, `agenda`, `section-list-grid`, `timeline`, `progress-timeline`, `people`, `metrics-and-links`, `action-cards`, `closing`.

Richer authoring guidance for each template lives on the template docs; the tables below list only what the validator enforces.

## Template-specific validation

Paths below are relative to one element of `presentation.slides` (e.g. `slides[0].content.…`).

### `hero`

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `content.title_primary` | no | string | Non-blank when present. |
| `content.title_accent` | no | string | Non-blank when present. |
| `content.subtitle_prefix` | no | string | Non-blank when present. |
| `content.quote` | no | string | Non-blank when present. |
| — | — | — | At least one of `content.title_primary` or `content.title_accent` must be set. |

`title` on the slide is not required by the hero template validator.

### `agenda`

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `title` | yes | string | Non-blank (slide-level). |
| `content` | no | object | Omit entirely. If present, must be `{}` (empty object); the renderer does not use `content`. Row text comes from other slides and optional `presentation.roadmap.agenda_label`. |

### `section-list-grid`

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `title` | yes | string | Non-blank. |
| `content.sections` | yes | array | Each element: object with `title` (non-blank string) and `bullets` (array of non-blank strings). |

### `timeline`

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `title` | yes | string | Non-blank. |
| `content.latest_badge_label` | no | string | Non-blank when present. |
| `content.footer_link_label` | no | string | Non-blank when present. |
| `content.empty_state_title` | no | string | Non-blank when present. |
| `content.empty_state_message` | no | string | Non-blank when present. |
| `content.featured_release_ids` | yes | string[] | Array of non-blank strings (may be empty). |

### `progress-timeline`

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `title` | yes | string | Non-blank. |
| `content.stage` | yes | string | Non-blank; must be `completed`, `in-progress`, `planned`, or `future`. |

### `people`

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `title` | yes | string | Non-blank. |
| `content.banner_prefix` | no | string | Non-blank when present. |
| `content.contributors_link_label` | no | string | Non-blank when present. |
| `content.banner_suffix` | no | string | Non-blank when present. |
| `content.spotlight` | yes | array | Each element: object with `login` and `summary` (both non-blank strings). |

### `metrics-and-links`

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `title` | yes | string | Non-blank. |
| `content.section_heading` | no | string | Non-blank when present. |
| `content.stats_heading` | no | string | Non-blank when present. |
| `content.show_deltas` | no | boolean | |
| `content.trend_suffix` | no | string | Non-blank when present. |
| `content.stat_keys` | yes | string[] | Array of non-blank strings. |
| `content.mentions` | yes | array | Each element: see below. |

#### Each `content.mentions[]` entry

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `type` | yes | string | Non-blank. |
| `title` | yes | string | Non-blank. |
| `url_label` | paired | string | Optional, but if either `url` or `url_label` is set, both must be set (non-blank strings). |
| `url` | paired | string | Same rule as `url_label`. |

### `action-cards`

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `title` | yes | string | Non-blank. |
| `content.footer_text` | no | string | Non-blank when present. |
| `content.cards` | yes | array | Each element: object with `title`, `description`, `url_label`, `url` (all non-blank strings). |

### `closing`

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `content.heading` | yes | string | Non-blank. |
| `content.message` | yes | string | Non-blank. |
| `content.quote` | no | string | Non-blank when present. |

`title` on the slide is not required by the closing template validator.

## Further reading

- [Hero](/templates/hero) · [Agenda](/templates/agenda) · [Section List Grid](/templates/section-list-grid) · [Timeline](/templates/timeline) · [Progress Timeline](/templates/progress-timeline) · [People](/templates/people) · [Metrics and Links](/templates/metrics-and-links) · [Action Cards](/templates/action-cards) · [Closing](/templates/closing)
