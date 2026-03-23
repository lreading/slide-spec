# slide-spec docs

This directory is the VitePress docs site for slide-spec.

Use it for:

- the public docs site
- schema references
- template references
- CLI usage guides
- examples that should be easy for humans and tooling to follow

Local workflow:

1. `cd docs`
2. `npm install`
3. `npm run dev`
4. `npm run build`

Accessibility check (build + axe against `vitepress preview`):

```bash
npx playwright install chromium   # first time
npm run a11y
```

Notes:

- The docs site should stay markdown-first.
- Keep the docs organized so each page has a single clear purpose.
- Prefer concise pages that link outward rather than repeating the same explanation everywhere.
