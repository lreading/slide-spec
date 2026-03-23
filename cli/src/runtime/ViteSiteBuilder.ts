import { cp, mkdir, readFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

import autoprefixer from 'autoprefixer'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import { build as viteBuild } from 'vite'
import { parse } from 'yaml'

import { RuntimeWorkspace } from './RuntimeWorkspace'
import { SiteArtifactGenerator } from '../../../shared/src/site-artifact-generator'
import { ContentValidator } from '../../../shared/src/content-validator'

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
    private readonly siteArtifactGenerator: SiteArtifactGenerator = new SiteArtifactGenerator(),
    private readonly contentValidator: ContentValidator = new ContentValidator(),
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
      const siteDocument = await this.readYaml<{ site: { site_url?: string } }>(paths.getSiteConfigPath())
      const indexDocument = await this.readYaml<{
        presentations: Array<{ id: string; published: boolean }>
      }>(paths.getPresentationsIndexPath())
      this.contentValidator.validateSiteDocument(siteDocument)
      this.contentValidator.validatePresentationIndexDocument(indexDocument)
      await this.siteArtifactGenerator.generate({
        outputRoot: resolve(workspace.appRoot, 'dist'),
        siteUrl: process.env.SLIDE_SPEC_SITE_URL || siteDocument.site.site_url || 'https://example.invalid',
        publishedPresentationIds: indexDocument.presentations
          .filter((entry) => entry.published)
          .map((entry) => entry.id),
      })
      await rm(paths.getDistPath(), { recursive: true, force: true })
      await mkdir(paths.getProjectRoot(), { recursive: true })
      await cp(resolve(workspace.appRoot, 'dist'), paths.getDistPath(), { recursive: true })
      return paths.getDistPath()
    } finally {
      await workspace.cleanup()
    }
  }

  private async readYaml<T>(path: string): Promise<T> {
    return parse(await readFile(path, 'utf8')) as T
  }
}
