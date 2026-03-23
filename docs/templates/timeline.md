# Timeline

Release cards for ids in `content.featured_release_ids`; card body comes from `generated.releases[]`.

Reference deck: **`2026-spring-briefing`**, slide **4**, viewport **1440×900**.

## Reference screenshot

<figure class="template-doc-shot">
  <img src="/screenshots/template-timeline-reference.png" alt="Timeline template reference slide from the fixture deck" />
</figure>

## YAML that matches the screenshot

### `presentation.yaml` — this slide

```yaml
- template: timeline
  enabled: true
  title: Releases
  subtitle: Two tagged updates landed during this cycle
  content:
    latest_badge_label: Latest
    footer_link_label: Browse the release archive
    featured_release_ids:
      - starter-kit-v2
      - export-layout-v1
```

### `generated.yaml` — releases shown on cards

Per-deck file: `content/presentations/<presentation-id>/generated.yaml` (this deck: `.../2026-spring-briefing/generated.yaml`).

```yaml
generated:
  releases:
    - id: starter-kit-v2
      version: Starter Kit v2
      published_at: 2026-05-20
      url: https://example.com/releases/starter-kit-v2
      summary_bullets:
        - Added launch ownership and sign-off states to the starter kit.
        - Standardized how operators export and review rollout summaries.
    - id: export-layout-v1
      version: Export Layout v1
      published_at: 2026-04-18
      url: https://example.com/releases/export-layout-v1
      summary_bullets:
        - Improved PDF spacing for customer-facing review decks.
        - Preserved section hierarchy in exported summaries.
```

### `site.yaml` — footer link target

The footer CTA uses `content.footer_link_label` for the label; the **href** is `{site.links.repository.url}/releases`.

```yaml
site:
  links:
    repository:
      label: Product Repo
      url: https://github.com/example/acorn-cloud
```

### `site.yaml` — slide chrome

```yaml
site:
  presentation_logo:
    url: content/assets/slide-spec-logo.svg
    alt: Slide Spec logo
  presentation_chrome:
    mark_label: Acorn Cloud
```

### `presentation.yaml` — mark line

```yaml
presentation:
  subtitle: Spring 2026
```

## Screen

| Region | Source |
| --- | --- |
| Title / subtitle | `slide.title`, `slide.subtitle` |
| Cards | `featured_release_ids` matched to `generated.releases[]` |
| “Latest” badge | `content.latest_badge_label` on first card |
| Version / date | `generated.releases[].version`, `published_at` |
| Bullets | `generated.releases[].summary_bullets` |
| Footer link | `content.footer_link_label` + `site.links.repository.url` + `/releases` |

## Field reference

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `subtitle` | no | string |
| `content.latest_badge_label` | no | string |
| `content.footer_link_label` | no | string |
| `content.empty_state_title` | no | string |
| `content.empty_state_message` | no | string |
| `content.featured_release_ids` | yes | string[] |

## Omitted behavior

Empty `featured_release_ids` shows empty-state copy when provided. IDs with no matching `generated.releases[]` entry are skipped.
