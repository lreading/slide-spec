# Community & DevRel Update

A quarterly community update from a developer relations team. This example shows how Slide Spec works for DevRel teams tracking community growth, events, content, and champion spotlights.

The full YAML for this example lives in the [`examples/community-update`](https://github.com/lreading/slide-spec/tree/main/examples/community-update) directory.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/comm-home.png" alt="Prism Community Updates home page" />
</figure>

## The scenario

The Prism Collective is a fictional developer community. The DevRel team publishes quarterly updates covering conference appearances, content releases, community champions, and engagement metrics. All data is hand-authored.

## Site configuration

```yaml
site:
  title: Prism Community Updates
  mascot:
    url: https://api.dicebear.com/9.x/bottts-neutral/svg?seed=prism
    alt: Prism mascot
  project_badge:
    label: Community
    fa_icon: fa-users
    icon_position: before
  home_hero:
    title_primary: Prism
    title_accent: Community
    subtitle: DevRel Updates
  home_intro: Quarterly community updates from the Prism Collective developer relations team.
  home_cta_label: View latest update
  presentations_cta_label: View all updates
  links:
    repository:
      label: GitHub
      url: https://github.com/example/prism
      eyebrow: Source Code
    docs:
      label: Community Hub
      url: https://community.prism.example.com
      eyebrow: Forum
    community:
      label: Events
      url: https://prism.example.com/events
      eyebrow: Calendar
```

## Slides

### Hero

<figure class="template-doc-shot">
  <img src="/screenshots/examples/comm-hero.png" alt="Prism Community hero slide" />
</figure>

```yaml
- template: hero
  enabled: true
  content:
    title_primary: Prism
    title_accent: Community
    subtitle_prefix: Q1 2026
    quote: Communities grow when people teach what they learn.
```

### What happened (section-list-grid)

Conference circuit, learning paths, and SDK launches. Note how the section-list-grid template works for non-engineering content like events and educational resources.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/comm-sections.png" alt="What happened slide with community highlights" />
</figure>

```yaml
- template: section-list-grid
  enabled: true
  title: What happened
  subtitle: Community highlights from Q1
  content:
    sections:
      - title: Learning paths
        bullets:
          - Getting Started path reached 2400 completions
          - Advanced Integrations launched with 8 modules
          - Migration Guide path covers v2 to v3 upgrades
      - title: Conference circuit
        bullets:
          - DevRelCon London - workshop on SDK design
          - ReactConf Miami - talk on developer portals
          - KubeCon Paris - booth and live demos
          - JSNation Amsterdam - lightning talk on YAML-first tooling
      - title: Community SDK
        bullets:
          - Published with 15 code samples in 4 languages
          - TypeScript, Python, Go, and Ruby clients
          - Interactive playground on the developer portal
```

### Community health (metrics-and-links)

Engagement metrics like forum members, events held, and SDK downloads. Mentions highlight testimonials and media coverage.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/comm-metrics.png" alt="Community health slide with engagement metrics" />
</figure>

```yaml
- template: metrics-and-links
  enabled: true
  title: Community health
  subtitle: Engagement signals from Q1
  content:
    section_heading: Highlights
    stats_heading: This quarter
    trend_suffix: vs Q4 2025
    show_deltas: true
    stat_keys:
      - forum_members
      - events_held
      - content_published
      - sdk_downloads
    mentions:
      - type: Testimonial
        title: "Prism's docs are the gold standard. I've never onboarded to a tool this fast."
      - type: Media
        title: "DevRel Weekly featured our community SDK launch as a top-5 developer tool release."
        url_label: Read the feature
        url: https://devrelweekly.example.com/issue/142
```

### Community champions (people)

Spotlight cards for community members who made an outsized impact. Note the `merged_prs: 0` entries - not every contribution is code.

<figure class="template-doc-shot">
  <img src="/screenshots/examples/comm-people.png" alt="Community champions slide" />
</figure>

```yaml
- template: people
  enabled: true
  title: Community champions
  subtitle: Members who went above and beyond
  content:
    banner_prefix: Celebrating
    contributors_link_label: community members
    banner_suffix: who made an outsized impact this quarter.
    spotlight:
      - login: elena-tutorials
        summary: Created the most-watched tutorial series on the platform with 18,000 views.
      - login: omar-translations
        summary: Led the effort to translate all getting-started guides into Spanish and Arabic.
      - login: anya-meetups
        summary: Organized 6 local meetups across Europe, bringing together 200+ developers.
```

### Get involved (action-cards)

<figure class="template-doc-shot">
  <img src="/screenshots/examples/comm-actions.png" alt="Get involved slide with community opportunities" />
</figure>

```yaml
- template: action-cards
  enabled: true
  title: Get involved
  subtitle: Ways to participate in Q2
  content:
    footer_text: The best community contributions are the ones only you can make.
    cards:
      - title: Become a mentor
        description: Join the mentorship pilot and help a newer developer grow their skills over 8 weeks.
        url_label: Apply now
        url: https://community.prism.example.com/mentorship
      - title: Speak at a meetup
        description: We are launching meetups in 5 cities. Submit a talk proposal or volunteer to host.
        url_label: Meetup program
        url: https://prism.example.com/events/meetups
      - title: Write a tutorial
        description: Share your expertise. Our content team will help with editing, graphics, and promotion.
        url_label: Content guide
        url: https://community.prism.example.com/contribute/content
```

### Generated data

Community-specific metrics. Note how `sdk_downloads` has `previous: 0` since the SDK was new this quarter.

```yaml
generated:
  id: 2026-q1-community
  period:
    start: 2026-01-01
    end: 2026-03-31
  stats:
    forum_members:
      label: Forum members
      current: 8420
      previous: 6800
      delta: 1620
      metadata:
        comparison_status: complete
        warning_codes: []
    sdk_downloads:
      label: SDK downloads
      current: 14500
      previous: 0
      delta: 14500
      metadata:
        comparison_status: complete
        warning_codes: []
  releases:
    - id: sdk-launch
      version: Community SDK v1.0
      published_at: "2026-03-01"
      url: https://prism.example.com/sdk
      summary_bullets:
        - Published with clients for TypeScript, Python, Go, and Ruby
        - Interactive playground on the developer portal
  contributors:
    total: 34
    authors:
      - login: elena-tutorials
        name: Elena Vasquez
        avatar_url: https://api.dicebear.com/9.x/avataaars/svg?seed=elena
        merged_prs: 0
        first_time: false
```
