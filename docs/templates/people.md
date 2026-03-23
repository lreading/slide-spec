# People

Contributor spotlight: one card per `content.spotlight[]`, resolved against `generated.contributors.authors[]`. The banner link shows **`generated.contributors.total`** next to `contributors_link_label` and points at `{site.links.repository.url}/graphs/contributors`.

Reference deck: **`2026-spring-briefing`**, slide **6**, viewport **1440×900**.

## Reference screenshot

<figure class="template-doc-shot">
  <img src="/screenshots/template-people-reference.png" alt="People template reference slide from the fixture deck" />
</figure>

## YAML that matches the screenshot

### `presentation.yaml` — this slide

```yaml
- template: people
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
      - login: mo-rendering
        summary: Improved export polish, spacing, and rendering behavior for PDF output.
      - login: ren-docs
        summary: Reworked migration notes and operator docs so teams can adopt the new workflow quickly.
```

### `generated.yaml` — contributor totals and author rows

Per-deck file: `content/presentations/<presentation-id>/generated.yaml` (this deck: `.../2026-spring-briefing/generated.yaml`).

```yaml
generated:
  contributors:
    total: 5
    authors:
      - login: ava-product
        name: Ava Product
        avatar_url: https://avatars.githubusercontent.com/u/1?v=4
        merged_prs: 7
        first_time: false
      - login: mo-rendering
        name: Mo Rendering
        avatar_url: https://avatars.githubusercontent.com/u/2?v=4
        merged_prs: 4
        first_time: false
      - login: ren-docs
        name: Ren Docs
        avatar_url: https://avatars.githubusercontent.com/u/3?v=4
        merged_prs: 3
        first_time: true
      - login: ivy-platform
        name: Ivy Platform
        avatar_url: https://avatars.githubusercontent.com/u/4?v=4
        merged_prs: 2
        first_time: true
      - login: dan-checklists
        name: Dan Checklists
        avatar_url: https://avatars.githubusercontent.com/u/5?v=4
        merged_prs: 2
        first_time: true
```

### `site.yaml` — repository base URL for the contributors link

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

### `presentation.yaml` — mark subtitle line

```yaml
presentation:
  subtitle: Spring 2026
```

## Screen

| Region | Source |
| --- | --- |
| Title / subtitle | `slide.title`, `slide.subtitle` |
| Cards | One per `content.spotlight[]`; display name from matching `generated.contributors.authors[].name` (fallback: `login`) |
| Summary | `content.spotlight[].summary` |
| GitHub handle link | `https://github.com/{login}` |
| Banner | `banner_prefix`, linked **`{total} {contributors_link_label}`**, `banner_suffix` |
| Contributors link href | `site.links.repository.url` + `/graphs/contributors` |
| Sidebar logo / mark | `site.presentation_logo`, `site.presentation_chrome.mark_label`, `presentation.subtitle` |

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

## Omitted behavior

Omitting `banner_prefix`, `contributors_link_label`, and `banner_suffix` removes the banner. If a `spotlight[].login` has no match in `generated.contributors.authors[]`, the card still renders using the login as the visible name.
