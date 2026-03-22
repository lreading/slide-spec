# Progress Timeline

This template visualizes roadmap status across the current stage flow.

## Example YAML

```yaml
template: progress-timeline
enabled: true
title: Roadmap: In Progress
content:
  stage: in-progress
```

## Screenshot

![Progress timeline slide](/screenshots/templates/progress-timeline-slide.png)

## Behavior

- The stage controls which roadmap section is highlighted.
- The slide should show the current stage plus the neighboring stages for context.
- Missing roadmap detail should omit that region instead of inventing placeholders.
