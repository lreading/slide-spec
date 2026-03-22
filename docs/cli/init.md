# `init`

`init` creates the project scaffold and prompts for the minimum required metadata.

## Behavior

- Asks for essentials first.
- Offers an advanced setup section for optional branding and links.
- Can write a `.env` file if a GitHub PAT is entered interactively.
- Offers to start the server after the scaffold is created.

## Typical prompts

- project title
- presentation id
- from-date
- optional subtitle and summary
- optional GitHub import details
- optional branding defaults

## Example

```bash
npx @slide-spec/cli init ./my-slides
```
