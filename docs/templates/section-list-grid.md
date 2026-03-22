# Section List Grid

This template is for grouped bullet content in a card grid.

## Example YAML

```yaml
template: section-list-grid
enabled: true
title: What changed
subtitle: Product, docs, and release engineering
content:
  sections:
    - title: Product
      bullets:
        - Reusable templates landed.
        - Desktop fixes reduced friction.
    - title: Docs
      bullets:
        - Schema docs were refreshed.
        - CLI guidance was updated.
```

## Screenshot

![Section list grid slide](/screenshots/templates/section-list-grid-slide.png)

## Behavior

- Each section title becomes a card title.
- Bullets are rendered in a compact grid layout.
- Empty sections should be omitted rather than padded with filler text.
