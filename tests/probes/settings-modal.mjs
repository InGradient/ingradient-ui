#!/usr/bin/env node
// Probe: Pages/Platform/0.0.1/SettingsModal — 8 core scenarios.
// Usage: node tests/probes/settings-modal.mjs

import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = process.env.PORT ?? '6194'
const BASE = `http://localhost:${PORT}`
const ID_PREFIX = 'pages-platform-0-0-1-settingsmodal'

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

const cases = [
  {
    story: 'default',
    check: async (page) => {
      await page.locator('h2:has-text("Settings")').first().waitFor({ state: 'visible', timeout: 5000 })
      const tabs = await page.locator('[role="tab"]').count()
      assert(tabs >= 4, `default: expected 4+ tabs, got ${tabs}`)
    },
  },
  {
    story: 'account-default',
    check: async (page) => {
      await page.locator('text=/Account|Email|Password/').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'account-password-dialog',
    check: async (page) => {
      await page.locator('text=/Change password/i').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'account-delete-dialog',
    check: async (page) => {
      await page.locator('text=/Delete account/i').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'project-default',
    check: async (page) => {
      const input = page.locator('input[type="text"]').first()
      await input.waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'admin-organization',
    check: async (page) => {
      await page.locator('text=/Organization name|organization/i').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'admin-devices',
    check: async (page) => {
      const tabActive = await page.locator('[role="tab"][aria-selected="true"]').first().innerText()
      assert(/admin/i.test(tabActive), `admin-devices: Admin tab should be active, got "${tabActive}"`)
    },
  },
  {
    story: 'admin-storage',
    check: async (page) => {
      await page.locator('text=/Storage|Total|Tier/i').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'edge-work-default',
    check: async (page) => {
      await page.locator('text=/Locked on Edge/i').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'edge-work-deflectometry',
    check: async (page) => {
      await page.locator('text=/Deflectometry/i').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'edge-export-with-packages',
    check: async (page) => {
      await page.locator('text=/Project File History/i').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'edge-import-uploading',
    check: async (page) => {
      await page.locator('text=/Cancelling…|Cancel/i').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'edge-import-completed',
    check: async (page) => {
      await page.locator('text=/Import Result/i').first().waitFor({ state: 'visible', timeout: 5000 })
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
  const page = await ctx.newPage()
  const consoleErrors = []
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text())
  })

  let failed = 0
  for (const { story, check } of cases) {
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
