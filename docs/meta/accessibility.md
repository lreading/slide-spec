# Accessibility

## Web app

The slide-spec app runs an automated axe audit in CI (Playwright + `@axe-core/playwright`). It covers the home page, presentations index, a standard presentation view, presentation mode, and a keyboard-only path through the primary home navigation.

```bash
cd app
npm run a11y
```

That is an automated signal, not a WCAG conformance certification.

## Documentation site

The VitePress docs use the same stack: after a production build, Playwright loads `vitepress preview` and axe scans a representative set of routes (home, quickstart, schema, templates, CLI, examples, connectors, meta).

```bash
cd docs
npm run a11y:install   # once per machine / CI image
npm run a11y
```

Syntax highlighting uses Shiki themes `github-light-high-contrast` and `github-dark-high-contrast` so code blocks stay within common AA contrast expectations. Theme chrome still uses VitePress’s default `div` wrapper for the main column; the docs audit disables axe’s best-practice-only `landmark-one-main` and `region` rules for that reason.

Screenshots in the main column use a lightbox on click (blurred backdrop, close control top-right, click outside the image or **Escape** to dismiss). The dialog receives focus when opened.
