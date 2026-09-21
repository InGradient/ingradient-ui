import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

export const controlHeights = {
  compact: ['28px', '32px', '40px'],
  comfortable: ['32px', '36px', '44px'],
  'ultra-dense': ['24px', '28px', '32px'],
}

export async function checkDocument(page, { id, readyText, preset = 'edge-0.0.1', density = 'compact', portal = false }) {
  await page.waitForFunction((storyId) => {
    const render = window.__STORYBOOK_PREVIEW__?.currentRender
    return render?.id === storyId && render.notYetRendered === false && render.phase !== 'errored'
  }, id, { timeout: 30000 })
  await page.locator('#storybook-root > *').first().waitFor({ state: 'visible', timeout: 30000 })
  await page.getByText(readyText, { exact: true }).first().waitFor({ state: 'visible', timeout: 15000 })
  assert.equal(await page.locator('.sb-errordisplay:visible, .sb-nopreview:visible').count(), 0, `${id}: Storybook error`)
  if (portal) await page.getByRole('dialog').first().waitFor({ state: 'visible' })
  const scope = await page.evaluate(() => {
    const root = document.documentElement
    const canvas = document.querySelector('#storybook-root')
    const dialog = document.querySelector('[role="dialog"]')
    const read = (element) => element ? ['sm', 'md', 'lg'].map((size) =>
      getComputedStyle(element).getPropertyValue(`--ig-control-height-${size}`).trim()) : null
    return {
      attributes: Object.fromEntries([...root.attributes].filter(({ name }) => name.startsWith('data-')).map(({ name, value }) => [name, value])),
      root: read(root), body: read(document.body), canvas: read(canvas), dialog: read(dialog),
      control: read(canvas.querySelector('button, input, select')),
      portalControl: read(dialog?.querySelector('button, input, select')),
      bodyPortal: !!dialog && document.body.contains(dialog) && !canvas.contains(dialog),
    }
  })
  assert.equal(scope.attributes['data-ig-preset'] ?? null, preset, `${id}: preset`)
  assert.equal(scope.attributes['data-ig-density'] ?? null, density, `${id}: density`)
  if (preset) {
    assert.equal(scope.attributes['data-ig-service'], preset.split('-')[0], `${id}: service`)
    assert.equal(scope.attributes['data-ig-version'], '0.0.1', `${id}: design version, not composition version`)
  }
  const expected = controlHeights[density ?? 'comfortable']
  for (const target of ['root', 'body', 'canvas', 'control']) assert.deepEqual(scope[target], expected, `${id}: ${target} tokens`)
  if (portal) {
    assert.ok(scope.bodyPortal, `${id}: expected a body portal outside the story root`)
    assert.deepEqual(scope.dialog, expected, `${id}: portal tokens`)
    assert.deepEqual(scope.portalControl, expected, `${id}: portal control tokens`)
  }
  return scope
}

export function auditExitCode(summary, a11yGate = false) {
  if (summary.contractFailures || summary.a11yRunnerErrors) return 1
  return a11yGate && summary.a11yViolationScans ? 2 : 0
}

export async function auditAccessibility(page) {
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') })
  const retries = []
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await page.evaluate(async () => {
        const { violations, incomplete, passes, testEngine } = await window.axe.run(document)
        return { violations, incomplete, passes: passes.map(({ id }) => id), testEngine }
      })
      return { status: result.violations.length ? 'violations' : 'no-violations', ...result, retries }
    } catch (error) {
      // A collision is a runner error, never an accessibility pass. Preserve each retry.
      if (!/already running/.test(error.message) || attempt === 2) throw error
      retries.push(error.message)
      await page.waitForTimeout(1000)
    }
  }
}
