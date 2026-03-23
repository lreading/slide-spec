# `fetch`

`fetch` fills `generated.yaml` for one presentation from the GitHub data source in `site.yaml`.

```bash
npx @slide-spec/cli fetch ./my-slides \
  --presentation-id 2026-spring-briefing \
  --from-date 2026-03-01 \
  --to-date 2026-05-31
```

## Required flags

| Flag | Notes |
| --- | --- |
| `project-root` (positional or `--project-root`) | Target project. |
| `--presentation-id` | Which deck to update. |
| `--from-date` | Period start. |
| `--to-date` | Period end; defaults to today if omitted. |

## Optional flags

| Flag | Notes |
| --- | --- |
| `--no-previous-period` | Skip previous-period comparison. |
| `--timings` | Print per-step timing. |

`site.yaml` must define exactly one GitHub data source today. A PAT is recommended for reliable metrics.

`fetch` overwrites `content/presentations/<presentation-id>/generated.yaml`. It does not write slide titles, roadmap prose, spotlights, or CTAs.
