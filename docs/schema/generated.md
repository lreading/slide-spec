# `generated.yaml`

This file contains structured data for metrics, releases, contributors, and merged pull requests.

It can be authored manually or populated by the CLI.

## Example

See the full reference file:

- [`docs/fixtures/reference-project/content/presentations/2026-spring-briefing/generated.yaml`](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/generated.yaml)

## Root fields

| Field | Required | Type |
| --- | --- | --- |
| `generated.id` | yes | string |
| `generated.period` | yes | object |
| `generated.previous_presentation_id` | no | string |
| `generated.stats` | yes | object |
| `generated.releases` | yes | array |
| `generated.contributors` | yes | object |
| `generated.merged_prs` | no | array |

## `generated.period`

| Field | Required | Type |
| --- | --- | --- |
| `start` | yes | string |
| `end` | yes | string |

## `generated.stats`

`stats` is a record keyed by metric id. The current UI commonly uses keys like:

- `stars`
- `issues_closed`
- `prs_merged`
- `new_contributors`

Each metric object uses the same shape:

| Field | Required | Type |
| --- | --- | --- |
| `label` | yes | string |
| `current` | yes | number |
| `previous` | yes | number |
| `delta` | yes | number |
| `metadata` | yes | object |

### `generated.stats.<metric>`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `label` | yes | string | Human-facing label used by metric slides. |
| `current` | yes | number | Current-period value. |
| `previous` | yes | number | Previous-period value or fallback/unavailable placeholder. |
| `delta` | yes | number | `current - previous`. |
| `metadata` | yes | object | Comparison metadata used for audit/debugging. |

### `generated.stats.<metric>.metadata`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `comparison_status` | yes | string | One of `complete`, `partial`, `skipped`, or `unavailable`. |
| `warning_codes` | yes | string[] | Machine-readable warnings for the metric. |

## `generated.releases[]`

| Field | Required | Type |
| --- | --- | --- |
| `id` | yes | string |
| `version` | yes | string |
| `published_at` | yes | string |
| `url` | yes | string |
| `summary_bullets` | yes | string[] |

## `generated.contributors`

| Field | Required | Type |
| --- | --- | --- |
| `total` | yes | number |
| `authors` | yes | array |

### `generated.contributors.authors[]`

| Field | Required | Type |
| --- | --- | --- |
| `login` | yes | string |
| `name` | yes | string |
| `avatar_url` | yes | string |
| `merged_prs` | yes | number |
| `first_time` | yes | boolean |

## `generated.merged_prs[]`

| Field | Required | Type |
| --- | --- | --- |
| `number` | yes | number |
| `title` | yes | string |
| `merged_at` | yes | string |
| `author_login` | yes | string |

## Notes

- `generated.yaml` is not required to come from the GitHub connector.
- The live validator only checks the shape, not the semantic truth of the values.
- If you hand-author this file, keep labels and metric keys consistent with the slide content that consumes them.
