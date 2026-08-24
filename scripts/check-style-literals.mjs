import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

/**
 * Scan production source for raw color literals that bypass the token system.
 *
 * Phase 1 guardrail (layer-chain-audit F-05/F-12):
 * - Scans src/components, src/patterns, and packages/{platform,edge}-pages/src.
 * - Excludes story/test/fixture files (those are documentation, not production).
 * - Skips lines with token references (var(--...), theme., tokens.).
 * - Skips HTML entities like &#9650; that were false-positived as hex colors.
 * - Skips color-editor spectrum values (domain data, not design tokens).
 */
const scanRoots = ['src/components', 'src/patterns', 'packages/platform-pages/src', 'packages/edge-pages/src']
const allowPatterns = [
  /var\(--/u,
  /theme\./u,
  /tokens\./u,
]
const skipFilePatterns = [
  /\.stories\.(ts|tsx)$/u,
  /\.test\.(ts|tsx)$/u,
  /\/__fixtures__\//u,
  /\/__mocks__\//u,
]
const colorEditorAllowPatterns = [
  /color-editor/iu,
  /color-swatch/iu,
  /color-input/iu,
  /color-chip/iu,
  /hsl/iu,
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
    // Skip stories/tests/fixtures
    if (skipFilePatterns.some((pattern) => pattern.test(entry.name) || pattern.test(fullPath))) continue

    const content = fs.readFileSync(fullPath, 'utf8')
    const lines = content.split('\n')
    const isColorFile = colorEditorAllowPatterns.some((pattern) => pattern.test(fullPath))

    for (const [index, line] of lines.entries()) {
      // Strip inline comments before checking (hex values in comments are not violations)
      const codeOnly = line.replace(/\/\/.*$/u, '')
      if (allowPatterns.some((pattern) => pattern.test(codeOnly))) continue
      // Skip HTML entities like &#9650; that match hex color regex
      if (/&#x?[0-9a-fA-F]+;/u.test(codeOnly)) continue
      // Skip color-editor files (HSL spectrum, user-selected colors are domain data)
      if (isColorFile) continue
      if (/#([0-9a-fA-F]{3,8})\b/u.test(codeOnly) || /rgba?\(/u.test(codeOnly)) {
        violations.push(`${path.relative(rootDir, fullPath)}:${index + 1}: raw color literal`)
      }
    }
  }
}

for (const relativeDir of scanRoots) {
  const absDir = path.join(rootDir, relativeDir)
  if (fs.existsSync(absDir)) {
    walk(absDir)
  }
}

if (violations.length) {
  console.error('Found raw color literals outside token layers:')
  console.error(violations.join('\n'))
  process.exit(1)
}

console.log('No raw color literals found in components/patterns/pages.')