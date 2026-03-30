# Tutorial

Build a full presentation from scratch. The YAML shown here matches the [reference project](https://github.com/lreading/slide-spec/tree/main/docs/fixtures/reference-project) in the repo.

## 1. Scaffold

```bash
npx @slide-spec/cli init ./acorn-cloud-updates \
  --presentation-id 2026-spring-briefing \
  --title "Acorn Cloud Product Brief" \
  --subtitle "Spring 2026" \
  --from-date 2026-03-01 \
  --to-date 2026-05-31
```

## 2. Add branding assets

Place logos in `content/assets/`:

- `content/assets/slide-spec-logo.svg`
- `content/assets/slide-spec-mascot.svg`

Local paths avoid network calls during build.

## 3. Edit `content/site.yaml`

```yaml
site:
  title: Acorn Cloud Updates
  mascot:
    url: content/assets/slide-spec-mascot.svg
    alt: Slide Spec mascot
  project_badge:
    label: YAML-First Slides
    fa_icon: fa-code
    icon_position: before
  presentation_logo:
    url: content/assets/slide-spec-logo.svg
    alt: Slide Spec logo
  navigation:
    brand_title: Acorn Cloud Updates
    home_label: Home
    presentations_label: Presentations
    latest_presentation_label: Latest Presentation
    toggle_label: Toggle navigation
  attribution:
    enabled: true
    label: Powered by slide-spec
    url: https://github.com/lreading/slide-spec
  presentation_chrome:
    mark_label: Acorn Cloud
  presentation_toolbar:
    navigation_label: Slide navigation
    previous_slide_label: Previous slide
    next_slide_label: Next slide
    presentation_mode_label: Presentation mode
    shortcut_help_title: Keyboard shortcuts
    shortcut_help_body: Use Left and Right to move, Space or Enter for next, and Escape to exit presentation mode.
    shortcut_help_dismiss_label: Do not show again
  home_hero:
    title_primary: Acorn
    title_accent: Cloud
    subtitle: Product Briefings
  home_intro: Team updates and product briefings, published from YAML with a static build.
  home_cta_label: View latest presentation
  presentations_cta_label: View all presentations
  presentations_page:
    title: All presentations
    search_label: Search
    search_placeholder: Search presentations...
    year_label: Year
    all_years_label: All years
    open_presentation_label: Open presentation
    empty_title: No matching presentations
    empty_message: Try a different year or a broader search term.
    previous_page_label: Previous
    next_page_label: Next
    page_label: Page
    page_of_label: of
    showing_label: Showing
    total_label: total
    presentation_singular_label: presentation
    presentation_plural_label: presentations
  links:
    repository:
      label: Product Repo
      url: https://github.com/example/acorn-cloud
      eyebrow: Source Code
    docs:
      label: User Docs
      url: https://example.com/docs
      eyebrow: Documentation
    community:
      label: Community Hub
      url: https://example.com/community
      eyebrow: Website
```

## 4. Edit `content/presentations/index.yaml`

```yaml
presentations:
  - id: 2026-spring-briefing
    year: 2026
    title: Acorn Cloud Product Brief
    subtitle: Spring 2026
    summary: Reliability work, platform roadmap, and team highlights for the first half of spring.
    published: true
    featured: true
    presentation_path: presentations/2026-spring-briefing/presentation.yaml
    generated_path: presentations/2026-spring-briefing/generated.yaml
```

## 5. Edit `presentation.yaml`

Copy from the reference fixture. It includes one slide per template with the full content each template expects, including the slimmer self-contained progress-timeline slide data:

[`presentations/2026-spring-briefing/presentation.yaml`](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/presentation.yaml)

## 6. Edit `generated.yaml`

Use the reference fixture for stable hand-authored metrics, releases, and contributors:

[`presentations/2026-spring-briefing/generated.yaml`](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/generated.yaml)

## 7. Validate, build, serve

```bash
npx @slide-spec/cli validate ./acorn-cloud-updates
npx @slide-spec/cli build ./acorn-cloud-updates
npx @slide-spec/cli serve ./acorn-cloud-updates
```

## Adding GitHub data later

Replace hand-authored `generated.yaml` with live data by adding a connector:

```yaml
site:
  data_sources:
    - type: github
      url: https://github.com/OWNER/REPO
```

Then run [`fetch`](/cli/fetch) to populate `generated.yaml` automatically.
