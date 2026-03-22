# `fetch`

`fetch` collects generated data from external sources and writes `generated.yaml`.

## Behavior

- Requires a project root and a date range.
- Uses GitHub data when configured in `site.yaml`.
- Can continue in best-effort mode when no PAT is supplied, but some data may be rate-limited or unavailable.

## Example

```bash
npx @slide-spec/cli fetch ./my-slides --from-date 2026-01-01 --to-date 2026-03-31
```
