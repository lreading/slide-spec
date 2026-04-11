# Schema

A Slide Spec project uses four YAML files (only the `.yaml` extension is supported):

| File | Purpose |
| --- | --- |
| `content/site.yaml` | Global branding, navigation, links |
| `content/presentations/index.yaml` | Presentation registry with explicit file paths |
| `content/presentations/<id>/presentation.yaml` | Slides and authored content |
| `content/presentations/<id>/generated.yaml` | Generated data from connectors or manual entry |

`presentation.yaml` is what you write - your slides, titles, and content. `generated.yaml` holds data produced by a [connector](/connectors/) or authored by hand: metrics, releases, contributors. Keeping them separate means automation and humans never conflict. The presentations index is the catalog layer that points to those files with explicit relative paths, so file layout is a choice rather than a hidden convention.

Each file starts with a major `schemaVersion` field (currently `1`) so future tooling can detect incompatible documents without guessing from structure alone.

## Editor JSON Schema

Scaffolded YAML files include a `yaml-language-server` schema comment for editor validation and autocomplete:

```yaml
# yaml-language-server: $schema=https://slide-spec.dev/schema/presentation.schema.json
schemaVersion: 1
```

The public JSON Schemas are maintained to mirror Slide Spec runtime validation and make editors more useful while you author content. Use `slide-spec validate` as the authoritative project validation path before publishing.

Use the specific schema for each file when you know the document type:

| File | Schema URL |
| --- | --- |
| `content/site.yaml` | `https://slide-spec.dev/schema/site.schema.json` |
| `content/presentations/index.yaml` | `https://slide-spec.dev/schema/presentations-index.schema.json` |
| `content/presentations/<id>/presentation.yaml` | `https://slide-spec.dev/schema/presentation.schema.json` |
| `content/presentations/<id>/generated.yaml` | `https://slide-spec.dev/schema/generated.schema.json` |

For hand-authored files where the type is not known yet, use the dispatcher schema:

```yaml
# yaml-language-server: $schema=https://slide-spec.dev/schema.json
schemaVersion: 1
```

Read in order: [site.yaml](/schema/site) → [presentations/index.yaml](/schema/presentations-index) → [presentation.yaml](/schema/presentation) → [generated.yaml](/schema/generated).
