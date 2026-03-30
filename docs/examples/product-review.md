# Product Management Review

A quarterly product review for an internal SaaS platform. This example shows how Slide Spec works for product teams tracking milestones, epics, customer feedback, and team spotlights - with no GitHub data at all.

The full YAML for this example lives in the [`examples/product-review`](https://github.com/lreading/slide-spec/tree/main/examples/product-review) directory.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/pm-home.png" alt="Meridian Product Reviews home page" />
</figure>

## The scenario

Meridian is a fictional project management SaaS. The product team publishes quarterly reviews to share what shipped, what the metrics look like, and where the roadmap is headed. All data is hand-authored from Jira exports and internal dashboards.

## Site configuration

Note how the three required links point to Jira, an internal wiki, and a roadmap page rather than GitHub. The `project_badge` marks this as an internal-only site.

```yaml
site:
  title: Meridian Product Reviews
  project_badge:
    label: Internal
    fa_icon: fa-lock
    icon_position: before
  home_hero:
    title_primary: Meridian
    title_accent: Reviews
    subtitle: Product Team
  home_intro: Quarterly product reviews for the Meridian platform team.
  home_cta_label: View latest review
  presentations_cta_label: View all reviews
  links:
    repository:
      label: Jira Board
      url: https://meridian.atlassian.net/browse/MER
      eyebrow: Project Tracker
    docs:
      label: Product Wiki
      url: https://meridian.example.com/wiki
      eyebrow: Documentation
    community:
      label: Roadmap
      url: https://meridian.example.com/roadmap
      eyebrow: Planning
```

## Slides

### Hero

<figure class="template-doc-shot">
  <img src="/screenshots/examples/pm-hero.png" alt="Meridian Q1 Review hero slide" />
</figure>

```yaml
- template: hero
  enabled: true
  content:
    title_primary: Meridian
    title_accent: Q1 Review
    subtitle_prefix: Product Team
    quote: Ship outcomes, not features.
```

### What we shipped (section-list-grid)

Three epics that shipped in Q1, each broken into bullet points.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/pm-sections.png" alt="What we shipped slide" />
</figure>

```yaml
- template: section-list-grid
  enabled: true
  title: What we shipped
  subtitle: Key deliverables from Q1
  content:
    sections:
      - title: Workspace redesign
        bullets:
          - Customizable layouts with drag-and-drop panels
          - Saved views for different project phases
          - Mobile-responsive workspace on tablet and phone
      - title: API v3
        bullets:
          - RESTful endpoints with OpenAPI 3.1 spec
          - Breaking change migration CLI for partners
          - Rate limiting with dashboard visibility
      - title: Self-serve onboarding
        bullets:
          - Guided setup wizard for teams under 50
          - Template library with 12 pre-built project types
          - Automated welcome sequences for new members
```

### Key metrics (metrics-and-links)

Product health metrics sourced from Jira and customer surveys. The `stat_keys` reference arbitrary metric ids in `generated.yaml`.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/pm-metrics.png" alt="Key metrics slide with product health data" />
</figure>

```yaml
- template: metrics-and-links
  enabled: true
  title: Key metrics
  subtitle: Product health signals from Q1
  content:
    section_heading: Customer signals
    stats_heading: This quarter
    trend_suffix: vs Q4 2025
    show_deltas: true
    stat_keys:
      - stories_completed
      - epics_closed
      - customer_nps
      - bugs_resolved
    mentions:
      - type: Customer feedback
        title: Enterprise customers rated the workspace redesign 4.6/5 in the post-launch survey.
      - type: Analyst report
        title: "Meridian named a Strong Performer in the 2026 project management wave."
        url_label: Read the report
        url: https://meridian.example.com/analyst-report
```

### Generated data

Metrics use product-specific keys like `stories_completed` and `customer_nps`. Releases track product milestones instead of git tags.

```yaml
generated:
  id: 2026-q1-review
  period:
    start: 2026-01-01
    end: 2026-03-31
  stats:
    stories_completed:
      label: Stories completed
      current: 142
      previous: 118
      delta: 24
      metadata:
        comparison_status: complete
        warning_codes: []
    customer_nps:
      label: Customer NPS
      current: 72
      previous: 65
      delta: 7
      metadata:
        comparison_status: complete
        warning_codes: []
  releases:
    - id: workspace-v2
      version: Workspace v2
      published_at: "2026-03-10"
      url: https://meridian.example.com/changelog/workspace-v2
      summary_bullets:
        - Customizable layouts with drag-and-drop panels
        - Saved views for different project phases
  contributors:
    total: 14
    authors:
      - login: priya-design
        name: Priya Sharma
        avatar_url: https://api.dicebear.com/9.x/avataaars/svg?seed=priya
        merged_prs: 18
        first_time: false
```
