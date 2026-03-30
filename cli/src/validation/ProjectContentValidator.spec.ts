import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { FileSystemPaths } from '../io/FileSystemPaths'
import { ProjectContentValidator } from './ProjectContentValidator'

const tempRoots: string[] = []

async function createProjectRoot(): Promise<string> {
  const root = await mkdtemp(resolve(tmpdir(), 'oss-slides-validate-'))
  tempRoots.push(root)
  await mkdir(resolve(root, 'content', 'presentations', 'demo'), { recursive: true })
  await writeFile(resolve(root, 'content', 'site.yaml'), `
site:
  title: Demo
  home_intro: Intro
  home_cta_label: Start
  presentations_cta_label: Browse
  data_sources:
    - type: github
      url: https://github.com/OWASP/threat-dragon
  links:
    repository:
      label: Repo
      url: https://github.com/OWASP/threat-dragon
    docs:
      label: Docs
      url: https://example.com/docs
    community:
      label: Community
      url: https://example.com/community
`)
  await writeFile(resolve(root, 'content', 'presentations', 'index.yaml'), `
presentations:
  - id: demo
    presentation_path: presentations/demo/presentation.yaml
    generated_path: presentations/demo/generated.yaml
    title: Demo Presentation
    subtitle: Demo
    summary: Summary
    published: true
    featured: true
`)
  await writeFile(resolve(root, 'content', 'presentations', 'demo', 'presentation.yaml'), `
presentation:
  id: demo
  title: Demo Presentation
  subtitle: Demo
  slides:
    - template: hero
      enabled: true
      content:
        title_primary: Demo
    - template: progress-timeline
      enabled: true
      title: Roadmap
      content:
        stage: completed
        deliverables_heading: Key deliverables
        focus_areas_heading: Focus areas
        footer_link_label: View roadmap
        stages:
          completed:
            label: Completed
            summary: Done
          in-progress:
            label: In Progress
            summary: Doing
          planned:
            label: Planned
            summary: Soon
          future:
            label: Future
            summary: Later
        items:
          - One
        themes:
          - category: Theme
            target: Target
`)
  await writeFile(resolve(root, 'content', 'presentations', 'demo', 'generated.yaml'), `
generated:
  id: demo
  period:
    start: 2026-01-01
    end: 2026-01-31
  stats: {}
  releases: []
  contributors:
    total: 0
    authors: []
`)
  return root
}

describe('ProjectContentValidator', () => {
  afterEach(async () => {
    await Promise.all(tempRoots.splice(0).map((path) => rm(path, { recursive: true, force: true })))
  })

  it('validates a standalone project content tree', async () => {
    const root = await createProjectRoot()

    await expect(new ProjectContentValidator().validate(new FileSystemPaths(root))).resolves.toBeUndefined()
  })

  it('ignores extra presentation directories when the index uses explicit paths', async () => {
    const root = await createProjectRoot()
    await mkdir(resolve(root, 'content', 'presentations', 'rogue'), { recursive: true })

    await expect(new ProjectContentValidator().validate(new FileSystemPaths(root))).resolves.toBeUndefined()
  })

  it('rejects duplicate presentation paths in the index', async () => {
    const root = await createProjectRoot()
    await writeFile(resolve(root, 'content', 'presentations', 'index.yaml'), `
presentations:
  - id: demo-a
    presentation_path: presentations/shared/presentation.yaml
    generated_path: presentations/demo-a/generated.yaml
    title: Demo Presentation A
    subtitle: Demo
    summary: Summary
    published: true
    featured: true
  - id: demo-b
    presentation_path: presentations/shared/presentation.yaml
    generated_path: presentations/demo-b/generated.yaml
    title: Demo Presentation B
    subtitle: Demo
    summary: Summary
    published: true
    featured: false
`)

    await expect(new ProjectContentValidator().validate(new FileSystemPaths(root))).rejects.toThrow(
      'presentations/index.yaml.presentations[1].presentation_path must be unique.',
    )
  })

  it('rejects duplicate generated paths in the index', async () => {
    const root = await createProjectRoot()
    await writeFile(resolve(root, 'content', 'presentations', 'index.yaml'), `
presentations:
  - id: demo-a
    presentation_path: presentations/demo-a/presentation.yaml
    generated_path: presentations/shared/generated.yaml
    title: Demo Presentation A
    subtitle: Demo
    summary: Summary
    published: true
    featured: true
  - id: demo-b
    presentation_path: presentations/demo-b/presentation.yaml
    generated_path: presentations/shared/generated.yaml
    title: Demo Presentation B
    subtitle: Demo
    summary: Summary
    published: true
    featured: false
`)

    await expect(new ProjectContentValidator().validate(new FileSystemPaths(root))).rejects.toThrow(
      'presentations/index.yaml.presentations[1].generated_path must be unique.',
    )
  })
})
