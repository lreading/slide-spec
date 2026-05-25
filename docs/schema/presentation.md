# presentation.yaml

Defines the authored slide content and deck structure.

For a complete example, see the [reference presentation.yaml](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/presentation.yaml).

Each slide owns its own `content` block. If two slides need the same copy or labels, repeat them on those slides rather than relying on shared presentation-level data.

Icon fields named `fa_icon` or ending in `_fa_icon` accept supported Font Awesome values from the [Font Awesome icon reference](/reference/fontawesome). All icon fields are optional and keep their documented defaults when omitted.

## Top level

```yaml
# yaml-language-server: $schema=https://slide-spec.dev/schema/presentation.schema.json
schemaVersion: 1
presentation:
  id: 2026-spring-briefing
```

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `schemaVersion` | yes | number | Major schema version. Must be `1` for this Slide Spec release. |
| `presentation.id` | yes | string | Presentation identifier used by the catalog entry |
| `presentation.title` | yes | string | Deck title |
| `presentation.subtitle` | yes | string | Deck subtitle |
| `presentation.year` | | number | Optional year |
| `presentation.slides` | yes | array | Ordered list of slides |

## Progress timeline slide content

The [progress-timeline](/templates/progress-timeline) template is self-contained. The slide owns its stage strip, active-stage detail, and footer labels.

| Field | Required | Type |
| --- | --- | --- |
| `content.stage` | yes | string |
| `content.deliverables_heading` | | string |
| `content.focus_areas_heading` | | string |
| `content.footer_link_label` | | string |
| `content.item_fa_icon` | | string |
| `content.focus_areas_fa_icon` | | string |
| `content.theme_fa_icon` | | string |
| `content.footer_link_fa_icon` | | string |
| `content.stages` | yes | object |
| `content.items` | yes | string[] |
| `content.themes` | yes | array of `{ category, target }` |

### `content.stages`

Must contain exactly four keys:

| Key | Required |
| --- | --- |
| `completed` | yes |
| `in-progress` | yes |
| `planned` | yes |
| `future` | yes |

Each stage strip entry:

| Field | Required | Type |
| --- | --- | --- |
| `label` | yes | string |
| `summary` | yes | string |

The active stage's `items` and `themes` live on the slide itself. Each `themes[]` entry has `category` (string, required) and `target` (string, required).

## Slides

Each slide in the `slides` array:

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `template` | yes | string | One of the supported [template ids](/templates/) |
| `enabled` | yes | boolean | Disabled slides are skipped |
| `title` | varies | string | Required by most templates |
| `subtitle` | | string | Optional on all templates |
| `content` | varies | object | Shape depends on `template`. Required for all except `agenda` |

## Template content validation

Each template enforces specific rules on `title` and `content`. Full authoring details are on each [template page](/templates/). The tables below summarize what the validator requires.

### hero

| Field | Required | Notes |
| --- | --- | --- |
| `content.title_primary` | | At least one of `title_primary` or `title_accent` required |
| `content.title_accent` | | |
| `content.subtitle_prefix` | | |
| `content.quote` | | |

Slide-level `title` is not required.

### agenda

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `content` | | Omit entirely or configure `content.card_arrow_fa_icon`. Row text comes from other slides |
| `content.card_arrow_fa_icon` | | Defaults to `fa-chevron-right` |

### section-title

| Field | Required | Notes |
| --- | --- | --- |
| `content.title` | yes | |
| `content.subtitle` | | |
| `content.image_url` | | |
| `content.image_alt` | | Requires `content.image_url` |

### section-list-grid

| Field | Required |
| --- | --- |
| `title` | yes |
| `content.sections` | yes |

Each `sections[]` entry: `{ title: string, bullets: string[] }`.

Each `sections[]` entry may also set `fa_icon` to override its badge icon.

### timeline

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `content.featured_release_ids` | yes | Array of release id strings (can be empty) |
| `content.latest_badge_label` | | |
| `content.footer_link_label` | | |
| `content.empty_state_title` | | |
| `content.empty_state_message` | | |
| `content.latest_release_fa_icon` | | Defaults to `fa-tag` |
| `content.release_fa_icon` | | Defaults to `fa-code-branch` |
| `content.footer_link_fa_icon` | | Defaults to `fa-github` |

### progress-timeline

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `content.stage` | yes | `completed`, `in-progress`, `planned`, or `future` |
| `content.deliverables_heading` | | |
| `content.focus_areas_heading` | | |
| `content.footer_link_label` | | |
| `content.item_fa_icon` | | Defaults to `fa-chevron-right` |
| `content.focus_areas_fa_icon` | | Defaults to `fa-bullseye` |
| `content.theme_fa_icon` | | Defaults to `fa-chevron-right` |
| `content.footer_link_fa_icon` | | Defaults to `fa-github` |
| `content.stages` | yes | Four stage strip entries |
| `content.items` | yes | Active stage items |
| `content.themes` | yes | Active stage themes |

### people

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `content.spotlight` | yes | |
| `content.banner_prefix` | | |
| `content.contributors_link_label` | | |
| `content.banner_suffix` | | |
| `content.github_fa_icon` | | Defaults to `fa-github` |
| `content.quote_fa_icon` | | Defaults to `fa-quote-left` |
| `content.banner_fa_icon` | | Defaults to `fa-heart` |

Each `spotlight[]` entry: `{ login: string, summary: string }` with optional `fa_icon`.

### metrics-and-links

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `content.stat_keys` | yes | |
| `content.mentions` | yes | |
| `content.section_heading` | | |
| `content.stats_heading` | | |
| `content.show_deltas` | | |
| `content.trend_suffix` | | |
| `content.section_heading_fa_icon` | | Defaults to `fa-bullhorn` |
| `content.stats_heading_fa_icon` | | Defaults to `fa-chart-line` |
| `content.stat_fa_icons` | | Optional string array matched to `stat_keys` order |
| `content.trend_up_fa_icon` | | Defaults to `fa-arrow-up` |
| `content.trend_down_fa_icon` | | Defaults to `fa-arrow-down` |

Each `mentions[]` entry: `{ type: string, title: string }` with optional paired `url` + `url_label`, optional `fa_icon`, and optional `link_fa_icon`.

### image-and-bullets

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `content.image_side` | | `left` or `right`, defaults to `right` in rendering |
| `content.image` | conditional | Required if `content.bullets` is omitted |
| `content.bullets` | conditional | Required if `content.image` is omitted; must include at least one item when present |

`content` must include at least one major block: `image` or `bullets`.

When present, `image` has shape: `{ src: string, alt?: string, description?: string }`.

### action-cards

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `content.cards` | yes | |
| `content.footer_text` | | |
| `content.footer_fa_icon` | | Defaults to `fa-github` |
| `content.footer_link_fa_icon` | | Defaults to `fa-code` |

Each `cards[]` entry: `{ title, description, url_label, url }` (all required strings) with optional `fa_icon` and `link_fa_icon`.

### closing

| Field | Required | Notes |
| --- | --- | --- |
| `content.heading` | yes | |
| `content.message` | yes | |
| `content.quote` | | |
| `content.repository_fa_icon` | | Defaults to `fa-github` |
| `content.docs_fa_icon` | | Defaults to `fa-book` |
| `content.community_fa_icon` | | Defaults to `fa-shield-alt` |

Slide-level `title` is not required.
