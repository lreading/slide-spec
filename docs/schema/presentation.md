# presentation.yaml

Defines the authored slide content and deck structure.

For a complete example, see the [reference presentation.yaml](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/presentation.yaml).

Each slide owns its own `content` block. If two slides need the same copy or labels, repeat them on those slides rather than relying on shared presentation-level data.

Icon fields named `fa_icon` or ending in `_fa_icon` accept supported Font Awesome values from the [Font Awesome icon reference](/reference/fontawesome). All icon fields are optional and keep their documented defaults when omitted.

## Lightweight rich text

Body-copy string fields support a small rich-text subset when authored as YAML block scalars. Blank-line-separated text renders as paragraphs, blocks where every line starts with `- ` or `* ` render as unordered lists, and blocks where every line starts with ordered markers such as `1. ` or `1) ` render as ordered lists. This is not full Markdown, and raw HTML is rendered as text.

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

The [progress-timeline](/templates/progress-timeline) template is self-contained. The slide owns its stage strip, active-stage detail sections, and footer labels.

| Field | Required | Type |
| --- | --- | --- |
| `content.stage` | yes | string |
| `content.footer_link_label` | | string |
| `content.footer_link_fa_icon` | | string |
| `content.stages` | yes | object |
| `content.sections` | yes | array of section objects |

Stage summaries, rich-text section bodies, and key/value row values support lightweight rich text.

### `content.stages`

Must contain 2 to 6 entries. Stage keys are author-defined labels, such as:

| Example key |
| --- |
| `completed` |
| `in-progress` |
| `planned` |
| `future` |
| `6-months` |

Each stage strip entry:

| Field | Required | Type |
| --- | --- | --- |
| `label` | yes | string |
| `summary` | yes | string |

### `content.sections`

Must contain at least one and no more than three entries. Each section:

| Field | Required | Type |
| --- | --- | --- |
| `title` | | string |
| `fa_icon` | | string |
| `type` | yes | `richtext` or `keyvalue` |
| `body` | yes | string for `richtext`; array of `{ key, value }` for `keyvalue` |
| `separator_fa_icon` | | string; only valid for `keyvalue` sections |

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

### card-grid

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `content.items` | yes | Authored rows rendered in order |
| `content.card_arrow_fa_icon` | | Optional arrow icon rendered at the end of each card |

Each `items[]` entry requires `title`, with optional `marker_text`, `fa_icon`, and `url`. Set either `marker_text` or `fa_icon`, not both. If both are omitted, the card uses its 1-based row number. Cards with `url` render as full-card links.

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
| `content.stage` | yes | Must match one key in `content.stages` |
| `content.footer_link_label` | | |
| `content.footer_link_fa_icon` | | Defaults to `fa-github` |
| `content.stages` | yes | 2 to 6 stage strip entries, rendered in authored order |
| `content.sections` | yes | 1 to 3 active-stage sections |

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

Each `spotlight[]` entry requires `summary`, with optional `login`, `name`, and `fa_icon`. Entries with `login` render a GitHub handle link. Entries with only `name` render without a handle. Entries with neither `login` nor `name` render summary-only cards. `summary` supports lightweight rich text.

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

When present, `image` has shape: `{ src: string, alt?: string, description?: string }`. `description` supports lightweight rich text.

### action-cards

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `content.cards` | yes | |
| `content.footer_text` | | |
| `content.footer_link_enabled` | | Boolean. Defaults to `true`; set to `false` to hide the repository footer action for this slide |
| `content.footer_fa_icon` | | Defaults to `fa-github` |
| `content.footer_link_fa_icon` | | Defaults to `fa-code` |

Each `cards[]` entry requires `title`, with optional `description`, `fa_icon`, and `link_fa_icon`. `description` and `content.footer_text` support lightweight rich text.

`url` and `url_label` are paired: set both or omit both. Cards without links render as informational cards without a bottom link.

### closing

| Field | Required | Notes |
| --- | --- | --- |
| `content.heading` | yes | |
| `content.message` | yes | Supports lightweight rich text |
| `content.quote` | | |
| `content.repository_fa_icon` | | Defaults to `fa-github` |
| `content.docs_fa_icon` | | Defaults to `fa-book` |
| `content.community_fa_icon` | | Defaults to `fa-shield-alt` |

Slide-level `title` is not required.
