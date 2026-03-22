import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const expectNoAccessibilityViolations = async (pagePath: string, page: Page) => {
  await page.goto(pagePath)

  const results = await new AxeBuilder({ page }).analyze()

  expect(results.violations).toEqual([])
}

test('has no automated accessibility violations on the home page', async ({ page }) => {
  await expectNoAccessibilityViolations('/', page)
})

test('has no automated accessibility violations on the presentations page', async ({ page }) => {
  await expectNoAccessibilityViolations('/presentations', page)
})

test('has no automated accessibility violations on the presentation page', async ({ page }) => {
  await expectNoAccessibilityViolations('/presentations/2026-q1?slide=1', page)
})

test('has no automated accessibility violations in presentation mode', async ({ page }) => {
  await page.goto('/presentations/2026-q1?slide=1')
  await page.getByRole('button', { name: 'Presentation mode' }).click()

  const results = await new AxeBuilder({ page }).analyze()

  expect(results.violations).toEqual([])
})

test('supports keyboard focus on the main home-page navigation path', async ({ page }) => {
  await page.goto('/')

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Threat Dragon Updates' })).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Presentations', exact: true })).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Latest Presentation', exact: true })).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'View latest presentation' })).toBeFocused()
})
