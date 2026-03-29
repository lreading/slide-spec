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

  it('fails when a presentation directory is missing from the index', async () => {
    const root = await createProjectRoot()
    await mkdir(resolve(root, 'content', 'presentations', 'rogue'), { recursive: true })

    await expect(new ProjectContentValidator().validate(new FileSystemPaths(root))).rejects.toThrow(
      'Presentation directory "rogue" is missing from content/presentations/index.yaml.',
    )
  })
})
