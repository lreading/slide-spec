import { test } from '@playwright/test'

test('readme video walkthrough (docs reference project)', async ({ page }) => {
  await page.goto('/presentations/2026-spring-briefing?slide=1&mode=presentation')

  const dismissBtn = page.getByRole('button', { name: 'Do not show again' })
  if (await dismissBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await dismissBtn.click()
  }

  // Long settle so ffmpeg -ss can trim cleanly into presentation
  await page.waitForTimeout(3000)

  const pauseMs = 1550
  const slideCount = 9
  for (let step = 1; step < slideCount; step += 1) {
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(pauseMs)
  }

  await page.waitForTimeout(1550)
})
