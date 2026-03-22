import { expect, test } from '@playwright/test'

import { FixtureRepository } from './support/FixtureRepository'

const fixtures = new FixtureRepository()
const site = fixtures.getSiteContent()
const presentations = fixtures.listPresentations()
const featured = presentations.find((entry) => entry.featured) ?? presentations[0]

test('renders the presentations listing and opens the selected presentation', async ({ page }) => {
  await page.goto('/presentations')
  const summary = page.locator('.presentations-results-summary')

  await expect(page.getByText(site.presentations_page?.title ?? '')).toBeVisible()
  await expect(page.getByLabel('Search')).toBeVisible()
  await expect(page.getByLabel('Year')).toBeVisible()
  await expect(summary).toContainText(`${presentations.length} presentations total`)
  await expect(summary).toContainText('Page 1 of 2')
  await expect(summary).toContainText('Showing 1-12')
  await expect(page.getByRole('heading', { name: featured.title })).toBeVisible()
  await expect(page.getByText(featured.summary)).toBeVisible()
  await expect(page.getByText(featured.subtitle)).toBeVisible()
  await expect(page.getByRole('link', { name: 'Powered by slide-spec' })).toHaveAttribute(
    'href',
    'https://github.com/lreading/slide-spec',
  )

  await page
    .getByRole('article')
    .filter({ has: page.getByRole('heading', { name: featured.title }) })
    .getByRole('link', { name: featured.title })
    .click()

  await expect(page).toHaveURL(new RegExp(`/presentations/${featured.id}`))
})

test('supports search and empty-state filtering on the presentations page', async ({ page }) => {
  await page.goto('/presentations')

  const search = page.getByLabel('Search')

  await search.fill(featured.subtitle)
  await expect(page.getByRole('heading', { name: featured.title })).toBeVisible()
  await expect(page.getByText('1 presentation total')).toBeVisible()
  await expect(page.getByText(/Page 1 of 1/)).toBeVisible()

  await search.fill('no such presentation')
  await expect(page.getByRole('heading', { name: 'No matching presentations' })).toBeVisible()
  await expect(page.getByText('Try a different year or a broader search term.')).toBeVisible()
  await expect(page.getByText('0 presentations total')).toBeVisible()

  await search.fill('')
  if (featured.year !== undefined) {
    await page.getByLabel('Year').selectOption(String(featured.year))
    await expect(page.getByRole('heading', { name: featured.title })).toBeVisible()
  }
})

test('paginates through the archive and opens a title link from page two', async ({ page }) => {
  await page.goto('/presentations')

  await expect(page.getByText(/Page 1 of 2/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Community Office Hours' })).toBeHidden()

  await page.getByRole('button', { name: 'Next' }).click()

  await expect(page.getByText(/Page 2 of 2/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Community Office Hours' })).toBeVisible()

  await page
    .getByRole('article')
    .filter({ has: page.getByRole('heading', { name: 'Community Office Hours' }) })
    .getByRole('link', { name: 'Community Office Hours' })
    .click()

  await expect(page).toHaveURL(/\/presentations\/2025-04-community-office-hours/)
  await expect(page.getByText('April 2025')).toBeVisible()
})

test('paginates to the second page and opens the expected presentation from the title link', async ({ page }) => {
  await page.goto('/presentations')
  const summary = page.locator('.presentations-results-summary')

  await expect(summary).toContainText('Page 1 of 2')
  await expect(summary).toContainText('Showing 1-12')
  await expect(page.getByRole('heading', { name: 'Community Office Hours' })).toHaveCount(0)

  await page.getByRole('button', { name: 'Next' }).click()

  await expect(summary).toContainText('Page 2 of 2')
  await expect(summary).toContainText('Showing 13-14')
  await expect(page.getByRole('heading', { name: 'Release Recap' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Community Office Hours' })).toBeVisible()

  await page
    .getByRole('article')
    .filter({ has: page.getByRole('heading', { name: 'Community Office Hours' }) })
    .getByRole('link', { name: 'Community Office Hours' })
    .click()

  await expect(page).toHaveURL(/\/presentations\/2025-04-community-office-hours/)
  await expect(page.getByText('April 2025')).toBeVisible()
})
