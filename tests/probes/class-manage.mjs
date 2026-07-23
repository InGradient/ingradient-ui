#!/usr/bin/env node
// Probe: Pages/Platform/0.0.1/ClassManage — core scenarios.
// Usage: node tests/probes/class-manage.mjs

import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = process.env.PORT ?? '6178'
const BASE = `http://localhost:${PORT}`
const ID_PREFIX = 'pages-platform-0-0-1-classmanage'

const cases = [
  {
    story: 'default',
    check: async (page) => {
      const rows = await page.locator('[role="option"]:has-text("Crack")').count()
      assert(rows > 0, `default: should render at least one Crack row, got ${rows}`)
      const selected = await page.locator('[role="option"][aria-selected="true"]').count()
      assert(selected === 1, `default: exactly one row selected, got ${selected}`)
    },
  },
  {
    story: 'no-class-selected',
    check: async (page) => {
      const rows = await page.locator('[role="option"]').count()
      assert(rows >= 10, `no-class-selected: should still list classes, got ${rows}`)
      const selected = await page.locator('[role="option"][aria-selected="true"]').count()
      assert(selected === 0, `no-class-selected: no row selected, got ${selected}`)
    },
  },
  {
    story: 'permission-denied',
    check: async (page) => {
      const alert = page.locator('div', { hasText: /don.+t have permission/ }).first()
      await alert.waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'empty',
    check: async (page) => {
      const rows = await page.locator('[role="option"]').count()
      assert(rows === 0, `empty: no class rows expected, got ${rows}`)
    },
  },
  {
    story: 'many-items',
    check: async (page) => {
      const rows = await page.locator('[role="option"]:has-text("#")').count()
      assert(rows >= 20, `many-items: expected 20+ rows, got ${rows}`)
    },
  },
  {
    story: 'add-class-modal-open',
    check: async (page) => {
      const dialog = page.locator('text=Add Class').first()
      await dialog.waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'lightbox-open',
    waitUntil: 'domcontentloaded',
    check: async (page) => {
      // Class lightbox renders a dialog. Look for the close action or large image.
      const closeBtn = page.locator('button[aria-label="Close"]').first()
      await closeBtn.waitFor({ state: 'visible', timeout: 10000 })
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
  const page = await ctx.newPage()
  const consoleErrors = []
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text())
  })

  let failed = 0
  for (const { story, check, waitUntil = 'networkidle' } of cases) {
    consoleErrors.length = 0
    const url = `${BASE}/iframe.html?viewMode=story&id=${ID_PREFIX}--${story}`
    try {
      await page.goto(url, { waitUntil, timeout: 20000 })
      await check(page)
      const errs = consoleErrors.filter(
        (e) => !/Failed to load resource/i.test(e) && !/X-Frame-Options/i.test(e),
      )
      if (errs.length > 0) throw new Error(`console errors:\n${errs.join('\n')}`)
      console.log(`[OK]   ${story}`)
    } catch (err) {
      failed++
      console.error(`[FAIL] ${story} — ${err.message}`)
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
