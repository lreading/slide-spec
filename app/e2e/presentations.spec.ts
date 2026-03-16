import { expect, test } from '@playwright/test'

import { FixtureRepository } from './support/FixtureRepository'

const fixtures = new FixtureRepository()
const site = fixtures.getSiteContent()
const presentations = fixtures.listPresentations()
const featured = presentations.find((entry) => entry.featured) ?? presentations[0]

test('renders the presentations listing and opens the selected presentation', async ({ page }) => {
  await page.goto('/presentations')

  await expect(page.getByText(site.presentations_page_title ?? 'All presentations')).toBeVisible()
  await expect(page.getByLabel('Search')).toBeVisible()
  await expect(page.getByLabel('Year')).toBeVisible()
  await expect(page.getByText(`${presentations.length} presentation`)).toBeVisible()
  await expect(page.getByRole('heading', { name: featured.title })).toBeVisible()
  await expect(page.getByText(featured.summary)).toBeVisible()
  await expect(page.getByText(`Q${featured.quarter} ${featured.year}`)).toBeVisible()

  await page.getByRole('link', { name: 'Open presentation' }).click()

  await expect(page).toHaveURL(new RegExp(`/presentations/${featured.id}`))
})
