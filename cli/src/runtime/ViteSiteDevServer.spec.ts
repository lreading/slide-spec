import { mkdir, mkdtemp, rm, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { ViteSiteDevServer } from './ViteSiteDevServer'

import type { AddressInfo } from 'node:net'
import type { InlineConfig, ViteDevServer } from 'vite'

class StubPackagePaths {
  public constructor(private readonly packageRoot: string = '/cli') {}

  public getPackageRoot(): string {
    return this.packageRoot
  }

  public getNodeModulesRoot(): string {
    return resolve(this.packageRoot, 'node_modules')
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

const tempRoots: string[] = []

async function createRoot(prefix: string): Promise<string> {
  const root = await mkdtemp(resolve(tmpdir(), prefix))
  tempRoots.push(root)
  return root
}

describe('ViteSiteDevServer', () => {
  afterEach(async () => {
    await Promise.all(tempRoots.splice(0).map((path) => rm(path, { recursive: true, force: true })))
  })

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

  it('allows real node_modules package paths so pnpm-linked font assets can be served', async () => {
    const cliRoot = await createRoot('slide-spec-cli-')
    const realPackageRoot = await createRoot('slide-spec-poppins-')
    await mkdir(resolve(cliRoot, 'node_modules', '@fontsource'), { recursive: true })
    await symlink(
      realPackageRoot,
      resolve(cliRoot, 'node_modules', '@fontsource', 'poppins'),
      'junction',
    )

    const viteServer = createViteServerDouble()
    const createServer = vi.fn(async (_config) => viteServer)
    const server = new ViteSiteDevServer(
      new StubPackagePaths(cliRoot) as never,
      new StubRuntimeWorkspace() as never,
      createServer,
    )

    await expect(server.start({
      getProjectRoot: () => '/project',
    } as never, '127.0.0.1', 4173)).resolves.toBe(4173)

    expect(createServer).toHaveBeenCalledWith(expect.objectContaining({
      server: expect.objectContaining({
        fs: {
          allow: expect.arrayContaining([realPackageRoot]),
        },
      }),
    }))
  })

  it('resolves port 0 to an explicit free port before starting Vite', async () => {
    const createServer = vi.fn(async (config: InlineConfig) => createViteServerDouble({
      address: {
        address: '127.0.0.1',
        family: 'IPv4',
        port: Number(config.server?.port),
      },
    }))
    const server = new ViteSiteDevServer(
      new StubPackagePaths() as never,
      new StubRuntimeWorkspace() as never,
      createServer,
    )

    await expect(server.start({
      getProjectRoot: () => '/project',
    } as never, '127.0.0.1', 0)).resolves.toBeGreaterThan(0)

    expect(createServer).toHaveBeenCalledWith(expect.objectContaining({
      server: expect.objectContaining({
        port: expect.any(Number),
      }),
    }))
    expect(createServer.mock.calls[0]?.[0].server?.port).not.toBe(0)
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
