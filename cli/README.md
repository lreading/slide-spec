# CLI

This package is the authoring CLI for a presentation project that stores authored/generated YAML under `content/` and produces static output in `dist/`.

Package identity:
- npm package: `@oss-slides/cli`
- executable: `oss-slides`

Current scope:
- service interface for future CLI commands
- site config loading
- GitHub data-source resolution
- `.env` token loading
- typed GitHub client
- period-based generated-data fetching
- presentation scaffolding from explicit ids, titles, subtitles, and date ranges
- thin CLI command routing
- embedded static-site build/serve against a target project root

Commands:
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run cli -- <command> [options]`
- `npm run verify`

Environment:
- copy `.env.example` to `<project-root>/.env`
- set `GITHUB_PAT`

Fine-grained PAT setup:
1. Create a fine-grained personal access token in GitHub.
2. Set `Resource owner` to the account or organization that owns the target repository.
3. Under `Repository access`, select `Only select repositories` and choose the repository configured in `<project-root>/content/site.yaml`.
4. Under `Repository permissions`, grant:
   - `Contents: Read-only`
   - `Pull requests: Read-only`
   - `Issues: Read-only`
   - `Metadata: Read-only`
5. Save the token in `<project-root>/.env` as `GITHUB_PAT=...`.

Notes:
- If the repository belongs to an organization, the token may require org approval before it works.
- The current CLI only reads repository data. It does not need write permissions.
- For public-repository testing, GitHub's current fine-grained PAT flow may work with the public-repo access selection alone, even if the UI does not expose the older per-permission `Read-only` toggles described above.
- GitHub documents fine-grained PAT creation and permission mapping here:
  - https://docs.github.com/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
  - https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens

Current source of truth:
- GitHub fetch target comes from `<project-root>/content/site.yaml`
- fetch code will use `site.data_sources`

Current status:
- `fetchPresentationData(...)` is implemented in the application layer
- `initPresentation(...)` is implemented in the application layer
- command parsing is implemented
- `build`, `serve`, and `validate` run against the embedded packaged app runtime

CLI usage:
- `npm run build`
- `node ./dist/index.js help`
- `npm run cli -- init /path/to/project --presentation-id 2026-q2 --title "Community Update" --subtitle "April 2026" --from-date 2026-04-01 --to-date 2026-04-30`
- `npm run cli -- fetch /path/to/project --presentation-id 2026-q1 --from-date 2026-01-01 --to-date 2026-03-31`
- `npm run cli -- fetch /path/to/project --presentation-id 2026-q1 --from-date 2026-03-01 --no-previous-period --dry-run`
- `npm run cli -- build /path/to/project`
- `npm run cli -- serve /path/to/project --host 127.0.0.1 --port 5173`
- `npm run cli -- validate /path/to/project`

Installed usage:
- `npx @oss-slides/cli help`
- `npx @oss-slides/cli init /path/to/project --presentation-id 2026-q2 --title "Community Update" --subtitle "April 2026" --from-date 2026-04-01 --to-date 2026-04-30`
- `npx @oss-slides/cli fetch /path/to/project --presentation-id 2026-q1 --from-date 2026-01-01 --to-date 2026-03-31`
- `npx @oss-slides/cli build /path/to/project`
- `npx @oss-slides/cli serve /path/to/project --host 127.0.0.1 --port 5173`

Project root expectations:
- `content/site.yaml`
- `content/presentations/index.yaml`
- `content/presentations/<id>/presentation.yaml`
- `content/presentations/<id>/generated.yaml`
- `dist/` is created by `build` or `serve`

Notes:
- If `--project-root` is omitted, the CLI uses the current working directory.
- For local monorepo compatibility, env loading also falls back to `<project-root>/cli/.env` when `<project-root>/.env` is absent.
- `serve` builds first, then serves the generated `dist/` directory.
- A target project does not need a local `app/` directory or Vue source tree.
