# serve

Validates the project, then starts a local Vite dev server with hot reload for `content/` changes.

```bash
npx @slide-spec/cli serve
```

## Flags

| Flag | Default | Description |
| --- | --- | --- |
| `[project-root]` (positional) | current directory | Target project |
| `--host` | `127.0.0.1` | Bind address |
| `--port` | `5173` | Port. If omitted and `5173` is taken, another free port is used |
| `--open` | | Open browser automatically |
