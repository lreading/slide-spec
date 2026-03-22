import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { FileSystemPaths } from '../io/FileSystemPaths'
import { CliPackagePaths } from './CliPackagePaths'
import { RuntimeWorkspace } from './RuntimeWorkspace'

const tempRoots: string[] = []

async function createRoot(prefix: string): Promise<string> {
  const root = await mkdtemp(resolve(tmpdir(), prefix))
  tempRoots.push(root)
  return root
}

describe('RuntimeWorkspace', () => {
  afterEach(async () => {
    await Promise.all(tempRoots.splice(0).map((path) => rm(path, { recursive: true, force: true })))
  })

  it('copies the embedded runtime and project content into a disposable workspace', async () => {
    const cliRoot = await createRoot('oss-slides-cli-')
    const projectRoot = await createRoot('oss-slides-project-')
    await mkdir(resolve(cliRoot, 'runtime-template', 'app'), { recursive: true })
    await mkdir(resolve(cliRoot, 'runtime-template', 'shared', 'src'), { recursive: true })
    await mkdir(resolve(cliRoot, 'node_modules'), { recursive: true })
    await writeFile(resolve(cliRoot, 'runtime-template', 'app', 'index.html'), '<html></html>')
    await writeFile(resolve(cliRoot, 'runtime-template', 'shared', 'src', 'content.ts'), 'export {}')
    await mkdir(resolve(projectRoot, 'content'), { recursive: true })
    await writeFile(resolve(projectRoot, 'content', 'site.yaml'), 'site: {}')

    const workspace = new RuntimeWorkspace(new CliPackagePaths(cliRoot))
    const prepared = await workspace.prepare(new FileSystemPaths(projectRoot))

    await expect(readFile(resolve(prepared.appRoot, 'index.html'), 'utf8')).resolves.toContain('<html>')
    await expect(readFile(resolve(prepared.root, 'content', 'site.yaml'), 'utf8')).resolves.toContain('site:')
    await expect(readFile(resolve(prepared.root, 'shared', 'src', 'content.ts'), 'utf8')).resolves.toContain('export')

    await prepared.cleanup()
    await expect(readFile(resolve(prepared.root, 'content', 'site.yaml'), 'utf8')).rejects.toThrow()
  })
})
