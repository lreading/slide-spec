# Action Cards

This template presents a compact set of calls to action or contribution options.

## Example YAML

```yaml
template: action-cards
enabled: true
title: How to Contribute
subtitle: Practical ways to help
content:
  footer_text: Open Source and Community Driven
  cards:
    - title: Report Bugs
      description: File a reproducible issue with the details maintainers need.
      url_label: Submit an issue
      url: https://github.com/example/repo/issues
```

## Screenshot

![Action cards slide](/screenshots/templates/action-cards-slide.png)

## Behavior

- Each card is a link card.
- Footer text is optional and should disappear when omitted.
- Empty card lists should not render filler cards.
