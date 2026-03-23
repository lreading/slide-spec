# Tutorial Example

This tutorial creates a small presentation project from scratch and shows exactly what to edit.

The final reference project used for the docs lives under:

- `docs/fixtures/reference-project/`

The walkthrough below is the human-readable version of that same project.

## Step 1: Scaffold the project

```bash
npx @slide-spec/cli init ./acorn-cloud-updates \
  --presentation-id 2026-spring-briefing \
  --title "Acorn Cloud Product Brief" \
  --subtitle "Spring 2026" \
  --from-date 2026-03-01 \
  --to-date 2026-05-31
```

## Step 2: Add branding assets

Create:

- `content/assets/slide-spec-logo.svg`
- `content/assets/slide-spec-mascot.svg`

Local assets are the easiest option because they build and serve without external dependencies.

## Step 3: Replace `content/site.yaml`

Update the scaffolded file so it looks like this:

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

## Step 4: Replace `content/presentations/index.yaml`

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

## Step 5: Author `presentation.yaml`

The full tutorial file is longer than this page should duplicate. Use the tracked reference file directly:

- [`docs/fixtures/reference-project/content/presentations/2026-spring-briefing/presentation.yaml`](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/presentation.yaml)

That file shows:

- one slide per current template
- global roadmap data
- authored slide titles, subtitles, and content blocks

## Step 6: Author `generated.yaml`

This tutorial uses hand-authored generated data so the example stays stable.

Use:

- [`docs/fixtures/reference-project/content/presentations/2026-spring-briefing/generated.yaml`](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/generated.yaml)

That file demonstrates:

- `period`
- `previous_presentation_id`
- complete metric metadata
- releases
- contributors
- merged pull requests

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

## Optional Step 10: Add a GitHub source later

If you later want generated metrics from GitHub, add:

```yaml
site:
  data_sources:
    - type: github
      url: https://github.com/OWNER/REPO
```

Then run `fetch`.

## What this tutorial proves

- You can author every visible part of the site from YAML.
- You do not need a GitHub source to use slide-spec.
- The app still validates and builds cleanly from manually-authored generated data.
