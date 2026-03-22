# Happy Path

This is the path we expect most users to follow.

## Start

1. Create a project with `init`.
2. Optionally enable GitHub import.
3. Fetch generated data.
4. Review the authored content.
5. Build or serve the static site.

## Example project layout

```text
content/
  site.yaml
  presentations/
    index.yaml
    2026-q1/
      presentation.yaml
      generated.yaml
```

## What a good first run looks like

- The scaffold works with minimal required input.
- Optional data source details can be added later.
- The first generated site opens locally without extra infrastructure.
