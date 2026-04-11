# generated.yaml

Generated data for a presentation - metrics, releases, and contributors. Populated by a [connector](/connectors/) or authored by hand.

For a complete example, see the [reference generated.yaml](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/generated.yaml).

## Top level

```yaml
# yaml-language-server: $schema=https://slide-spec.dev/schema/generated.schema.json
schemaVersion: 1
generated:
  id: 2026-spring-briefing
```

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `schemaVersion` | yes | number | Major schema version. Must be `1` for this Slide Spec release. |
| `generated.id` | yes | string | Must match the presentation id |
| `generated.period` | yes | object | Reporting period |
| `generated.stats` | yes | object | Metric values keyed by id |
| `generated.releases` | yes | array | Release entries |
| `generated.contributors` | yes | object | Contributor data |
| `generated.previous_presentation_id` | | string | Links to the prior presentation for comparison |
| `generated.merged_prs` | | array | Merged pull request entries |

## `generated.period`

| Field | Required | Type |
| --- | --- | --- |
| `start` | yes | string |
| `end` | yes | string |

## `generated.stats`

An object where each key is a metric id (e.g. `stars`, `issues_closed`, `stories_completed`). Key names are arbitrary - use whatever fits your data. Each value:

| Field | Required | Type |
| --- | --- | --- |
| `label` | yes | string |
| `current` | yes | number |
| `previous` | yes | number |
| `delta` | yes | number |
| `metadata` | yes | object |

### `metadata`

| Field | Required | Type | Values |
| --- | --- | --- | --- |
| `comparison_status` | yes | string | `complete`, `partial`, `skipped`, `unavailable` |
| `warning_codes` | yes | string[] | Empty array when no warnings |

Example:

```yaml
generated:
  stats:
    stars:
      label: GitHub Stars
      current: 1840
      previous: 1760
      delta: 80
      metadata:
        comparison_status: complete
        warning_codes: []
```

## `generated.releases`

Required array of release objects.

### `generated.releases[]`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | yes | string | Unique release id, usually the tag name. Used by timeline slides to match entries. |
| `version` | yes | string | Display version string. The CLI currently sets this to the release tag name. |
| `published_at` | yes | string | Publication timestamp. The CLI emits an ISO-like UTC string. |
| `url` | yes | string | Link to the release page. |
| `summary_bullets` | yes | string[] | Short summary bullets shown on the slide. The CLI limits this to a small list of bullet strings. |

## `generated.contributors`

| Field | Required | Type |
| --- | --- | --- |
| `total` | yes | number |
| `authors` | yes | array |

`total` is the number of unique authors in the current reporting period.

### `generated.contributors.authors[]`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `login` | yes | string | GitHub username or handle. Used for profile links and contributor matching. |
| `name` | yes | string | Display name. The CLI falls back to the login when GitHub does not provide a name. |
| `avatar_url` | yes | string | Avatar image URL. The CLI falls back to a GitHub avatar URL when needed. |
| `merged_prs` | yes | number | Number of merged pull requests attributed to this contributor in the reporting period. |
| `first_time` | yes | boolean | Whether this contributor had no merged PR history before the current period. |

## `generated.merged_prs`

Optional. If present, it must be an array of merged pull request entries.

### `generated.merged_prs[]`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `number` | yes | number | Pull request number. |
| `title` | yes | string | Pull request title. |
| `merged_at` | yes | string | Merge timestamp. The CLI emits an ISO-like UTC string. |
| `author_login` | yes | string | Author's GitHub username. |

## Notes

- The `id` in `generated.yaml` must match the presentation's `id`
- Keep metric keys aligned with `stat_keys` in any [metrics-and-links](/templates/metrics-and-links) slide that references them
- `generated.releases` is required even when it is an empty array
- `generated.contributors.authors` is required even when it is an empty array
- `generated.previous_presentation_id` is optional and only present when a previous period exists
- `generated.merged_prs` is optional and omitted when the CLI does not include historical merged PR data
- This file does not have to come from a connector - hand-author it with data from any source
