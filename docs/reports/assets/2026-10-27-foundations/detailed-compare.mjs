// Detailed before/after comparison of rendered screens.
// For each story, elements are matched by component name + own text (+ occurrence), and their
// computed styles are compared. Identical change descriptions are grouped under one number;
// added and removed elements get their own numbers. Output: per-screen JSON for annotation.
import { chromium } from 'playwright'
import fs from 'node:fs'

const BEFORE = process.env.BEFORE
const AFTER = process.env.AFTER
const OUT = process.env.OUT
const SCREENS = JSON.parse(fs.readFileSync(process.env.SCREENS, 'utf8'))
fs.mkdirSync(OUT, { recursive: true })

const collect = () => {
  const root = [...document.querySelectorAll('#storybook-root, [role=dialog]')]
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width >= 6 && r.height >= 6 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && getComputedStyle(e).visibility !== 'hidden' }
  const own = (e) => [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim()
  const meaningful = (e) => {
    const t = e.tagName.toLowerCase(); const cs = getComputedStyle(e)
    if (e.dataset.igComponent) return true
    if (/^(button|input|textarea|select|label|h[1-6]|a|p|aside|nav|section|header|li|th|td|img|svg)$/.test(t)) return true
    if (e.getAttribute('role') && /button|tab|checkbox|switch|dialog|img/.test(e.getAttribute('role'))) return true
    const filled = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none'
    return filled && own(e).length > 0
  }
  const seen = new Map(); const rows = []
  for (const r of root) for (const e of [r, ...r.querySelectorAll('*')]) {
    if (!vis(e) || !meaningful(e)) continue
    const t = e.tagName.toLowerCase()
    const isField = t === 'input' || t === 'textarea' || t === 'select'
    // Fields are matched by order: their placeholder or aria-label may change between versions.
    const label = isField ? '' : (own(e) || e.getAttribute('aria-label') || e.getAttribute('alt') || '').slice(0, 28)
    const base = isField ? `${t}:${e.getAttribute('type') || ''}` : `${e.dataset.igComponent || t}|${label}`
    const n = (seen.get(base) || 0) + 1; seen.set(base, n)
    const cs = getComputedStyle(e); const q = e.getBoundingClientRect()
    rows.push({
      key: `${base}#${n}`, comp: e.dataset.igComponent || t, label,
      x: Math.round(q.x), y: Math.round(q.y), w: Math.round(q.width), h: Math.round(q.height),
      radius: cs.borderTopLeftRadius, pad: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].join(' '),
      gap: cs.rowGap === 'normal' ? cs.columnGap : cs.rowGap, fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight,
      textTransform: cs.textTransform, family: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
      bg: cs.backgroundColor, border: parseFloat(cs.borderTopWidth) + parseFloat(cs.borderLeftWidth) > 0 ? `${cs.borderTopWidth}/${cs.borderLeftWidth} ${cs.borderTopColor}` : 'none',
      shadow: cs.boxShadow === 'none' ? 'none' : 'shadow', color: cs.color,
      placeholder: e.getAttribute('placeholder') || '', accName: e.getAttribute('aria-label') || '',
    })
  }
  return { rows, bodyFont: getComputedStyle(document.body).fontFamily.split(',')[0].replace(/["']/g, '').trim() }
}

const b = await chromium.launch()
const take = async (base, id, vw) => {
  const p = await b.newPage({ viewport: { width: vw, height: 900 }, reducedMotion: 'reduce' })
  await p.goto(`${base}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
  await p.evaluate(() => document.fonts.ready).catch(() => {})
  await p.addStyleTag({ content: '*{animation:none!important;transition:none!important;caret-color:transparent!important}' }).catch(() => {})
  await p.waitForTimeout(2500)
  const data = await p.evaluate(collect)
  const shot = await p.screenshot()
  await p.close()
  return { ...data, shot }
}

const px = (v) => (v === 'normal' ? NaN : parseFloat(v))
const describe = (a, c) => {
  const d = []
  // Icons: only their rendered size is meaningful.
  if (c.comp === 'svg') {
    if (Math.abs(a.w - c.w) >= 1 || Math.abs(a.h - c.h) >= 1) d.push(`아이콘 크기 ${a.w}×${a.h}→${c.w}×${c.h}px`)
    return d
  }
  const num = (name, f, min = 1) => { const x = px(a[f]), y = px(c[f]); if (!Number.isNaN(x) && !Number.isNaN(y) && Math.abs(x - y) >= min) d.push(`${name} ${Math.round(x)}→${Math.round(y)}px`) }
  num('모서리', 'radius'); num('글자', 'fontSize'); num('줄높이', 'lineHeight'); num('간격', 'gap')
  if (a.pad !== c.pad) { const s = (v) => [...new Set(v.split(' ').map((n) => Math.round(parseFloat(n))))].join('/'); d.push(`안쪽여백 ${s(a.pad)}→${s(c.pad)}px`) }
  if (a.fontWeight !== c.fontWeight) d.push(`굵기 ${a.fontWeight}→${c.fontWeight}`)
  if (a.textTransform !== c.textTransform) d.push(`대문자 ${a.textTransform === 'uppercase' ? '켬→끔' : '끔→켬'}`)
  if (Math.abs(a.h - c.h) >= 2) d.push(`높이 ${a.h}→${c.h}px`)
  // Width of text-bearing elements mostly follows font and padding; report it only for elements without text.
  if (Math.abs(a.w - c.w) >= 4 && !c.label && !['section', 'div', 'main', 'aside', 'p', 'h1', 'h2', 'h3'].includes(c.comp)) d.push(`폭 ${a.w}→${c.w}px`)
  if (a.bg !== c.bg) d.push(a.bg === 'rgba(0, 0, 0, 0)' ? '배경 생김' : c.bg === 'rgba(0, 0, 0, 0)' ? '배경 없앰' : '배경색 바뀜')
  if (a.border !== c.border) d.push(a.border === 'none' ? '테두리 생김' : c.border === 'none' ? '테두리 없앰' : '테두리 바뀜')
  if (a.shadow !== c.shadow) d.push(c.shadow === 'none' ? '그림자 없앰' : '그림자 생김')
  if (a.placeholder !== c.placeholder) d.push(`안내 글자 "${a.placeholder}"→"${c.placeholder}"`)
  return d
}

const result = {}
for (const s of SCREENS) {
  const vw = s.vw || 1440
  const A = await take(BEFORE, s.id, vw); const C = await take(AFTER, s.id, vw)
  fs.writeFileSync(`${OUT}/${s.name}-before.png`, A.shot); fs.writeFileSync(`${OUT}/${s.name}-after.png`, C.shot)
  const am = new Map(A.rows.map((r) => [r.key, r])); const cm = new Map(C.rows.map((r) => [r.key, r]))
  const groups = new Map()
  const add = (sig, kind, a, c) => { if (!groups.has(sig)) groups.set(sig, { sig, kind, before: [], after: [] }); const g = groups.get(sig); if (a) g.before.push(a); if (c) g.after.push(c) }
  for (const [k, c] of cm) {
    const a = am.get(k)
    if (!a) { if (c.w * c.h >= 400) add(`새로 생김: ${c.comp}${c.label ? ` "${c.label}"` : ''}`.slice(0, 70), 'added', null, c); continue }
    const d = describe(a, c)
    if (d.length) add(`${c.comp}${c.label ? ` "${c.label.slice(0, 18)}"` : ''}: ${d.join(', ')}`, 'changed', a, c)
  }
  for (const [k, a] of am) if (!cm.has(k) && a.w * a.h >= 400) add(`사라짐: ${a.comp}${a.label ? ` "${a.label}"` : ''}`.slice(0, 70), 'removed', a, null)
  // merge groups that share the same change list across different labels of the same component
  const merged = new Map()
  for (const g of groups.values()) {
    const m = g.sig.match(/^([^"]+?)(?: "[^"]*")?: (.*)$/)
    const key = g.kind === 'changed' && m ? `${m[1].trim()}: ${m[2]}` : g.sig
    if (!merged.has(key)) merged.set(key, { sig: key, kind: g.kind, before: [], after: [], labels: [] })
    const t = merged.get(key); t.before.push(...g.before); t.after.push(...g.after)
    const l = g.sig.match(/"([^"]*)"/); if (l) t.labels.push(l[1])
  }
  const score = (g) => (g.kind === 'changed' ? g.sig.split(',').length * 3 : 2) * Math.log2(2 + Math.max(g.before.length, g.after.length)) * (g.sig.includes('모서리') || g.sig.includes('안쪽여백') || g.sig.includes('글자') ? 1.5 : 1)
  const list = [...merged.values()].filter((g) => !/^새로 생김: (div|span|svg|li|td|th|p)\b/.test(g.sig) && !/^사라짐: (div|span|svg|li|td|th|p)\b/.test(g.sig)).sort((x, y) => score(y) - score(x))
  const top = list.slice(0, 14).map((g, i) => ({ n: i + 1, ...g, before: g.before.slice(0, 8), after: g.after.slice(0, 8), count: Math.max(g.before.length, g.after.length), labels: [...new Set(g.labels)].slice(0, 4) }))
  result[s.name] = { title: s.title, id: s.id, vw, fontBefore: A.bodyFont, fontAfter: C.bodyFont, totalGroups: list.length, top, rest: list.slice(14).map((g) => ({ sig: g.sig, count: Math.max(g.before.length, g.after.length) })) }
  console.log(s.name.padEnd(16), `groups ${list.length} (shown ${top.length})`, `font ${A.bodyFont} → ${C.bodyFont}`)
}
fs.writeFileSync(`${OUT}/compare.json`, JSON.stringify(result, null, 1))
await b.close()
