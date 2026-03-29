import { test } from '@playwright/test'

test('readme walkthrough from CLI-initialized default deck', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(700)

  await page.goto('/presentations/2026-demo?slide=1&mode=presentation')
  await page.waitForTimeout(500)

  const totalSlides = 9
  const pauseMs = 1000

  await page.waitForTimeout(pauseMs)
  for (let slide = 1; slide < totalSlides; slide += 1) {
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(pauseMs)
  }

  await page.waitForTimeout(1100)
})
