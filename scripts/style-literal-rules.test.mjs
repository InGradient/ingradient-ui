import { test } from 'node:test'
import assert from 'node:assert/strict'
import { declaredCustomProperties, inlineStyleRawLines, rawColorLines, tokenReferences } from './style-literal-rules.mjs'

test('tokens do not whitelist raw colors on the same line', () => {
  for (const prefix of ['var(--ig-border-2px)', 'theme.border', 'tokens.border']) {
    assert.deepEqual(rawColorLines(`border: ${prefix} solid rgba(255, 255, 255, .5);`), [1])
    assert.deepEqual(rawColorLines(`border: ${prefix} solid #fff;`), [1])
  }
})
test('pure token references are allowed', () => {
  assert.deepEqual(rawColorLines('border: var(--ig-border-2px) solid var(--ig-color-border-strong);'), [])
})
test('entities do not whitelist adjacent literal colors', () => {
  assert.deepEqual(rawColorLines('const icon = "&#9650; &#x25B2;"'), [])
  assert.deepEqual(rawColorLines('const icon = "&#9650;"; const color = "#fff"'), [1])
})
test('ignores comments and preserves CRLF source lines', () => {
  assert.deepEqual(rawColorLines('// #fff\r\n/* rgba(0,0,0,1)\r\n #aaa */\r\ncolor: #123456; // #fff'), [4])
})
test('quoted URLs and their following colors remain inspectable', () => {
  assert.deepEqual(rawColorLines('const url="https://example.test"; const color="#fff"'), [1])
})
test('detects alpha hex and modern function notation', () => {
  assert.deepEqual(rawColorLines('color:#ffff;\ncolor:#11223344;\ncolor:rgb(0 0 0 / 50%);\ncolor:hsl(0 0% 0%);'), [1, 2, 3, 4])
})
test('lists token references and skips names assembled at runtime', () => {
  assert.deepEqual(tokenReferences('gap: var(--ig-spacing-8);\ncolor: var( --ig-color-a, var(--ig-color-b));'), [
    { line: 1, name: '--ig-spacing-8' }, { line: 2, name: '--ig-color-a' }, { line: 2, name: '--ig-color-b' },
  ])
  assert.deepEqual(tokenReferences('gap: var(--ig-space-${n});\n// var(--ig-gone)'), [])
})
test('finds custom properties declared in CSS and in style objects', () => {
  assert.deepEqual(declaredCustomProperties("--ig-catalog-gap: 8px;\nstyle={{ '--ig-page-max-width': w }}"), ['--ig-catalog-gap', '--ig-page-max-width'])
  assert.deepEqual(declaredCustomProperties('gap: var(--ig-spacing-8);'), [])
})
test('flags raw lengths in inline styles', () => {
  assert.deepEqual(inlineStyleRawLines("<a style={{ maxWidth: 360 }} />\n<b style={{ borderRight: '1px solid var(--ig-color-border-subtle)' }} />"), [1, 2])
  assert.deepEqual(inlineStyleRawLines("<a style={{\n  display: 'flex',\n  padding: '4px 8px',\n}} />"), [3])
})
test('leaves tokens, unitless values and runtime values alone in inline styles', () => {
  assert.deepEqual(inlineStyleRawLines("<a style={{ flex: 1, flexShrink: 0, opacity: 0.5, zIndex: 2, width: 0, height: '100%' }} />"), [])
  assert.deepEqual(inlineStyleRawLines("<a style={{ gap: 'var(--ig-spacing-8)', border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)' }} />"), [])
  assert.deepEqual(inlineStyleRawLines("<a style={{ width: size, left: `${x}px`, height: 'calc(100vh - 2px)', minHeight: '100vh' }} />"), [])
})
test('only inspects style objects', () => {
  assert.deepEqual(inlineStyleRawLines('const size = { width: 360 }\n<svg width={16} />'), [])
})
