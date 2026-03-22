import { expect, test } from '@playwright/test'

const DESKTOP_VIEWPORT = { width: 1440, height: 1024 }
const TABLET_VIEWPORT = { width: 1024, height: 1366 }

async function preparePageForCapture(page: Parameters<typeof test>[0]['page']): Promise<void> {
  await page.waitForLoadState('networkidle')
  await page.evaluate(async () => {
    await document.fonts.ready
  })
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
