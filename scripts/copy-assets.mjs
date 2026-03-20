import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const sourceDir = path.join(rootDir, 'src', 'brand', 'assets')
const targetDir = path.join(rootDir, 'lib', 'assets')

fs.mkdirSync(targetDir, { recursive: true })

for (const fileName of fs.readdirSync(sourceDir)) {
  fs.copyFileSync(path.join(sourceDir, fileName), path.join(targetDir, fileName))
}
