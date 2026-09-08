import { execFileSync } from 'node:child_process'
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const keep = process.argv.includes('--keep')
const temporary = mkdtempSync(path.join(tmpdir(), 'ingradient-packed-'))
const consumer = path.join(temporary, 'consumer')
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
function run(args, cwd) {
  return execFileSync(npm, args, { cwd, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })
}

try {
  mkdirSync(consumer)
  const tarballs = {}
  for (const directory of ['.', 'packages/platform-pages', 'packages/edge-pages']) {
    const [{ name, filename }] = JSON.parse(run(['pack', '--json', '--ignore-scripts', '--pack-destination', temporary], path.join(root, directory)))
    tarballs[name] = `file:${path.join(temporary, filename)}`
  }
  const source = path.join(root, 'apps/storybook-smoke-consumer')
  for (const file of ['src', 'index.html', 'vite.config.ts', 'tsconfig.node.json']) {
    cpSync(path.join(source, file), path.join(consumer, file), { recursive: true })
  }
  const manifest = JSON.parse(readFileSync(path.join(source, 'package.json'), 'utf8'))
  manifest.dependencies = { ...manifest.dependencies, ...tarballs }
  writeFileSync(path.join(consumer, 'package.json'), JSON.stringify(manifest, null, 2))
  writeFileSync(path.join(consumer, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      target: 'ES2020', lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx',
      strict: true, skipLibCheck: true, noEmit: true, esModuleInterop: true,
      noUnusedLocals: true, noUnusedParameters: true,
    },
    include: ['src'],
  }, null, 2))
  console.log(run(['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumer))
  console.log(run(['run', 'build'], consumer))
  console.log(`Packed consumer passed: ${Object.keys(tarballs).join(', ')}`)
  if (keep) console.log(`CONSUMER_DIR=${consumer}`)
} finally {
  if (!keep) rmSync(temporary, { recursive: true, force: true })
}
