- Contributor spotlight: Add link to "(n) contributors"
- Specify link to "view full roadmap and milestones on github" via config
- Contributor spotlight - single contributor, information next to it in a card
- Welcome slide: "OWASP Project" - include optional maturity level (fixed selection)
- Community highlights: subtitle, feels very marketing-ish
- Community highlights: Talks / mentions - rename, include things like interop tools as well
- Community highlights: Make links optional per item, clicking card opens link new tab
- Presentation: Replace red weird logo with configurable logo (global config?)
- How to Contribute: Make sure links are configurable
- Add a real root level README
- Archive page needs some love, ui isn't great.  Could also get unruly if project updates happen weekly or something and it goes for a long time.  Probably need pagination, POTENTIALLY search? idk, but current state ain't great.

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
