# GitHub

The GitHub connector populates `generated.yaml` with data from a GitHub repository.

## Configuration

Add a data source to `site.yaml`:

```yaml
site:
  data_sources:
    - type: github
      url: https://github.com/OWNER/REPO
```

Then run [`fetch`](/cli/fetch) to populate `generated.yaml`.

## What it collects

- Star counts (current and previous period)
- Issues closed in the date window
- PRs merged in the date window
- Releases published in the date window
- Contributors with PR counts and first-time detection

## Authentication

A GitHub personal access token (PAT) is strongly recommended. Without one, requests hit public rate limits and return less data.

Set `GITHUB_PAT` in the `.env` file at the project root you are fetching from. The interactive `init` flow can write that file for you if you enter a token during setup.

Example:

```bash
GITHUB_PAT=ghp_your_token_here
```

If you skip the token, `fetch` still runs in best-effort mode, but it may return fewer releases, contributors, or history details depending on rate limits and repository size.

## Constraints

- One GitHub data source per project
- URL must be on `github.com`
- Very large repos may produce partial star history (the CLI warns when this happens)
