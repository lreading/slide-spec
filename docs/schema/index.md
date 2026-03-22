# Schema

slide-spec keeps authored content and generated content in separate YAML files so the data model stays reviewable.

This section documents the live schema currently used by the app and CLI.

## Files

- `site.yaml`
- `presentations/index.yaml`
- `presentation.yaml`
- `generated.yaml`

## Reading order

1. `site.yaml`
2. `presentations/index.yaml`
3. `presentation.yaml`
4. `generated.yaml`

The first two define project-level metadata and the presentation registry. The last two define the presentation itself and the generated data attached to it.
