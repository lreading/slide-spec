# `site.yaml`

`site.yaml` defines global branding, navigation labels, footer links, and shared page copy.

## Minimal example

```yaml
site:
  title: Acorn Cloud Updates
  home_intro: Team updates and product briefings, published from YAML with a static build.
  home_cta_label: View latest presentation
  presentations_cta_label: View all presentations
  links:
    repository:
      label: Product Repo
      url: https://github.com/example/acorn-cloud
    docs:
      label: User Docs
      url: https://example.com/docs
    owasp:
      label: Community Hub
      url: https://example.com/community
```

## Complete example

See the tracked reference file:

- [`docs/fixtures/reference-project/content/site.yaml`](https://github.com/lreading/slide-spec/blob/main/docs/fixtures/reference-project/content/site.yaml)

## Field reference

### Root

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `site.title` | yes | non-blank string | Site title used by the app shell and document title logic. |
| `site.mascot` | no | object | Shared mascot image for home/title/closing surfaces. |
| `site.data_sources` | no | array | External data sources. Only GitHub is supported today. |
| `site.project_badge` | no | object | Small badge rendered near the hero/title identity. |
| `site.presentation_logo` | no | object | Shared sidebar/logo image for presentation chrome. |
| `site.navigation` | no | object | App nav labels. |
| `site.app_footer` | no | object | Repository link labels in the app footer. |
| `site.attribution` | no | object | Optional block; see subtable. Entire object omitted: behavior not specified by validator. |
| `site.presentation_chrome` | no | object | Shared slide chrome labels. |
| `site.presentation_toolbar` | no | object | Presentation view control labels and shortcut help copy. |
| `site.home_hero` | no | object | Home-page hero title parts. |
| `site.home_intro` | yes | non-blank string | Home-page intro paragraph. |
| `site.home_cta_label` | yes | non-blank string | Primary home CTA label. |
| `site.presentations_cta_label` | yes | non-blank string | Secondary home CTA label. |
| `site.presentations_page` | no | object | Archive/listing labels. |
| `site.links` | yes | object | Shared footer/resource links. |

### `site.mascot`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `url` | no | string | Local or remote image path. |
| `alt` | no | string | Requires `url`. |

### `site.data_sources[]`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `type` | yes | non-blank string | Must be `github`. |
| `url` | yes | non-blank string | Must parse as a URL whose host is `github.com` or `www.github.com`. |

### `site.project_badge`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `label` | no | string | Badge text. |
| `fa_icon` | no | string | Font Awesome icon class token, such as `fa-code`. |
| `icon_position` | no | string | If set, must be `before` or `after`. |

At least one of `label` or `fa_icon` must be present.

### `site.presentation_logo`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `url` | no | string | Local or remote image path. |
| `alt` | no | string | Requires `url`. |

### `site.navigation`

| Field | Required | Type |
| --- | --- | --- |
| `brand_title` | no | string |
| `home_label` | no | string |
| `presentations_label` | no | string |
| `latest_presentation_label` | no | string |
| `toggle_label` | no | string |

### `site.app_footer`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `repository_label` | no | string | Set together with `repository_url`, or omit both. |
| `repository_url` | no | string | Set together with `repository_label`, or omit both. |

### `site.attribution`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `enabled` | no | boolean | |
| `label` | no | string | Must be paired with `url` when either is set. |
| `url` | no | string | Must be paired with `label` when either is set. |

### `site.presentation_chrome`

| Field | Required | Type |
| --- | --- | --- |
| `mark_label` | no | string |

### `site.presentation_toolbar`

| Field | Required | Type |
| --- | --- | --- |
| `navigation_label` | no | string |
| `previous_slide_label` | no | string |
| `next_slide_label` | no | string |
| `presentation_mode_label` | no | string |
| `shortcut_help_title` | no | string |
| `shortcut_help_body` | no | string |
| `shortcut_help_dismiss_label` | no | string |

### `site.home_hero`

| Field | Required | Type |
| --- | --- | --- |
| `title_primary` | no | string |
| `title_accent` | no | string |
| `subtitle` | no | string |

### `site.presentations_page`

| Field | Required | Type |
| --- | --- | --- |
| `title` | no | string |
| `search_label` | no | string |
| `search_placeholder` | no | string |
| `year_label` | no | string |
| `all_years_label` | no | string |
| `open_presentation_label` | no | string |
| `empty_title` | no | string |
| `empty_message` | no | string |
| `previous_page_label` | no | string |
| `next_page_label` | no | string |
| `page_label` | no | string |
| `page_of_label` | no | string |
| `showing_label` | no | string |
| `total_label` | no | string |
| `presentation_singular_label` | no | string |
| `presentation_plural_label` | no | string |

### `site.links`

Three keys are currently required by the live validator:

- `repository`
- `docs`
- `owasp`

Each link object uses the same shape:

| Field | Required | Type |
| --- | --- | --- |
| `label` | yes | non-blank string |
| `url` | yes | non-blank string |
| `eyebrow` | no | string |

## Omitted behavior

- Optional blocks can be omitted entirely.
- Optional string fields: if present, must be non-blank after trim.
- `alt` without `url` is invalid on `site.mascot` and `site.presentation_logo`.
- `site.app_footer`: set both `repository_label` and `repository_url`, or omit both.
- `site.links.repository`, `site.links.docs`, and `site.links.owasp` must all exist.
