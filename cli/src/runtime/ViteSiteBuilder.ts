import { cp, mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

import autoprefixer from 'autoprefixer'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import { build as viteBuild } from 'vite'

import { RuntimeWorkspace } from './RuntimeWorkspace'

import type { FileSystemPaths } from '../io/FileSystemPaths'
import type { InlineConfig } from 'vite'

type ViteBuildFunction = (config: InlineConfig) => Promise<unknown>

const fontFamilyConfig = {
  sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  mono: ['Roboto Mono', 'ui-monospace', 'monospace'],
}

export class ViteSiteBuilder {
  public constructor(
    private readonly runtimeWorkspace: RuntimeWorkspace = new RuntimeWorkspace(),
    private readonly viteBuilder: ViteBuildFunction = viteBuild,
  ) {}

  public async build(paths: FileSystemPaths): Promise<string> {
    const workspace = await this.runtimeWorkspace.prepare(paths)

    try {
      await this.viteBuilder({
        root: workspace.appRoot,
        configFile: false,
        logLevel: 'error',
        plugins: [vue()],
        css: {
          postcss: {
            plugins: [
              tailwindcss({
                content: [
                  resolve(workspace.appRoot, 'index.html'),
                  resolve(workspace.appRoot, 'src/**/*.{vue,ts,tsx}'),
                ],
                theme: {
                  extend: {
                    fontFamily: fontFamilyConfig,
                  },
                },
                plugins: [],
              }),
              autoprefixer(),
            ],
          },
        },
        build: {
          outDir: resolve(workspace.appRoot, 'dist'),
          emptyOutDir: true,
        },
      })
      await rm(paths.getDistPath(), { recursive: true, force: true })
      await mkdir(paths.getProjectRoot(), { recursive: true })
      await cp(resolve(workspace.appRoot, 'dist'), paths.getDistPath(), { recursive: true })
      return paths.getDistPath()
    } finally {
      await workspace.cleanup()
    }
  }
}
