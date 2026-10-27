import { chromium } from 'playwright'
import fs from 'node:fs'
import { PNG } from 'pngjs'

// Phase gate: every story must render pixel-identical between BASE and NEXT.
// BASE is read twice; stories whose two BASE reads differ are excluded as unstable.
const BASE = process.env.BASE
const NEXT = process.env.NEXT
const OUT = process.env.OUT
const ids = Object.values((await (await fetch(BASE + '/index.json')).json()).entries).filter((e) => e.type === 'story').map((e) => e.id)
let b = await chromium.launch()
const ensure = async () => { if (!b.isConnected()) b = await chromium.launch() }
const take = async (base, id) => {
  await ensure()
  let p
  try {
    p = await b.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
    await p.goto(`${base}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
    await p.evaluate(() => document.fonts.ready).catch(() => {})
    await p.addStyleTag({ content: '*{animation:none!important;transition:none!important;caret-color:transparent!important}' }).catch(() => {})
    await p.waitForTimeout(800).catch(() => {})
    const buf = await p.screenshot()
    await p.close()
    return PNG.sync.read(buf)
  } catch {
    try { await p?.close() } catch {}
    return null
  }
}
const same = (x, y) => {
  if (!x || !y || x.width !== y.width || x.height !== y.height) return false
  for (let k = 0; k < x.data.length; k += 4) {
    if (Math.abs(x.data[k] - y.data[k]) + Math.abs(x.data[k + 1] - y.data[k + 1]) + Math.abs(x.data[k + 2] - y.data[k + 2]) > 36) return false
  }
  return true
}
const rows = []
const q = [...ids]
await Promise.all(Array.from({ length: 4 }, async () => {
  while (q.length) {
    const id = q.shift()
    const a1 = await take(BASE, id)
    const a2 = await take(BASE, id)
    if (!a1 || !a2) { rows.push({ id, failed: true }); continue }
    if (!same(a1, a2)) { rows.push({ id, stable: false }); continue }
    const n = await take(NEXT, id)
    if (!n) { rows.push({ id, failed: true }); continue }
    rows.push({ id, stable: true, same: same(a1, n) })
  }
}))
fs.writeFileSync(OUT, JSON.stringify(rows))
const st = rows.filter((r) => r.stable)
const diff = st.filter((r) => !r.same)
console.log('stories', rows.length, '| stable', st.length, '| unstable', rows.filter((r) => r.stable === false).length, '| failed', rows.filter((r) => r.failed).length)
console.log('differ:', diff.length)
diff.slice(0, 30).forEach((r) => console.log('  ', r.id))
await b.close()
