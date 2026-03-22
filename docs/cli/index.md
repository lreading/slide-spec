# CLI

The CLI is the authoring and generation entry point for slide-spec projects.

## Commands

| Command | Purpose |
| --- | --- |
| `init` | Scaffold a new project with minimal working config. |
| `fetch` | Pull GitHub-backed generated data into `generated.yaml`. |
| `build` | Build the static site into `dist/`. |
| `serve` | Build first, then serve the static site locally. |
| `validate` | Validate authored and generated content. |

## Usage model

The CLI operates on a project root. That root contains the content/config for the presentation project, not the CLI source itself.

## Common flags

- `--project-root <path>`: explicitly set the project root.
- positional project-root: supported as a convenience for all commands.
- `--help`: show command-specific help.

## Packaging

The packaged CLI is intended to be run with `npx @slide-spec/cli` or as the installed `slide-spec` binary once published.
