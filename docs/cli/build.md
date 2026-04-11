# build

Generates a static site into `dist/`.

```bash
npx @slide-spec/cli build
```

## Flags

| Flag | Description |
| --- | --- |
| `[project-root]` (positional) | Target project. Defaults to current directory |
| `--deployment-url <url>` | Public URL for canonical metadata and sitemap generation |

## Output

- `dist/` - static HTML, CSS, and JS. Host anywhere.
- `index.html` - includes static `<title>`, meta description, canonical URL, Open Graph, and Twitter/X card metadata from `site.yaml`
- files from project `public/` - copied into the root of `dist/`
- `robots.txt` - always generated
- `404.html` - always generated for static host not-found handling
- `sitemap.xml` - generated when a deployment URL is provided via `--deployment-url` or `site.yaml`'s `deployment_url` field (with `sitemap_enabled: true`)
