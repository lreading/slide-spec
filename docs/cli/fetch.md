# fetch

Populates `generated.yaml` for a presentation using the connector configured in `site.yaml`.

```bash
npx @slide-spec/cli fetch \
  --presentation-id 2026-spring-briefing \
  --from-date 2026-03-01 \
  --to-date 2026-05-31
```

## Flags

| Flag | Required | Description |
| --- | --- | --- |
| `[project-root]` (positional) | | Target project. Defaults to current directory |
| `--presentation-id` | yes | Presentation to update |
| `--from-date` | yes | Period start date |
| `--to-date` | | Period end date (defaults to today) |
| `--no-previous-period` | | Skip previous-period comparison |
| `--timings` | | Print timing for each fetch step |
| `--dry-run` | | Preview without writing `generated.yaml` |
| `--force` | | Overwrite `generated.yaml` if it already exists |

## What it writes

`fetch` writes `content/presentations/<id>/generated.yaml` with data from the configured connector: metrics, releases, contributors, and related details.

If `generated.yaml` already exists, `fetch` exits with an error to prevent accidental overwrites. Pass `--force` to overwrite it.

It does not touch slide titles, roadmap content, spotlights, or CTAs.

## Requirements

- `site.yaml` must define a data source (see [connectors](/connectors/))
- Authentication credentials may be required depending on the connector
