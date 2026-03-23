# Quickstart

From install to a served static site. You need Node.js 22+, a writable directory, and a GitHub token only if you will use `fetch`.

**1. Scaffold**

```bash
npx @slide-spec/cli init ./my-slides
```

Non-interactive example:

```bash
npx @slide-spec/cli init ./my-slides \
  --presentation-id 2026-spring-briefing \
  --title "My Product Brief" \
  --subtitle "Spring 2026" \
  --from-date 2026-03-01
```

That writes `content/site.yaml`, `content/presentations/index.yaml`, `content/presentations/<id>/presentation.yaml`, and `content/presentations/<id>/generated.yaml`.

**2. Edit** the scaffold: start with `site.yaml`, `presentations/index.yaml`, and the new `presentation.yaml`. For a full line-by-line walkthrough, use the [tutorial example](/examples/tutorial-example).

**3. Validate**

```bash
npx @slide-spec/cli validate ./my-slides
```

**4. Build** — output goes to `<project-root>/dist`:

```bash
npx @slide-spec/cli build ./my-slides
```

**5. Serve** (builds first, then serves `dist/`):

```bash
npx @slide-spec/cli serve ./my-slides
```

**6. Optional: GitHub-backed `generated.yaml`**

Add a GitHub data source under `site.data_sources` in `content/site.yaml` (see [GitHub connector](/connectors/github)), then:

```bash
npx @slide-spec/cli fetch ./my-slides \
  --presentation-id 2026-spring-briefing \
  --from-date 2026-03-01 \
  --to-date 2026-05-31
```

A PAT is strongly recommended; without one you risk rate limits and thinner data. Interactive init can write a local `.env` when you supply a token.

**Next:** [Schema](/schema/) for every file and field, [templates](/templates/) for slide layouts, [manual data example](/examples/manual-data-example) if you skip GitHub entirely.
