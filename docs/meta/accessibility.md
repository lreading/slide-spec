# Accessibility

## Web app

The slide-spec app runs automated axe audits in CI (Playwright + `@axe-core/playwright`), covering the home page, presentations index, presentation view, viewport mode, fullscreen mode, and keyboard navigation.

```bash
pnpm --filter @slide-spec/app a11y
```

This is an automated check, not a WCAG conformance certification.

## Documentation site

The docs site runs the same axe audit stack against a production build:

```bash
pnpm --filter @slide-spec/docs a11y:install
pnpm --filter @slide-spec/docs a11y
```

Syntax highlighting uses `github-light-high-contrast` and `github-dark-high-contrast` Shiki themes for AA contrast compliance. Images open in a lightbox on click (Escape or click outside to dismiss).
