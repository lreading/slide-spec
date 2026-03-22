# Hero

The hero template is the title slide. It is the first thing people see, so it should carry the project identity clearly and quickly.

## Example YAML

```yaml
template: hero
enabled: true
content:
  title_primary: slide-spec
  title_accent: Declarative Slides
  subtitle_prefix: Static presentations from
  quote: Build once, publish anywhere.
```

## Screenshot

![Hero slide](/screenshots/templates/hero-slide.png)

## Behavior

- `title_primary` and `title_accent` form the large two-part title.
- `subtitle_prefix` is optional; if omitted, the slide can still render with the main title.
- `quote` is optional; if omitted, the callout line is removed.
