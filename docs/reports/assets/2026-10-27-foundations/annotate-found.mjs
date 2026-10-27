import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

// Draws matching numbered boxes on the current (orange) and recommended (teal) captures and
// places them side by side with Korean captions.
const DIR = process.env.DIR || '/tmp/rt/found'
const FONT = '/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc'
const m = JSON.parse(fs.readFileSync(`${DIR}/measure.json`, 'utf8'))
const sh = (a) => execFileSync('magick', a, { stdio: ['ignore', 'pipe', 'pipe'] })
const draw = (src, out, items, color) => {
  const args = [src]
  items.forEach((it, i) => {
    if (!it || it.missing) return
    const n = String(i + 1)
    const x0 = it.x - 3, y0 = it.y - 3, x1 = it.x + it.w + 3, y1 = it.y + it.h + 3
    args.push('-fill', 'none', '-stroke', color, '-strokewidth', '3', '-draw', `rectangle ${x0},${y0} ${x1},${y1}`)
    const tx = Math.max(0, x0), ty = Math.max(0, y0 - 26)
    args.push('-stroke', 'none', '-fill', color, '-draw', `rectangle ${tx},${ty} ${tx + 26},${ty + 24}`)
    args.push('-fill', '#0b0d12', '-font', FONT, '-pointsize', '18', '-gravity', 'NorthWest', '-annotate', `+${tx + 7}+${ty}`, n)
  })
  args.push(out)
  sh(args)
}
for (const [name, v] of Object.entries(m)) {
  draw(`${DIR}/${name}-cur.png`, `${DIR}/${name}-cur-ann.png`, v.cur, '#f28c28')
  draw(`${DIR}/${name}-rec.png`, `${DIR}/${name}-rec-ann.png`, v.rec, '#14b8a6')
  const cap = (img, text) => ['(', img, '-resize', '60%', '-background', '#12151c', '-gravity', 'NorthWest', '-splice', '0x40', '-font', FONT, '-fill', '#e7eaf0', '-pointsize', '22', '-annotate', '+10+6', text, ')']
  sh([...cap(`${DIR}/${name}-cur-ann.png`, '지금 (주황)'), ...cap(`${DIR}/${name}-rec-ann.png`, '추천안 (청록)'), '-background', '#12151c', '-gravity', 'North', '+append', `${DIR}/${name}-compare.png`])
}
console.log('annotated', Object.keys(m).length)
