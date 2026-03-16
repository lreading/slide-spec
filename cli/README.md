# CLI

This project will become the repository CLI for authoring and data-fetch workflows.

Current scope:
- service interface for future CLI commands
- site config loading
- GitHub data-source resolution
- `.env` token loading

Commands:
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run verify`

Environment:
- copy `.env.example` to `.env`
- set `GITHUB_TOKEN`

Current source of truth:
- GitHub fetch target comes from `../content/site.yaml`
- fetch code will use `site.data_sources`

Current status:
- command parsing is not implemented yet
- GitHub transport is not implemented yet
