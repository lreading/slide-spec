# CLI Reference

The CLI is the authoring and build interface for slide-spec projects.

## Command order

1. `init`
2. edit YAML
3. `validate`
4. optional `fetch`
5. `build`
6. `serve`

## Commands

- [init](/cli/init)
- [fetch](/cli/fetch)
- [build](/cli/build)
- [serve](/cli/serve)
- [validate](/cli/validate)

## Project-root model

All commands operate on a target project root.

You can pass that root:

- as a positional argument, for example `slide-spec validate ./my-slides`
- or with `--project-root`

## Interactive mode

- `slide-spec` with no arguments starts interactive mode
- `slide-spec init` with no flags starts interactive init

## Packaged runtime behavior

The target project does not need a local `app/` source tree. The packaged CLI brings its own runtime for `build` and `serve`.
