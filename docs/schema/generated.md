# generated.yaml

Generated data for a presentation - metrics, releases, and contributors. Populated by a [connector](/connectors/) or authored by hand.

For a complete example, see the [reference generated.yaml](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/generated.yaml).

## Top level

| Field | Required | Type | Description |
| --- | --- | --- | --- |
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

Array of release objects. The validator checks that `releases` is an array. Expected shape for each entry:

| Field | Description |
| --- | --- |
| `id` | Unique release id (referenced by timeline slides) |
| `version` | Display version string |
| `published_at` | Publication date |
| `url` | Link to the release |
| `summary_bullets` | Array of summary strings |

## `generated.contributors`

| Field | Required | Type |
| --- | --- | --- |
| `total` | yes | number |
| `authors` | yes | array |

The validator checks structure only. Expected shape for each author:

| Field | Description |
| --- | --- |
| `login` | Username or handle |
| `name` | Display name |
| `avatar_url` | Avatar image URL |
| `merged_prs` | Number of merged PRs or completed items |
| `first_time` | Whether this is a first-time contributor |

## `generated.merged_prs`

Optional. If present, must be an array. Expected shape per entry:

| Field | Description |
| --- | --- |
| `number` | Item number |
| `title` | Item title |
| `merged_at` | Completion date |
| `author_login` | Author's username |

## Notes

- The `id` in `generated.yaml` must match the presentation's `id`
- Keep metric keys aligned with `stat_keys` in any [metrics-and-links](/templates/metrics-and-links) slide that references them
- This file does not have to come from a connector - hand-author it with data from any source
