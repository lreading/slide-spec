# `build`

`build` produces a static site.

## Usage

```bash
npx @slide-spec/cli build ./my-slides
```

## Output

- writes `<project-root>/dist`

The build output is static HTML, CSS, and JS. No backend is required.

## Notes

- `build` uses the packaged runtime shipped with the CLI.
- The target project does not need a local copy of the app source.
