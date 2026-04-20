# site.yaml

Global branding, navigation labels, footer links, and page copy.

## Minimal example

```yaml
# yaml-language-server: $schema=https://slide-spec.dev/schema/site.schema.json
schemaVersion: 1
site:
  title: My Project Updates
  home_intro: Team updates published from YAML.
  home_cta_label: View latest presentation
  presentations_cta_label: View all presentations
  links:
    repository:
      label: Source Code
      url: https://github.com/example/my-project
    docs:
      label: Documentation
      url: https://example.com/docs
    community:
      label: Community
      url: https://example.com/community
```

For a complete example, see the [reference site.yaml](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/site.yaml).

## Field reference

### Root

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `schemaVersion` | yes | number | Major schema version. Must be `1` for this Slide Spec release. |
| `site.title` | yes | string | Site title for the app shell and document title |
| `site.home_intro` | yes | string | Home page intro paragraph |
| `site.home_cta_label` | yes | string | Primary home page button label |
| `site.presentations_cta_label` | yes | string | Secondary home page button label |
| `site.links` | yes | object | Footer/resource links (see below) |
| `site.deployment_url` | | string | Public URL for the deployed site. Required when `sitemap_enabled` is `true` |
| `site.sitemap_enabled` | | boolean | Enable sitemap generation. Requires `deployment_url` |
| `site.metadata` | | object | Static HTML metadata for search and social previews |
| `site.mascot` | | object | Shared mascot image |
| `site.data_sources` | | array | External data sources (GitHub only) |
| `site.project_badge` | | object | Badge near the hero/title |
| `site.presentation_logo` | | object | Logo shown in presentation sidebar |
| `site.navigation` | | object | Nav bar labels |
| `site.app_footer` | | object | Footer repository link |
| `site.attribution` | | object | Optional attribution block |
| `site.presentation_chrome` | | object | Slide chrome labels |
| `site.presentation_toolbar` | | object | Toolbar labels and shortcut copy |
| `site.home_hero` | | object | Home page hero title parts |
| `site.home_logos` | | array | Optional compact home page logo links |
| `site.presentations_page` | | object | Presentations list page labels |

All optional string fields must be non-blank when present. Optional objects can be omitted entirely.

### `site.metadata`

These values are written into the built root HTML document so crawlers and link previews can read them before the app loads.

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | Falls back to `site.title` |
| `description` | string | Falls back to `site.home_intro` |
| `image_url` | string | Absolute URL or root-relative path for Open Graph and Twitter/X preview images |
| `image_alt` | string | Requires `image_url` |

If `site.deployment_url` or `--deployment-url` is set, relative `image_url` values are resolved against that canonical site URL. Put root-relative static preview images in the project `public/` directory so they are copied into `dist/`. The canonical URL, Open Graph URL, and sitemap URL all use the same deployment URL.

### `site.links`

Three link keys are required:

| Key | Required |
| --- | --- |
| `repository` | yes |
| `docs` | yes |
| `community` | yes |

Each link object:

| Field | Required | Type |
| --- | --- | --- |
| `label` | yes | string |
| `url` | yes | string |
| `eyebrow` | | string |

### `site.mascot`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `url` | | string | Local or remote image path |
| `alt` | | string | Requires `url` |

### `site.data_sources[]`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `type` | yes | string | Must be `github` |
| `url` | yes | string | Must be a `github.com` URL |

### `site.project_badge`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `label` | | string | Badge text |
| `fa_icon` | | string | Font Awesome class (e.g. `fa-code`) |
| `icon_position` | | string | `before` or `after` |

At least one of `label` or `fa_icon` must be present.

### `site.presentation_logo`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `url` | | string | Local or remote image path |
| `alt` | | string | Requires `url` |

### `site.navigation`

| Field | Type |
| --- | --- |
| `brand_title` | string |
| `home_label` | string |
| `presentations_label` | string |
| `latest_presentation_label` | string |
| `docs_enabled` | boolean |
| `toggle_label` | string |

All fields optional.

### `site.app_footer`

| Field | Type | Notes |
| --- | --- | --- |
| `repository_label` | string | Set both or omit both |
| `repository_url` | string | Set both or omit both |

### `site.attribution`

| Field | Type | Notes |
| --- | --- | --- |
| `enabled` | boolean | |
| `label` | string | Must be paired with `url` |
| `url` | string | Must be paired with `label` |

### `site.presentation_chrome`

| Field | Type |
| --- | --- |
| `mark_label` | string |

### `site.presentation_toolbar`

| Field | Type |
| --- | --- |
| `navigation_label` | string |
| `previous_slide_label` | string |
| `next_slide_label` | string |
| `presentation_mode_label` | string |
| `shortcut_help_title` | string |
| `shortcut_help_body` | string |
| `shortcut_help_dismiss_label` | string |

All fields optional.

### `site.home_hero`

| Field | Type |
| --- | --- |
| `title_primary` | string |
| `title_accent` | string |
| `subtitle` | string |

All fields optional.

### `site.home_logos[]`

Compact logo links rendered below the home page hero. Use them for "used by" links, featured projects, partner logos, or other small logo-based references.

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `name` | yes | string | Link text shown below the logo |
| `url` | yes | string | Link target |
| `logo` | yes | object | Logo image |

#### `site.home_logos[].logo`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `url` | yes | string | Local or remote image path |
| `alt` | yes | string | Accessible image text |

### `site.presentations_page`

| Field | Type |
| --- | --- |
| `title` | string |
| `search_label` | string |
| `search_placeholder` | string |
| `year_label` | string |
| `all_years_label` | string |
| `open_presentation_label` | string |
| `empty_title` | string |
| `empty_message` | string |
| `previous_page_label` | string |
| `next_page_label` | string |
| `page_label` | string |
| `page_of_label` | string |
| `showing_label` | string |
| `total_label` | string |
| `presentation_singular_label` | string |
| `presentation_plural_label` | string |

All fields optional.
