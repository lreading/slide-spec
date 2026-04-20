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

  const focusedLinks: Array<{ text: string; href: string | null }> = []

  for (let index = 0; index < 6; index += 1) {
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    focusedLinks.push({
      text: (await focused.textContent())?.trim() ?? '',
      href: await focused.getAttribute('href'),
    })
  }

  expect(focusedLinks).toEqual([
    { text: 'Aurora Notes Updates', href: '/' },
    { text: 'Home', href: '/' },
    { text: 'Presentations', href: '/presentations' },
    { text: 'Latest Presentation', href: '/presentations/2026-q1' },
    { text: 'Aurora Notes Docs', href: 'https://docs.example.org/aurora-notes' },
    { text: 'View latest presentation', href: '/presentations/2026-q1' },
  ])
})
