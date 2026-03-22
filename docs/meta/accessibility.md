# Accessibility

slide-spec runs an automated accessibility audit against the main app surfaces as part of the standard app gate.

## Current Scope

The automated audit covers:

- the home page
- the presentations index
- the standard presentation view
- presentation mode
- a keyboard-only focus path through the main home-page navigation flow

The audit is implemented with Playwright and axe-core.

## Local Command

```bash
cd app
npm run a11y
```

## Current Status

- automated audit: passing
- keyboard navigation spot checks: passing for the main home-page flow and presentation navigation

This status is intentionally conservative. It is an automated audit signal, not a formal WCAG compliance claim.
