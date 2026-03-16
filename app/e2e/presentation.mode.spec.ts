import { expect, test } from '@playwright/test'

import { FixtureRepository } from './support/FixtureRepository'

const fixtures = new FixtureRepository()
const presentation = fixtures.getPresentation('2026-q1')

test('supports keyboard navigation on the presentation page', async ({ page }) => {
  await page.goto('/presentations/2026-q1?slide=1')

  await expect(page.getByRole('button', { name: 'Presentation mode' })).toBeVisible()

  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/slide=2/)
  await expect(page.getByText('Agenda')).toBeVisible()

  await page.keyboard.press('ArrowLeft')
  await expect(page).toHaveURL(/slide=1/)
  await expect(page.getByText(presentation.deck.subtitle)).toBeVisible()
})

test('enters and exits presentation mode cleanly', async ({ page }) => {
  await page.goto('/presentations/2026-q1?slide=1')

  const modeButton = page.getByRole('button', { name: 'Presentation mode' })

  await expect(modeButton).toBeVisible()
  await modeButton.click()

  await expect(page).toHaveURL(/mode=presentation/)
  await expect(modeButton).toBeHidden()
  await page.keyboard.press('Escape')
  await expect(page).not.toHaveURL(/mode=presentation/)
  await expect(page.getByRole('button', { name: 'Presentation mode' })).toBeVisible()
})
