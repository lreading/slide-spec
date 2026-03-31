import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { parse } from 'yaml'

import {
  buildPresentationSiteLlmsText,
  type PresentationSiteDocument,
  type PresentationSiteIndexDocument,
} from '../shared/src/presentation-site-llms'

const appRoot = process.cwd()
const projectRoot = resolve(appRoot, '..')

const llmsTxtPlugin = () => ({
  name: 'slide-spec-llms-txt',
  configureServer(server: {
    middlewares: {
      use: (path: string, handler: (req: unknown, res: {
        statusCode: number
        setHeader(name: string, value: string): void
        end(body: string): void
      }) => void | Promise<void>) => void
    }
  }) {
    // Keep local /llms.txt aligned with the same content-driven metadata used in production builds.
    server.middlewares.use('/llms.txt', async (_req, res) => {
      const siteDocument = parse(
        await readFile(resolve(projectRoot, 'content', 'site.yaml'), 'utf8'),
      ) as PresentationSiteDocument
      const indexDocument = parse(
        await readFile(resolve(projectRoot, 'content', 'presentations', 'index.yaml'), 'utf8'),
      ) as PresentationSiteIndexDocument

      const llmsText = buildPresentationSiteLlmsText(
        process.env.SLIDE_SPEC_DEPLOYMENT_URL || siteDocument.site.deployment_url,
        siteDocument,
        indexDocument,
      )

      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end(llmsText)
    })
  },
})

export default defineConfig({
  plugins: [llmsTxtPlugin(), vue()],
  server: {
    allowedHosts: ['localhost', '06ed-64-223-218-131.ngrok-free.app']
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      thresholds: {
        perFile: true,
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
      exclude: [
        'src/main.ts',
        'src/assets/**',
        'e2e/fixtures/content/**',
        'e2e/fixtures/content-demo/**',
        'e2e/fixtures/content-cli-demo/**',
        '../docs/fixtures/reference-project/**',
      ],
    },
  },
})
