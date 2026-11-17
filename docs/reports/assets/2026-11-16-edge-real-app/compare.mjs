import { chromium } from 'playwright'
import fs from 'node:fs'
import { PNG } from 'pngjs'

// AS-IS / TO-BE composites for changed stories. Captures BASE and NEXT at the same viewport and
// state, finds the changed pixels, groups them into boxes, and draws numbered orange (AS-IS) and
// teal (TO-BE) boxes on copies of the screenshots placed side by side.
// Env: BASE, NEXT, OUT (directory), IDS (comma-separated story ids).
const { BASE, NEXT, OUT } = process.env
const ids = process.env.IDS.split(',').filter(Boolean)
fs.mkdirSync(OUT, { recursive: true })
const W = 1440, H = 900
const b = await chromium.launch()
const shot = async (base, id) => {
  const p = await b.newPage({ viewport: { width: W, height: H }, reducedMotion: 'reduce' })
  await p.goto(`${base}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {})
  await p.evaluate(() => document.fonts.ready).catch(() => {})
  await p.addStyleTag({ content: '*{animation:none!important;transition:none!important;caret-color:transparent!important}' }).catch(() => {})
  await p.waitForTimeout(1500)
  const png = PNG.sync.read(await p.screenshot())
  await p.close()
  return png
}
const differs = (x, y, k) => Math.abs(x.data[k] - y.data[k]) + Math.abs(x.data[k + 1] - y.data[k + 1]) + Math.abs(x.data[k + 2] - y.data[k + 2]) > 36
// Coarse grid of changed cells, merged into boxes by flood fill over 8px cells.
const boxesOf = (x, y) => {
  const C = 8, gw = Math.ceil(W / C), gh = Math.ceil(H / C)
  const grid = new Uint8Array(gw * gh)
  for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) if (differs(x, y, (py * W + px) * 4)) grid[Math.floor(py / C) * gw + Math.floor(px / C)] = 1
  const seen = new Uint8Array(gw * gh), boxes = []
  for (let i = 0; i < grid.length; i++) {
    if (!grid[i] || seen[i]) continue
    let minx = 1e9, miny = 1e9, maxx = -1, maxy = -1
    const st = [i]; seen[i] = 1
    while (st.length) {
      const c = st.pop(), cx = c % gw, cy = Math.floor(c / gw)
      minx = Math.min(minx, cx); maxx = Math.max(maxx, cx); miny = Math.min(miny, cy); maxy = Math.max(maxy, cy)
      for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
        const nx = cx + dx, ny = cy + dy, n = ny * gw + nx
        if (nx >= 0 && ny >= 0 && nx < gw && ny < gh && grid[n] && !seen[n]) { seen[n] = 1; st.push(n) }
      }
    }
    boxes.push({ x: minx * C - 4, y: miny * C - 4, w: (maxx - minx + 1) * C + 8, h: (maxy - miny + 1) * C + 8 })
  }
  return boxes.filter((q) => q.w * q.h > 200).sort((a, c) => a.y - c.y || a.x - c.x).slice(0, 9)
}
const rect = (img, q, [r, g, bl], t = 3) => {
  for (let k = 0; k < t; k++) for (let px = q.x - k; px <= q.x + q.w + k; px++) for (const py of [q.y - k, q.y + q.h + k]) put(img, px, py, r, g, bl)
  for (let k = 0; k < t; k++) for (let py = q.y - k; py <= q.y + q.h + k; py++) for (const px of [q.x - k, q.x + q.w + k]) put(img, px, py, r, g, bl)
}
const put = (img, x, y, r, g, bl) => { if (x < 0 || y < 0 || x >= img.width || y >= img.height) return; const k = (y * img.width + x) * 4; img.data[k] = r; img.data[k + 1] = g; img.data[k + 2] = bl; img.data[k + 3] = 255 }
// 5x7 digit font for box numbers.
const DIG = ['01110100011001110101110011000101110', '00100011000010000100001000010001110', '01110100010000100010001000100011111', '11111000100010000010000011000101110', '00010001100101010010111110001000010', '11111100001111000001000011000101110', '00110010001000011110100011000101110', '11111000010001000100010000100001000', '01110100011000101110100011000101110', '01110100011000101111000010001001100']
const label = (img, n, x, y, color) => {
  const s = 3, bw = 5 * s + 8, bh = 7 * s + 8
  for (let py = 0; py < bh; py++) for (let px = 0; px < bw; px++) put(img, x + px, y + py, ...color)
  const d = DIG[n]
  for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) if (d[r * 5 + c] === '1') for (let a = 0; a < s; a++) for (let bb = 0; bb < s; bb++) put(img, x + 4 + c * s + a, y + 4 + r * s + bb, 255, 255, 255)
}
const ORANGE = [245, 130, 32], TEAL = [20, 184, 166]
const report = []
for (const id of ids) {
  const a = await shot(BASE, id), n = await shot(NEXT, id)
  const boxes = boxesOf(a, n)
  boxes.forEach((q, i) => { rect(a, q, ORANGE); rect(n, q, TEAL); label(a, i + 1, Math.max(0, q.x - 3), Math.max(0, q.y - 32), ORANGE); label(n, i + 1, Math.max(0, q.x - 3), Math.max(0, q.y - 32), TEAL) })
  const gap = 24, out = new PNG({ width: W * 2 + gap, height: H })
  out.data.fill(255)
  PNG.bitblt(a, out, 0, 0, W, H, 0, 0)
  PNG.bitblt(n, out, 0, 0, W, H, W + gap, 0)
  const file = `${id.replace('pages-edge-0-0-6-', '')}.png`
  fs.writeFileSync(`${OUT}/${file}`, PNG.sync.write(out))
  report.push({ id, file, boxes })
  console.log(id, boxes.length)
}
fs.writeFileSync(`${OUT}/boxes.json`, JSON.stringify(report, null, 1))
await b.close()
