# Slide Spec CLI

Create beautiful slides from YAML - presentations as structured data for open sharing and collaboration. Built for open source, usable everywhere.

Write presentations as structured data. Version control them like code, review them in pull requests, and publish static sites without relying on proprietary slide formats.

![Slide Spec demo](../assets/readme-demo.gif)

<img src="../assets/readme-divider.svg" width="100%" height="8" alt="" />

## Why Slide Spec?

Slide Spec is for technical maintainers, docs-as-code teams, and open source projects that want presentations to be:

- **Structured** instead of hand-edited in opaque binaries
- **Version controlled** alongside code and docs
- **Reviewable** in pull requests
- **Reusable** across updates, releases, briefings, and reports
- **Openly shareable** as static web output without proprietary authoring tools

<img src="../assets/readme-divider.svg" width="100%" height="8" alt="" />

## ⚡ Quickstart

Get a working deck in under two minutes.

```sh
npx @slide-spec/cli init my-slides
cd my-slides
npx @slide-spec/cli serve
```

From there, edit your content, validate it, fetch generated GitHub-backed content if needed, and build:

```sh
npx @slide-spec/cli validate
# Requires GITHUB_PAT in your environment or in a .env file at the project root
npx @slide-spec/cli fetch
npx @slide-spec/cli build
```

<img src="../assets/readme-divider.svg" width="100%" height="8" alt="" />

## ✨ Install

Run without installing:

```sh
npx @slide-spec/cli <command>
```

Or install globally:

```sh
npm install -g @slide-spec/cli
```

Then run:

```sh
slide-spec help
```

<img src="../assets/readme-divider.svg" width="100%" height="8" alt="" />

## 🧰 Commands

`[root]` is an optional path to the Slide Spec project directory. If omitted, the CLI uses your current working directory.

| Command | Description |
| --- | --- |
| `slide-spec help` | List commands |
| `slide-spec init [root]` | Scaffold a project interactively |
| `slide-spec validate [root]` | Validate Slide Spec YAML in the target project directory |
| `slide-spec fetch [root]` | Fetch GitHub data into generated content for the target project directory |
| `slide-spec build [root]` | Build a static site to `<root>/dist` |
| `slide-spec serve [root]` | Build and serve the target project locally |

Example:

```sh
slide-spec serve ./my-slides
```

Per-command help:

```sh
slide-spec <command> --help
```

<img src="../assets/readme-divider.svg" width="100%" height="8" alt="" />

## 🔐 GitHub Integration

`fetch` can enrich generated content with GitHub data.

To enable authenticated GitHub-backed fetches, copy `.env.example` to `.env` in your project root and set:

```env
GITHUB_PAT=your_token_here
```

Notes:

- A token is optional
- `fetch` supports best-effort mode without a token
- `init` can write a masked `GITHUB_PAT` entry into `.env` during setup
- `fetch` also supports date ranges

<img src="../assets/readme-divider.svg" width="100%" height="8" alt="" />

## 🛠️ Development

From the monorepo:

```sh
npm install
npm run cli -- help
```

Development and quality commands:

| Command | Description |
| --- | --- |
| `npm run build` | Compile the CLI |
| `npm run verify` | Lint + typecheck + tests |
| `npm run coverage` | Unit tests with coverage |
| `npm run semgrep` | Semgrep security scan |
| `npm run spellcheck` | Spelling check |

## Requirements

- Node.js **24+**
- npm
- Docker for `semgrep`

## Quality Gates

`npm run verify` is the default local gate.

CI also runs:

- `semgrep`
- `spellcheck`

<img src="../assets/readme-divider.svg" width="100%" height="8" alt="" />

## 📝 Notes

- Uses `../shared` for content types and validation
- Running with no args enters interactive mode
- Accepts an explicit project root, so it also works against external Slide Spec projects
- `build --deployment-url <url>` enables `sitemap.xml` generation

<img src="../assets/readme-divider.svg" width="100%" height="8" alt="" />

## 🚢 Releases

The CLI is published to npm as [`@slide-spec/cli`](https://www.npmjs.com/package/@slide-spec/cli).

> ⚠️ **Pre-1.0** — minor versions may contain breaking changes without prior deprecation. Pin your version if you need stability.

Tagged releases publish through CI.

- Stable releases publish to `latest`
- Prereleases publish to `alpha`, `beta`, or `rc` based on the tag suffix
