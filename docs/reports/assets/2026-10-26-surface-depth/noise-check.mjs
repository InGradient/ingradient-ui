import { chromium } from 'playwright'
import { PNG } from 'pngjs'

// Re-captures stories that a zero-diff gate flagged, N times on each build, to tell timing
// noise (the base build also differs from itself) from a real change (base stable, next differs).
const A = process.env.BASE, B = process.env.NEXT, N = Number(process.env.N || 4)
const ids = process.env.IDS.split(',')
const b = await chromium.launch()
const take = async (base, id) => {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
  await p.goto(`${base}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  await p.evaluate(() => document.fonts.ready).catch(() => {})
  await p.addStyleTag({ content: '*{animation:none!important;transition:none!important;caret-color:transparent!important}' }).catch(() => {})
  await p.waitForTimeout(3000)
  const buf = await p.screenshot(); await p.close(); return PNG.sync.read(buf)
}
const d = (x, y) => { if (x.width !== y.width || x.height !== y.height) return 'size'; let n = 0; for (let k = 0; k < x.data.length; k += 4) if (Math.abs(x.data[k] - y.data[k]) + Math.abs(x.data[k + 1] - y.data[k + 1]) + Math.abs(x.data[k + 2] - y.data[k + 2]) > 36) n++; return n }
for (const id of ids) {
  const a = [], c = []
  for (let i = 0; i < N; i++) { a.push(await take(A, id)); c.push(await take(B, id)) }
  const aa = a.slice(1).map((x) => d(a[0], x)), cc = c.slice(1).map((x) => d(c[0], x)), ac = a.map((x, i) => d(x, c[i]))
  const verdict = ac.every((v) => v === 0) ? 'same' : aa.some((v) => v !== 0) ? 'noise (base differs from itself)' : 'REAL CHANGE?'
  console.log(id, '| base vs base', aa.join(' '), '| next vs next', cc.join(' '), '| base vs next', ac.join(' '), '|', verdict)
}
await b.close()
