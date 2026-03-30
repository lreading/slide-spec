# validate

Checks all YAML in a project against the schema and path/reference rules.

```bash
npx @slide-spec/cli validate
```

Validates:

- `site.yaml` structure and required fields
- `presentations/index.yaml` entries and explicit file paths
- Each presentation's `presentation.yaml` and `generated.yaml`
- Cross-file consistency for ids and declared file paths
- Template-specific slide content rules

On success, prints `Content is valid`. On failure, prints the specific error and exits with code 1. For example:

```
site.yaml.site.title must not be blank.
```

or for a template issue:

```
presentation document.presentation.slides[2].content.sections is required.
```

The error tells you which file and field to fix. Correct the YAML and run `validate` again.

Run after editing YAML and before `build` or `serve`.
