# `init`

`init` scaffolds a new project directory.

## Usage

```bash
npx @slide-spec/cli init ./my-slides
```

## Required inputs

- project root
- presentation id
- title
- from-date

These can come from flags or the interactive prompt flow.

## Common flags

| Flag | Required | Notes |
| --- | --- | --- |
| positional `project-root` | yes | Target directory for the project. |
| `--project-root` | no | Named alternative to the positional argument. |
| `--presentation-id` | no in interactive mode, yes otherwise | Creates `content/presentations/<id>/`. |
| `--title` | no in interactive mode, yes otherwise | Presentation title. |
| `--subtitle` | no | Presentation subtitle. |
| `--from-date` | no in interactive mode, yes otherwise | Start of the reporting period. |
| `--to-date` | no | End of the reporting period. |
| `--summary` | no | Presentation summary used in the archive list. |
| `--force` | no | Overwrite existing scaffold files for the same project/presentation. |

## Interactive flow

Interactive init collects essentials first, then offers optional advanced setup:

- site title and presentation title
- presentation id
- period start/end
- summary
- optional GitHub data source
- optional PAT creation
- optional advanced branding/link fields

## Output

`init` creates:

- `content/site.yaml`
- `content/presentations/index.yaml`
- `content/presentations/<presentation-id>/presentation.yaml`
- `content/presentations/<presentation-id>/generated.yaml`

## Next step

Run [validate](/cli/validate) before you build or serve.
