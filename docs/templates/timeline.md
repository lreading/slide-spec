# Timeline

Release cards for ids listed in `content.featured_release_ids`; body copy comes from `generated.yaml`.

![Timeline reference slide](/screenshots/template-timeline-reference.png)

## Screen

| Region | Source |
| --- | --- |
| Title / subtitle | `slide.title`, `slide.subtitle` |
| Release cards | One per id in `content.featured_release_ids` that exists in `generated.releases[]` |
| “Latest” badge | `content.latest_badge_label` on first rendered card |
| Version / date | `generated.releases[].version`, `generated.releases[].published_at` |
| Summary bullets | `generated.releases[].summary_bullets` |
| Footer link | Label from `content.footer_link_label`; href is `{site.links.repository.url}/releases` |
| Empty state | `content.empty_state_title`, `content.empty_state_message` when no ids match |

## Example

```yaml
template: timeline
enabled: true
title: Releases
subtitle: Two tagged updates landed during this cycle
content:
  latest_badge_label: Latest
  footer_link_label: Browse the release archive
  featured_release_ids:
    - starter-kit-v2
    - export-layout-v1
```

## Field reference

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `subtitle` | no | string |
| `content.latest_badge_label` | no | string |
| `content.footer_link_label` | no | string |
| `content.empty_state_title` | no | string |
| `content.empty_state_message` | no | string |
| `content.featured_release_ids` | yes | string[] |

## From `generated.yaml` (`generated.releases[]`)

| Field | Role |
| --- | --- |
| `id` | Matched against `featured_release_ids` |
| `version` | Shown on card |
| `published_at` | Shown on card |
| `url` | Card link target |
| `summary_bullets` | Card bullet list |

## Omitted behavior

Empty `featured_release_ids` shows the empty-state copy. If both empty-state strings are omitted, the slide still renders without authored empty-state text.
