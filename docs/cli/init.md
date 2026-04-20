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
| `--presentation-id` | non-interactive | Directory name under `presentations/` |
| `--title` | non-interactive | Presentation title |
| `--subtitle` | | Presentation subtitle |
| `--from-date` | non-interactive | Reporting period start |
| `--to-date` | | Reporting period end |
| `--summary` | | Summary shown in the presentation list |
| `--force` | | Overwrite existing files |

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
