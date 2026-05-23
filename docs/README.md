# Slide Spec docs

VitePress site for Slide Spec covering schema reference, templates, CLI usage, and examples.

## Getting started

1. Node 24+ and pnpm.
2. From the repo root, `pnpm install`.
3. `pnpm --filter @slide-spec/docs dev`

## Commands

| Command | Description |
| --- | --- |
| `pnpm --filter @slide-spec/docs dev` | Local dev server |
| `pnpm --filter @slide-spec/docs build` | Production build |
| `pnpm --filter @slide-spec/docs spellcheck` | Spelling check |
| `pnpm --filter @slide-spec/docs verify` | Standard gate |

Accessibility check (build + axe against `vitepress preview`):

```bash
pnpm --filter @slide-spec/docs a11y:install
pnpm --filter @slide-spec/docs a11y
```

Run `pnpm --filter @slide-spec/docs verify` before you push docs-only changes.

## Notes

- No runtime dependencies on other monorepo packages.
- Keep each page focused on one topic.
- Not published to npm. Deploy as a static site.
- Versioned with the monorepo. Publish the built output however you prefer.
