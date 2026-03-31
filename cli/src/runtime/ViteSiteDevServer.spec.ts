import { describe, expect, it, vi } from 'vitest'

import { ViteSiteDevServer } from './ViteSiteDevServer'

import type { AddressInfo } from 'node:net'
import type { ViteDevServer } from 'vite'

class StubPackagePaths {
  public getPackageRoot(): string {
    return '/cli'
  }

  public getNodeModulesRoot(): string {
    return '/cli/node_modules'
  }
}

class StubRuntimeWorkspace {
  public readonly cleanup = vi.fn(async () => undefined)
  public readonly prepare = vi.fn(async () => ({
    root: '/workspace',
    appRoot: '/workspace/app',
    cleanup: this.cleanup,
  }))
}

function createViteServerDouble(options: {
  address?: AddressInfo | string | null
  listenError?: Error
} = {}): ViteDevServer {
  return {
    listen: options.listenError
      ? vi.fn(async () => {
        throw options.listenError
      })
      : vi.fn(async () => undefined),
    close: vi.fn(async () => undefined),
    httpServer: {
      address: vi.fn(() => options.address ?? {
        address: '127.0.0.1',
        family: 'IPv4',
        port: 4173,
      }),
    },
  } as unknown as ViteDevServer
}

describe('ViteSiteDevServer', () => {
  it('starts a Vite dev server with the live content workspace and returns the bound port', async () => {
    const packagePaths = new StubPackagePaths()
    const runtimeWorkspace = new StubRuntimeWorkspace()
    const viteServer = createViteServerDouble()
    const createServer = vi.fn(async (_config) => viteServer)
    const server = new ViteSiteDevServer(
      packagePaths as never,
      runtimeWorkspace as never,
      createServer,
    )

    await expect(server.start({
      getProjectRoot: () => '/project',
    } as never, '127.0.0.1', 4173)).resolves.toBe(4173)

    expect(runtimeWorkspace.prepare).toHaveBeenCalledWith(
      expect.objectContaining({
        getProjectRoot: expect.any(Function),
      }),
      { liveContent: true },
    )
    expect(createServer).toHaveBeenCalledWith(expect.objectContaining({
      appType: 'spa',
      root: '/workspace/app',
      server: expect.objectContaining({
        host: '127.0.0.1',
        port: 4173,
        strictPort: true,
        fs: {
          allow: ['/workspace', '/project', '/cli', '/cli/node_modules'],
        },
      }),
    }))
    expect(runtimeWorkspace.cleanup).not.toHaveBeenCalled()
  })

  it('closes the Vite server and cleans up the workspace when listen fails', async () => {
    const runtimeWorkspace = new StubRuntimeWorkspace()
    const listenError = new Error('Port busy')
    const viteServer = createViteServerDouble({ listenError })
    const server = new ViteSiteDevServer(
      new StubPackagePaths() as never,
      runtimeWorkspace as never,
      vi.fn(async () => viteServer),
    )

    await expect(server.start({
      getProjectRoot: () => '/project',
    } as never, '127.0.0.1', 4173)).rejects.toThrow('Port busy')

    expect(viteServer.close).toHaveBeenCalledOnce()
    expect(runtimeWorkspace.cleanup).toHaveBeenCalledOnce()
  })

  it('cleans up the workspace when the Vite server does not expose a TCP address', async () => {
    const runtimeWorkspace = new StubRuntimeWorkspace()
    const viteServer = createViteServerDouble({ address: 'pipe-address' })
    const server = new ViteSiteDevServer(
      new StubPackagePaths() as never,
      runtimeWorkspace as never,
      vi.fn(async () => viteServer),
    )

    await expect(server.start({
      getProjectRoot: () => '/project',
    } as never, '127.0.0.1', 4173)).rejects.toThrow(
      'Vite dev server did not expose a TCP address.',
    )

    expect(runtimeWorkspace.cleanup).toHaveBeenCalledOnce()
  })
})
