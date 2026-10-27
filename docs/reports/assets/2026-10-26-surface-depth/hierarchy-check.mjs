import { chromium } from 'playwright'
import fs from 'node:fs'

// Surface hierarchy check for every Platform 0.0.1 story.
// 1) structural: each element with data-ig-depth vs its nearest data-ig-depth ancestor in the DOM;
//    the ancestor must be rounder. Floating surfaces portal out of the tree, so they are compared
//    only with what they actually contain.
// 2) positional (same method as the 2026-10-26 baseline of 376 pairs): any rounded box (>=120x40,
//    not a control) geometrically inside another rounded box. Counts popovers that merely overlap.
const BASE = process.env.BASE
const OUT = process.env.OUT
const ids = Object.values((await (await fetch(BASE + '/index.json')).json()).entries)
  .filter((e) => e.type === 'story' && e.id.startsWith('pages-platform-0-0-1-')).map((e) => e.id)
let b = await chromium.launch()
const read = async (id) => {
  if (!b.isConnected()) b = await chromium.launch()
  let p
  try {
    p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
    await p.goto(`${BASE}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {})
    await p.evaluate(() => document.fonts.ready).catch(() => {})
    await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}' }).catch(() => {})
    await p.waitForTimeout(1500).catch(() => {})
    const r = await p.evaluate(() => {
      const rad = (e) => parseFloat(getComputedStyle(e).borderTopLeftRadius) || 0
      const vis = (e) => { const q = e.getBoundingClientRect(); return q.width > 0 && q.height > 0 }
      const label = (e) => ((e.getAttribute('aria-label') || e.innerText || '') + '').trim().replace(/\s+/g, ' ').slice(0, 24)
      const structural = { pairs: 0, ok: 0, bad: [] }
      for (const e of document.querySelectorAll('[data-ig-depth]')) {
        if (!vis(e) || rad(e) === 0 || rad(e) >= 50) continue
        // A floating surface (dialog over a modal, menu) is its own stacking layer, not a nested panel.
        if (e.hasAttribute('data-ig-floating')) continue
        let a = e.parentElement
        while (a && !a.hasAttribute('data-ig-depth')) a = a.parentElement
        if (!a || rad(a) === 0) continue
        structural.pairs++
        if (rad(a) > rad(e)) structural.ok++
        else if (structural.bad.length < 3) structural.bad.push(`${a.dataset.igDepth}:${rad(a)}px ⊃ ${e.dataset.igDepth}:${rad(e)}px ${JSON.stringify(label(e))}`)
      }
      const boxes = [...document.querySelectorAll('#storybook-root *, [role=dialog], [role=dialog] *')].filter((e) => {
        const q = e.getBoundingClientRect(); const t = e.tagName.toLowerCase(); const r = rad(e)
        return vis(e) && r > 0 && r < 50 && q.width >= 120 && q.height >= 40 && t !== 'button' && t !== 'input' && t !== 'textarea' && e.getAttribute('role') !== 'button'
      }).map((e) => { const q = e.getBoundingClientRect(); return { r: Math.round(rad(e) * 10) / 10, x: q.x, y: q.y, w: q.width, h: q.height } })
      let pairs = 0, ok = 0, eq = 0, inv = 0
      for (const o of boxes) for (const i of boxes) {
        if (o === i) continue
        if (i.x >= o.x && i.y >= o.y && i.x + i.w <= o.x + o.w + 1 && i.y + i.h <= o.y + o.h + 1 && (i.w < o.w || i.h < o.h)) {
          pairs++; if (o.r > i.r) ok++; else if (o.r === i.r) eq++; else inv++
        }
      }
      return { structural, positional: { pairs, ok, eq, inv } }
    })
    await p.close()
    return r
  } catch { try { await p?.close() } catch {} ; return null }
}
const rows = []
const q = [...ids]
await Promise.all(Array.from({ length: 4 }, async () => { while (q.length) { const id = q.shift(); rows.push({ id, ...(await read(id) ?? { failed: true }) }) } }))
fs.writeFileSync(OUT, JSON.stringify(rows))
const ok = rows.filter((r) => !r.failed)
const S = ok.reduce((a, r) => ({ pairs: a.pairs + r.structural.pairs, ok: a.ok + r.structural.ok }), { pairs: 0, ok: 0 })
const P = ok.reduce((a, r) => ({ pairs: a.pairs + r.positional.pairs, ok: a.ok + r.positional.ok, eq: a.eq + r.positional.eq, inv: a.inv + r.positional.inv }), { pairs: 0, ok: 0, eq: 0, inv: 0 })
console.log('stories', rows.length, '| failed', rows.length - ok.length)
console.log('structural (DOM depth): pairs', S.pairs, '| outer rounder', S.ok, '| violations', S.pairs - S.ok)
console.log('positional (old method): pairs', P.pairs, '| outer rounder', P.ok, '| equal', P.eq, '| inverted', P.inv)
ok.filter((r) => r.structural.bad.length).slice(0, 12).forEach((r) => console.log('  structural violation', r.id.replace('pages-platform-0-0-1-', ''), r.structural.bad.join(' | ')))
const posBad = ok.filter((r) => r.positional.eq + r.positional.inv > 0).sort((a, b) => (b.positional.eq + b.positional.inv) - (a.positional.eq + a.positional.inv))
console.log('stories with positional equal/inverted:', posBad.length)
posBad.slice(0, 10).forEach((r) => console.log('  ', r.id.replace('pages-platform-0-0-1-', ''), `eq ${r.positional.eq} inv ${r.positional.inv}`))
await b.close()
