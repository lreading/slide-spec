# `fetch`

`fetch` populates `generated.yaml` from the configured GitHub data source.

## Usage

```bash
npx @slide-spec/cli fetch ./my-slides \
  --presentation-id 2026-spring-briefing \
  --from-date 2026-03-01 \
  --to-date 2026-05-31
```

## Required inputs

| Flag | Required | Notes |
| --- | --- | --- |
| positional `project-root` or `--project-root` | yes | Target project. |
| `--presentation-id` | yes | Which presentation to update. |
| `--from-date` | yes | Start of the measured period. |
| `--to-date` | no | End of the measured period. Defaults to the current date when omitted. |

## Optional flags

| Flag | Notes |
| --- | --- |
| `--no-previous-period` | Skip previous-period comparison. |
| `--timings` | Print per-step fetch timing. |

## Requirements

- `content/site.yaml` must contain exactly one GitHub data source today.
- a GitHub PAT is recommended for reliable metrics

## Output

`fetch` updates:

- `content/presentations/<presentation-id>/generated.yaml`

## What gets fetched today

- repository metadata
- releases
- merged pull requests in the period
- closed issues in the period
- contributor history used for first-time contributor detection
- star snapshots for current and previous periods

## What does not get authored for you

- slide titles
- roadmap copy
- spotlight summaries
- call-to-action text
