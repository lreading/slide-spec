# Quickstart

This is the shortest path from install to a working static site.

It assumes:

- Node.js 22+
- a writable working directory
- optional GitHub token only if you plan to use `fetch`

## 1. Create a project

```bash
npx @slide-spec/cli init ./my-slides
```

If you prefer flags instead of the interactive flow:

```bash
npx @slide-spec/cli init ./my-slides \
  --presentation-id 2026-spring-briefing \
  --title "My Product Brief" \
  --subtitle "Spring 2026" \
  --from-date 2026-03-01
```

What this creates:

- `content/site.yaml`
- `content/presentations/index.yaml`
- `content/presentations/<presentation-id>/presentation.yaml`
- `content/presentations/<presentation-id>/generated.yaml`

## 2. Edit the scaffolded files

For the smallest useful project, edit:

- `content/site.yaml`
  - set the site title
  - set footer links
  - set branding assets if you have them
- `content/presentations/index.yaml`
  - set the listing title, subtitle, and summary
- `content/presentations/<presentation-id>/presentation.yaml`
  - author the slide content

If you want a concrete walkthrough instead of a minimal checklist, use the [tutorial example](/examples/tutorial-example).

## 3. Validate the project

```bash
npx @slide-spec/cli validate ./my-slides
```

Run this after every YAML edit until the structure is stable.

## 4. Build the static site

```bash
npx @slide-spec/cli build ./my-slides
```

This writes a static `dist/` directory inside the project root.

## 5. Serve it locally

```bash
npx @slide-spec/cli serve ./my-slides
```

`serve` builds first and then serves the generated output.

## 6. Optional: fetch GitHub-backed metrics

If you want generated metrics, add a GitHub data source in `content/site.yaml`:

```yaml
site:
  data_sources:
    - type: github
      url: https://github.com/OWNER/REPO
```

Then fetch into the current presentation:

```bash
npx @slide-spec/cli fetch ./my-slides \
  --presentation-id 2026-spring-briefing \
  --from-date 2026-03-01 \
  --to-date 2026-05-31
```

GitHub token notes:

- A token is strongly recommended.
- The CLI can run without one, but you may hit rate limits or reduced coverage.
- When a PAT is provided interactively, the CLI can create a local `.env` file for you.

See [GitHub connector](/connectors/github) for the full fetch model.

## Common next steps

- Learn the file layout: [Schema reference](/schema/)
- Pick a slide layout: [Templates](/templates/)
- Follow a full walkthrough: [Tutorial example](/examples/tutorial-example)
- See a manual-data project: [Manual data example](/examples/manual-data-example)
