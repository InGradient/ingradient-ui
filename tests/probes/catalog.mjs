#!/usr/bin/env node
// Probe: Pages/Platform/0.0.1/Catalog — 12 core scenarios.
// Usage: node tests/probes/catalog.mjs

import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = process.env.PORT ?? '6191'
const BASE = `http://localhost:${PORT}`
const ID_PREFIX = 'pages-platform-0-0-1-catalog'
const DEFAULT_VIEWPORT = { width: 1280, height: 800 }

const cases = [
  {
    story: 'default',
    check: async (page) => {
      await page.locator('[data-dataset-id]').first().waitFor({ state: 'visible', timeout: 10000 })
      const datasetRows = await page.locator('[data-dataset-id]').count()
      assert(datasetRows > 0, `default: expected dataset rows, got ${datasetRows}`)
    },
  },
  {
    story: 'empty-images',
    check: async (page) => {
      await page.locator('text=No images').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'loading-images',
    check: async (page) => {
      await page.locator('text=Loading images').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'permission-denied',
    check: async (page) => {
      await page
        .locator('text=/don.+t have permission/')
        .first()
        .waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'mixed-sync',
    check: async (page) => {
      const cards = await page.locator('img[alt]').count()
      assert(cards > 0, `mixed-sync: expected image cards, got ${cards}`)
    },
  },
  {
    story: 'multi-selection',
    check: async (page) => {
      const banner = page.locator('text=/\\d+ image.*selected/i').first()
      await banner.waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'table-view',
    check: async (page) => {
      await page
        .locator('table:has(th:text-is("Dataset")) tbody tr')
        .first()
        .waitFor({ state: 'visible', timeout: 10000 })
      const rows = await page.locator('table:has(th:text-is("Dataset")) tbody tr').count()
      assert(rows > 0, `table-view: expected image rows, got ${rows}`)
    },
  },
  {
    story: 'stats-view',
    waitUntil: 'domcontentloaded',
    check: async (page) => {
      await page.locator('text=Images by dataset').first().waitFor({ state: 'visible', timeout: 10000 })
    },
  },
  {
    story: 'image-menu-open',
    check: async (page) => {
      await page.locator('text=/Open in Labeling|Copy to|Move to|Delete/').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'detail-open',
    waitUntil: 'domcontentloaded',
    check: async (page) => {
      const closeBtn = page.locator('[role="dialog"], [aria-modal="true"]').first()
      await closeBtn.waitFor({ state: 'visible', timeout: 10000 })
    },
  },
  {
    story: 'detail-with-comments',
    name: 'detail-with-comments-mobile-responsive',
    viewport: { width: 375, height: 800 },
    waitUntil: 'domcontentloaded',
    check: async (page) => {
      const image = page.locator('[role="dialog"] img').first()
      await image.waitFor({ state: 'visible', timeout: 10000 })
      const imageBox = await image.boundingBox()
      assert(imageBox && imageBox.width >= 300, `detail-with-comments-mobile-responsive: expected usable image width, got ${imageBox?.width ?? 0}px`)
      await page.getByText('Daniel Kim', { exact: true }).last().waitFor({ state: 'visible', timeout: 10000 })
    },
  },
  {
    story: 'mobile-default',
    check: async (page) => {
      const trigger = page.locator('[aria-haspopup="listbox"]').first()
      await trigger.waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'default',
    name: 'default-tablet-responsive',
    viewport: { width: 768, height: 1024 },
    check: async (page) => {
      await page.getByRole('button', { name: 'View' }).waitFor({ state: 'visible', timeout: 10000 })
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      assert(overflow <= 1, `default-tablet-responsive: expected no page overflow, got ${overflow}px`)
    },
  },
  {
    story: 'modal-add-dataset',
    waitUntil: 'domcontentloaded',
    check: async (page) => {
      await page.locator('text=/Add (new )?dataset/i').first().waitFor({ state: 'visible', timeout: 10000 })
    },
  },
  {
    story: 'modal-bulk-delete',
    waitUntil: 'domcontentloaded',
    check: async (page) => {
      await page.locator('text=/Delete \\d+ images/i').first().waitFor({ state: 'visible', timeout: 10000 })
    },
  },
  {
    story: 'modal-export-config',
    waitUntil: 'domcontentloaded',
    check: async (page) => {
      await page.locator('text=/Export Data/i').first().waitFor({ state: 'visible', timeout: 10000 })
    },
  },
  {
    story: 'modal-export-progress',
    waitUntil: 'domcontentloaded',
    check: async (page) => {
      await page.locator('text=/Exporting Data/i').first().waitFor({ state: 'visible', timeout: 10000 })
    },
  },
  {
    story: 'modal-transfer-move',
    waitUntil: 'domcontentloaded',
    check: async (page) => {
      await page.locator('text=/Move to dataset/i').first().waitFor({ state: 'visible', timeout: 10000 })
    },
  },
]

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

async function startServer() {
  const proc = spawn('python3', ['-m', 'http.server', PORT], {
    cwd: 'storybook-static',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(BASE)
      if (r.ok || r.status === 200) return proc
    } catch {
      /* keep waiting */
    }
    await new Promise((r) => setTimeout(r, 100))
  }
  throw new Error('Server never started')
}

async function main() {
  const server = await startServer()
  const browser = await chromium.launch()
  const ctx = await browser.newContext()

  let failed = 0
  for (const { story, name = story, viewport = DEFAULT_VIEWPORT, check, waitUntil = 'domcontentloaded' } of cases) {
    const page = await ctx.newPage()
    const consoleErrors = []
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text())
    })
    consoleErrors.length = 0
    await page.setViewportSize(viewport)
    const url = `${BASE}/iframe.html?viewMode=story&id=${ID_PREFIX}--${story}`
    try {
      await page.goto(url, { waitUntil, timeout: 30000 })
      await page.waitForTimeout(500)
      await check(page)
      const errs = consoleErrors.filter(
        (e) => !/Failed to load resource/i.test(e) && !/X-Frame-Options/i.test(e),
      )
      if (errs.length > 0) throw new Error(`console errors:\n${errs.join('\n')}`)
      console.log(`[OK]   ${name}`)
    } catch (err) {
      failed++
      console.error(`[FAIL] ${name} — ${err.message}`)
    } finally {
      await page.close()
    }
  }

  await browser.close()
  server.kill()
  if (failed > 0) {
    console.error(`\n${failed}/${cases.length} scenarios failed.`)
    process.exit(1)
  }
  console.log(`\n${cases.length}/${cases.length} scenarios passed.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
