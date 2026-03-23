# Schema Reference

slide-spec uses four YAML documents:

- `content/site.yaml`
- `content/presentations/index.yaml`
- `content/presentations/<id>/presentation.yaml`
- `content/presentations/<id>/generated.yaml`

The app validates all four documents together.

## Reading order

1. [site.yaml](/schema/site)
2. [presentations/index.yaml](/schema/presentations-index)
3. [presentation.yaml](/schema/presentation)
4. [generated.yaml](/schema/generated)

## Important split

- `presentation.yaml` is authored narrative and layout
- `generated.yaml` is structured metric/release/contributor data

That split is intentional. It keeps machine-produced data reviewable without mixing it into slide copy.
