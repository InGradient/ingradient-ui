#!/usr/bin/env bash
# Builds the 4px foundation trial variants from the isolated worktree and serves them.
set -u
W=/tmp/rt/base
cd "$W" || exit 1
apply() {
python3 - "$1" <<'EOF'
import re, sys
v = sys.argv[1]
def sub(path, pairs):
    s = open(path).read()
    for a, b in pairs:
        n = len(re.findall(a, s))
        assert n >= 1, (path, a)
        s = re.sub(a, b, s, count=1)
    open(path, 'w').write(s)
if v in ('spacing', 'all'):
    m = {"'3px'": '4px', "'1Plus'": '4px', '2': '8px', "'2Plus'": '8px', '4': '8px', '6': '12px', '8': '16px', '10': '24px', '12': '32px'}
    sub('src/tokens/core/spacing.ts', [(rf"(\n  {re.escape(k)}: )'[-0-9]+px'", rf"\g<1>'{val}'") for k, val in m.items()])
if v in ('icon', 'all'):
    s = open('src/tokens/core/icon-sizes.ts').read()
    for k, val in {"'2xs'": 12, 'xsPlus': 12, 'sm': 16, 'smPlus': 16, 'lg': 16, "'2xl'": 24}.items():
        s, n = re.subn(rf"(\n  {re.escape(k)}: )'?\d+(px')?", lambda mo: mo.group(1) + (f"'{val}px'" if mo.group(2) else str(val)), s, count=2)
        assert n == 2, k
    open('src/tokens/core/icon-sizes.ts', 'w').write(s)
if v in ('radius', 'all'):
    sub('src/tokens/core/radius.ts', [(rf"(\n  {re.escape(k)}: )'[0-9]+px'", rf"\g<1>'{val}'") for k, val in
        {"'2xs'": '4px', 'xxs': '8px', 'xs': '8px', 'sm': '8px', 'md': '8px', 'lg': '12px', 'xl': '16px', "'2xl'": '12px', "'4xl'": '16px'}.items()])
    sub('src/tokens/modes/build-theme.ts', [(r"sm: radiusScale\.xs,", 'sm: radiusScale.sm,'),
        (r"lg: radiusScale\['2xl'\],", 'lg: radiusScale.lg,'), (r"xl: radiusScale\['4xl'\],", 'xl: radiusScale.xl,')])
    p = '.storybook/preview.tsx'
    s = open(p).read()
    s = "import { SurfaceDepthProvider } from '../src/primitives'\n" + s
    a = "          {inner}\n        </PresetProvider>"
    assert s.count(a) == 1
    s = s.replace(a, "          <SurfaceDepthProvider>{inner}</SurfaceDepthProvider>\n        </PresetProvider>")
    open(p, 'w').write(s)
print('applied', v)
EOF
}
declare -A PORT=([all]=6060 [spacing]=6061 [icon]=6062 [radius]=6063)
for v in spacing icon radius all; do
  git checkout -q -- . && apply "$v" || { echo "apply $v failed"; continue; }
  git diff --stat | tail -1
  git diff > "/tmp/rt/foundations-$v.patch"
  mise exec node@20 -- npx storybook build -o "/tmp/rt/sb-f-$v" --quiet > "/tmp/rt/build-f-$v.log" 2>&1
  echo "$v build exit $?"
  setsid -f python3 -m http.server "${PORT[$v]}" --bind 100.105.177.42 --directory "/tmp/rt/sb-f-$v" >/dev/null 2>&1
done
git checkout -q -- .
echo "worktree dirty files: $(git status --short | grep -v node_modules | wc -l)"
echo done
