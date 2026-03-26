/**
 * Check that built bundle sizes stay under thresholds.
 * Run after `npm run build:package`.
 */
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

const LIB_DIR = 'lib'
const MAX_TOTAL_KB = 500 // Total JS output threshold

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
