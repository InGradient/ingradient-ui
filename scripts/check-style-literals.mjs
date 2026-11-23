import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { declaredCustomProperties, inlineStyleRawLines, rawColorLines, tokenReferences } from './style-literal-rules.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

/**
 * Scan production source for values that bypass the token system.
 *
 * Phase 1 guardrail (layer-chain-audit F-05/F-12):
 * - Raw colors: scans src/components, src/patterns, and packages/{platform,edge}-pages/src.
 * - Excludes story/test/fixture files (those are documentation, not production).
 * - Checks mixed token/literal lines; a token reference never exempts its neighbors.
 * - Skips HTML entities like &#9650; that were false-positived as hex colors.
 * - Skips files whose colors are domain data, not design tokens:
 *   color editor spectrum, and measured grayscale ramps (fringe profile).
 *
 * Token references: every `var(--ig-…)` must name a token in lib/tokens.css or a custom
 * property the scanned source declares itself. Needs `npm run build:package` first.
 *
 * Inline styles: raw lengths in `style={{ … }}`, which stylelint cannot see.
 */
const colorRoots = ['src/components', 'src/patterns', 'packages/platform-pages/src', 'packages/edge-pages/src']
const tokenRoots = ['src/primitives', 'src/hooks', ...colorRoots]
const skipFilePatterns = [
  /\.stories\.(ts|tsx)$/u,
  /\.test\.(ts|tsx)$/u,
  /\/__fixtures__\//u,
  /\/__mocks__\//u,
]
const domainColorFilePatterns = [
  /color-editor/iu,
  /color-swatch/iu,
  /color-input/iu,
  /color-chip/iu,
  /hsl/iu,
  // 촬영된 프린지 프로파일의 0~255 휘도를 그대로 그라디언트로 그린다.
  // 테마 색이 아니라 측정값이라 토큰으로 바꿀 수 없다.
  /FringeProfileChart/iu,
]
const tokensCssPath = path.join(rootDir, 'lib/tokens.css')

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath, files)
      continue
    }
    if (!/\.(ts|tsx)$/.test(entry.name)) continue
    // Skip stories/tests/fixtures
    if (skipFilePatterns.some((pattern) => pattern.test(entry.name) || pattern.test(fullPath))) continue
    files.push(fullPath)
  }
  return files
}

function sources(roots) {
  return roots
    .map((relativeDir) => path.join(rootDir, relativeDir))
    .filter((absDir) => fs.existsSync(absDir))
    .flatMap((absDir) => walk(absDir))
    .map((fullPath) => ({ file: path.relative(rootDir, fullPath), content: fs.readFileSync(fullPath, 'utf8') }))
}

const violations = []

for (const { file, content } of sources(colorRoots)) {
  if (domainColorFilePatterns.some((pattern) => pattern.test(file))) continue
  for (const line of rawColorLines(content)) violations.push(`${file}:${line}: raw color literal`)
}

if (!fs.existsSync(tokensCssPath)) {
  console.error('lib/tokens.css is missing. Run `npm run build:package` before this check.')
  process.exit(1)
}
const tokenSources = sources(tokenRoots)
const knownProperties = new Set([
  ...fs.readFileSync(tokensCssPath, 'utf8').matchAll(/(--ig-[a-z0-9-]+)\s*:/gu),
].map(([, name]) => name))
for (const { content } of tokenSources) {
  for (const name of declaredCustomProperties(content)) knownProperties.add(name)
}
for (const { file, content } of tokenSources) {
  for (const { line, name } of tokenReferences(content)) {
    if (!knownProperties.has(name)) violations.push(`${file}:${line}: unknown token ${name} (rebuild with \`npm run build:package\` if it is new)`)
  }
}

for (const { file, content } of tokenSources) {
  for (const line of inlineStyleRawLines(content)) violations.push(`${file}:${line}: raw length in inline style`)
}

if (violations.length) {
  console.error('Found values that bypass the token system:')
  console.error(violations.join('\n'))
  process.exit(1)
}

console.log('No raw color literals, unknown tokens, or raw inline style lengths found.')
