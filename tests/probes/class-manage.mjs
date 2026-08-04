#!/usr/bin/env node
/* global process, fetch, setTimeout, console */
// Probe: Pages/Platform/0.0.1/Class Management — 16 consolidated integration cases.
// Usage: node tests/probes/class-manage.mjs

import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = process.env.PORT ?? '6178'
const BASE = `http://localhost:${PORT}`
const DEFAULT_VIEWPORT = { width: 1280, height: 800 }

const STORY = {
  overview: 'pages-platform-0-0-1-class-management-workspace--overview',
  sidebarCollapsed: 'pages-platform-0-0-1-class-management-workspace--sidebar-collapsed',
  classListOverflow: 'pages-platform-0-0-1-class-management-workspace--class-list-overflow',
  noProject: 'pages-platform-0-0-1-class-management-system-states--no-project-selected',
  accessDenied: 'pages-platform-0-0-1-class-management-system-states--access-denied',
  loadError: 'pages-platform-0-0-1-class-management-system-states--load-error',
  classesLoading: 'pages-platform-0-0-1-class-management-system-states--classes-loading',
  noClasses: 'pages-platform-0-0-1-class-management-system-states--no-classes',
  noLinkedDatasets: 'pages-platform-0-0-1-class-management-system-states--no-linked-datasets',
  linkedDatasetsLoading: 'pages-platform-0-0-1-class-management-system-states--linked-datasets-loading',
  imagesLoading: 'pages-platform-0-0-1-class-management-system-states--images-loading',
  noImages: 'pages-platform-0-0-1-class-management-system-states--no-images',
  referenceError: 'pages-platform-0-0-1-class-management-reference-image--update-error',
  addClass: 'pages-platform-0-0-1-class-management-workflows--add-class',
  patternSequence: 'pages-platform-0-0-1-class-management-image-inspector--pattern-sequence',
  cocoMapping: 'pages-platform-0-0-1-class-management-model-mapping--coco-mapping-workflow',
}

const cases = [
  {
    id: STORY.overview,
    name: 'workspace-overview',
    check: async (page) => {
      await page.locator('[data-class-id]').first().waitFor({ state: 'visible', timeout: 10000 })
      const selected = await page.locator('[data-class-id][aria-current="true"]').count()
      const images = await page.locator('[data-grid-id]').count()
      assert(selected === 1, `workspace-overview: expected one selected class, got ${selected}`)
      assert(images === 9, `workspace-overview: expected 9 images, got ${images}`)
    },
  },
  {
    id: STORY.sidebarCollapsed,
    name: 'sidebar-collapsed',
    viewport: { width: 1024, height: 768 },
    check: async (page) => page.getByRole('button', { name: 'Expand class sidebar' }).waitFor({ state: 'visible' }),
  },
  {
    id: STORY.classListOverflow,
    name: 'class-list-overflow',
    check: async (page) => {
      await page.locator('[data-class-id]').first().waitFor({ state: 'visible' })
      const rows = await page.locator('[data-class-id]').count()
      assert(rows >= 30, `class-list-overflow: expected at least 30 rows, got ${rows}`)
      await page.locator(`[title^="A-very-long-class-name"]`).first().waitFor({ state: 'visible' })
    },
  },
  {
    id: STORY.noProject,
    name: 'no-project-narrow',
    viewport: { width: 375, height: 812 },
    check: async (page) => page.getByText('No project selected', { exact: true }).first().waitFor({ state: 'visible' }),
  },
  {
    id: STORY.accessDenied,
    name: 'access-denied',
    check: async (page) => page.locator('text=/don.+t have permission/').first().waitFor({ state: 'visible' }),
  },
  {
    id: STORY.loadError,
    name: 'load-error',
    check: async (page) => page.getByText('Failed to load classes. Try again.', { exact: true }).waitFor({ state: 'visible' }),
  },
  {
    id: STORY.classesLoading,
    name: 'classes-loading',
    check: async (page) => page.getByText('Loading…', { exact: true }).first().waitFor({ state: 'visible' }),
  },
  {
    id: STORY.noClasses,
    name: 'no-classes',
    check: async (page) => page.getByText('No classes yet.', { exact: true }).waitFor({ state: 'visible' }),
  },
  {
    id: STORY.noLinkedDatasets,
    name: 'no-linked-datasets',
    check: async (page) => page.getByText('No images with this class in the selected datasets.', { exact: true }).waitFor({ state: 'visible' }),
  },
  {
    id: STORY.linkedDatasetsLoading,
    name: 'linked-datasets-loading',
    check: async (page) => page.getByText('Loading…', { exact: true }).first().waitFor({ state: 'visible' }),
  },
  {
    id: STORY.imagesLoading,
    name: 'images-loading',
    check: async (page) => page.getByText('Loading images…', { exact: true }).waitFor({ state: 'visible' }),
  },
  {
    id: STORY.noImages,
    name: 'no-images',
    check: async (page) => page.getByText('No images with this class in the selected datasets.', { exact: true }).waitFor({ state: 'visible' }),
  },
  {
    id: STORY.referenceError,
    name: 'reference-update-error',
    check: async (page) => page.getByText('Failed to update reference image. Try again.', { exact: true }).waitFor({ state: 'visible' }),
  },
  {
    id: STORY.addClass,
    name: 'add-class-workflow',
    check: async (page) => page.getByRole('button', { name: /^Story defect/ }).waitFor({ state: 'visible', timeout: 10000 }),
  },
  {
    id: STORY.patternSequence,
    name: 'pattern-sequence',
    waitUntil: 'domcontentloaded',
    check: async (page) => page.getByRole('dialog', { name: 'seq-x-0.jpg' }).waitFor({ state: 'visible', timeout: 10000 }),
  },
  {
    id: STORY.cocoMapping,
    name: 'coco-mapping-workflow',
    check: async (page) => page.getByRole('button', { name: 'person' }).waitFor({ state: 'visible', timeout: 10000 }),
  },
]

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

async function startServer() {
  const proc = spawn('python3', ['-m', 'http.server', PORT], {
    cwd: 'storybook-static',
    stdio: 'ignore',
  })
  for (let i = 0; i < 50; i++) {
    try {
      const response = await fetch(BASE)
      if (response.ok) return proc
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
  const context = await browser.newContext({ viewport: DEFAULT_VIEWPORT })
  const page = await context.newPage()
  const consoleErrors = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })

  let failed = 0
  for (const { id, name, check, viewport = DEFAULT_VIEWPORT, waitUntil = 'domcontentloaded' } of cases) {
    consoleErrors.length = 0
    await page.setViewportSize(viewport)
    const url = `${BASE}/iframe.html?viewMode=story&id=${id}`
    try {
      await page.goto(url, { waitUntil, timeout: 20000 })
      await check(page)
      const errors = consoleErrors.filter(
        (error) => !/Failed to load resource/i.test(error) && !/X-Frame-Options/i.test(error),
      )
      if (errors.length > 0) throw new Error(`console errors:\n${errors.join('\n')}`)
      console.log(`[OK]   ${name}`)
    } catch (error) {
      failed++
      console.error(`[FAIL] ${name} — ${error.message}`)
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

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
