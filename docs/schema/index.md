# Schema reference

A slide-spec project uses four YAML documents:

`content/site.yaml`, `content/presentations/index.yaml`, `content/presentations/<id>/presentation.yaml`, and `content/presentations/<id>/generated.yaml`. The app validates them together.

Read them in this order: [site](/schema/site) → [presentations index](/schema/presentations-index) → [presentation](/schema/presentation) → [generated](/schema/generated).

`presentation.yaml` holds authored narrative and slide structure. `generated.yaml` holds machine-oriented metrics and release-style data so generated numbers stay out of slide copy. The [presentation](/schema/presentation) and [generated](/schema/generated) schema pages follow `ContentValidator` in `shared/src/content-validator.ts`, with slide `content` shapes from `shared/src/templates/validation.ts`.
