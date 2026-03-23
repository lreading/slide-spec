# Agenda

The `agenda` template renders a derived list of enabled slides.

![Agenda reference slide](/screenshots/template-agenda-reference.png)

## Visible regions

1. Slide title from `slide.title`
2. Optional subtitle from `slide.subtitle`
3. Agenda items derived from the rest of the enabled slides
4. Shared presentation chrome from `site.presentation_logo` and `site.presentation_chrome.mark_label`

## Example YAML

```yaml
template: agenda
enabled: true
title: Agenda
subtitle: What this briefing covers
content: {}
```

## Field reference

`agenda` has no template-specific `content` fields.

Required slide envelope fields:

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `subtitle` | no | string |

## Omitted behavior

- If `subtitle` is omitted, the subtitle line is removed.
- Disabled slides are not included in the generated agenda list.
