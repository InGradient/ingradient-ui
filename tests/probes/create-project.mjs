#!/usr/bin/env node
// Probe: Pages/Platform/0.0.1/Create Project — 5 grouped stories.
// Usage: node tests/probes/create-project.mjs
// Requires: storybook-static built, http server reachable.

import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = process.env.PORT ?? '6177'
const BASE = `http://localhost:${PORT}`
const STORY_IDS = {
  overview: 'pages-platform-0-0-1-create-project-workspace--overview',
  submitting: 'pages-platform-0-0-1-create-project-system-states--submitting',
  serverError: 'pages-platform-0-0-1-create-project-system-states--server-error',
  projectCreation: 'pages-platform-0-0-1-create-project-workflows--project-creation',
  cancel: 'pages-platform-0-0-1-create-project-workflows--cancel',
}

const cases = [
  {
    story: 'overview',
    id: STORY_IDS.overview,
    check: async (page) => {
      await expectVisible(page, 'label[for="project-name"]', 'Project name label')
      await expectVisible(page, 'button:has-text("Create Project")', 'Create Project button')
      await expectVisible(page, 'button:has-text("General Project")', 'General option')
      await expectVisible(page, 'button:has-text("Deflectometry Project")', 'Deflectometry option')
      const value = await page.locator('#project-name').inputValue()
      assert(value === '', `default: name should be empty, got "${value}"`)
    },
  },
  {
    story: 'project-creation-workflow',
    id: STORY_IDS.projectCreation,
    check: async (page) => {
      await page.waitForFunction(() => {
        const input = document.querySelector('#project-name')
        return input instanceof HTMLInputElement && input.value === 'Inspection line C'
      })
      const value = await page.locator('#project-name').inputValue()
      assert(
        value === 'Inspection line C',
        `project creation: expected corrected name, got "${value}"`,
      )
      await expectVisible(page, 'li:has-text("inspection-001.jpg")', 'uploaded image')
    },
  },
  {
    story: 'cancel-workflow',
    id: STORY_IDS.cancel,
    check: async (page) => {
      const value = await page.locator('#project-name').inputValue()
      assert(value === 'Wafer line A Q2 2026', `cancel: expected prepared form, got "${value}"`)
    },
  },
  {
    story: 'submitting',
    id: STORY_IDS.submitting,
    check: async (page) => {
      const btn = page.locator('button:has-text("Creating")')
      await btn.waitFor({ state: 'visible', timeout: 5000 })
      const disabled = await btn.isDisabled()
      assert(disabled, 'submitting: submit button must be disabled')
    },
  },
  {
    story: 'server-error',
    id: STORY_IDS.serverError,
    check: async (page) => {
      const danger = page.locator('div').filter({ hasText: /Failed to create project/i }).first()
      await danger.waitFor({ state: 'visible', timeout: 5000 })
    },
  },
]

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

async function expectVisible(page, selector, label) {
  await page.locator(selector).first().waitFor({ state: 'visible', timeout: 5000 })
  void label
}

async function startServer() {
  const proc = spawn('python3', ['-m', 'http.server', PORT], {
    cwd: 'storybook-static',
    stdio: 'ignore',
  })
  // wait until reachable
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
  for (const { story, id, check } of cases) {
    consoleErrors.length = 0
    const url = `${BASE}/iframe.html?viewMode=story&id=${id}`
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 })
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
