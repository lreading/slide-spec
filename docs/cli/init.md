# `init`

`init` creates a new project tree under the directory you pass.

```bash
npx @slide-spec/cli init ./my-slides
```

You need a project root, presentation id, title, and `from-date`. Supply them with flags or through the interactive prompts.

## Flags

| Flag | Required | Notes |
| --- | --- | --- |
| positional `project-root` | yes | Target directory. |
| `--project-root` | no | Named alternative to the positional path. |
| `--presentation-id` | yes in non-interactive mode | Creates `content/presentations/<id>/`. |
| `--title` | yes in non-interactive mode | Presentation title. |
| `--subtitle` | no | Subtitle. |
| `--from-date` | yes in non-interactive mode | Period start. |
| `--to-date` | no | Period end. |
| `--summary` | no | Archive list summary. |
| `--force` | no | Overwrite existing scaffold files for the same project/presentation. |

Interactive `init` walks through titles, ids, period, summary, optional GitHub source, optional PAT, and optional branding fields.

## Output

`content/site.yaml`, `content/presentations/index.yaml`, `content/presentations/<presentation-id>/presentation.yaml`, and `content/presentations/<presentation-id>/generated.yaml`.

Then run [validate](/cli/validate) before `build` or `serve`.
