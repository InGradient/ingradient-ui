import { expect, test } from '@playwright/test'
import { edgeRoutes } from '../probes/edge-routes.mjs'

// Fresh production Storybook is served by playwright.storybook.config.ts.
// This validates token wiring without inventing or updating visual baselines.
for (const { id } of edgeRoutes) {
  test(`Edge production preset: ${id}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`)
    await expect(page.locator('#storybook-root > *').first()).toBeVisible()
    await expect(page.locator('.sb-errordisplay:visible, .sb-nopreview:visible')).toHaveCount(0)
    await expect(page.locator('html')).toHaveAttribute('data-ig-preset', 'edge-0.0.1')
    await expect(page.locator('html')).toHaveAttribute('data-ig-density', 'compact')
    expect(await page.locator('body').evaluate(el => getComputedStyle(el).getPropertyValue('--ig-control-height-lg').trim())).toBe('40px')
    if (id === 'pages-edge-0-0-5-workspace--settings') {
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()
      expect(await dialog.evaluate(el => getComputedStyle(el).getPropertyValue('--ig-control-height-lg').trim())).toBe('40px')
    }
  })
}
