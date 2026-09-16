/**
 * Check that built bundle sizes stay under thresholds.
 * Run after `npm run build:package`.
 */
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

const LIB_DIR = 'lib'
// Total JS output threshold.
// lib/ 의 ESM 출력을 압축 전 기준으로 잰다 (tsup 에 minify 없음) -- 소비 앱이 번들하며 줄인다.
// 2026-09-16: main 이 497.1 KB 로 여유가 2.9 KB (0.6%) 밖에 없어 기능 PR 마다 걸렸다.
// edge-pages 이관이 진행 중이라 550 으로 올린다.
const MAX_TOTAL_KB = 550

const jsFiles = readdirSync(LIB_DIR).filter((f) => f.endsWith('.js'))
let totalBytes = 0

console.log('\nBundle sizes:')
for (const file of jsFiles) {
  const size = statSync(join(LIB_DIR, file)).size
  totalBytes += size
  const kb = (size / 1024).toFixed(1)
  console.log(`  ${file.padEnd(30)} ${kb} KB`)
}

const totalKB = (totalBytes / 1024).toFixed(1)
console.log(`\n  Total: ${totalKB} KB (limit: ${MAX_TOTAL_KB} KB)`)

if (totalBytes / 1024 > MAX_TOTAL_KB) {
  console.error(`\n  FAIL: Bundle exceeds ${MAX_TOTAL_KB} KB threshold`)
  process.exit(1)
}

console.log('  OK\n')
