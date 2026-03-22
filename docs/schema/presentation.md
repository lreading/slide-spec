# `presentation.yaml`

This file defines the authored slide content for a single presentation.

## Purpose

The document is intentionally template-first. Every slide declares:
- `template`
- `enabled`
- `content`

Shared fields like `title`, `subtitle`, and `roadmap` metadata live at the presentation level.

## Minimal example

```yaml
presentation:
  id: demo-2026-q1
  title: Demo Presentation
  subtitle: Q1 2026
  slides:
    - template: hero
      enabled: true
      content: {}
```

## Field reference

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Must match the registry entry. |
| `title` | yes | Presentation title. |
| `subtitle` | yes | Subtitle or period label. |
| `roadmap` | no | Optional roadmap metadata used by progress timeline slides. |
| `slides` | yes | Ordered slide list. Each slide must declare a template. |

## Slide rules

- `template` selects the renderer and validator.
- `enabled` controls whether the slide appears in the app and agenda.
- `content` carries template-owned fields.
- Missing optional content should usually hide UI rather than invent copy.
