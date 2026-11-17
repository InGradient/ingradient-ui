// Current-state captures of screens that did not exist at the base commit (no AS-IS to compare).
// Env: NEXT, OUT. Same viewport and settle steps as compare.mjs.
import { chromium } from 'playwright'
import fs from 'node:fs'
const { NEXT, OUT } = process.env
fs.mkdirSync(OUT, { recursive: true })
const shots = [
  ['pages-edge-0-0-6-settings-tabs--plc', 'plc-tab'],
  ['pages-edge-0-0-6-settings-system-states--plc-auto-running', 'plc-auto-running'],
  ['pages-edge-0-0-6-settings-tabs--judge', 'judge-tab'],
  ['pages-edge-0-0-6-settings-system-states--judge-failed', 'judge-failed'],
  ['pages-edge-0-0-6-capture-system-states--optimize-confirm', 'optimize-confirm'],
  ['pages-edge-0-0-6-capture-system-states--optimize-running', 'optimize-running'],
  ['pages-edge-0-0-6-capture-system-states--optimize-result', 'optimize-result'],
  ['pages-edge-0-0-6-capture-system-states--optimize-error', 'optimize-error'],
]
const b = await chromium.launch()
for (const [id, name] of shots) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  await p.goto(`${NEXT}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {})
  await p.evaluate(() => document.fonts.ready).catch(() => {})
  await p.addStyleTag({ content: '*{animation:none!important;transition:none!important;caret-color:transparent!important}' }).catch(() => {})
  await p.waitForTimeout(1500)
  await p.screenshot({ path: `${OUT}/${name}.png` })
  await p.close(); console.log(name)
}
// Language menu open and the Setup panel with a stripe pattern on screen (interaction states).
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
await p.goto(`${NEXT}/iframe.html?id=pages-edge-0-0-6-capture-workspace--overview&viewMode=story`, { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
await p.getByRole('button', { name: /^Language:/ }).click(); await p.waitForTimeout(800)
await p.screenshot({ path: `${OUT}/language-menu.png`, clip: { x: 900, y: 30, width: 540, height: 220 } })
await p.goto(`${NEXT}/iframe.html?id=pages-edge-0-0-6-capture-workspace--setup&viewMode=story`, { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
await p.getByRole('button', { name: 'X Phase 1/16' }).first().click(); await p.waitForTimeout(800)
await p.screenshot({ path: `${OUT}/setup-fringe-contrast.png` })
await b.close()
