"""Converts `const NAME_STYLE = {...}` objects used only as `style={NAME_STYLE}` into styled components.

Conservative: an object is converted only when every value is a string or number literal, every
usage is `style={NAME_STYLE}` on the same JSX tag, and that tag has no `as=` prop. Everything
else is skipped and reported. Run with --write to apply; default is a dry run.
"""
import glob, re, sys

WRITE = '--write' in sys.argv
ROOTS = [a for a in sys.argv[1:] if not a.startswith('--')] or ['packages/platform-pages/src']
UNITLESS = {'flex', 'flexGrow', 'flexShrink', 'zIndex', 'opacity', 'lineHeight', 'fontWeight', 'order'}
OBJ = re.compile(r"^const ([A-Z][A-Z0-9_]*_STYLE)(?:\s*:\s*[\w.<>]+)?\s*=\s*\{([^{}]*)\}(?:\s*as const)?\s*\n", re.M)
PROP = re.compile(r"\s*(\w+)\s*:\s*('(?:[^'\\]|\\.)*'|\"(?:[^\"\\]|\\.)*\"|-?\d+(?:\.\d+)?)(?:\s+as\s+const)?\s*,?\s*")


def kebab(k):
    return re.sub(r'[A-Z]', lambda m: '-' + m.group(0).lower(), k)


def parse(body):
    pos, out = 0, []
    while pos < len(body):
        if body[pos:].strip() == '':
            break
        m = PROP.match(body, pos)
        if not m:
            return None
        key, raw = m.group(1), m.group(2)
        if raw[0] in "'\"":
            val = raw[1:-1]
        else:
            val = raw if (key in UNITLESS or raw == '0') else raw + 'px'
        out.append((key, val))
        pos = m.end()
    return out


def opening_tag(src, style_pos):
    """Return (start, end, tag) of the JSX opening tag that contains style_pos."""
    i = src.rfind('<', 0, style_pos)
    while i >= 0:
        m = re.match(r'<([A-Za-z][\w.]*)', src[i:])
        if m:
            # find tag end from i, honoring braces and quotes
            depth, q, j = 0, None, i + 1
            while j < len(src):
                c = src[j]
                if q:
                    if c == q and src[j - 1] != '\\':
                        q = None
                elif c in '"\'`':
                    q = c
                elif c == '{':
                    depth += 1
                elif c == '}':
                    depth -= 1
                elif c == '>' and depth == 0:
                    if j > style_pos:
                        return i, j, m.group(1)
                    break
                j += 1
        i = src.rfind('<', 0, i)
    return None


def closing_for(src, start, end, tag):
    """Index range of the matching </tag> for the opening tag [start, end], or None if self-closing."""
    if src[end - 1] == '/':
        return None
    depth, k = 1, end + 1
    pat = re.compile(r'<(/?)' + re.escape(tag) + r'(?=[\s>/])')
    while True:
        m = pat.search(src, k)
        if not m:
            raise ValueError('unbalanced ' + tag)
        if m.group(1) == '/':
            depth -= 1
            if depth == 0:
                close_end = src.index('>', m.end())
                return m.start(), close_end + 1
            k = m.end()
        else:
            ot = opening_tag(src, m.end())
            if ot and src[ot[1] - 1] != '/':
                depth += 1
            k = (ot[1] if ot else m.end()) + 1


def comp_name(const):
    words = const[:-len('_STYLE')].lower().split('_')
    return ''.join(w.capitalize() for w in words if w) + 'Box'


done, skipped = [], []
for root in ROOTS:
    for f in sorted(glob.glob(root + '/**/*.tsx', recursive=True)):
        if '.stories.' in f or '.test.' in f:
            continue
        src = open(f).read()
        changed = False
        seen_consts = set()
        while True:
          # Re-scan after every rewrite: positions shift once an object is converted.
          m = next((x for x in OBJ.finditer(src) if x.group(1) not in seen_consts), None)
          if m is None:
              break
          seen_consts.add(m.group(1))
          if True:
              const, body = m.group(1), m.group(2)
              props = parse(body)
              uses = [u.start() for u in re.finditer(r'\b' + const + r'\b', src) if u.start() != m.start(1)]
              direct = [u for u in re.finditer(r'style=\{' + const + r'\}', src)]
              reason = None
              if props is None:
                  reason = 'non-literal value'
              elif len(uses) != len(direct) or not direct:
                  reason = 'used outside style={...} (spread or prop)'
              tags = set()
              if not reason:
                  for d in direct:
                      ot = opening_tag(src, d.start())
                      if not ot:
                          reason = 'no tag'; break
                      tag_src = src[ot[0]:ot[1] + 1]
                      if re.search(r'\sas=', tag_src) and ot[2][0].islower():
                          reason = 'as= on html tag'; break
                      tags.add(ot[2])
                  if not reason and len(tags) != 1:
                      reason = f'different tags {sorted(tags)}'
              if reason:
                  skipped.append((f, const, reason)); continue
              tag = tags.pop()
              name = comp_name(const)
              if re.search(r'\b' + name + r'\b', src):
                  name = name[:-3] + 'Styled'
              css = ''.join(f'  {kebab(k)}: {v};\n' for k, v in props)
              base = f'styled.{tag}' if tag[0].islower() and '.' not in tag else f'styled({tag})'
              decl = f'const {name} = {base}`\n{css}`\n'
              done.append((f, const, name, tag, len(direct)))
              if not WRITE:
                  continue
              # rewrite usages from the end so earlier indexes stay valid
              for d in reversed(list(re.finditer(r'\s*style=\{' + const + r'\}', src))):
                  ot = opening_tag(src, d.start() + 1)
                  cl = closing_for(src, ot[0], ot[1], ot[2])
                  if cl:
                      src = src[:cl[0]] + f'</{name}>' + src[cl[1]:]
                  src = src[:d.start()] + src[d.end():]
                  src = src[:ot[0]] + f'<{name}' + src[ot[0] + 1 + len(ot[2]):]
                  # styled's own `as` would replace the wrapped component; pass it through instead.
                  tag_end = opening_tag(src, ot[0] + 1)[1]
                  src = src[:ot[0]] + re.sub(r'(\s)as=', r'\1forwardedAs=', src[ot[0]:tag_end], count=1) + src[tag_end:]
              mm = re.search(r'^const ' + const + r'\b[^\n]*\{[^{}]*\}[^\n]*\n', src, re.M)
              src = src[:mm.start()] + decl + src[mm.end():]
              changed = True
        if changed:
            if not re.search(r"^import styled\b[^\n]*from 'styled-components'", src, re.M):
                src = "import styled from 'styled-components'\n" + src
            open(f, 'w').write(src)

print(f'convertible {len(done)}, skipped {len(skipped)}')
print('tags', sorted({t for *_, t, _ in done}))
from collections import Counter
print('skip reasons', dict(Counter(r[2].split(' [')[0] for r in skipped)))
for f, c, n, t, k in done[:12]:
    print('  ', f.split('/src/')[1], c, '->', n, f'({t} x{k})')
