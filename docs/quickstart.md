# Quickstart

**Prerequisites:** Node.js 24+, npm 10+

## 1. Scaffold a project

```bash
npx @slide-spec/cli init
```

The interactive prompts walk you through project setup: name, title, dates, and optional connector configuration.

If you enable GitHub-backed data during setup, the CLI can write `GITHUB_PAT` into the project root `.env` file for you.

This creates a common `content/` layout with:

- `site.yaml` - global branding, navigation, links
- `presentations/index.yaml` - presentation registry with explicit file paths
- `presentations/<id>/presentation.yaml` - slides and content
- `presentations/<id>/generated.yaml` - generated data (metrics, releases, contributors)

Each of these files declares a major `schemaVersion` (currently `1`) at the top level and includes a JSON Schema comment for editor validation. See the [schema reference](/schema/) for details.

The scaffold uses a conventional folder layout, but the registry points to presentation files explicitly.

## 2. Edit your content

Start with `site.yaml` (branding and links), then `presentations/index.yaml` (listing metadata and file paths), then the `presentation.yaml` for your deck.

See the [concepts](/concepts) page for an overview of how these files work together, or the [schema reference](/schema/) for every field.

## 3. Validate

```bash
npx @slide-spec/cli validate
```

## 4. Build

```bash
npx @slide-spec/cli build
```

Output goes to `./dist/` - static HTML, CSS, and JS.

## 5. Preview locally

```bash
npx @slide-spec/cli serve
```

## 6. (Optional) Connect external data

Slide Spec supports connectors that populate `generated.yaml` with live data. See [connectors](/connectors/) for available options.

## Next steps

- [Concepts](/concepts) - understand how Slide Spec projects work
- [Schema reference](/schema/) - every YAML file and field
- [Templates](/templates/) - the available slide layouts
- [Examples](/examples/) - real-world project walkthroughs
