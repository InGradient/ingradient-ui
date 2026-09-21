import { test } from 'node:test'
import assert from 'node:assert/strict'
import { rawColorLines } from './style-literal-rules.mjs'

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
