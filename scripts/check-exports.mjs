/**
 * Verify that all package.json exports exist and contain expected named exports.
 * Run after `npm run build:package`.
 */
import { readFileSync, existsSync } from 'fs'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const exports = pkg.exports || {}

let failed = false

// 1. Check all export paths exist
for (const [key, path] of Object.entries(exports)) {
  if (!existsSync(path)) {
    console.error(`MISSING FILE: ${key} → ${path}`)
    failed = true
  }
}

// 2. Check critical named exports used by consuming projects
const criticalExports = {
  'lib/components.js': [
    'Alert', 'Button', 'TextField', 'PasswordField',
    'Badge', 'Spinner', 'ToastProvider', 'useToast',
  ],
  'lib/tokens.js': [
    'IngradientThemeProvider', 'IngradientGlobalStyle',
  ],
}

for (const [file, names] of Object.entries(criticalExports)) {
  if (!existsSync(file)) {
    console.error(`MISSING FILE: ${file}`)
    failed = true
    continue
  }
  const code = readFileSync(file, 'utf8')
  for (const name of names) {
    if (!code.includes(name)) {
      console.error(`MISSING EXPORT: ${name} not found in ${file}`)
      failed = true
    }
  }
}

if (failed) {
  process.exit(1)
}
console.log('All exports verified.')
