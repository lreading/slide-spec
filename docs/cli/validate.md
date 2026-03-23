# `validate`

`validate` checks the project YAML against the live schema.

## Usage

```bash
npx @slide-spec/cli validate ./my-slides
```

## What it checks

- `site.yaml`
- `presentations/index.yaml`
- `presentation.yaml`
- `generated.yaml`
- cross-file consistency between index, presentation, and generated data
- template-specific slide validation

## When to run it

- after every meaningful YAML edit
- before `build`
- before `serve`
- after `fetch`
