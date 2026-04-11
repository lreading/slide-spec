# presentations/index.yaml

Controls what appears on the presentations list page.

## Example

```yaml
# yaml-language-server: $schema=https://slide-spec.dev/schema/presentations-index.schema.json
schemaVersion: 1
presentations:
  - id: 2026-spring-briefing
    year: 2026
    title: Acorn Cloud Product Brief
    subtitle: Spring 2026
    summary: Reliability work, platform roadmap, and team highlights.
    published: true
    featured: true
    presentation_path: presentations/2026-spring-briefing/presentation.yaml
    generated_path: presentations/2026-spring-briefing/generated.yaml
```

## Field reference

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `schemaVersion` | yes | number | Major schema version. Must be `1` for this Slide Spec release. |
| `presentations` | yes | array | List of presentation entries |

### `presentations[]`

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `id` | yes | string | Unique across the file |
| `title` | yes | string | List page title |
| `subtitle` | yes | string | List page subtitle |
| `summary` | yes | string | Shown on the presentations list page |
| `published` | yes | boolean | Controls visibility |
| `featured` | yes | boolean | Highlights on the home page |
| `year` | | number | Enables year filtering on the list page |
| `presentation_path` | yes | string | Relative path to `presentation.yaml` |
| `generated_path` | | string | Relative path to `generated.yaml` when it does not live beside the presentation file |

## Notes

- `published: true` means the presentation is visible on the site; `published: false` means it is not shown
- `presentation_path` and `generated_path` are relative to `content/`
- The index is catalog metadata for the presentations page; it does not need to mirror deck copy
