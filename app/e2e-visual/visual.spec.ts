import { expect, test } from '@playwright/test'

const DESKTOP_VIEWPORT = { width: 1440, height: 1024 }
const TABLET_VIEWPORT = { width: 1024, height: 1366 }
const MOBILE_VIEWPORT = { width: 390, height: 844 }

async function preparePageForCapture(page: Parameters<typeof test>[0]['page']): Promise<void> {
  await page.waitForLoadState('networkidle')
  await page.evaluate(async () => {
    await document.fonts.ready
    const images = Array.from(document.images)
    await Promise.all(
      images.map(async (image) => {
        if (!image.complete) {
          await new Promise<void>((resolve) => {
            image.addEventListener('load', () => resolve(), { once: true })
            image.addEventListener('error', () => resolve(), { once: true })
          })
        }

        if (typeof image.decode === 'function') {
          try {
            await image.decode()
          } catch {
            // A decode failure is handled by the broken-image assertion below.
          }
        }
      }),
    )
  })

  const brokenImageSources = await page.locator('img').evaluateAll((images) =>
    images
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.getAttribute('src') ?? image.getAttribute('data-src') ?? '<missing-src>'),
  )

  expect(brokenImageSources, `Broken images found: ${brokenImageSources.join(', ')}`).toEqual([])
}

test.describe('visual regression', () => {
  test('captures the home page', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT)
    await page.goto('/')
    await preparePageForCapture(page)

    await expect(page).toHaveScreenshot('home-desktop.png', {
      animations: 'disabled',
      caret: 'hide',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    })
  })

  test('captures the mobile home page', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto('/')
    await preparePageForCapture(page)

    await expect(page).toHaveScreenshot('home-mobile.png', {
      animations: 'disabled',
      caret: 'hide',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    })
  })

  test('captures the presentations page', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT)
    await page.goto('/presentations')
    await preparePageForCapture(page)

    await expect(page).toHaveScreenshot('presentations-desktop.png', {
      animations: 'disabled',
      caret: 'hide',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    })
  })

  test('captures the hero slide', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT)
    await page.goto('/presentations/2026-q1?slide=1')
    await preparePageForCapture(page)

    await expect(page).toHaveScreenshot('presentation-hero-desktop.png', {
      animations: 'disabled',
      caret: 'hide',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    })
  })

  test('captures the mobile hero slide', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto('/presentations/2026-q1?slide=1')
    await preparePageForCapture(page)

    await expect(page).toHaveScreenshot('presentation-hero-mobile.png', {
      animations: 'disabled',
      caret: 'hide',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    })
  })

  test('captures a mobile standard slide', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto('/presentations/2026-q1?slide=3')
    await preparePageForCapture(page)

    await expect(page).toHaveScreenshot('presentation-standard-mobile.png', {
      animations: 'disabled',
      caret: 'hide',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    })
  })

  test('captures the community metrics slide', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT)
    await page.goto('/presentations/2026-q1?slide=9')
    await preparePageForCapture(page)

    await expect(page).toHaveScreenshot('presentation-community-metrics-desktop.png', {
      animations: 'disabled',
      caret: 'hide',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    })
  })

  test('captures the sparse presentation', async ({ page }) => {
    await page.setViewportSize(TABLET_VIEWPORT)
    await page.goto('/presentations/2025-template-sparse?slide=1')
    await preparePageForCapture(page)

    await expect(page).toHaveScreenshot('presentation-sparse-tablet.png', {
      animations: 'disabled',
      caret: 'hide',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    })
  })
})
