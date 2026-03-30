import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

import { FixtureRepository } from './support/FixtureRepository'

const fixtures = new FixtureRepository()
const sparseRecord = fixtures.getPresentation('2025-template-sparse')

async function assertSparseSlide(page: Page, slideNumber: number): Promise<void> {
  const slide = sparseRecord.presentation.slides[slideNumber - 1]

  if (!slide) {
    throw new Error(`Missing sparse slide ${slideNumber}`)
  }

  switch (slide.template) {
    case 'hero':
      await expect(page.getByRole('heading', { name: /threat dragon/i })).toBeVisible()
      await expect(page.locator('.hero-subtitle')).toHaveCount(0)
      await expect(page.locator('.hero-quote')).toHaveCount(0)
      break
    case 'agenda':
      await expect(page.getByRole('heading', { name: 'Agenda' })).toBeVisible()
      await expect(page.getByText('Minimal Updates')).toBeVisible()
      await expect(page.getByText('How to Contribute')).toBeVisible()
      break
    case 'section-list-grid':
      await expect(page.getByRole('heading', { name: 'Minimal Updates' })).toBeVisible()
      await expect(page.locator('.feature-card')).toHaveCount(0)
      break
    case 'timeline':
      await expect(page.getByRole('heading', { name: 'Releases' })).toBeVisible()
      await expect(page.locator('.release-card')).toHaveCount(0)
      await expect(page.locator('.github-link')).toHaveCount(0)
      break
    case 'progress-timeline':
      await expect(page.getByRole('heading', { name: 'Roadmap' })).toBeVisible()
      await expect(page.locator('.progress-timeline__item')).toHaveCount(4)
      await expect(page.locator('.card-eyebrow')).toHaveCount(1)
      await expect(page.locator('.card-title')).toHaveCount(0)
      await expect(page.locator('.footer-link')).toHaveCount(0)
      break
    case 'people':
      await expect(page.getByRole('heading', { name: 'Contributors' })).toBeVisible()
      await expect(page.locator('.profile-card')).toHaveCount(0)
      await expect(page.locator('.thank-you-banner')).toHaveCount(0)
      break
    case 'metrics-and-links':
      await expect(page.getByRole('heading', { name: 'Community Highlights' })).toBeVisible()
      await expect(page.locator('.mention-card')).toHaveCount(0)
      await expect(page.locator('.stat-card')).toHaveCount(0)
      await expect(page.locator('.section-heading')).toHaveCount(0)
      break
    case 'action-cards':
      await expect(page.getByRole('heading', { name: 'How to Contribute' })).toBeVisible()
      await expect(page.locator('.contrib-card')).toHaveCount(0)
      await expect(page.locator('.footer-cta')).toHaveCount(1)
      break
    case 'closing':
      await expect(page.getByRole('heading', { name: /thanks/i })).toBeVisible()
      await expect(page.getByText('See you soon.')).toBeVisible()
      await expect(page.locator('.footer-quote')).toHaveCount(0)
      break
  }
}

for (const [index, slide] of sparseRecord.presentation.slides.entries()) {
  test(`renders sparse slide ${index + 1}: ${slide.template}`, async ({ page }) => {
    await page.goto(`/presentations/${sparseRecord.presentation.id}?slide=${index + 1}`)

    await assertSparseSlide(page, index + 1)
  })
}
