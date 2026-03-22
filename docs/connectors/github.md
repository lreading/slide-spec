# GitHub Connector

The current connector reads GitHub repository data for generated slide content.

## Configuration

The repository source is declared in `site.yaml`:

```yaml
site:
  data_sources:
    - type: github
      url: https://github.com/OWASP/threat-dragon
```

## Authentication

- A GitHub PAT improves reliability and avoids rate-limiting.
- The CLI asks for a PAT in interactive mode when GitHub import is enabled.
- If you do not provide one, the CLI continues best-effort and may skip some data.

## What the connector fetches

- repository metadata
- releases
- merged PRs
- contributor data
- issue closures
- star snapshots

## What remains authored

- roadmap narrative
- slide copy
- curated mentions
- final editorial wording
