import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { StaticSiteServer } from './StaticSiteServer'

const tempRoots: string[] = []

async function getFreePort(): Promise<number> {
  const server = await import('node:net').then(({ createServer }) => createServer())

  return await new Promise<number>((resolvePort, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      server.close(() => {
        if (!address || typeof address === 'string') {
          reject(new Error('Failed to allocate port.'))
          return
        }

        resolvePort(address.port)
      })
    })
  })
}

describe('StaticSiteServer', () => {
  afterEach(async () => {
    await Promise.all(tempRoots.splice(0).map((path) => rm(path, { recursive: true, force: true })))
  })

  it('serves static assets and falls back to index.html for routes', async () => {
    const root = await mkdtemp(resolve(tmpdir(), 'oss-slides-static-'))
    tempRoots.push(root)
    await writeFile(resolve(root, 'index.html'), '<html>home</html>')
    await writeFile(resolve(root, 'app.css'), 'body{}')
    await writeFile(resolve(root, 'blob.bin'), 'blob')
    const port = await getFreePort()
    const server = new StaticSiteServer()

    await server.start(root, '127.0.0.1', port)

    const homeResponse = await fetch(`http://127.0.0.1:${port}/`)
    const assetResponse = await fetch(`http://127.0.0.1:${port}/app.css`)
    const blobResponse = await fetch(`http://127.0.0.1:${port}/blob.bin?cache=1`)
    const routeResponse = await fetch(`http://127.0.0.1:${port}/presentations/demo`)

    expect(await homeResponse.text()).toContain('home')
    expect(await assetResponse.text()).toContain('body')
    expect(await blobResponse.text()).toContain('blob')
    expect(await routeResponse.text()).toContain('home')

    await server.close()
  })

  it('can be closed before start without throwing', async () => {
    await expect(new StaticSiteServer().close()).resolves.toBeUndefined()
  })
})
