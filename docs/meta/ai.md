# AI-friendly docs

These docs are structured so tools and humans can follow them without guessing.

Entry points: [`/llms.txt`](/llms.txt), [`/sitemap.xml`](/sitemap.xml), and stable URLs under schema, templates, CLI, and examples.

Schema pages name fields explicitly. Template pages separate shared slide fields from template-specific `content`. Examples use copy-pasteable YAML. The quickstart does not skip install or validate steps.

Do not infer: required fields, defaulting behavior for omitted keys, whether `generated.yaml` was hand-written or produced by `fetch`, or which file (`site.yaml`, `presentation.yaml`, or `generated.yaml`) a template reads for a given value.
