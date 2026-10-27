import { chromium } from 'playwright'
import fs from 'node:fs'

// Captures the same screens on the current build and a trial build, picks representative
// elements by DOM path (token-only trials keep the DOM identical), and records their
// radius, size, icon size, padding, and gap so annotated comparisons can be drawn.
const CUR = process.env.CUR || 'http://100.105.177.42:6057'
const REC = process.env.REC || 'http://100.105.177.42:6060'
const OUT = process.env.OUT || '/tmp/rt/found'
fs.mkdirSync(OUT, { recursive: true })
const SCREENS = {
  settings: 'pages-platform-0-0-1-settings-modal-general--preferences',
  catalog: 'pages-platform-0-0-1-dataset-catalog-workspace--overview',
  class: 'pages-platform-0-0-1-class-management-workspace--overview',
  dashboard: 'pages-platform-0-0-1-dashboard-workspace--overview',
  create: 'pages-platform-0-0-1-create-project-workspace--overview',
  login: 'pages-platform-0-0-1-auth-login-workspace--overview',
  buttons: 'components-inputs-button--review',
  iconbuttons: 'components-inputs-iconbutton--review',
}

const pick = () => {
  const root = document.querySelector('#storybook-root')
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight }
  const path = (e) => { const p = []; while (e && e !== document.body) { const par = e.parentElement; p.unshift(par ? [...par.children].indexOf(e) : 0); e = par } return p.join('.') }
  const rad = (e) => parseFloat(getComputedStyle(e).borderTopLeftRadius) || 0
  const all = [...document.querySelectorAll('#storybook-root *, [role=dialog], [role=dialog] *')].filter(vis)
  const boxes = all.filter((e) => { const r = e.getBoundingClientRect(); const t = e.tagName.toLowerCase(); return rad(e) > 0 && rad(e) < 50 && r.width >= 200 && r.height >= 60 && t !== 'button' && t !== 'input' && t !== 'textarea' })
    .sort((a, b) => b.getBoundingClientRect().width * b.getBoundingClientRect().height - a.getBoundingClientRect().width * a.getBoundingClientRect().height)
  const outer = boxes[0]
  const inner = outer ? boxes.find((e) => e !== outer && outer.contains(e)) : boxes[1]
  const textBtn = all.find((e) => e.tagName === 'BUTTON' && (e.innerText || '').trim().length > 1 && rad(e) > 0)
  const iconBtn = all.find((e) => e.tagName === 'BUTTON' && !(e.innerText || '').trim() && e.querySelector('svg') && rad(e) > 0)
  const input = all.find((e) => (e.tagName === 'INPUT' && e.type !== 'checkbox' && e.type !== 'hidden') || e.tagName === 'TEXTAREA')
  const smallBox = all.find((e) => { const r = e.getBoundingClientRect(); return rad(e) > 0 && rad(e) < 50 && r.width <= 24 && r.height <= 24 && r.width >= 12 })
  const picks = [['큰 표면(모달·카드·패널)', outer], ['안쪽 표면(카드·섹션)', inner], ['글자 버튼', textBtn], ['아이콘 버튼', iconBtn], ['입력창', input], ['작은 요소(체크박스·칩)', smallBox]]
  return picks.filter(([, e]) => e).map(([role, e]) => ({ role, path: path(e) }))
}

const measure = (paths) => {
  const byPath = (p) => { let e = document.body; for (const i of p.split('.').map(Number)) { e = e?.children[i] } return e }
  return paths.map(({ role, path }) => {
    const e = byPath(path)
    if (!e) return { role, missing: true }
    const r = e.getBoundingClientRect(); const cs = getComputedStyle(e)
    const svg = e.tagName === 'BUTTON' ? e.querySelector('svg') : null
    return {
      role, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
      radius: Math.round(parseFloat(cs.borderTopLeftRadius) * 10) / 10,
      padX: cs.paddingLeft, gap: cs.columnGap,
      icon: svg ? Math.round(svg.getBoundingClientRect().width * 10) / 10 : null,
      label: ((e.getAttribute('aria-label') || e.innerText || '') + '').trim().replace(/\s+/g, ' ').slice(0, 24),
    }
  })
}

const b = await chromium.launch()
const open = async (base, id) => {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  await p.goto(`${base}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {})
  await p.evaluate(() => document.fonts.ready).catch(() => {})
  await p.addStyleTag({ content: '*{animation:none!important;transition:none!important;caret-color:transparent!important}' }).catch(() => {})
  await p.waitForTimeout(1500)
  return p
}
const result = {}
for (const [name, id] of Object.entries(SCREENS)) {
  const pc = await open(CUR, id)
  const paths = await pc.evaluate(pick)
  const cur = await pc.evaluate(measure, paths)
  const curH = await pc.evaluate(() => document.documentElement.scrollHeight)
  await pc.screenshot({ path: `${OUT}/${name}-cur.png` })
  await pc.close()
  const pr = await open(REC, id)
  const rec = await pr.evaluate(measure, paths)
  const recH = await pr.evaluate(() => document.documentElement.scrollHeight)
  await pr.screenshot({ path: `${OUT}/${name}-rec.png` })
  await pr.close()
  result[name] = { id, cur, rec, curH, recH }
  console.log(name.padEnd(12), `page height ${curH}→${recH}`)
  cur.forEach((c, i) => { const r = rec[i]; if (!c.missing && !r.missing) console.log('   ', String(i + 1), c.role.padEnd(18), `radius ${c.radius}→${r.radius}`, `size ${c.w}x${c.h}→${r.w}x${r.h}`, c.icon ? `icon ${c.icon}→${r.icon}` : '', `padX ${c.padX}→${r.padX}`) })
}
fs.writeFileSync(`${OUT}/measure.json`, JSON.stringify(result, null, 1))
await b.close()
