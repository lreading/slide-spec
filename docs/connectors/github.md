# GitHub Connector

GitHub is the only built-in data source today.

## Configure the source

Add this to `content/site.yaml`:

```yaml
site:
  data_sources:
    - type: github
      url: https://github.com/OWNER/REPO
```

Rules enforced by the validator:

- `data_sources` must be an array
- only one GitHub source is supported for fetch
- the URL must point to `github.com`

## What the connector fetches

- repository metadata
- releases
- merged pull requests
- closed issues
- contributor history used for first-time contributor detection
- star snapshots for the current and previous periods

## What still stays authored

- roadmap narrative
- spotlight summaries
- community mentions
- CTA copy
- template structure

## Token guidance

- A PAT is recommended.
- The CLI can continue without one, but rate-limiting or reduced coverage is more likely.
- When provided interactively, the CLI can write the local `.env` file for you.

## Current limitation

Very large repositories can still make historical star snapshots expensive because exact star history is costly to reconstruct. The CLI records warnings and metadata when those snapshot paths become partial or unavailable.
