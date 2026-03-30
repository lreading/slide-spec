# Schema

A Slide Spec project uses four YAML files (only the `.yaml` extension is supported):

| File | Purpose |
| --- | --- |
| `content/site.yaml` | Global branding, navigation, links |
| `content/presentations/index.yaml` | Presentation registry with explicit file paths |
| `content/presentations/<id>/presentation.yaml` | Slides and authored content |
| `content/presentations/<id>/generated.yaml` | Generated data from connectors or manual entry |

`presentation.yaml` is what you write - your slides, titles, and content. `generated.yaml` holds data produced by a [connector](/connectors/) or authored by hand: metrics, releases, contributors. Keeping them separate means automation and humans never conflict. The presentations index is the catalog layer that points to those files with explicit relative paths, so file layout is a choice rather than a hidden convention.

Read in order: [site.yaml](/schema/site) → [presentations/index.yaml](/schema/presentations-index) → [presentation.yaml](/schema/presentation) → [generated.yaml](/schema/generated).
