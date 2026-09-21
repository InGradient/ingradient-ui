#!/usr/bin/env node
// Read-only route/preset gate + honest a11y audit. No API actions or baseline updates.
// STORYBOOK_URL=http://localhost:6016 node tests/probes/edge.mjs [--a11y-gate]
// OUTPUT_DIR optionally writes JSON and 1440x1000 review captures (never snapshots).
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'
import { edgeRoutes } from './edge-routes.mjs'
import { auditAccessibility, auditExitCode, checkDocument } from './edge-contract.mjs'

const base = process.env.STORYBOOK_URL ?? 'http://localhost:6016'
const output = process.env.OUTPUT_DIR
const a11yGate = process.argv.includes('--a11y-gate')
const settings = edgeRoutes.find(({ id }) => id.endsWith('workspace--settings'))
const sandbox = { id: 'sandboxes-theme-lab--overview', readyText: 'Theme Lab', preset: null, density: null }
const cases = [
  ...edgeRoutes.map((route) => ({ ...route, portal: route.id.endsWith('workspace--settings') })),
  ...['comfortable', 'compact', 'ultra-dense'].map((density) => ({ ...settings, density, globals: `density:${density}`, portal: true })),
  { id: 'pages-platform-0-0-1-auth-login-workspace--overview', readyText: 'Sign in', preset: 'platform-0.0.1' },
  { id: 'pages-medical-0-0-1-auth--login', readyText: 'medilabel', preset: 'medical-0.0.1', density: 'comfortable' },
  sandbox,
  ...['comfortable', 'compact', 'ultra-dense'].map((density) => ({ ...sandbox, density, globals: `density:${density}` })),
]

async function main() {
  const response = await fetch(`${base}/index.json`)
  assert.ok(response.ok, `Storybook index HTTP ${response.status}`)
  const { entries } = await response.json()
  const actual = Object.values(entries).filter(({ id, type }) => type === 'story' && id.startsWith('pages-edge-0-0-5-')).map(({ id }) => id).sort()
  assert.equal(edgeRoutes.length, 19, 'Phase-1 route inventory must remain 19')
  // Later named workflows are outside this frozen population; disclose rather than silently count them.
  const additionalRoutesNotAudited = actual.filter((id) => !edgeRoutes.some((route) => route.id === id))
  for (const { id } of cases) assert.equal(entries[id]?.type, 'story', `Missing route ${id}`)
  if (output) await mkdir(output, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const results = []
  try {
    for (const scenario of cases) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
      const runtimeErrors = []
      const consoleErrors = []
      page.on('pageerror', (error) => runtimeErrors.push(error.message))
      page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
      const url = `${base}/iframe.html?viewMode=story&id=${scenario.id}${scenario.globals ? `&globals=${scenario.globals}` : ''}`
      const result = { id: scenario.id, globals: scenario.globals ?? 'inherit', url, runtimeErrors, consoleErrors }
      try {
        const navigation = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
        assert.ok(navigation?.ok(), `${scenario.id}: navigation failed`)
        await page.mouse.move(0, 0)
        result.scope = await checkDocument(page, scenario)
        await page.evaluate(() => document.fonts.ready)
        assert.deepEqual(runtimeErrors, [], 'Uncaught runtime error')
        result.contract = 'passed'
        if (output) {
          const file = `${scenario.id}${scenario.density && scenario.globals ? `-${scenario.density}` : ''}.png`
          await page.screenshot({ path: path.join(output, file), animations: 'disabled' })
          result.capture = file
        }
        try {
          result.a11y = await auditAccessibility(page)
        } catch (error) {
          result.a11y = { status: 'runner-error', error: error.message }
        }
      } catch (error) {
        result.contract = 'failed'
        result.error = error.message
        result.a11y = { status: 'not-run' }
      } finally {
        results.push(result)
        console.log(`${result.contract}: ${scenario.id} (${result.globals}); a11y=${result.a11y.status}`)
        await page.close()
      }
    }
  } finally {
    await browser.close()
  }
  const summary = {
    mode: a11yGate ? 'a11y-gate' : 'a11y-audit (violations reported, not a green accessibility gate)',
    inventory: edgeRoutes.length, totalPublishedEdgeRoutes: actual.length, additionalRoutesNotAudited, scenarios: results.length,
    contractFailures: results.filter(({ contract }) => contract !== 'passed').length,
    a11yRunnerErrors: results.filter(({ a11y }) => a11y.status === 'runner-error').length,
    a11yViolationScans: results.filter(({ a11y }) => a11y.status === 'violations').length,
  }
  const report = { timestamp: new Date().toISOString(), base, viewport: { width: 1440, height: 1000 }, summary, results }
  if (output) await writeFile(path.join(output, 'route-audit.json'), JSON.stringify(report, null, 2))
  else console.log(JSON.stringify(report, null, 2))
  console.log(JSON.stringify(summary))
  // Bad readiness/presets and runner errors always fail, even in audit mode.
  process.exitCode = auditExitCode(summary, a11yGate)
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
