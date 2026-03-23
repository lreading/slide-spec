import { cp, mkdtemp, mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { chromium, type Route } from 'playwright'

const screenshotWidth = 1440
const screenshotHeight = 900
const docsFixtureBaseUrl = 'http://slide-spec-docs.local'
const screenshotRoutes = [
  { name: 'home-reference.png', path: '/' },
  { name: 'presentations-reference.png', path: '/presentations' },
  { name: 'template-hero-reference.png', path: '/presentations/2026-spring-briefing?slide=1' },
  { name: 'template-agenda-reference.png', path: '/presentations/2026-spring-briefing?slide=2' },
  { name: 'template-section-list-grid-reference.png', path: '/presentations/2026-spring-briefing?slide=3' },
  { name: 'template-timeline-reference.png', path: '/presentations/2026-spring-briefing?slide=4' },
  { name: 'template-progress-timeline-reference.png', path: '/presentations/2026-spring-briefing?slide=5' },
  { name: 'template-people-reference.png', path: '/presentations/2026-spring-briefing?slide=6' },
  { name: 'template-metrics-and-links-reference.png', path: '/presentations/2026-spring-briefing?slide=7' },
  { name: 'template-action-cards-reference.png', path: '/presentations/2026-spring-briefing?slide=8' },
  { name: 'template-closing-reference.png', path: '/presentations/2026-spring-briefing?slide=9' },
] as const

export class DocsAssetGenerator {
  private readonly repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
  private readonly fixtureSource = join(this.repoRoot, 'docs', 'fixtures', 'reference-project')
  private readonly cliEntrypoint = join(this.repoRoot, 'cli', 'dist', 'index.js')
  private readonly screenshotDirectory = join(this.repoRoot, 'docs', 'public', 'screenshots')

  public async run(): Promise<void> {
    const fixtureRoot = await mkdtemp(join(tmpdir(), 'slide-spec-docs-fixture-'))

    try {
      await cp(this.fixtureSource, fixtureRoot, { recursive: true })
      await mkdir(this.screenshotDirectory, { recursive: true })
      await this.runCli(['validate', fixtureRoot])
      await this.runCli(['build', fixtureRoot])
      await this.captureScreenshots(fixtureRoot)
    } finally {
      await rm(fixtureRoot, { force: true, recursive: true })
    }
  }

  private async runCli(argumentsList: string[]): Promise<void> {
    await new Promise<void>((resolvePromise, rejectPromise) => {
      const child = spawn(process.execPath, [this.cliEntrypoint, ...argumentsList], {
        cwd: this.repoRoot,
        stdio: 'inherit',
      })

      child.once('exit', (code) => {
        if (code === 0) {
          resolvePromise()
          return
        }

        rejectPromise(new Error(`CLI command failed with exit code ${String(code)}.`))
      })
      child.once('error', rejectPromise)
    })
  }

  private async captureScreenshots(fixtureRoot: string): Promise<void> {
    const distRoot = join(fixtureRoot, 'dist')
    const browser = await chromium.launch()

    try {
      const page = await browser.newPage({
        viewport: {
          width: screenshotWidth,
          height: screenshotHeight,
        },
      })
      await page.route(`${docsFixtureBaseUrl}/**`, async (route) => {
        await this.fulfillBuiltAsset(route, distRoot)
      })

      for (const route of screenshotRoutes) {
        await page.goto(`${docsFixtureBaseUrl}${route.path}`, {
          waitUntil: 'networkidle',
        })
        await this.assertNoBrokenImages(page)
        await page.screenshot({
          fullPage: true,
          path: join(this.screenshotDirectory, route.name),
        })
      }
    } finally {
      await browser.close()
    }
  }

  private async fulfillBuiltAsset(route: Route, distRoot: string): Promise<void> {
    const requestUrl = new URL(route.request().url())
    const assetPath = this.resolveAssetPath(distRoot, requestUrl.pathname)

    try {
      const body = await import('node:fs/promises').then(({ readFile }) => readFile(assetPath))
      await route.fulfill({
        body,
        contentType: this.resolveMimeType(assetPath),
        status: 200,
      })
    } catch {
      const fallback = await import('node:fs/promises').then(({ readFile }) => readFile(join(distRoot, 'index.html')))
      await route.fulfill({
        body: fallback,
        contentType: 'text/html; charset=utf-8',
        status: 200,
      })
    }
  }

  private resolveAssetPath(distRoot: string, requestPath: string): string {
    const normalizedPath = normalize(requestPath).replace(/^(\.\.[/\\])+/, '')
    const relativePath = normalizedPath === '/' ? 'index.html' : normalizedPath.replace(/^\//, '')
    return join(distRoot, relativePath)
  }

  private resolveMimeType(filePath: string): string {
    const extension = extname(filePath)

    switch (extension) {
      case '.css':
        return 'text/css; charset=utf-8'
      case '.html':
        return 'text/html; charset=utf-8'
      case '.ico':
        return 'image/x-icon'
      case '.js':
        return 'text/javascript; charset=utf-8'
      case '.json':
        return 'application/json; charset=utf-8'
      case '.png':
        return 'image/png'
      case '.svg':
        return 'image/svg+xml'
      case '.woff2':
        return 'font/woff2'
      default:
        return 'application/octet-stream'
    }
  }

  private async assertNoBrokenImages(page: import('playwright').Page): Promise<void> {
    const imageStatus = await page.evaluate(() =>
      Array.from(document.images).map((image) => ({
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        src: image.currentSrc || image.src,
      })),
    )

    const brokenImages = imageStatus.filter((image) => !image.complete || image.naturalWidth === 0)
    if (brokenImages.length > 0) {
      throw new Error(`Broken images detected: ${brokenImages.map((image) => image.src).join(', ')}`)
    }
  }
}

const generator = new DocsAssetGenerator()

generator.run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exitCode = 1
})
