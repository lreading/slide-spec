# `presentations/index.yaml`

This file is the registry of available presentations.

## Purpose

It tells the app and CLI which presentations exist, which one is featured, and where to find each presentation's authored and generated YAML.

## Minimal example

```yaml
presentations:
  - id: demo-2026-q1
    title: Demo Presentation
    subtitle: Q1 2026
    presentation: presentations/demo-2026-q1/presentation.yaml
    generated: presentations/demo-2026-q1/generated.yaml
```

## Field reference

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Presentation slug used in routes and file paths. |
| `year` | no | Helpful for filtering/sorting the listing page. |
| `title` | yes | Presentation title shown in the UI. |
| `subtitle` | yes | Short summary or time window label. |
| `featured` | no | Whether the presentation should surface first in the listing. |
| `published` | no | Optional publication status flag. |
| `presentation` | yes | Path to the authored presentation YAML. |
| `generated` | yes | Path to generated data YAML. |

## Omitted behavior

- The listing page can sort and filter without every optional field.
- The featured presentation becomes the default home CTA target.
