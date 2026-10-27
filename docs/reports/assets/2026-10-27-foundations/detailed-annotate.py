"""Draws numbered boxes (before orange, after teal) from compare.json and crops each side to the
region that changed, so small forms are readable. Legends are rendered by the report, not here."""
import json, subprocess, sys
D = sys.argv[1]
FONT = '/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc'
data = json.load(open(f'{D}/compare.json'))
OR, TE = '#f28c28', '#14b8a6'
def crop_box(rects, vw, vh=900, margin=40, min_w=640, min_h=420):
    if not rects: return (0, 0, vw, vh)
    x0 = min(r['x'] for r in rects) - margin; y0 = min(r['y'] for r in rects) - margin - 24
    x1 = max(r['x'] + r['w'] for r in rects) + margin; y1 = max(r['y'] + r['h'] for r in rects) + margin
    if x1 - x0 < min_w: c = (x0 + x1) / 2; x0, x1 = c - min_w / 2, c + min_w / 2
    if y1 - y0 < min_h: c = (y0 + y1) / 2; y0, y1 = c - min_h / 2, c + min_h / 2
    x0, y0 = max(0, int(x0)), max(0, int(y0)); x1, y1 = min(vw, int(x1)), min(vh, int(y1))
    return (x0, y0, x1 - x0, y1 - y0)
def draw(img, out, groups, side, color, crop):
    args = ['magick', img]
    for g in groups:
        for r in g[side]:
            x0, y0, x1, y1 = r['x'] - 2, r['y'] - 2, r['x'] + r['w'] + 2, r['y'] + r['h'] + 2
            args += ['-fill', 'none', '-stroke', color, '-strokewidth', '3', '-draw', f'rectangle {x0},{y0} {x1},{y1}']
            tx, ty = max(0, x0), max(0, y0 - 24); w = 14 + 11 * len(str(g['n']))
            args += ['-stroke', 'none', '-fill', color, '-draw', f'rectangle {tx},{ty} {tx + w},{ty + 22}',
                     '-fill', '#0b0d12', '-font', FONT, '-pointsize', '17', '-gravity', 'NorthWest', '-annotate', f'+{tx + 6}+{ty}', str(g['n'])]
    x, y, w, h = crop
    args += ['-crop', f'{w}x{h}+{x}+{y}', '+repage']
    if w > 720: args += ['-resize', '720x']
    args.append(out); subprocess.run(args, check=True)
for name, s in data.items():
    top = s['top']
    cb = crop_box([r for g in top for r in g['before']], s['vw']); ca = crop_box([r for g in top for r in g['after']], s['vw'])
    draw(f'{D}/{name}-before.png', f'{D}/{name}-before-ann.png', top, 'before', OR, cb)
    draw(f'{D}/{name}-after.png', f'{D}/{name}-after-ann.png', top, 'after', TE, ca)
    cap = lambda img, t: ['(', img, '-background', '#12151c', '-gravity', 'NorthWest', '-splice', '0x34', '-font', FONT, '-fill', '#e7eaf0', '-pointsize', '19', '-annotate', '+8+5', t, ')']
    subprocess.run(['magick', *cap(f'{D}/{name}-before-ann.png', '이전 (어제 저녁, 주황)'), *cap(f'{D}/{name}-after-ann.png', '지금 (청록)'),
                    '-background', '#12151c', '-gravity', 'East', '-splice', '16x0', '-gravity', 'NorthWest', '+append', f'{D}/{name}-detail.png'], check=True)
    print(name, 'boxes', len(top), 'crop before', cb, 'after', ca)
