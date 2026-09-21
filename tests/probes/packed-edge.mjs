// Run against the standalone tarball-installed smoke consumer, never a source alias server.
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const base = process.env.SMOKE_URL
if (!base) throw new Error('SMOKE_URL must identify the tarball-installed consumer server')
const browser = await chromium.launch()
const errors = []
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(new URL('/edge-workspace', base).href)
  await page.getByRole('heading', { name: 'Packed Edge workspace' }).waitFor()
  assert.equal(await page.locator('html').getAttribute('data-ig-preset'), 'edge-0.0.1')
  await page.getByRole('tab', { name: 'Images', exact: true }).click()
  assert.equal(await page.getByRole('status').textContent(), 'Workspace tab: images')
  await page.getByText('Images slot from the consumer').waitFor()
  const opener = page.getByRole('button', { name: 'Open settings' })
  await opener.click()
  const dialog = page.getByRole('dialog', { name: 'Packed Edge settings' })
  await dialog.waitFor()
  await dialog.getByRole('tab', { name: 'Connection', exact: true }).click()
  await dialog.getByText('Connection slot from the consumer').waitFor()
  await page.keyboard.press('Escape')
  await dialog.waitFor({ state: 'detached' })
  assert.ok(await opener.evaluate(element => element === document.activeElement), 'Settings opener focus must restore')
  assert.deepEqual(errors, [])
  if (process.env.OUTPUT_DIR) {
    await mkdir(process.env.OUTPUT_DIR, { recursive: true })
    await page.screenshot({ path: path.join(process.env.OUTPUT_DIR, 'packed-workspace.png') })
    await writeFile(path.join(process.env.OUTPUT_DIR, 'packed-workspace.json'), JSON.stringify({ base, checks: ['public preset', 'controlled tab callback', 'settings slot', 'Escape', 'opener restoration'], errors }, null, 2))
  }
  console.log('Packed Edge workspace runtime contract passed')
} finally {
  await browser.close()
}
