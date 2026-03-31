import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

import { documentationPaths as DOC_PATHS } from '../scripts/documentation-manifest'

const expectNoAccessibilityViolations = async (pagePath: string, page: Page) => {
  await page.goto(pagePath)
  const results = await new AxeBuilder({ page })
    // VitePress default layout uses a div#VPContent; axe treats missing <main> as best-practice only.
    .disableRules(['landmark-one-main', 'region'])
    .analyze()
  expect(results.violations).toEqual([])
}

for (const path of DOC_PATHS) {
  test(`docs a11y: ${path}`, async ({ page }) => {
    await expectNoAccessibilityViolations(path, page)
  })
}
