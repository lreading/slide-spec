# `serve`

`serve` builds the site and serves the generated `dist/` output locally.

## Usage

```bash
npx @slide-spec/cli serve ./my-slides
```

## Optional flags

| Flag | Notes |
| --- | --- |
| `--host` | Host to bind to. |
| `--port` | Preferred port. The CLI may choose another port when needed. |

## Notes

- `serve` is the supported local preview path for packaged projects.
- It is not necessary to run a dev server inside the project itself.
