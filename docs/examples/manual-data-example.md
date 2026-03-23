# Manual Data Example

You do not need GitHub to use slide-spec.

The current app treats `generated.yaml` as a structured data source, not as a file that must come from the CLI. That means you can create it yourself if your metrics come from somewhere else.

Good fits for a manual-data project:

- internal product briefings
- customer rollout decks
- projects hosted outside GitHub
- teams that export stats from another system

## Manual data workflow

1. Run `init`.
2. Author `site.yaml`, `presentations/index.yaml`, and `presentation.yaml`.
3. Write `generated.yaml` yourself.
4. Run `validate`.
5. Run `build` or `serve`.

## Example data sources that are not GitHub

- CSV exports from analytics tools
- issue counts from Jira or Linear
- release notes from an internal release process
- contributor summaries from a spreadsheet or people-ops report

## Remote asset example

Local assets are recommended, but remote URLs are supported. Example:

```yaml
site:
  presentation_logo:
    url: https://raw.githubusercontent.com/lreading/slide-spec/main/app/public/slide-spec-mark.svg
    alt: Slide Spec logo
```

## Manual metrics example

```yaml
generated:
  id: 2026-spring-briefing
  period:
    start: 2026-03-01
    end: 2026-05-31
  stats:
    stars:
      label: GitHub Stars
      current: 1840
      previous: 1760
      delta: 80
      metadata:
        comparison_status: complete
        warning_codes: []
```

The full reference file is here:

- [`docs/fixtures/reference-project/content/presentations/2026-spring-briefing/generated.yaml`](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/generated.yaml)
