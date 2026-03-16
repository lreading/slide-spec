import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import { afterEach, describe, expect, it } from 'vitest'

import { NodeFileSystem } from './FileSystem'

describe('NodeFileSystem', () => {
  const temporaryDirectories: string[] = []

  afterEach(async () => {
    await Promise.all(temporaryDirectories.map(async (directory) => rm(directory, { force: true, recursive: true })))
    temporaryDirectories.length = 0
  })

  it('reports whether a file exists and reads text files', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'td-cli-fs-'))
    temporaryDirectories.push(directory)

    const filePath = join(directory, 'sample.txt')
    await writeFile(filePath, 'hello world', 'utf8')

    const fileSystem = new NodeFileSystem()

    await expect(fileSystem.fileExists(filePath)).resolves.toBe(true)
    await expect(fileSystem.fileExists(join(directory, 'missing.txt'))).resolves.toBe(false)
    await expect(fileSystem.readTextFile(filePath)).resolves.toBe('hello world')
  })
})
