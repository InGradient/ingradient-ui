#!/usr/bin/env node
// Probe: Pages/Platform/0.0.1/SettingsModal — 8 core scenarios.
// Usage: node tests/probes/settings-modal.mjs

import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = process.env.PORT ?? '6194'
const BASE = `http://localhost:${PORT}`
const ID_PREFIX = 'pages-platform-0-0-1-settingsmodal'
const DEFAULT_VIEWPORT = { width: 1280, height: 800 }

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
    story: 'account-default',
    name: 'account-default-mobile-responsive',
    viewport: { width: 375, height: 812 },
    check: async (page) => {
      const tabList = page.getByRole('tablist').first()
      await tabList.waitFor({ state: 'visible', timeout: 10000 })
      const tabListBox = await tabList.boundingBox()
      assert(tabListBox && tabListBox.width >= 275, `account-default-mobile-responsive: expected full-width tabs, got ${tabListBox?.width ?? 0}px`)
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
    story: 'admin-invitations-search',
    check: async (page) => {
      const search = page.getByPlaceholder('Search users by name or email')
      await search.waitFor({ state: 'visible', timeout: 10000 })
      assert(await search.inputValue() === 'sangha', 'admin-invitations-search: expected seeded search query')
    },
  },
  {
    story: 'admin-members',
    name: 'admin-members-visible',
    check: async (page) => {
      const membersTable = page.getByRole('region', { name: 'Members table' })
      await membersTable.waitFor({ state: 'attached', timeout: 10000 })
      const sectionHeight = await membersTable.evaluate((element) => element.closest('section')?.getBoundingClientRect().height ?? 0)
      assert(sectionHeight >= 200, `admin-members-visible: expected expanded Members section, got ${sectionHeight}px`)
    },
  },
  {
    story: 'admin-members',
    name: 'admin-members-mobile-scrollable',
    viewport: { width: 375, height: 812 },
    check: async (page) => {
      const membersTable = page.getByRole('region', { name: 'Members table' })
      await membersTable.waitFor({ state: 'attached', timeout: 10000 })
      const metrics = await membersTable.evaluate((element) => {
        const table = element.querySelector('table')
        return { clientWidth: element.clientWidth, scrollWidth: element.scrollWidth, tableWidth: table?.getBoundingClientRect().width ?? 0 }
      })
      assert(metrics.tableWidth >= 600 && metrics.scrollWidth > metrics.clientWidth, `admin-members-mobile-scrollable: expected readable scrollable table, got ${JSON.stringify(metrics)}`)
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
    story: 'admin-storage',
    name: 'admin-storage-mobile-responsive',
    viewport: { width: 375, height: 812 },
    check: async (page) => {
      const label = page.getByText('Total Images', { exact: true })
      await label.waitFor({ state: 'visible', timeout: 10000 })
      const cardWidth = await label.evaluate((element) => element.parentElement?.getBoundingClientRect().width ?? 0)
      assert(cardWidth >= 120, `admin-storage-mobile-responsive: expected readable metric card, got ${cardWidth}px`)
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

  let failed = 0
  for (const { story, name = story, viewport = DEFAULT_VIEWPORT, check } of cases) {
    const page = await ctx.newPage()
    const consoleErrors = []
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text())
    })
    consoleErrors.length = 0
    await page.setViewportSize(viewport)
    const url = `${BASE}/iframe.html?viewMode=story&id=${ID_PREFIX}--${story}`
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
      await page.waitForTimeout(500)
      await check(page)
      const errs = consoleErrors.filter(
        (e) => !/Failed to load resource/i.test(e) && !/X-Frame-Options/i.test(e),
      )
      if (errs.length > 0) throw new Error(`console errors:\n${errs.join('\n')}`)
      console.log(`[OK]   ${name}`)
    } catch (err) {
      failed++
      const msg = err.message.split('\n')[0]
      console.error(`[FAIL] ${name} — ${msg}`)
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
