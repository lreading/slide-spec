# Templates

Templates are pre-built layouts for slides. Each slide in a presentation requires a `template` field that determines how it renders. Some templates pull data from `generated.yaml`, others use only what you write in the slide's `content` block.

| Template | Purpose |
| --- | --- |
| [`hero`](/templates/hero) | Title slide with branding |
| [`agenda`](/templates/agenda) | Auto-generated table of contents |
| [`section-list-grid`](/templates/section-list-grid) | Grid of titled bullet sections |
| [`timeline`](/templates/timeline) | Release cards from generated data |
| [`progress-timeline`](/templates/progress-timeline) | Self-contained stage detail |
| [`people`](/templates/people) | Contributor spotlights |
| [`metrics-and-links`](/templates/metrics-and-links) | Metric tiles and authored mentions |
| [`action-cards`](/templates/action-cards) | CTA card grid |
| [`closing`](/templates/closing) | Final slide with message and links |

## Shared slide chrome

Most slides display a sidebar logo and corner mark. These come from `site.yaml` and apply globally, so they are not repeated on each template page:

```yaml
site:
  presentation_logo:
    url: content/assets/logo.svg
    alt: Project logo
  presentation_chrome:
    mark_label: My Project
```

The corner mark combines `site.presentation_chrome.mark_label` with `presentation.subtitle` from the deck.

## Slide structure

Every slide shares this envelope in `presentation.yaml`:

```yaml
- template: hero
  enabled: true
  title: Slide Title
  subtitle: Optional
  content:
    # ...template-specific fields
```

See [presentation.yaml](/schema/presentation) for the full validation rules.

## Validation

Each template enforces specific content requirements. When you run [`validate`](/cli/validate), it checks that every slide has the fields its template expects. For example, if a `section-list-grid` slide is missing `content.sections`, validation fails with an error like:

```
presentation document.presentation.slides[2].content.sections is required.
```

The error tells you which slide (by index) and which field is missing. Fix the YAML and run `validate` again. The individual template pages below document exactly which fields are required and which are optional.
