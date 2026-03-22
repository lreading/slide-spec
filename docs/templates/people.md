# People

This template spotlights contributors or other people involved in the work.

## Example YAML

```yaml
template: people
enabled: true
title: Contributor Spotlight
subtitle: Real people who moved the project forward
content:
  banner_prefix: Special thanks to all
  contributors_link_label: contributors
  banner_suffix: who shipped code, docs, and tests during the reporting period.
  spotlight:
    - login: octocat
      summary: Delivered the feature that unlocked the next release.
```

## Screenshot

![People slide](/screenshots/templates/people-slide.png)

## Behavior

- Each spotlight card links to the contributor profile.
- Banner copy is optional and should be omitted cleanly when missing.
- The contributor count link should be explicit and reviewable.
