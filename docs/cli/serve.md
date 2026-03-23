# `serve`

`serve` builds the project and serves `dist/` locally.

```bash
npx @slide-spec/cli serve ./my-slides
```

| Flag | Notes |
| --- | --- |
| `--host` | Bind address. |
| `--port` | Preferred port; the CLI may pick another if it is taken. |

This is the supported preview path for packaged projects; you do not need a separate dev server inside the content repo.
