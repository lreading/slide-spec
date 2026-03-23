# `generated.yaml`

Structured data for metrics, releases, contributors, and optional merged PRs. It can be authored manually or filled by the CLI.

Validation for this file is `ContentValidator.validateGeneratedDocument` in `shared/src/content-validator.ts`. The validator is **strict** on `id`, `period`, `stats` (every metric value), and the top-level shape of `contributors`, and **permissive** on the contents of `releases`, `contributors.authors`, and `merged_prs`: it only checks that those are arrays (and that `contributors.total` is a number). Element shapes for those arrays are defined in TypeScript (`shared/src/content.ts`) for the app but are **not** asserted by `ContentValidator`.

## Example

See the full reference file:

- [`docs/fixtures/reference-project/content/presentations/2026-spring-briefing/generated.yaml`](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/generated.yaml)

## Document root

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| (root) | yes | object | |
| `generated` | yes | object | All fields below live under this key. |

## `generated`

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `generated.id` | yes | string | Non-blank. |
| `generated.period` | yes | object | See below. |
| `generated.previous_presentation_id` | no | string | Non-blank when present. |
| `generated.stats` | yes | object | Record keyed by metric id; every value must satisfy the metric shape below. |
| `generated.releases` | yes | array | Length and element shape are **not** validated beyond “is an array”. |
| `generated.contributors` | yes | object | See below. |
| `generated.merged_prs` | no | array | If present, must be an array; elements **not** validated. |

## `generated.period`

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `start` | yes | string | Non-blank. |
| `end` | yes | string | Non-blank. |

Format of date strings is not validated.

## `generated.stats`

`stats` is an object: each **key** is a metric id (any non-empty key string in YAML). Each **value** must be a metric object. The reference project uses ids such as `stars`, `issues_closed`, `prs_merged`, `new_contributors`; the validator does not restrict key names.

### Each `generated.stats.<metricId>` value

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `label` | yes | string | Non-blank. |
| `current` | yes | number | Finite number. |
| `previous` | yes | number | Finite number. |
| `delta` | yes | number | Finite number. |
| `metadata` | yes | object | See below. |

### `generated.stats.<metricId>.metadata`

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `comparison_status` | yes | string | Non-blank; must be one of `complete`, `partial`, `skipped`, `unavailable`. |
| `warning_codes` | yes | string[] | Array; each entry a non-blank string. |

## `generated.releases`

| What is validated | Rule |
| --- | --- |
| `releases` | Must be an array. |

There is no per-item validation in `ContentValidator`. For the shape the TypeScript types expect (`ReleaseEntry` in `shared/src/content.ts`), each entry is typically:

| Field | In types | Notes |
| --- | --- | --- |
| `id` | yes | Not enforced by validator. |
| `version` | yes | Not enforced by validator. |
| `published_at` | yes | Not enforced by validator. |
| `url` | yes | Not enforced by validator. |
| `summary_bullets` | yes | Not enforced by validator. |

## `generated.contributors`

| Path | Required | Type | Notes |
| --- | --- | --- | --- |
| `total` | yes | number | Finite number. |
| `authors` | yes | array | Must be an array; **elements are not validated** by `ContentValidator`. |

### `generated.contributors.authors[]` (typed contract only)

`ContributorEntry` in `shared/src/content.ts` declares each author object with:

| Field | In types | Notes |
| --- | --- | --- |
| `login` | yes | Not enforced by validator. |
| `name` | yes | Not enforced by validator. |
| `avatar_url` | yes | Not enforced by validator. |
| `merged_prs` | yes | Not enforced by validator. |
| `first_time` | yes | Not enforced by validator. |

## `generated.merged_prs`

| What is validated | Rule |
| --- | --- |
| `merged_prs` | If the key is present, value must be an array. Elements are **not** validated. |

`MergedPullRequestEntry` in `shared/src/content.ts` declares:

| Field | In types | Notes |
| --- | --- | --- |
| `number` | yes | Not enforced by validator. |
| `title` | yes | Not enforced by validator. |
| `merged_at` | yes | Not enforced by validator. |
| `author_login` | yes | Not enforced by validator. |

## Notes

- This file does not have to originate from the GitHub connector.
- Cross-document checks (e.g. matching `generated.id` to the presentation and index) are handled separately (`validatePresentationRecordConsistency`), not by `validateGeneratedDocument` alone.
- Hand-authored files should still keep metric keys and labels aligned with slides that consume them (e.g. `metrics-and-links` `stat_keys`), even where the validator does not enforce that link.
