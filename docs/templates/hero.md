# Hero

Title slide: primary/accent titles, optional subtitle line and quote, plus site chrome (mascot, project badge, footer links).

Reference deck: **`2026-spring-briefing`** in [`docs/fixtures/reference-project/`](https://github.com/lreading/slide-spec/tree/main/docs/fixtures/reference-project). Screenshot: slide **1**, viewport **1440×900** (`docs/scripts/generate-doc-assets.ts`).

## Reference screenshot

<figure class="template-doc-shot">
  <img src="/screenshots/template-hero-reference.png" alt="Hero template reference slide from the fixture deck" />
</figure>

## YAML that matches the screenshot

### `presentation.yaml` — this slide

```yaml
- template: hero
  enabled: true
  content:
    title_primary: Acorn
    title_accent: Cloud
    subtitle_prefix: Product Brief
    quote: Teams ship clearer launch updates when the layout is declarative.
```

### `presentation.yaml` — deck context (subtitle line)

The subtitle line is `subtitle_prefix` **—** `presentation.subtitle`:

```yaml
presentation:
  subtitle: Spring 2026
```

### `site.yaml` — fields on this slide

```yaml
site:
  mascot:
    url: content/assets/slide-spec-mascot.svg
    alt: Slide Spec mascot
  project_badge:
    label: YAML-First Slides
    fa_icon: fa-code
    icon_position: before
  links:
    repository:
      label: Product Repo
      url: https://github.com/example/acorn-cloud
      eyebrow: Source Code
    docs:
      label: User Docs
      url: https://example.com/docs
      eyebrow: Documentation
    owasp:
      label: Community Hub
      url: https://example.com/community
      eyebrow: Website
```

## Screen

| Region | Source |
| --- | --- |
| Mascot | `site.mascot` |
| Badge | `site.project_badge` |
| Title | `content.title_primary`, `content.title_accent` |
| Subtitle line | `content.subtitle_prefix` + `presentation.subtitle` |
| Quote | `content.quote` |
| Footer links | `site.links.repository`, `site.links.docs`, `site.links.owasp` |

## Field reference

| Field | Required | Type |
| --- | --- | --- |
| `content.title_primary` | no | string |
| `content.title_accent` | no | string |
| `content.subtitle_prefix` | no | string |
| `content.quote` | no | string |

At least one of `title_primary` or `title_accent` must be set.

## Omitted behavior

Omitting `quote` removes the quote line. Omitting `subtitle_prefix` removes the whole subtitle row; `presentation.subtitle` is only shown together with `subtitle_prefix` in the hero layout.
