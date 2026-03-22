# slide-spec CLI

This package is the standalone authoring CLI for slide-spec.

It manages project scaffolding, GitHub-backed data fetches, validation, and local build/serve flows against a target project root.

Commands:

- `npm run cli -- help`
- `npm run cli -- init`
- `npm run cli -- fetch`
- `npm run cli -- build`
- `npm run cli -- serve`
- `npm run cli -- validate`

Environment:

- copy `.env.example` to `<project-root>/.env`
- set `GITHUB_PAT` if you want GitHub-backed fetches

Usage notes:

- The CLI is interactive when run with no arguments.
- `init` is interactive by default and starts with essentials first, then offers GitHub import, links, and local server startup.
- `init` accepts optional `--subtitle`, `--summary`, GitHub repo URL, docs URL, website URL, and GitHub data source URL fields.
- If you choose GitHub import interactively and paste a PAT, the CLI writes `<project-root>/.env` for you.
- `fetch` supports explicit date ranges and best-effort mode when no GitHub token is provided.
- `build` writes only `<project-root>/dist`.
- `serve` builds first, then serves `<project-root>/dist`.
- The CLI accepts an explicit project root so it can run against external projects, not just this repository.

For the full command surface, prompt flow, and project-root expectations, keep this README alongside the command help output and the implementation plan in `agents/`.
