# Agent Assistance

Agents work best with slide-spec when the human reviewer keeps the source-of-truth files explicit.

## Good tasks for agents

- drafting `presentation.yaml`
- filling `generated.yaml` from approved source data
- checking schema validity
- generating screenshots from a validated fixture project

## Tasks that still need human review

- roadmap priorities
- release narrative
- external links
- spotlight summaries
- any generated metrics that look surprising

## Recommended workflow

1. author or fetch data
2. run `validate`
3. run `build` or `serve`
4. review the rendered output
5. commit only after the rendered site looks correct
