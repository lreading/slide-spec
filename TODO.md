# UI
- Add some info about keyboard shortcuts before entering presentation mode.  Not sure how yet.. either a small ui addition near the button, or something that is dismissable (if dismissable, make sure we save to localStorage a "do not show again" type of setting or whatever)

# Data
- Rename deck to presentation, ensure consistency in naming (file and data properties, should match our "business terms", slides, presentation, etc)
- Try to keep names for the data for the content in all of the different slides as consistent as possible.  We will be migrating to a "template" format.
- Ensure that all text, except for links, comes from the data files.  This includes website title, EVERYTHING in EVERY slide, etc.
- Create a plan on how we can use these data classes with slide TEMPLATES, so that way they aren't as tightly coupled to OSS work
- Add data validation per template type
- Add data validation to site, index, and generated files as well
- Ensure we are not duplicating data unless necessary. If a slide wants the github url, that's fine, but we could also make an exception for that to be duplicated because they may not want to reference the current project url for some reason in a given slide?

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
