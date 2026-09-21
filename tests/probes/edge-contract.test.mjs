import assert from 'node:assert/strict'
import test from 'node:test'
import { auditExitCode, checkDocument } from './edge-contract.mjs'
import { edgeRoutes } from './edge-routes.mjs'

const options = { id: 'pages-edge-0-0-5-workspace--settings', readyText: 'System Settings', portal: true }
function scope() {
  const heights = ['28px', '32px', '40px']
  return {
    attributes: { 'data-ig-preset': 'edge-0.0.1', 'data-ig-service': 'edge', 'data-ig-version': '0.0.1', 'data-ig-density': 'compact' },
    root: heights, body: heights, canvas: heights, control: heights, dialog: heights, portalControl: heights, bodyPortal: true,
  }
}
function page(value) {
  const locator = { first() { return this }, async waitFor() {}, async count() { return 0 } }
  return { async waitForFunction() {}, locator: () => locator, getByText: () => locator, getByRole: () => locator, evaluate: async () => value }
}

test('freezes 19 unique routes: Login 4, DatasetSelect 6, Workspace 9', () => {
  assert.equal(edgeRoutes.length, 19)
  assert.equal(new Set(edgeRoutes.map(({ id }) => id)).size, 19)
  for (const [group, count] of [['login', 4], ['datasetselect', 6], ['workspace', 9]]) {
    assert.equal(edgeRoutes.filter(({ id }) => id.includes(`${group}--`)).length, count)
  }
})

test('accepts matching document, control, and body portal tokens', async () => {
  assert.deepEqual(await checkDocument(page(scope()), options), scope())
})

test('readiness timeout cannot be reported as a passing contract', async () => {
  const stub = page(scope())
  stub.waitForFunction = async () => { throw new Error('render identity/readiness timeout') }
  await assert.rejects(checkDocument(stub, options), /readiness timeout/)
})

for (const target of ['root', 'body', 'canvas', 'control', 'dialog', 'portalControl']) {
  test(`rejects wrong ${target} control tokens`, async () => {
    await assert.rejects(checkDocument(page({ ...scope(), [target]: ['32px', '36px', '44px'] }), options))
  })
}

test('rejects absent or wrong preset instead of accepting otherwise rendered UI', async () => {
  for (const preset of [undefined, 'platform-0.0.1']) {
    const value = scope()
    value.attributes['data-ig-preset'] = preset
    await assert.rejects(checkDocument(page(value), options), /preset/)
  }
})

test('requires the Settings dialog to actually be a body portal', async () => {
  await assert.rejects(checkDocument(page({ ...scope(), bodyPortal: false }), options), /body portal/)
})

test('audit and gate distinguish known violations from contract/runner errors', () => {
  const summary = { contractFailures: 0, a11yRunnerErrors: 0, a11yViolationScans: 12 }
  assert.equal(auditExitCode(summary), 0)
  assert.equal(auditExitCode(summary, true), 2)
  for (const key of ['contractFailures', 'a11yRunnerErrors']) {
    assert.equal(auditExitCode({ ...summary, [key]: 1 }), 1)
    assert.equal(auditExitCode({ ...summary, [key]: 1 }, true), 1)
  }
})
