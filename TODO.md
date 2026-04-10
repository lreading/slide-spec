# Review:
- Do the published site examples match our cli examples exactly?
- Manually test interactive CLI
- Check the Ladybird test
- Check out documentation site
- Make sure sbom generation is automated and available
- Ask specifically about "agent friendly" documentation
- Review Contributing
- Review README
- Review License
- Does the GH connector use avatars for the spotlight/people template? can it?

# Examples to build
“OSS project release update template”
“Quarterly roadmap template”
“Security incident postmortem deck”
“Engineering demo day template”

# Docs Updates
- The schemas are not fully documented.  The examples have fields that are not in the reference table.  For example, generated: stats is not fully documented. That is unacceptable. ALL fields, optional or otherwise, no matter how deep the field spec is, MUST be documented.
- Update screenshots to not use cupcake - did we generate a logo for this project? If so, where is it?
- Templates are NOT fully documented. Hero slide, for example... I want EVERY SINGLE PART OF THE SCREENSHOT DOCUMENTED.  There are a bunch of things that aren't, such as the links.  I don't care if that's in a different data file, it NEEDS to be documented. No guesswork for our users. Also, not all props are documented like issue number 1.
- Example pages sucks.  Really not an example at all.  Let's also remove the "happy path" title. These should be legitimate examples.  Eventually, we can reference our own repo, and maybe Threat Dragon when I get to that after this is all published.  For now, make a contrived example.  Better yet, let's make a "tutorial" example where you walk the user through EACH STEP, skipping NOTHING, including exactly what to update in yaml files. You must validate this example by running a full cli e2e using the docs.
- Get rid of contributing page from docs, let's just link to the repo instead.  I dislike multiple sources of truth.
- Examples should include non-github examples too, brainstorm on that
- This needs a complete plan.  Page by page. I want to define the intent of the page. You should also make it more complete, use less fluffy language, it should really read like a human wrote this.
- When executing this plan, you must exercise the docs the same way a human would.  Leave NOTHING out, but make sure it'd make sense to a human.
- Gotta work on the llms.txt as well: that looks wildly incomplete.  Should we include a complete schema in there so they have it in their context?
- What about a sitemap?
- How is the SEO positioning on this? Probably non-existent... gotta get that sorted too.

# Next:
- Problem with data file naming... "Generated" isn't always going to be true.  Maybe this should be "datasource.yaml" - there is no reason that people can't manually create one if they want. Just make sure the different schemas are documented.
- Is GH PAT a hard requirement now for GH fetch? If so, make that clear in interactive mode
- github PAT input should be hidden (password style input)
- never log PAT or auth headers anywhere
- Create an optional log path file.  Only log to file if specified, default is off
  - Log should be standard logging for CLI, but also responses from GH. Again, NEVER log sensitive information
  - Default is off, and no need to log results to the console. 
- Conduct full security review
- Make sure the CLI serve command accepts an optional port flag, and finds an unused port on its own.
- README badges are going to need to be linked to GH actions so that they are dynamic and update if something is broken. These are fine as placeholders, but.... not long term
- README needs work
- Need a README per dir, and they should be more descriptive than they currently are
- Verify help, make sure there's contextual help too and that it's still accurate
- Is there any precedence for adding a man page for globally installed npm libs? (I don't think so, but maybe check)
- Ensure cross-compatibility: no unix/linux/macOS/windows code.  Everything should "just work" regardless of operating system
- Continue expanding CLI - want to make it so you can scaffold a new presentation (slightly different from init, but can borrow the same workflow).  Maybe even rename init to scaffold and just make it use the name as the folder, and validate the name does not already exist? Tool should not overwrite data.
- Automate the e2e cli test somehow, including visual regression with exact or damn near exact thresholds (cli testing doesn't need to test all templates, so this should be ok?)
- Test for all threat dragon content, make sure it's all gone
- Make more plans for more work, figure out what next steps are.
- GH Actions (needs plans)
  - PR
  - push (main)
  - deploy (tag)


# Manual Work
- Repository branch protections
- Do we want dependabot?
- Create project for OSS compliance badge
- Repo tags: can they be immutable?
- Make sure NPM listing looks good (does it read from README? that'd be ideal)


# GH Actions
- Find latest version of GH actions that we are going to use, and pin using commit.

## PR
- Verify / all gates for all components (app, docs, cli)
  - Should these be individual / parallel steps? Probably
- As distributed as possible, only make things serial if there are real deps
- SAST for all
- DAST (should probably use dist)
- SCA
- SBOM
- Spellcheck for markdown in docs
- Linkchecker? (maybe)
- Do we want linting for markdown too?


## Main
- Same checks as PR mostly
- Deploy the docs
- Deploy the slides


## Publish
- Runs on tag v*
- What repo settings do we need to ensure that nobody else can push tags?
- Trusted publishing for npm to @slide-spec/cli 
- Do we want to publish @slide-spec/web? Probably not?
- Needs to pass all gates


## Dependabot
- Do we want an action for it?  If so, how to configure it?
- Can we enforce automated testing to allow auto-merging??? That'd be so cool, albeit a bit dangerous.


# Infrastructure
- Update repo name, do a pass at updating repo contents. Add branch protections, do a pass at other configuration, and also make sure that tags are immutable (if possible). If NOT possible, develop a pipeline that alerts when an existing tag is overwritten or deleted? Gotta make sure I'm aware of it, maybe make an issue?
- Figure out deployment model (docs vs slides)
- Dogfood: create an initial slide for q1 2026. No history yet, good edge case to exercise.
- Create roadmap and issues
- Create GH Actions pipelines and do some security stuff (SAST, DAST, SCA, all actions pinned to commits, dependabot, SBOM, ensure we can push findings to security tab, etc).  Also all of our gates need to be run and pass.  Split into pull_request, push to main, release, etc.  Release should probably be when pushing a tag.  
- Create a release pipeline (automated, trusted publisher, no write perms for actions if avoidable).  Make sure releases are auto-created, include contributors, include overview, include changelog, and specific commit that was tagged.

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
- Create "themes" (just one default), but allow users to create other themes if they want
