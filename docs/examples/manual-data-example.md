# Manual Data Example

slide-spec does not require GitHub. The app reads `generated.yaml` as structured data—author it yourself when metrics come from spreadsheets, internal tools, or other systems.

Use this path for internal briefings, customer rollouts, repos outside GitHub, or any pipeline that exports numbers you map into the schema.

## Workflow

1. Run `init`.
2. Edit `site.yaml`, `presentations/index.yaml`, and `presentation.yaml`.
3. Write `generated.yaml` (by hand or from your own exporter).
4. Run `validate`, then `build` or `serve`.

Typical non-GitHub inputs: CSV from analytics, issue counts from Jira or Linear, release notes from an internal process, contributor rollups from a spreadsheet or HR report.

## Remote assets

Prefer local files under `content/assets/`. HTTPS URLs are allowed when you need a hosted logo or image:

```yaml
site:
  presentation_logo:
    url: https://cdn.example.com/brand/logo.svg
    alt: Company logo
```

## Manual `generated` snippet

Metric ids under `stats` are yours (see [generated schema](/schema/generated)). This block matches the reference fixture shape—`issues_closed` fits Jira, Linear, or an internal tracker as easily as GitHub.

```yaml
generated:
  id: 2026-spring-briefing
  period:
    start: 2026-03-01
    end: 2026-05-31
  stats:
    issues_closed:
      label: Issues closed
      current: 14
      previous: 9
      delta: 5
      metadata:
        comparison_status: complete
        warning_codes: []
```

Full fixture for copy-paste and diffing:

- [`docs/fixtures/reference-project/content/presentations/2026-spring-briefing/generated.yaml`](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/generated.yaml)
