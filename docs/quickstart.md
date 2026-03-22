# Quickstart

This path gets you from zero to a local static presentation as fast as possible.

## 1. Install the CLI

```bash
npx @slide-spec/cli --help
```

## 2. Initialize a project

```bash
npx @slide-spec/cli init ./my-slides
```

The interactive flow starts with the essentials:
- project title
- presentation id
- from-date

Then it offers advanced setup for optional branding, links, and GitHub import.

## 3. Add GitHub data if needed

If you want imported statistics, provide a GitHub repository URL and a GitHub PAT when prompted.

The CLI will explain how to create the token and where it will be stored in `.env`.

## 4. Fetch generated data

```bash
npx @slide-spec/cli fetch ./my-slides --from-date 2026-01-01 --to-date 2026-03-31
```

## 5. Build and serve

```bash
npx @slide-spec/cli build ./my-slides
npx @slide-spec/cli serve ./my-slides
```

`serve` builds first, then serves the static `dist/` output.

## 6. Edit the authored files

The minimum files to review after init are:
- `content/site.yaml`
- `content/presentations/index.yaml`
- `content/presentations/<id>/presentation.yaml`
- `content/presentations/<id>/generated.yaml`

## 7. Open the result

After serving starts, open the local URL shown in the terminal and review the slides in the browser.
