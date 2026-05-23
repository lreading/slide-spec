# presentation.yaml

Defines the authored slide content and deck structure.

For a complete example, see the [reference presentation.yaml](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/presentations/2026-spring-briefing/presentation.yaml).

Each slide owns its own `content` block. If two slides need the same copy or labels, repeat them on those slides rather than relying on shared presentation-level data.

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
| `content` | | Omit entirely or pass `{}`. Row text comes from other slides |

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

### timeline

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `content.featured_release_ids` | yes | Array of release id strings (can be empty) |
| `content.latest_badge_label` | | |
| `content.footer_link_label` | | |
| `content.empty_state_title` | | |
| `content.empty_state_message` | | |

### progress-timeline

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `content.stage` | yes | `completed`, `in-progress`, `planned`, or `future` |
| `content.deliverables_heading` | | |
| `content.focus_areas_heading` | | |
| `content.footer_link_label` | | |
| `content.stages` | yes | Four stage strip entries |
| `content.items` | yes | Active stage items |
| `content.themes` | yes | Active stage themes |

### people

| Field | Required |
| --- | --- |
| `title` | yes |
| `content.spotlight` | yes |
| `content.banner_prefix` | |
| `content.contributors_link_label` | |
| `content.banner_suffix` | |

Each `spotlight[]` entry: `{ login: string, summary: string }`.

### metrics-and-links

| Field | Required |
| --- | --- |
| `title` | yes |
| `content.stat_keys` | yes |
| `content.mentions` | yes |
| `content.section_heading` | |
| `content.stats_heading` | |
| `content.show_deltas` | |
| `content.trend_suffix` | |

Each `mentions[]` entry: `{ type: string, title: string }` with optional paired `url` + `url_label`.

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

| Field | Required |
| --- | --- |
| `title` | yes |
| `content.cards` | yes |
| `content.footer_text` | |

Each `cards[]` entry: `{ title, description, url_label, url }` (all required strings).

### closing

| Field | Required | Notes |
| --- | --- | --- |
| `content.heading` | yes | |
| `content.message` | yes | |
| `content.quote` | | |

Slide-level `title` is not required.
