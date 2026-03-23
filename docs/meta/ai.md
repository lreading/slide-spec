# AI-Friendly Docs

slide-spec aims to keep both the product and docs easy for agents to consume.

## Current machine-readable entrypoints

- `/llms.txt`
- `/sitemap.xml`
- stable page URLs for schema, templates, CLI, and examples

## What makes these docs agent-friendly

- schema pages use explicit field names
- template pages separate shared fields from template-specific fields
- examples use real YAML, not pseudo-code
- quickstart avoids hidden steps

## What agents should not guess

- required schema fields
- omitted-field behavior
- whether generated data is authored or fetched
- whether a template reads data from `site.yaml`, `presentation.yaml`, or `generated.yaml`
