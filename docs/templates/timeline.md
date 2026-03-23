# Timeline

The `timeline` template renders release entries from `generated.yaml`.

![Timeline reference slide](/screenshots/template-timeline-reference.png)

## Visible regions

1. Slide title and optional subtitle
2. One release card per matching id in `content.featured_release_ids`
3. Latest badge from `content.latest_badge_label` on the first rendered release
4. Release version and publish date from `generated.releases[]`
5. Release bullet list from `generated.releases[].summary_bullets`
6. Footer link label from `content.footer_link_label`
7. Empty-state title/message when no release cards match

## Example YAML

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

## Also rendered from `generated.yaml`

- `generated.releases[].id`
- `generated.releases[].version`
- `generated.releases[].published_at`
- `generated.releases[].url`
- `generated.releases[].summary_bullets`

## Omitted behavior

- If `featured_release_ids` is empty, the empty-state title/message are used instead of release cards.
- If `empty_state_title` and `empty_state_message` are omitted, the template still renders but has no authored empty-state copy.
