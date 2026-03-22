# Timeline

The timeline template is for release-oriented or milestone-oriented content.

## Example YAML

```yaml
template: timeline
enabled: true
content:
  latest_badge_label: Latest
  footer_link_label: View release history on GitHub
  empty_state_title: No tagged releases in this period
  empty_state_message: Release work happened, but no tagged release was published.
  featured_release_ids: []
```

## Screenshot

![Timeline slide](/screenshots/templates/timeline-slide.png)

## Behavior

- Featured releases are resolved from generated release data.
- If there are no releases, the empty state renders instead.
- The footer link is optional and should be hidden when missing.
