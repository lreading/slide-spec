import { expect, test } from '@playwright/test'

import { FixtureRepository } from './support/FixtureRepository'

const fixtures = new FixtureRepository()
const site = fixtures.getSiteContent()

function formatFooterText(url: string): string {
  const parsed = new URL(url)
  const path = parsed.pathname.replace(/\/$/, '')

  return `${parsed.host}${path}`
}

test('renders home content from config-backed fixtures', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Presentations', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Latest Presentation', exact: true })).toBeVisible()
  await expect(page.getByText(site.project_badge?.label ?? '')).toBeVisible()
  await expect(page.getByRole('link', { name: site.home_cta_label })).toBeVisible()
  await expect(page.getByRole('link', { name: site.presentations_cta_label })).toBeVisible()
  await expect(page.getByRole('heading', { name: /owasp threat dragon/i })).toBeVisible()
  await expect(page.getByText(site.home_intro)).toBeVisible()

  for (const link of Object.values(site.links)) {
    const footerLink = page.getByRole('link', { name: formatFooterText(link.url) })
    await expect(footerLink).toBeVisible()
    await expect(footerLink).toHaveAttribute('href', link.url)
  }
})
