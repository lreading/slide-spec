# People

Contributor spotlight: banner line plus cards for each `content.spotlight[]` entry, joined to `generated.contributors`.

![People reference slide](/screenshots/template-people-reference.png)

## Screen

| Region | Source |
| --- | --- |
| Title / subtitle | `slide.title`, `slide.subtitle` |
| Banner | `content.banner_prefix`, linked `content.contributors_link_label`, `content.banner_suffix` |
| Cards | One per `content.spotlight[]`; name/login from generated contributor match |
| Summary | `content.spotlight[].summary` |
| Profile link | Built from `content.spotlight[].login` and contributor metadata |

## Example

```yaml
template: people
enabled: true
title: Contributor spotlight
subtitle: Three contributors whose work clearly shaped this cycle
content:
  banner_prefix: Thanks to
  contributors_link_label: contributors
  banner_suffix: who handled product delivery, export polish, and rollout docs this season.
  spotlight:
    - login: ava-product
      summary: Defined the starter-kit structure and coordinated the rollout checklist overhaul.
```

## Field reference

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `subtitle` | no | string |
| `content.banner_prefix` | no | string |
| `content.contributors_link_label` | no | string |
| `content.banner_suffix` | no | string |
| `content.spotlight` | yes | array |

### `content.spotlight[]`

| Field | Required | Type |
| --- | --- | --- |
| `login` | yes | string |
| `summary` | yes | string |

## From `generated.yaml`

| Path | Role |
| --- | --- |
| `generated.contributors.total` | Used in banner / counts |
| `generated.contributors.authors[]` | Resolved by `login` for card data |

## Omitted behavior

Omitting `banner_prefix`, `contributors_link_label`, and `banner_suffix` removes the banner. Each `spotlight[].login` resolves through `generated.contributors.authors[]`; if absent, the card uses the login as the visible name.
