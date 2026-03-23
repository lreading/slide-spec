# Tutorial example

Build a minimal deck from scratch. The steps match [`docs/fixtures/reference-project/`](https://github.com/lreading/slide-spec/tree/main/docs/fixtures/reference-project) in the main repo.

## Step 1: `init`

```bash
npx @slide-spec/cli init ./acorn-cloud-updates \
  --presentation-id 2026-spring-briefing \
  --title "Acorn Cloud Product Brief" \
  --subtitle "Spring 2026" \
  --from-date 2026-03-01 \
  --to-date 2026-05-31
```

## Step 2: Branding assets

Add `content/assets/slide-spec-logo.svg` and `content/assets/slide-spec-mascot.svg`. Local paths avoid network calls during `build` and `serve`.

## Step 3: `content/site.yaml`

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
    owasp:
      label: Community Hub
      url: https://example.com/community
      eyebrow: Website
```

## Step 4: `content/presentations/index.yaml`

```yaml
presentations:
  - id: 2026-spring-briefing
    year: 2026
    title: Acorn Cloud Product Brief
    subtitle: Spring 2026
    summary: Reliability work, platform roadmap, and team highlights for the first half of spring.
    published: true
    featured: true
```

## Step 5: `presentation.yaml`

Copy from the tracked reference—one slide per template, global roadmap data, and authored titles, subtitles, and blocks:

- [`docs/fixtures/reference-project/content/presentations/2026-spring-briefing/presentation.yaml`](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/presentation.yaml)

## Step 6: `generated.yaml`

Same fixture: stable hand-authored metrics (`period`, `previous_presentation_id`, metric metadata, releases, contributors, merged pull requests):

- [`docs/fixtures/reference-project/content/presentations/2026-spring-briefing/generated.yaml`](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/generated.yaml)

## Step 7: Validate

```bash
npx @slide-spec/cli validate ./acorn-cloud-updates
```

## Step 8: Build

```bash
npx @slide-spec/cli build ./acorn-cloud-updates
```

## Step 9: Serve

```bash
npx @slide-spec/cli serve ./acorn-cloud-updates
```

## Optional: GitHub `fetch` later

Add a connector and run `fetch` when you want live GitHub data instead of hand-written `generated.yaml`:

```yaml
site:
  data_sources:
    - type: github
      url: https://github.com/OWNER/REPO
```

## Takeaways

The fixture shows end-to-end YAML authoring, validation, and build without a GitHub data source. Add `site.data_sources` only when you need automated metrics.
