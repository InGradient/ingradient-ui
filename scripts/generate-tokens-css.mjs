import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const libDir = path.join(rootDir, 'lib')
const outputPath = path.join(libDir, 'tokens.css')
const tokensModuleUrl = pathToFileURL(path.join(libDir, 'tokens.js')).href

const { renderTokensCss } = await import(tokensModuleUrl)

fs.mkdirSync(libDir, { recursive: true })
fs.writeFileSync(outputPath, `/* Generated from src/tokens. Do not edit directly. */\n\n${renderTokensCss()}`)
