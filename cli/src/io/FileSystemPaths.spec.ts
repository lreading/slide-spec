import { describe, expect, it } from 'vitest'

import { FileSystemPaths } from './FileSystemPaths'

describe('FileSystemPaths', () => {
  it('resolves project paths from the target project root', () => {
    const paths = new FileSystemPaths('/workspace/project')

    expect(paths.getAppRoot()).toBe('/workspace/project/app')
    expect(paths.getContentRoot()).toBe('/workspace/project/content')
    expect(paths.getDistPath()).toBe('/workspace/project/dist')
    expect(paths.getSiteConfigPath()).toBe('/workspace/project/content/site.yaml')
    expect(paths.getPresentationsIndexPath()).toBe('/workspace/project/content/presentations/index.yaml')
    expect(paths.getPresentationPath('2026-q1')).toBe('/workspace/project/content/presentations/2026-q1/presentation.yaml')
    expect(paths.getGeneratedPath('2026-q1')).toBe('/workspace/project/content/presentations/2026-q1/generated.yaml')
    expect(paths.getEnvPath()).toBe('/workspace/project/.env')
    expect(paths.getLegacyMonorepoEnvPath()).toBe('/workspace/project/cli/.env')
    expect(paths.getCliWorkspaceRoot()).toBe('/workspace/project/.slide-spec')
  })
})
