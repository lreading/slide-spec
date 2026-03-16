# UI
- Add some info about keyboard shortcuts before entering presentation mode.  Not sure how yet.. either a small ui addition near the button, or something that is dismissable (if dismissable, make sure we save to localStorage a "do not show again" type of setting or whatever)
- Add a documentation site (focus on schema, template, etc)

# Scripts
- Start fleshing out what data can be pulled dynamically
- Make sure thee main config file is the source of truth for things like gh repo
- Use gh repo from config to pull info
- If GH API is the best way to go, make sure that there's a .env w/ a token.  If not, warn user and exit
- Scripts follow the same rules in AGENTS.md, including tests, file size, typescript, classes vs objects, etc.
- Should have its own package.json / linting, testing, etc... but we should expect to package this as an NPM package ONE DAY (not today)

# Future
- Add presenter notes? Might be a lot of work cuz of fullscreen constraints
- Make all icons, logos, text part of config
- Publish an npm package that takes a config and generates a static site so others can use this if they so choose.
- E2E tests
- Separate npm module from vue implementation (generator, validator, init, etc)
- Create "themes" (just one default), but allow users to create other themes if they want
  - Realistically, we want templates... Templates should have their own data definitions, but can be usable by whatever.  Not all templates need to be used in a deck
