import { chromium } from 'playwright'
import fs from 'node:fs'

// Checks every story for controls that look broken. Each story is rendered twice;
// only stories whose two reads agree are judged (the earlier icon scan wrongly mixed unstable reads).
const BASE = process.env.BASE
const OUT = process.env.OUT
const ids = process.env.IDS
  ? process.env.IDS.split(',')
  : Object.values((await (await fetch(BASE + '/index.json')).json()).entries).filter((e) => e.type === 'story').map((e) => e.id)

const readPage = () => {
  const root = document.querySelector('#storybook-root')
  if (!root) return { missing: true }
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 }
  const label = (e) => ((e.getAttribute('aria-label') || e.innerText || e.title || '') + '').trim().replace(/\s+/g, ' ').slice(0, 40)
  const controls = [...root.querySelectorAll('button, [role=button]')].filter(vis)
  const out = []
  for (const e of controls) {
    const r = e.getBoundingClientRect()
    const cs = getComputedStyle(e)
    const ig = e.dataset.igComponent || ''
    const issues = []
    // 1) squashed: a design-system control rendered clearly smaller than its smallest size token
    if ((ig === 'Button' || ig === 'IconButton') && r.height < 24) issues.push(['squashed', `${Math.round(r.height)}px high`])
    // 2) clipped: text or content wider/taller than the control while overflow is hidden
    if ((ig === 'Button' || ig === 'IconButton') && (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1) && cs.overflow !== 'visible') issues.push(['clipped', `${e.scrollWidth}x${e.scrollHeight} in ${e.clientWidth}x${e.clientHeight}`])
    // 3) empty: a button with no accessible name and no visible content
    const hasContent = !!(e.querySelector('svg,img') || (e.innerText || '').trim())
    if (!hasContent) issues.push(['empty', 'no icon, no text'])
    if (!label(e) && !e.getAttribute('aria-labelledby')) issues.push(['unnamed', 'no accessible name'])
    // 4) text glyph used as an icon (×, ‹, ›, ▲ ...) inside an icon-only button
    const t = (e.innerText || '').trim()
    if (ig === 'IconButton' && t && /^[×✕✖‹›«»▲▼☰+−x]$/.test(t)) issues.push(['glyph-icon', `"${t}"`])
    // 5) icon-only control that is not square
    if (ig === 'IconButton' && Math.abs(r.width - r.height) > 1) issues.push(['non-square', `${Math.round(r.width)}x${Math.round(r.height)}`])
    // 6) squashed against a sibling: control overlapping another control
    for (const o of out) { /* overlap checked below */ }
    for (const i of issues) out.push({ kind: i[0], detail: i[1], comp: ig || e.tagName.toLowerCase(), label: label(e), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) })
  }
  // 7) overlapping controls
  const rects = controls.map((e) => ({ e, r: e.getBoundingClientRect() }))
  for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
    const a = rects[i], b = rects[j]
    if (a.e.contains(b.e) || b.e.contains(a.e)) continue
    const ox = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left)
    const oy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top)
    if (ox > 3 && oy > 3) out.push({ kind: 'overlap', detail: `${Math.round(ox)}x${Math.round(oy)} overlap with "${label(b.e)}"`, comp: a.e.dataset.igComponent || a.e.tagName.toLowerCase(), label: label(a.e), x: Math.round(a.r.x), y: Math.round(a.r.y), w: Math.round(a.r.width), h: Math.round(a.r.height) })
  }
  // 8) horizontal page overflow
  const hOver = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  return { n: controls.length, hOver, issues: out }
}

const b = await chromium.launch()
const take = async (id) => {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
  await p.goto(`${BASE}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  await p.evaluate(() => document.fonts.ready).catch(() => {})
  await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}' }).catch(() => {})
  await p.waitForTimeout(700)
  const r = await p.evaluate(readPage).catch(() => ({ missing: true }))
  await p.close()
  return r
}
const sig = (r) => JSON.stringify([r.n, r.hOver, (r.issues || []).map((i) => i.kind + i.x + i.y + i.w + i.h)])
const rows = []
const q = [...ids]
await Promise.all(Array.from({ length: 6 }, async () => {
  while (q.length) {
    const id = q.shift()
    const a = await take(id)
    const c = await take(id)
    if (a.missing || c.missing || sig(a) !== sig(c)) { rows.push({ id, stable: false }); continue }
    rows.push({ id, stable: true, n: a.n, hOver: a.hOver, issues: a.issues })
  }
}))
fs.writeFileSync(OUT, JSON.stringify(rows))
const st = rows.filter((r) => r.stable)
const cnt = {}
st.forEach((r) => r.issues.forEach((i) => { cnt[i.kind] = (cnt[i.kind] || 0) + 1 }))
console.log('stories', rows.length, '| stable', st.length, '| unstable (excluded)', rows.length - st.length, '| page h-overflow', st.filter((r) => r.hOver).length)
console.log('issue counts (stable stories):', JSON.stringify(cnt))
await b.close()
