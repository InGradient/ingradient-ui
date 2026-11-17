// 4px grid audit: renders every story under PREFIXES and lists elements whose rendered height
// is off the 4px grid, grouped by the nearest named React component that owns them.
//
// Measured: form controls and bordered boxes (any element with a top/bottom border).
// Skipped (fluid, decided by available width, DESIGN "fluid sizes"): img, video, canvas, svg and
// their descendants, elements with an aspect-ratio, and anything with height 0-2px.
//
// Usage: BASE=http://host:port OUT=report.json [PREFIXES=a,b] [W=1920 H=1080] node grid-audit.mjs
import { chromium } from 'playwright'
import fs from 'node:fs'

const BASE = process.env.BASE
const OUT = process.env.OUT ?? 'grid-audit.json'
const PREFIXES = (process.env.PREFIXES ?? 'pages-platform-0-0-1-,pages-edge-0-0-6-').split(',')
const W = Number(process.env.W ?? 1920), H = Number(process.env.H ?? 1080)
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 4)

const index = await (await fetch(`${BASE}/index.json`)).json()
const ids = Object.entries(index.entries).filter(([id, e]) => e.type === 'story' && PREFIXES.some((p) => id.startsWith(p))).map(([id]) => id)

function measure() {
  const FLUID = new Set(['IMG', 'VIDEO', 'CANVAS', 'SVG', 'svg'])
  const ownerOf = (el) => {
    const key = Object.keys(el).find((k) => k.startsWith('__reactFiber$'))
    let f = key ? el[key] : null
    while (f) {
      const t = f.type
      const name = typeof t === 'function' ? (t.displayName || t.name) : null
      if (name && !/^(styled|Styled|forwardRef|Memo|_c)/.test(name) && name.length > 2 && /^[A-Z]/.test(name)) return name
      f = f.return
    }
    return '?'
  }
  const out = []
  for (const el of document.querySelectorAll('#storybook-root *, body > [role=dialog] *, body > div[style] *')) {
    if (el.closest('svg, img, video, canvas')) continue
    if (FLUID.has(el.tagName)) continue
    const r = el.getBoundingClientRect()
    if (!r.width || r.height <= 2 || r.bottom < 0 || r.top > innerHeight) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.aspectRatio !== 'auto') continue
    // Fluid: height decided by the parent or the window, not by content (DESIGN fluid-size rule).
    if (/%|vh|dvh|svh/.test(el.style.height) || /%|vh/.test(cs.maxHeight)) continue
    const parent = el.parentElement
    if (parent) {
      const ps = getComputedStyle(parent)
      const flex = ps.display.includes('flex'), grid = ps.display.includes('grid')
      const column = ps.flexDirection.startsWith('column')
      if (flex && column && parseFloat(cs.flexGrow) > 0) continue
      const selfAlign = cs.alignSelf === 'auto' ? ps.alignItems : cs.alignSelf
      if (((flex && !column) || grid) && (selfAlign === 'stretch' || selfAlign === 'normal') && Math.abs(r.height - parent.clientHeight) < 1.5 && parent.clientHeight > 0) continue
      if (cs.height !== 'auto' && Math.abs(r.height - parent.getBoundingClientRect().height) < 1.5 && parent.getBoundingClientRect().height > innerHeight * 0.4) continue
    }
    if (r.height >= innerHeight * 0.6) continue
    const border = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth)
    const control = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)
    if (!control && border === 0) continue
    const h = Math.round(r.height * 100) / 100
    if (Math.abs(h - Math.round(h / 4) * 4) < 0.05) continue
    const cause = Math.abs((h - border) % 4) < 0.05 ? 'border' : (control ? 'control' : 'content')
    out.push({ owner: ownerOf(el), tag: el.tagName.toLowerCase(), h, border, cause, text: (el.getAttribute('aria-label') || el.innerText || '').trim().slice(0, 30).replace(/\n/g, ' ') })
  }
  return out
}

const results = []
const browser = await chromium.launch()
let next = 0
async function worker() {
  const page = await browser.newPage({ viewport: { width: W, height: H } })
  while (next < ids.length) {
    const id = ids[next++]
    let last
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await page.goto(`${BASE}/iframe.html?viewMode=story&id=${id}&pace=0`, { waitUntil: 'networkidle', timeout: 30000 })
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(600)
        results.push({ id, items: await page.evaluate(measure) }); last = null; break
      } catch (e) { last = e; await page.goto('about:blank').catch(() => {}); await new Promise((r) => setTimeout(r, 2000)) }
    }
    if (last) results.push({ id, error: String(last).slice(0, 200) })
  }
  await page.close()
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker))
await browser.close()

const byOwner = {}
for (const r of results) for (const it of r.items ?? []) {
  const k = `${it.owner} | ${it.tag} | ${it.cause}`
  byOwner[k] ??= { count: 0, stories: new Set(), heights: new Set(), sample: it.text }
  byOwner[k].count++; byOwner[k].stories.add(r.id); byOwner[k].heights.add(it.h)
}
const summary = Object.entries(byOwner).map(([k, v]) => ({ key: k, count: v.count, stories: v.stories.size, heights: [...v.heights].slice(0, 6), sample: v.sample })).sort((a, b) => b.stories - a.stories || b.count - a.count)
fs.writeFileSync(OUT, JSON.stringify({ stories: results.length, failed: results.filter((r) => r.error).length, offending: results.filter((r) => r.items?.length).length, summary, results }, null, 1))
console.log(`stories ${results.length} | failed ${results.filter((r) => r.error).length} | stories with off-grid ${results.filter((r) => r.items?.length).length} | owners ${summary.length}`)
for (const s of summary.slice(0, 40)) console.log(`${String(s.stories).padStart(3)} stories ${String(s.count).padStart(4)}x  ${s.key}  h=${s.heights.join(',')}  "${s.sample}"`)
