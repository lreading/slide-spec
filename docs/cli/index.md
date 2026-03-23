# CLI reference

The CLI is how you scaffold, validate, build, and preview slide-spec projects. It ships its own static runtime for `build` and `serve`, so the project does not need a copy of the web app source.

Typical order: `init` → edit YAML → `validate` → optional `fetch` → `build` or `serve`.

Commands: [init](/cli/init), [fetch](/cli/fetch), [build](/cli/build), [serve](/cli/serve), [validate](/cli/validate).

## Project root

Every command takes a project root: either the first positional argument (`npx @slide-spec/cli validate ./my-slides`) or `--project-root`.

## Interactive mode

`slide-spec` with no subcommand opens interactive mode. `slide-spec init` with no flags runs interactive init.
