import { createServer as createNetServer } from 'node:net'
import { resolve } from 'node:path'

import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import vue from '@vitejs/plugin-vue'
import { createServer as viteCreateServer } from 'vite'

import { CliPackagePaths } from './CliPackagePaths'
import { RuntimeWorkspace } from './RuntimeWorkspace'

import type { FileSystemPaths } from '../io/FileSystemPaths'
import type { ViteDevServer, InlineConfig } from 'vite'

type ViteCreateServerFunction = (config: InlineConfig) => Promise<ViteDevServer>

export class ViteSiteDevServer {
  public constructor(
    private readonly packagePaths: CliPackagePaths = new CliPackagePaths(),
    private readonly runtimeWorkspace: RuntimeWorkspace = new RuntimeWorkspace(),
    private readonly createViteServer: ViteCreateServerFunction = viteCreateServer,
  ) {}

  public async start(paths: FileSystemPaths, host: string, port: number): Promise<number> {
    const workspace = await this.runtimeWorkspace.prepare(paths, { liveContent: true })

    try {
      const resolvedPort = port === 0 ? await this.findFreePort(host) : port
      const server = await this.createViteServer({
        appType: 'spa',
        root: workspace.appRoot,
        configFile: false,
        logLevel: 'error',
        plugins: [vue()],
        css: {
          postcss: {
            plugins: [
              tailwindcss({
                config: resolve(workspace.appRoot, 'tailwind.config.cjs'),
              }),
              autoprefixer(),
            ],
          },
        },
        server: {
          host,
          port: resolvedPort,
          strictPort: true,
          open: false,
          fs: {
            allow: [
              workspace.root,
              paths.getProjectRoot(),
              this.packagePaths.getPackageRoot(),
              this.packagePaths.getNodeModulesRoot(),
            ],
          },
        },
      })

      try {
        await server.listen()
      } catch (error) {
        await server.close()
        throw error
      }

      return this.getBoundPort(server)
    } catch (error) {
      await workspace.cleanup()
      throw error
    }
  }

  private getBoundPort(server: ViteDevServer): number {
    const address = server.httpServer?.address()

    if (!address || typeof address === 'string') {
      throw new Error('Vite dev server did not expose a TCP address.')
    }

    return address.port
  }

  private async findFreePort(host: string): Promise<number> {
    const server = createNetServer()

    await new Promise<void>((resolvePromise, reject) => {
      server.once('error', reject)
      server.listen(0, host, () => resolvePromise())
    })

    const address = server.address()

    await new Promise<void>((resolvePromise) => {
      server.close(() => resolvePromise())
    })

    if (!address || typeof address === 'string') {
      throw new Error('Unable to resolve a free TCP port.')
    }

    return address.port
  }
}
