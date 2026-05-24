# init

Scaffolds a new Slide Spec project.

```bash
npx @slide-spec/cli init
```

Running `init` without flags starts interactive mode, which walks you through project titles, reporting period, optional connector configuration, and branding.

For CI or scripting, pass required flags directly:

```bash
npx @slide-spec/cli init \
  --presentation-id 2026-spring-briefing \
  --title "Spring Product Brief" \
  --subtitle "Spring 2026" \
  --from-date 2026-03-01
```

## Flags

| Flag | Required | Description |
| --- | --- | --- |
| `[project-root]` (positional) | | Target directory. Defaults to current directory |
| `--project-root` | | Alternative to the positional argument |
| `--presentation-id` | non-interactive | Directory name under `presentations/`; use only letters, numbers, dots, underscores, and hyphens |
| `--title` | non-interactive | Presentation title |
| `--subtitle` | | Presentation subtitle |
| `--from-date` | non-interactive | Reporting period start |
| `--to-date` | | Reporting period end |
| `--summary` | | Summary shown in the presentation list |
| `--repository-url` | | Repository link written to `site.yaml` |
| `--docs-url` | | Documentation link written to `site.yaml` |
| `--website-url` | | Project website or community link written to `site.yaml` |
| `--github-data-source-url` | | GitHub repository used by `fetch` to populate `generated.yaml` |
| `--force` | | Overwrite existing files |
| `--from-example [id]` | | Scaffold from a bundled example instead of creating a blank project |

"non-interactive" means required only when running with flags instead of prompts.

## Output

Creates these files under `content/`:

```
content/
├── site.yaml
├── presentations/
│   ├── index.yaml
│   └── <presentation-id>/
│       ├── presentation.yaml
│       └── generated.yaml
```

If `site.yaml` or `index.yaml` already exist, they are updated rather than overwritten (unless `--force` is used).

Scaffolded YAML files start with Slide Spec homepage and documentation links, then include `yaml-language-server` comments that point to the public Slide Spec JSON Schemas for editor validation and autocomplete.

When `--github-data-source-url` is provided, `init` writes a GitHub connector entry to `site.yaml`. `fetch` can then populate `generated.yaml` for that project without additional connector configuration.
