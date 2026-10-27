import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
const DIR = '/tmp/rt/found'
const FONT = '/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc'
const m = JSON.parse(fs.readFileSync(`${DIR}/measure.json`, 'utf8'))
const sh = (a) => execFileSync('magick', a, { stdio: ['ignore', 'pipe', 'pipe'] })
const S = 64, Z = 4
const rows = []
for (const name of ['settings', 'dashboard', 'create', 'login']) {
  for (const idx of [0, 1]) {
    const c = m[name].cur[idx], r = m[name].rec[idx]
    if (!c || !r || c.missing || r.missing || c.radius === r.radius) continue
    const cell = (src, it, label, out) => sh([src, '-crop', `${S}x${S}+${Math.max(0, it.x - 8)}+${Math.max(0, it.y - 8)}`, '+repage', '-filter', 'point', '-resize', `${Z * 100}%`,
      '-background', '#12151c', '-gravity', 'North', '-splice', '0x34', '-font', FONT, '-fill', '#e7eaf0', '-pointsize', '20', '-annotate', '+0+4', label, out])
    const a = `${DIR}/z-${name}-${idx}-a.png`, b = `${DIR}/z-${name}-${idx}-b.png`
    cell(`${DIR}/${name}-cur.png`, c, `지금 ${c.radius}px`, a)
    cell(`${DIR}/${name}-rec.png`, r, `추천 ${r.radius}px`, b)
    const row = `${DIR}/z-${name}-${idx}.png`
    sh([a, b, '+append', '-background', '#12151c', '-gravity', 'NorthWest', '-splice', '0x36', '-font', FONT, '-fill', '#e7eaf0', '-pointsize', '22', '-annotate', '+8+4', `${name} · ${c.role} 왼쪽 위 모서리 (4배)`, row])
    rows.push(row)
  }
}
sh([...rows, '-background', '#12151c', '-append', `${DIR}/corners-zoom.png`])
console.log(rows.length, 'rows')
