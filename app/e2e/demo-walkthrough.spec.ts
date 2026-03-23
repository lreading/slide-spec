import { expect, test } from '@playwright/test'

test('readme demo walkthrough (records video when using playwright.demo.config)', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('link', { name: 'Acorn Cloud Updates' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1, name: /Quarterly Roadmap/ })).toBeVisible()

  await page.getByRole('link', { name: 'View latest presentation', exact: true }).click()
  await expect(page).toHaveURL(/\/presentations\/readme-demo/)

  await expect(page.getByRole('heading', { name: 'Slide Spec', exact: true })).toBeVisible()

  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('heading', { name: 'Agenda', exact: true })).toBeVisible()

  await expect(page.getByText('Keyboard shortcuts')).toBeVisible()
  await page.getByRole('button', { name: 'Do not show again' }).click()

  await page.getByRole('button', { name: 'Presentation mode' }).click()

  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('heading', { name: /Thanks/ })).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Presentation mode' })).toBeVisible()
})
