import { describe, expect, it } from 'vitest'

import { FileSystemPaths } from './FileSystemPaths'

describe('FileSystemPaths', () => {
  it('resolves repo, site config, and env paths from the cli root', () => {
    const paths = new FileSystemPaths('/workspace/project/cli')

    expect(paths.getCliRoot()).toBe('/workspace/project/cli')
    expect(paths.getRepoRoot()).toBe('/workspace/project')
    expect(paths.getSiteConfigPath()).toBe('/workspace/project/content/site.yaml')
    expect(paths.getPresentationsIndexPath()).toBe('/workspace/project/content/presentations/index.yaml')
    expect(paths.getGeneratedPath('2026-q1')).toBe('/workspace/project/content/presentations/2026-q1/generated.yaml')
    expect(paths.getEnvPath()).toBe('/workspace/project/cli/.env')
  })
})
