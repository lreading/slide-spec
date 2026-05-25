# Agenda

Auto-generated table of contents. Each row comes from a later enabled slide in the deck. No `content` block needed.

<figure class="template-doc-shot">
  <img src="/screenshots/template-agenda-reference.png" alt="Agenda slide showing a list of upcoming slides" />
</figure>

## Example

```yaml
- template: agenda
  enabled: true
  title: Agenda
  subtitle: What this briefing covers
  content:
    card_arrow_fa_icon: fa-arrow-right
```

## How rows are generated

Row labels come from each subsequent enabled slide's `title`. Two exceptions:

- **Closing** slides use `content.heading` when `title` is omitted
- The agenda never reads other slides' stage detail; if a **progress-timeline** slide needs a custom row label, put it in that slide's `title`

## Fields

| Field | Required | Type |
| --- | --- | --- |
| `title` | yes | string |
| `subtitle` | | string |
| `content` | | object |
| `content.card_arrow_fa_icon` | | string |

`content.card_arrow_fa_icon` defaults to `fa-chevron-right`. Icon fields use supported values from the [Font Awesome icon reference](/reference/fontawesome).
