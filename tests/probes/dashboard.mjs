#!/usr/bin/env node
// Probe: Pages/Platform/0.0.1/Dashboard — 6 core scenarios.

import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = process.env.PORT ?? '6204'
const BASE = `http://localhost:${PORT}`
const ID_PREFIX = 'pages-platform-0-0-1-dashboard'

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

const cases = [
  {
    story: 'default',
    check: async (page) => {
      await page.locator('[data-widget-key]').first().waitFor({ state: 'visible', timeout: 10000 })
      const widgets = await page.locator('[data-widget-key]').count()
      assert(widgets >= 6, `default: expected 6+ widgets, got ${widgets}`)
    },
  },
  {
    story: 'no-project',
    check: async (page) => {
      await page.locator('text=/Select a project to load dashboard stats/i').first().waitFor({ state: 'visible', timeout: 10000 })
      const widgets = await page.locator('[data-widget-key]').count()
      assert(widgets === 0, `no-project: expected 0 widgets, got ${widgets}`)
    },
  },
  {
    story: 'loading',
    check: async (page) => {
      await page.getByRole('status', { name: 'Loading' }).waitFor({ state: 'visible', timeout: 10000 })
      const widgets = await page.locator('[data-widget-key]').count()
      assert(widgets === 0, `loading: expected 0 widgets, got ${widgets}`)
    },
  },
  {
    story: 'error',
    check: async (page) => {
      await page.locator('text=/Failed to load/i').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'customize-open',
    check: async (page) => {
      await page.locator('input[type="checkbox"]').first().waitFor({ state: 'attached', timeout: 10000 })
      const checkboxes = await page.locator('input[type="checkbox"]').count()
      assert(checkboxes >= 4, `customize-open: expected 4+ checkboxes, got ${checkboxes}`)
    },
  },
  {
    story: 'date-range-open',
    check: async (page) => {
      const daypicker = page.locator('.rdp, [role="grid"]').first()
      await daypicker.waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'with-edge-analytics',
    check: async (page) => {
      await page.locator('text=/Edge session summary/i').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'with-deflectometry',
    check: async (page) => {
      await page.locator('text=/Deflectometry summary/i').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
]

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
  for (const { story, check } of cases) {
    const page = await ctx.newPage()
    const consoleErrors = []
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text())
    })
    consoleErrors.length = 0
    const url = `${BASE}/iframe.html?viewMode=story&id=${ID_PREFIX}--${story}`
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
      await page.waitForTimeout(500)
      await check(page)
      const errs = consoleErrors.filter(
        (e) => !/Failed to load resource/i.test(e) && !/X-Frame-Options/i.test(e),
      )
      if (errs.length > 0) throw new Error(`console errors:\n${errs.join('\n')}`)
      console.log(`[OK]   ${story}`)
    } catch (err) {
      failed++
      const msg = err.message.split('\n')[0]
      console.error(`[FAIL] ${story} — ${msg}`)
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
