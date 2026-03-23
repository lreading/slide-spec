# People

The `people` template renders a contributor spotlight slide.

![People reference slide](/screenshots/template-people-reference.png)

## Example YAML

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

## Also rendered from `generated.yaml`

- `generated.contributors.total`
- `generated.contributors.authors[]`

## Visible regions

1. Banner prefix, contributors link, and suffix
2. Contributor card title from generated contributor name/login
3. Summary quote from `content.spotlight[].summary`
4. Profile link built from the contributor login

## Omitted behavior

- If banner fields are omitted, the banner disappears.
- Spotlight entries only control which contributors are featured and what summary text is shown.
