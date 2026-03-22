# `site.yaml`

`site.yaml` defines global project settings, navigation labels, links, and source configuration.

## Purpose

This file controls content that applies across the whole site:
- site title
- nav labels
- footer links
- project badge/logo
- data sources
- presentation chrome labels

## Minimal example

```yaml
site:
  title: slide-spec
  home_intro: Static presentations from YAML and GitHub data.
  home_cta_label: View latest presentation
  presentations_cta_label: View all presentations
  links:
    repository:
      label: GitHub
      url: https://github.com/lreading/slide-spec
```

## Field reference

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Site name shown in docs and app chrome. |
| `mascot` | no | Optional mascot object with `url` and `alt` used on the home/title/closing views. |
| `data_sources` | no | External data sources, currently GitHub only. |
| `project_badge` | no | Optional brand badge shown on the home/title views. |
| `presentation_logo` | no | Optional logo image for the shared slide chrome. |
| `navigation` | no | Labels for the main app navigation. |
| `app_footer` | no | Footer label and link for the app chrome. |
| `attribution` | no | Product attribution footer control; defaults to enabled if omitted. |
| `presentation_chrome` | no | Shared slide chrome mark label. |
| `presentation_toolbar` | no | Labels for next/previous/presentation mode controls. |
| `home_hero` | no | Title/subtitle text for the home hero. |
| `home_intro` | yes | Short intro sentence on the home page. |
| `home_cta_label` | yes | Primary home CTA label. |
| `presentations_cta_label` | yes | Secondary home CTA label. |
| `presentations_page` | no | Labels for the presentations listing page. |
| `links` | yes | Shared external links used across the app. |

## Omitted behavior

- Missing optional fields are omitted from the UI.
- Labels should come from config rather than hardcoded defaults where possible.
- The `data_sources` block is optional, but GitHub fetches require it when using the CLI.
