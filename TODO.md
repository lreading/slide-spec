# TODO
This file should go away.  After this gets to a reasonably organized list and reasonable size, these should become GH issues for better tracking and history.


# Review:
- Do the published site examples match our cli examples exactly?
- Manually test interactive CLI
- Check the Ladybird test
- Make sure sbom generation is automated and available
- Make sure docs are "agent friendly" (manual test)
- Does the GH connector use avatars for the spotlight/people template? can it?
- Can the fetch command *actually* work without a PAT?
- Ensure cross-compatibility: no unix/linux/macOS/windows code.  Everything should "just work" regardless of operating system
  - Test on a windows box to confirm
- package.json metadata for discoverability / npm publishing


# Examples to build
“OSS project release update template”
“Quarterly roadmap template”
“Security incident postmortem deck”
“Engineering demo day template”


# Planning
- Create a better public roadmap.  Issues are fine, but maybe milestones or projects?


# Docs
- SEO: we added a bit of metdata, do a quick review to make sure it's discoverable
- SEO: Add to google search console or whatever it is


# Next:
- Problem with data file naming... "Generated" isn't always going to be true.  Maybe this should be "datasource.yaml" - there is no reason that people can't manually create one if they want. Just make sure the different schemas are documented.
- github PAT input should be hidden (password style input)
- Create an optional log path file.  Only log to file if specified, default is off
  - Log should be standard logging for CLI, but also responses from GH. Again, NEVER log sensitive information
  - Default is off, and no need to log results to the console. 
- Conduct full security review
- Is there any precedence for adding a man page for globally installed npm libs? (I don't think so, but maybe check)
- Automate the e2e cli test somehow, including visual regression with exact or damn near exact thresholds (cli testing doesn't need to test all templates, so this should be ok?)


# Future
- Add presenter notes? Might be a lot of work cuz of fullscreen constraints
- Create "themes" (just one default), but allow users to create other themes if they want
