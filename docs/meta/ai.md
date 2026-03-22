# AI-Friendly Docs

The docs site should be easy for both humans and machine readers to navigate.

## Current approach

The practical baseline is:
- plain Markdown pages
- stable URLs
- clear headings
- `robots.txt`
- `llms.txt` as an additional discovery aid

## Why this approach

- `robots.txt` remains the standard crawler control file.
- `llms.txt` is useful as a compact, human-written index for AI tooling.
- The docs should not rely on client-only rendering for important content.

## Files used

- `docs/public/robots.txt`
- `docs/public/llms.txt`

## Notes

These files should help discovery, but they do not replace good structure, headings, and clean content.
