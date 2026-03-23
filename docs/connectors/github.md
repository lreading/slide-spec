# GitHub connector

GitHub is the only first-party data source today. Add it under `site.data_sources` in `content/site.yaml`:

```yaml
site:
  data_sources:
    - type: github
      url: https://github.com/OWNER/REPO
```

Validation rules: `data_sources` is an array, at most one GitHub entry is allowed for `fetch`, and the URL must be on `github.com`.

`fetch` pulls repository metadata, releases, merged PRs and closed issues in the window you pass, contributor history (for first-time contributor detection), and star snapshots for the current and previous periods. It does not author roadmap copy, spotlights, community notes, CTAs, or slide structure.

Use a PAT when you can. The CLI runs without one but hits rate limits and thinner coverage sooner; interactive flows can persist a token into `.env`.

Very large repos can make star history expensive; the CLI surfaces warnings when snapshots are partial.
