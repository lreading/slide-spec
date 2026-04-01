# Slide Spec CLI

Standalone CLI for Slide Spec. It scaffolds projects, validates YAML, fetches GitHub data into generated content, builds static sites, and serves them locally.

## Getting started

1. Node 24+ and npm. Semgrep also needs Docker.
2. From this directory, `npm install`
3. Copy `.env.example` to `.env` at the project root you target (monorepo root or a Slide Spec project).
4. Set `GITHUB_PAT` in `.env` if you want GitHub-backed fetches (optional).
5. `npm run cli -- help`

## Commands

| Command | Description |
| --- | --- |
| `npm run cli -- help` | List commands |
| `npm run cli -- init <root>` | Scaffold a project (interactive) |
| `npm run cli -- validate <root>` | Validate YAML |
| `npm run cli -- fetch <root>` | Fetch GitHub data into `generated.yaml` |
| `npm run cli -- build <root>` | Build static site to `<root>/dist` |
| `npm run cli -- serve <root>` | Build and serve locally |
| `npm run build` | Compile the CLI |
| `npm run verify` | Standard local gate (lint + typecheck + tests) |
| `npm run coverage` | Unit tests with coverage |
| `npm run semgrep` | Semgrep security scan (Docker) |
| `npm run spellcheck` | Spelling check |

Per-subcommand help: `npm run cli -- <command> --help`.

## Quality gates

`npm run verify` is the default. CI also runs `semgrep` and `spellcheck`.

## Notes

- Uses `../shared` for content types and validation.
- Run with no args for interactive mode.
- `init` can write a masked `GITHUB_PAT` into `.env` for you.
- `fetch` supports date ranges and best-effort mode without a token.
- `build --deployment-url <url>` enables `sitemap.xml` generation.
- Accepts an explicit project root, so it works against external projects too.
- Tagged commits on `main` are intended to trigger `npm publish` in CI once the package is published and the release pipeline is finalized.
