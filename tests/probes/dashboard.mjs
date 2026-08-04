#!/usr/bin/env node
// Probe: Pages/Platform/0.0.1/Dashboard — 16 grouped stories.

import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = process.env.PORT ?? '6204'
const BASE = `http://localhost:${PORT}`
const STORY_IDS = {
  overview: 'pages-platform-0-0-1-dashboard-workspace--overview',
  noProject: 'pages-platform-0-0-1-dashboard-system-states--no-project-selected',
  loading: 'pages-platform-0-0-1-dashboard-system-states--loading',
  loadError: 'pages-platform-0-0-1-dashboard-system-states--load-error',
  noData: 'pages-platform-0-0-1-dashboard-system-states--no-analysis-data',
  missingProjectName: 'pages-platform-0-0-1-dashboard-system-states--missing-project-name',
  customize: 'pages-platform-0-0-1-dashboard-interactions--customize-widgets-workflow',
  dateRange: 'pages-platform-0-0-1-dashboard-interactions--date-range-workflow',
  export: 'pages-platform-0-0-1-dashboard-interactions--export-workflow',
  layoutReset: 'pages-platform-0-0-1-dashboard-interactions--layout-reset-workflow',
  threePerRow: 'pages-platform-0-0-1-dashboard-layouts--three-per-row',
  onePerRow: 'pages-platform-0-0-1-dashboard-layouts--one-per-row',
  compactMasonry: 'pages-platform-0-0-1-dashboard-layout-studies--compact-masonry',
  sectionedGrid: 'pages-platform-0-0-1-dashboard-layout-studies--sectioned-grid',
  edgeAnalytics: 'pages-platform-0-0-1-dashboard-integrations--edge-analytics',
  deflectometry: 'pages-platform-0-0-1-dashboard-integrations--deflectometry',
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

const cases = [
  {
    story: 'overview',
    id: STORY_IDS.overview,
    check: async (page) => {
      await page.locator('[data-widget-key]').first().waitFor({ state: 'visible', timeout: 10000 })
      const widgets = await page.locator('[data-widget-key]').count()
      assert(widgets >= 6, `default: expected 6+ widgets, got ${widgets}`)
    },
  },
  {
    story: 'no-project-selected',
    id: STORY_IDS.noProject,
    check: async (page) => {
      await page.locator('text=/Select a project to load dashboard stats/i').first().waitFor({ state: 'visible', timeout: 10000 })
      const widgets = await page.locator('[data-widget-key]').count()
      assert(widgets === 0, `no-project: expected 0 widgets, got ${widgets}`)
    },
  },
  {
    story: 'loading',
    id: STORY_IDS.loading,
    check: async (page) => {
      await page.getByRole('status', { name: 'Loading' }).waitFor({ state: 'visible', timeout: 10000 })
      const widgets = await page.locator('[data-widget-key]').count()
      assert(widgets === 0, `loading: expected 0 widgets, got ${widgets}`)
    },
  },
  {
    story: 'load-error',
    id: STORY_IDS.loadError,
    check: async (page) => {
      await page.locator('text=/Failed to load/i').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'no-analysis-data',
    id: STORY_IDS.noData,
    check: async (page) => {
      await page.getByText('No analysis data is available for this project.').waitFor({ state: 'visible', timeout: 10000 })
    },
  },
  {
    story: 'missing-project-name',
    id: STORY_IDS.missingProjectName,
    check: async (page) => {
      await page.getByRole('heading', { name: 'Dashboard' }).waitFor({ state: 'visible', timeout: 10000 })
      const projectName = await page.getByText('Wafer-2026', { exact: true }).count()
      assert(projectName === 0, 'missing-project-name: project name should be absent')
    },
  },
  {
    story: 'customize-widgets-workflow',
    id: STORY_IDS.customize,
    check: async (page) => {
      await page.waitForFunction(() => document.querySelectorAll('[data-widget-key]').length === 1)
      await page.getByRole('group', { name: 'Visible Sections' }).waitFor({ state: 'visible' })
    },
  },
  {
    story: 'date-range-workflow',
    id: STORY_IDS.dateRange,
    check: async (page) => {
      await page.getByRole('dialog', { name: 'Overview Date Range' }).waitFor({ state: 'visible', timeout: 10000 })
      await page.getByRole('button', { name: 'All time' }).waitFor({ state: 'visible' })
    },
  },
  {
    story: 'export-workflow',
    id: STORY_IDS.export,
    check: async (page) => {
      await page.getByText('PDF saved.').waitFor({ state: 'visible', timeout: 10000 })
    },
  },
  {
    story: 'layout-reset-workflow',
    id: STORY_IDS.layoutReset,
    check: async (page) => {
      await page.locator('[data-widget-key]').first().waitFor({ state: 'visible', timeout: 10000 })
      await page.waitForFunction(
        () => {
          const widgets = [...document.querySelectorAll('[data-widget-key]')]
          const rows = [...new Set(widgets.map((widget) => widget.parentElement).filter(Boolean))]
          return JSON.stringify(
            rows.map((row) => row.querySelectorAll(':scope > [data-widget-key]').length),
          ) === JSON.stringify([2, 3, 2, 1])
        },
        undefined,
        { timeout: 10000 },
      )
      const rows = await widgetRowSizes(page)
      assert(JSON.stringify(rows) === JSON.stringify([2, 3, 2, 1]), `layout reset: got ${rows}`)
    },
  },
  {
    story: 'three-per-row',
    id: STORY_IDS.threePerRow,
    check: async (page) => {
      const rows = await widgetRowSizes(page)
      assert(JSON.stringify(rows) === JSON.stringify([3, 3, 2]), `three-per-row: got ${rows}`)
    },
  },
  {
    story: 'one-per-row',
    id: STORY_IDS.onePerRow,
    check: async (page) => {
      const rows = await widgetRowSizes(page)
      assert(rows.length === 8 && rows.every((count) => count === 1), `one-per-row: got ${rows}`)
    },
  },
  {
    story: 'compact-masonry',
    id: STORY_IDS.compactMasonry,
    check: async (page) => {
      await page.getByText('Compact Masonry', { exact: true }).waitFor({ state: 'visible', timeout: 10000 })
      assert(await page.locator('[data-widget-key]').count() === 8, 'compact masonry: expected 8 widgets')
    },
  },
  {
    story: 'sectioned-grid',
    id: STORY_IDS.sectionedGrid,
    check: async (page) => {
      await page.getByRole('heading', { name: 'Summary' }).waitFor({ state: 'visible', timeout: 10000 })
      await page.getByRole('heading', { name: 'Breakdown' }).waitFor({ state: 'visible' })
    },
  },
  {
    story: 'edge-analytics',
    id: STORY_IDS.edgeAnalytics,
    check: async (page) => {
      await page.locator('text=/Edge session summary/i').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
  {
    story: 'deflectometry',
    id: STORY_IDS.deflectometry,
    check: async (page) => {
      await page.locator('text=/Deflectometry summary/i').first().waitFor({ state: 'visible', timeout: 5000 })
    },
  },
]

async function widgetRowSizes(page) {
  await page.locator('[data-widget-key]').first().waitFor({ state: 'visible', timeout: 10000 })
  return page.locator('[data-widget-key]').evaluateAll((nodes) => {
    const parents = [...new Set(nodes.map((node) => node.parentElement).filter(Boolean))]
    return parents.map((parent) => parent.querySelectorAll(':scope > [data-widget-key]').length)
  })
}

async function startServer() {
  const proc = spawn('python3', ['-m', 'http.server', PORT], {
    cwd: 'storybook-static',
    stdio: 'ignore',
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
  for (const { story, id, check } of cases) {
    const page = await ctx.newPage()
    const consoleErrors = []
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text())
    })
    consoleErrors.length = 0
    const url = `${BASE}/iframe.html?viewMode=story&id=${id}`
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
