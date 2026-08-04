#!/usr/bin/env node
// Probe: Pages/Platform/0.0.1/Dataset Catalog — 22 consolidated integration cases.
// Usage: node tests/probes/catalog.mjs

import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = process.env.PORT ?? '6191'
const BASE = `http://localhost:${PORT}`
const DEFAULT_VIEWPORT = { width: 1280, height: 800 }

const STORY = {
  overview: 'pages-platform-0-0-1-dataset-catalog-workspace--overview',
  noImages: 'pages-platform-0-0-1-dataset-catalog-system-states--no-images',
  imagesLoading: 'pages-platform-0-0-1-dataset-catalog-system-states--images-loading',
  accessDenied: 'pages-platform-0-0-1-dataset-catalog-system-states--access-denied',
  noProject: 'pages-platform-0-0-1-dataset-catalog-system-states--no-project-selected',
  imagesSelected: 'pages-platform-0-0-1-dataset-catalog-workspace--images-selected',
  activeFilters: 'pages-platform-0-0-1-dataset-catalog-interactions--active-filtered-results',
  imageTable: 'pages-platform-0-0-1-dataset-catalog-workspace--image-table',
  analytics: 'pages-platform-0-0-1-dataset-catalog-analytics--overview',
  imageActions: 'pages-platform-0-0-1-dataset-catalog-interactions--image-actions-menu',
  inspector: 'pages-platform-0-0-1-dataset-catalog-image-inspector--with-comments',
  mobileOverview: 'pages-platform-0-0-1-dataset-catalog-responsive--overview',
  mobileSort: 'pages-platform-0-0-1-dataset-catalog-responsive--sort-sheet-open',
  mobileAnalytics: 'pages-platform-0-0-1-dataset-catalog-responsive--analytics-fallback',
  addDataset: 'pages-platform-0-0-1-dataset-catalog-workflows--add-dataset-dialog',
  deleteImages: 'pages-platform-0-0-1-dataset-catalog-workflows--delete-images-dialog',
  galleryExport: 'pages-platform-0-0-1-dataset-catalog-workflows--gallery-export-dialog',
  datasetExport: 'pages-platform-0-0-1-dataset-catalog-workflows--dataset-igp-export-dialog',
  transferImages: 'pages-platform-0-0-1-dataset-catalog-workflows--transfer-images-dialog',
  uploadQuality: 'pages-platform-0-0-1-dataset-catalog-workflows--upload-quality-dialog',
}

const cases = [
  {
    id: STORY.overview,
    name: 'workspace-overview',
    check: async (page) => {
      await page.locator('[data-dataset-id]').first().waitFor({ state: 'visible', timeout: 10000 })
      const datasetRows = await page.locator('[data-dataset-id]').count()
      const imageCards = await page.locator('[data-image-id]').count()
      assert(datasetRows > 0, `workspace-overview: expected dataset rows, got ${datasetRows}`)
      assert(imageCards > 0, `workspace-overview: expected mixed-state image cards, got ${imageCards}`)
    },
  },
  {
    id: STORY.noImages,
    name: 'no-images',
    check: async (page) => page.getByText('No images', { exact: false }).first().waitFor({ state: 'visible' }),
  },
  {
    id: STORY.imagesLoading,
    name: 'images-loading',
    check: async (page) => page.getByText('Loading images', { exact: false }).first().waitFor({ state: 'visible' }),
  },
  {
    id: STORY.accessDenied,
    name: 'access-denied',
    check: async (page) => page.locator('text=/don.+t have permission/').first().waitFor({ state: 'visible' }),
  },
  {
    id: STORY.noProject,
    name: 'no-project-selected',
    check: async (page) => page.getByText('No project selected', { exact: true }).first().waitFor({ state: 'visible' }),
  },
  {
    id: STORY.imagesSelected,
    name: 'images-selected',
    check: async (page) => page.locator('text=/\d+ image.*selected/i').first().waitFor({ state: 'visible' }),
  },
  {
    id: STORY.activeFilters,
    name: 'active-filtered-results',
    check: async (page) => {
      const cards = await page.locator('[data-image-id]').count()
      assert(cards === 2, `active-filtered-results: expected 2 matching images, got ${cards}`)
    },
  },
  {
    id: STORY.imageTable,
    name: 'image-table',
    check: async (page) => {
      await page.locator('table:has(th:text-is("Dataset")) tbody tr').first().waitFor({ state: 'visible' })
      const rows = await page.locator('table:has(th:text-is("Dataset")) tbody tr').count()
      assert(rows > 0, `image-table: expected image rows, got ${rows}`)
    },
  },
  {
    id: STORY.analytics,
    name: 'analytics-overview',
    waitUntil: 'domcontentloaded',
    check: async (page) => page.getByText('Images by dataset', { exact: true }).first().waitFor({ state: 'visible' }),
  },
  {
    id: STORY.imageActions,
    name: 'image-actions-menu',
    check: async (page) => page.locator('text=/Open in Labeling|Copy to|Move to|Delete/').first().waitFor({ state: 'visible' }),
  },
  {
    id: STORY.inspector,
    name: 'image-inspector',
    waitUntil: 'domcontentloaded',
    check: async (page) => page.getByRole('dialog').first().waitFor({ state: 'visible' }),
  },
  {
    id: STORY.inspector,
    name: 'image-inspector-mobile-responsive',
    viewport: { width: 375, height: 800 },
    waitUntil: 'domcontentloaded',
    check: async (page) => {
      const image = page.locator('[role="dialog"] img').first()
      await image.waitFor({ state: 'visible' })
      const imageBox = await image.boundingBox()
      assert(imageBox && imageBox.width >= 300, `image-inspector-mobile-responsive: expected usable image width, got ${imageBox?.width ?? 0}px`)
      await page.getByText('Daniel Kim', { exact: true }).last().waitFor({ state: 'visible' })
    },
  },
  {
    id: STORY.mobileOverview,
    name: 'mobile-overview',
    viewport: { width: 375, height: 812 },
    check: async (page) => page.locator('[aria-haspopup="listbox"]').first().waitFor({ state: 'visible' }),
  },
  {
    id: STORY.mobileSort,
    name: 'mobile-sort-sheet',
    viewport: { width: 375, height: 812 },
    check: async (page) => {
      await page.waitForFunction(() => document.querySelector('[data-image-id] img')?.getAttribute('alt')?.startsWith('very-long-image'))
    },
  },
  {
    id: STORY.mobileAnalytics,
    name: 'mobile-analytics-fallback',
    viewport: { width: 375, height: 812 },
    check: async (page) => {
      await page.getByRole('button', { name: 'View' }).waitFor({ state: 'visible' })
      const analyticsHeading = await page.getByRole('heading', { name: 'Images by dataset' }).count()
      assert(analyticsHeading === 0, 'mobile-analytics-fallback: desktop analytics remained visible')
    },
  },
  {
    id: STORY.overview,
    name: 'workspace-tablet-responsive',
    viewport: { width: 768, height: 1024 },
    check: async (page) => {
      await page.getByRole('button', { name: 'View' }).waitFor({ state: 'visible' })
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      assert(overflow <= 1, `workspace-tablet-responsive: expected no page overflow, got ${overflow}px`)
    },
  },
  dialogCase(STORY.addDataset, 'add-dataset-dialog', 'Add dataset'),
  dialogCase(STORY.deleteImages, 'delete-images-dialog', /Delete \d+ images/),
  dialogCase(STORY.galleryExport, 'gallery-export-dialog', 'Export Data'),
  dialogCase(STORY.datasetExport, 'dataset-igp-export-dialog', 'Export (.igp)'),
  dialogCase(STORY.transferImages, 'transfer-images-dialog', 'Move to dataset'),
  dialogCase(STORY.uploadQuality, 'upload-quality-dialog', 'Upload quality'),
]

function dialogCase(id, name, heading) {
  return {
    id,
    name,
    waitUntil: 'domcontentloaded',
    check: async (page) => page.getByRole('heading', { name: heading }).waitFor({ state: 'visible' }),
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function startServer() {
  const process = spawn('python3', ['-m', 'http.server', PORT], {
    cwd: 'storybook-static',
    stdio: 'ignore',
  })
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const response = await fetch(BASE)
      if (response.ok) return process
    } catch {
      /* keep waiting */
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error('Server never started')
}

async function main() {
  const server = await startServer()
  const browser = await chromium.launch()
  const context = await browser.newContext()
  let failed = 0

  for (const { id, name, viewport = DEFAULT_VIEWPORT, check, waitUntil = 'domcontentloaded' } of cases) {
    const page = await context.newPage()
    const consoleErrors = []
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })
    await page.setViewportSize(viewport)
    try {
      await page.goto(`${BASE}/iframe.html?viewMode=story&id=${id}`, { waitUntil, timeout: 30000 })
      await page.waitForTimeout(500)
      await check(page)
      const productErrors = consoleErrors.filter(
        (message) => !/Failed to load resource/i.test(message) && !/X-Frame-Options/i.test(message),
      )
      if (productErrors.length > 0) throw new Error(`console errors:\n${productErrors.join('\n')}`)
      console.log(`[OK]   ${name}`)
    } catch (error) {
      failed++
      console.error(`[FAIL] ${name} — ${error.message}`)
    } finally {
      await page.close()
    }
  }

  await browser.close()
  server.kill()
  if (failed > 0) {
    console.error(`\n${failed}/${cases.length} cases failed.`)
    process.exit(1)
  }
  console.log(`\n${cases.length}/${cases.length} cases passed.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
