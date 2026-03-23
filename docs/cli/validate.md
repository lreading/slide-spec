# `validate`

`validate` checks all project YAML against the live schema and template rules.

```bash
npx @slide-spec/cli validate ./my-slides
```

It loads `site.yaml`, `presentations/index.yaml`, each deck’s `presentation.yaml` and `generated.yaml`, checks cross-file consistency, and runs template-specific slide checks.

Run it after substantive YAML edits, and before `build`, `serve`, or right after `fetch`.
