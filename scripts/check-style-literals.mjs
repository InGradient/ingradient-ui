import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const scanRoots = ['src/components', 'src/patterns']
const allowPatterns = [
  /var\(--/u,
  /theme\./u,
  /tokens\./u,
]
const violations = []

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath)
      continue
    }
    if (!/\.(ts|tsx)$/.test(entry.name)) continue
    const content = fs.readFileSync(fullPath, 'utf8')
    const lines = content.split('\n')
    for (const [index, line] of lines.entries()) {
      if (allowPatterns.some((pattern) => pattern.test(line))) continue
      if (/#([0-9a-fA-F]{3,8})\b/u.test(line) || /rgba?\(/u.test(line)) {
        violations.push(`${path.relative(rootDir, fullPath)}:${index + 1}: raw color literal`)
      }
    }
  }
}

for (const relativeDir of scanRoots) {
  walk(path.join(rootDir, relativeDir))
}

if (violations.length) {
  console.error('Found raw style literals outside token layers:')
  console.error(violations.join('\n'))
  process.exit(1)
}

console.log('No raw color literals found in components/patterns.')
