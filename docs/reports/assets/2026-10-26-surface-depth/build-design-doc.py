import json, re, html

ROOT = '/home/homebodify/Projects/ingradient-ui'
A = 'assets/2026-10-26-surface-depth/'
css = re.search(r'<style>([\s\S]*?)</style>', open(f'{ROOT}/docs/reports/2026-10-05-work-report.ko.html').read()).group(1)
nest = json.load(open(f'{ROOT}/docs/reports/{A}nesting-all-platform-stories.json'))
roles = json.load(open(f'{ROOT}/docs/reports/{A}radius-usage-by-role.json'))
e = lambda s: html.escape(str(s))

# ---- numbers from data -------------------------------------------------------
st = [r for r in nest if r.get('stable')]
withn = [r for r in st if r['n'] > 0]
pairs = sum(r['n'] for r in withn)
ok = sum(r['ok'] for r in withn)
eq = sum(r['eq'] for r in withn)
inv = sum(r['inv'] for r in withn)
bad = sorted([r for r in st if r['eq'] + r['inv'] > 0], key=lambda r: -(r['eq'] + r['inv']))
def area(i):
    a = i.replace('pages-platform-0-0-1-', '')
    for p, n in [('dataset-catalog', 'Dataset Catalog'), ('class-management', 'Class Management'), ('dashboard', 'Dashboard'),
                 ('settings-modal', 'Settings Modal'), ('create-project', 'Create Project'), ('auth', 'Auth')]:
        if a.startswith(p): return n
    return '?'
areas = {}
for r in bad:
    x = areas.setdefault(area(r['id']), {'n': 0, 'eq': 0, 'inv': 0})
    x['n'] += 1; x['eq'] += r['eq']; x['inv'] += r['inv']
assert len(nest) == 128 and len(bad) == 38, (len(nest), len(bad))

ORDER = ['모달·다이얼로그 껍데기', '도킹 사이드바·패널', '카드·섹션', '팝오버·메뉴', '컨트롤·툴바']
TARGET = {'모달·다이얼로그 껍데기': '깊이 1 (떠 있는 표면, 새로 시작)', '도킹 사이드바·패널': '깊이 1 (도킹)',
          '카드·섹션': '깊이 2 또는 3 (놓인 위치에 따라)', '팝오버·메뉴': '깊이 1 (떠 있는 표면, 새로 시작)', '컨트롤·툴바': '깊이와 무관 (컨트롤 고정값)'}
rolerows = []
for k in ORDER:
    v = [r for r in roles if r['role2'] == k]
    toks = {}
    for r in v: toks[r['tok']] = toks.get(r['tok'], 0) + 1
    ar = {}
    for r in v: ar[r['area']] = ar.get(r['area'], 0) + 1
    names = sorted({r['name'] or r['f'].split('/')[-1] for r in v})
    rolerows.append(f"<tr><td>{e(k)}</td><td>{len(v)}</td><td>{e(', '.join(f'{t} {n}' for t, n in sorted(toks.items())))}</td>"
                    f"<td>{e(', '.join(f'{a} {n}' for a, n in ar.items()))}</td><td>{e(TARGET[k])}</td><td><code>{e(', '.join(names[:9]))}{' …' if len(names) > 9 else ''}</code></td></tr>")
assert sum(1 for r in roles if r['role2'] in ORDER) == 53

badrows = ''.join(
    f"<tr><td>{e(area(r['id']))}</td><td><code>{e(r['id'].replace('pages-platform-0-0-1-', ''))}</code></td><td>{r['eq']}</td><td>{r['inv']}</td><td>{e((r['ex'][0] if r['ex'] else ''))}</td></tr>"
    for r in bad)
arearows = ''.join(f"<tr><td>{e(k)}</td><td>{v['n']}</td><td>{v['eq']}</td><td>{v['inv']}</td></tr>" for k, v in sorted(areas.items(), key=lambda x: -x[1]['n']))

body = f'''
<h1>표면 깊이(Surface Depth) 설계안</h1>
<p class="muted">승인됨(진행) · 2026-10-26 작성 · 기준 커밋 <code>ecdaa1f</code>(브랜치 <code>fix/broken-controls</code>) · 이 문서 작성 중 제품 코드는 바꾸지 않았다.</p>

<div class="note"><b>요약.</b> 모서리의 위계는 토큰 값이나 이름이 아니라 <b>무엇이 무엇 안에 있는가</b>로 정해진다. 그래서 상자(표면) 컴포넌트가 자기 깊이를 알고, 깊이에 맞는 모서리를 쓰게 한다. 같은 장치로 배경·그림자·테두리도 정할 수 있다. 깊이 정보를 주는 Provider가 없으면 지금과 똑같이 동작하므로, Platform부터 화면 하나씩 켜고 Edge는 나중에 따로 정한다.</div>

<nav class="toc"><ol>
<li><a href="#problem">문제와 근거</a></li><li><a href="#rule">규칙</a></li><li><a href="#values">깊이별 값(제안)</a></li>
<li><a href="#impl">구현 방식</a></li><li><a href="#phases">단계와 통과 기준</a></li><li><a href="#risks">리스크</a></li>
<li><a href="#decide">결정할 것</a></li><li><a href="#appendix">부록: 위계가 깨진 38개 스토리, 53곳 분류, 측정 방법</a></li></ol></nav>

<h2 id="problem">1. 문제와 근거</h2>
<h3>Platform 전체 측정</h3>
<p>Platform 0.0.1 스토리 128개를 정적 빌드(<code>ecdaa1f</code>)에서 두 번씩 읽어, 두 번의 결과가 같은 {len(st)}개로 판정했다. 다음 표는 둥근 상자가 다른 둥근 상자 안에 있는 경우의 수다.</p>
<table><tr><th>항목</th><th>값</th></tr>
<tr><td>중첩이 있는 스토리</td><td>{len(withn)} / {len(st)}</td></tr>
<tr><td>중첩 쌍</td><td>{pairs}</td></tr>
<tr><td>바깥이 더 둥금(규칙 맞음)</td><td>{ok} ({round(ok/pairs*100)}%)</td></tr>
<tr><td>바깥과 안쪽이 같음</td><td>{eq} ({round(eq/pairs*100)}%)</td></tr>
<tr><td>안쪽이 더 둥금(역전)</td><td>{inv} ({round(inv/pairs*100)}%)</td></tr>
<tr><td>위계가 깨진 스토리</td><td>{len(bad)}</td></tr></table>
<table><tr><th>영역</th><th>깨진 스토리</th><th>같음 쌍</th><th>역전 쌍</th></tr>{arearows}</table>
<p>이 숫자는 실제보다 많다. 위치로 판정해서 ① 패널 위에 뜬 팝오버·대화상자도 "안쪽"으로 세고(예: Settings의 계정 삭제 확인창), ② 할아버지-손자 관계도 한 쌍으로 센다. 그래도 "중첩은 흔하고, 그중 절반 가까이가 규칙을 어긴다"는 결론은 바뀌지 않는다. 대표 사례는 코드로 원인을 확인했다(아래).</p>

<h3>값이나 이름만 바꾸는 시험은 실패했다</h3>
<table><tr><th>시험</th><th>바꾼 것</th><th>결과</th></tr>
<tr><td>(가)</td><td>테마 <code>xl</code> 24→20px</td><td>Settings 모달도 20px가 되어 안쪽 카드(20px)와 같아짐</td></tr>
<tr><td>(나)</td><td>토큰 값을 4·8·12·16px로</td><td>모달과 카드가 둘 다 12px</td></tr>
<tr><td>(다)</td><td>값 변경 + Settings 모달의 덮어쓰기 1줄 삭제</td><td>Settings는 16 &gt; 12 &gt; 8로 해결. Create는 3/3쌍이 같아짐(현재는 3/3 정상)</td></tr>
<tr><td>(라)</td><td>53곳을 역할 이름 토큰으로 교체</td><td>(다)와 같음. Dashboard 역전 5쌍 그대로</td></tr></table>
<p>원인은 코드에서 확인했다.</p>
<ul>
<li><b>같은 역할이 다른 토큰을 쓴다.</b> 카드·섹션 19곳이 <code>lg</code>(20px) 9곳, <code>xl</code>(24px) 8곳, <code>2xl</code>(20px) 2곳.</li>
<li><b>같은 토큰을 다른 역할이 쓴다.</b> <code>xl</code>을 모달, 카드, 사이드바, 팝오버가 모두 쓴다.</li>
<li><b>이름으로는 역할을 알 수 없다.</b> Create Project의 바깥 상자는 이름이 <code>Card</code>지만 실제로는 다른 카드를 감싸는 껍데기다.</li>
<li><b>같은 컴포넌트가 놓인 곳에 따라 깊이가 다르다.</b> 대시보드 위젯은 바깥 <code>Card</code>(<code>radius-xxs</code>, 8px) 안에 <code>BarChartCard</code>를 넣는다. 토큰 하나로는 두 위치를 다르게 표현할 수 없다.</li>
</ul>

<h2 id="rule">2. 규칙</h2>
<ol>
<li><b>표면</b>은 배경·테두리·모서리를 가진 상자다. 가장 바깥 표면이 깊이 1이고, 그 안의 표면은 깊이가 하나씩 늘어난다.</li>
<li><b>떠 있는 표면</b>(모달, 대화상자, 서랍, 팝오버, 메뉴, 토스트)은 어디서 열리든 깊이 1에서 새로 시작한다.</li>
<li><b>선으로 나누는 레이아웃 열</b>(모서리 0인 Catalog 사이드바 같은 열)은 표면이 아니라서 깊이를 올리지 않는다. <span class="muted">(결정 필요 3)</span></li>
<li><b>최대 깊이는 3</b>이다. 깊이 4 이상은 <code>DESIGN.md</code> 7절의 "장식 패널을 다른 장식 패널로 감싸지 않는다"를 어긴 것으로 검사에서 실패한다.</li>
<li><b>컨트롤과 작은 요소</b>(버튼, 입력창, 칩, 체크박스)는 깊이와 관계없이 고정값을 쓴다.</li>
<li><b>불변식:</b> 둥근 표면 안의 둥근 표면은 모서리가 바깥보다 작다. 이 불변식을 DOM 구조 기준 검사로 만들어 CI에서 지킨다.</li>
</ol>

<h2 id="values">3. 깊이별 값(제안)</h2>
<p>모서리 값은 시험 빌드 (다)·(라)에서 화면으로 확인했다. 배경·그림자·테두리는 <b>아직 시험하지 않았고</b>, 지금 쓰는 토큰을 깊이에 배정한 것이다.</p>
<table><tr><th>깊이</th><th>예</th><th>모서리</th><th>배경</th><th>그림자</th><th>테두리</th></tr>
<tr><td>1 · 떠 있음</td><td>모달, 팝오버, 메뉴</td><td>16px</td><td><code>surface-raised</code></td><td>지금 쓰는 <code>floating</code>/<code>popover</code>/<code>menu</code></td><td><code>border-subtle</code></td></tr>
<tr><td>1 · 도킹</td><td>둥근 페이지 패널</td><td>16px</td><td><code>surface-panel</code></td><td>없음</td><td><code>border-subtle</code></td></tr>
<tr><td>2</td><td>카드, 섹션, 위젯</td><td>12px</td><td>부모보다 한 단계 밝게(값은 시험 필요)</td><td>없음</td><td><code>border-subtle</code></td></tr>
<tr><td>3</td><td>카드 안 미리보기 틀, 셀</td><td>8px</td><td>투명 또는 <code>surface-interactive</code></td><td>없음</td><td>없음 또는 <code>border-subtle</code></td></tr>
<tr><td>컨트롤</td><td>버튼, 입력창</td><td>8px</td><td colspan="3">각 컴포넌트가 정함(변경 없음)</td></tr>
<tr><td>작은 요소</td><td>칩, 체크박스</td><td>6px</td><td colspan="3">변경 없음</td></tr>
<tr><td>알약</td><td>배지, 토글</td><td>999px</td><td colspan="3">변경 없음</td></tr></table>
<ul>
<li>현재 섹션 카드(<code>SectionPanel</code>)는 <code>surfacePanel</code> 레시피를 써서 <code>shadow-panel</code>(<code>0 20px 60px</code>)을 갖는다. 깊이 2부터 그림자를 없애면 <code>DESIGN.md</code>의 "그림자는 패널·메뉴·팝오버·서랍·대화상자·토스트에만"과 맞는다.</li>
<li>팝오버 그림자는 파란빛(<code>rgba(77,136,255,.34)</code>)이다. 이것을 유지할지는 결정 5에서 정한다.</li>
<li>깊이 3(8px)과 컨트롤(8px)이 같다. 컨트롤은 표면이 아니라서 불변식에 걸리지 않는다.</li>
</ul>

<h2 id="impl">4. 구현 방식</h2>
<h3>깊이는 React context로 전달한다</h3>
<p>모달과 팝오버는 portal로 DOM 밖에 그려져서 CSS 상속으로는 "어디 안에 있는지"가 끊긴다. React context는 portal을 넘어 이어진다. 그래서 깊이는 context로 전달하고, 화면에 쓰는 값은 CSS 변수로 둔다.</p>
<pre><code>// @ingradient/ui (새 export, 이름은 안)
&lt;SurfaceDepthProvider&gt;          // 켜기. 없으면 지금 값 그대로(legacy)
useSurfaceDepth()               // {{ depth, enabled }}
&lt;SurfaceDepth float&gt;            // 떠 있는 표면: 깊이 1에서 새로 시작
&lt;SurfaceDepth&gt;                  // 일반 표면: 부모 깊이 + 1

// 표면 컴포넌트가 하는 일
data-ig-depth="2"               // 검사·테스트용 표시
border-radius: var(--ig-depth-2-radius)   // 깊이별 토큰</code></pre>
<ul>
<li><b>Provider가 없으면 아무것도 바뀌지 않는다.</b> 표면 컴포넌트는 지금 쓰는 토큰을 그대로 쓴다. 그래서 Edge와 외부 사용처는 영향이 없다.</li>
<li><code>Card</code>는 이미 <code>radius</code> 속성을 받는다(기본값 <code>var(--ig-radius-lg)</code>). 명시한 값이 이긴다. 예외가 필요할 때 쓰되, 위계 검사에서 걸리면 이유를 남긴다.</li>
<li>공개 API는 추가만 하므로 깨지는 변경이 아니다.</li>
</ul>
<h3>바꿔야 할 곳</h3>
<p><code>radius-lg/xl/2xl/4xl</code>을 쓰는 53곳을 코드로 읽어 역할을 분류했다(<a href="{A}radius-usage-by-role.json">전체 목록</a>). 이 분류는 이름이 아니라 컴포넌트 정의를 읽어 정했고, 이름이 모호했던 6곳은 개별로 확인했다.</p>
<table><tr><th>역할</th><th>곳수</th><th>지금 쓰는 토큰</th><th>영역</th><th>깊이 방식에서</th><th>컴포넌트</th></tr>{''.join(rolerows)}</table>
<p>이 53곳 외에 위계가 깨진 원인으로 확인한 곳:</p>
<ul>
<li>대시보드 위젯 바깥 <code>Card</code> 2곳이 <code>radius-xxs</code>(8px): <code>per-dataset-distribution-widget.tsx</code>, <code>source-breakdown-widget.tsx</code>(두 파일은 같은 복사본)</li>
<li>Class Management 참조 이미지: 8px 틀 안에 10px 이미지(15개 스토리)</li>
<li>Catalog 이미지 드롭 상태: 14px 영역 안에 14px 이미지 카드</li>
</ul>

<h2 id="phases">5. 단계와 통과 기준</h2>
<table><tr><th>단계</th><th>내용</th><th>통과 기준</th></tr>
<tr><td>0</td><td>Provider, hook, 깊이 토큰 추가. 아무 컴포넌트도 아직 쓰지 않음</td><td>전체 스토리 픽셀 비교 차이 0(기준 빌드 자기 일치 대조 포함), 단위 테스트</td></tr>
<tr><td>1</td><td>공용 표면(모달, 대화상자, 팝오버, 메뉴, <code>Card</code>, <code>SectionPanel</code>)을 깊이 인식으로</td><td>Provider 없을 때 차이 0. Provider 있을 때 깊이별 값 단위 테스트(jsdom은 CSS 변수를 못 풀므로 값 계산 함수를 직접 테스트)</td></tr>
<tr><td>2</td><td>Platform 화면 하나씩 켜기: Settings → Create → Auth → Class → Catalog → Dashboard</td><td>화면마다 DOM 기준 위계 검사 위반 0, 현재/변경 번호 박스 이미지, 접근성 결과 동일, CI(Ubuntu) 시각 기준선 승인</td></tr>
<tr><td>3</td><td>위계 검사를 CI에 추가, <code>DESIGN.md</code> 7절 갱신</td><td>알려진 위반 사례로 검사가 실패하는지 먼저 확인</td></tr>
<tr><td>4</td><td>Edge 적용</td><td>별도 결정(Edge 카드 vs 선 결정과 함께)</td></tr>
<tr><td>5</td><td>옛 토큰(<code>lg/xl/2xl/4xl</code>) <code>@deprecated</code></td><td>다음 breaking release에서 삭제, 릴리스 노트</td></tr></table>

<h2 id="risks">6. 리스크</h2>
<table><tr><th>리스크</th><th>정도</th><th>대응</th></tr>
<tr><td>Platform 모서리가 넓게 바뀌어 시각 기준선 재승인 필요</td><td>큼</td><td>화면 단위로 진행. 화면마다 비교 이미지로 승인</td></tr>
<tr><td>공용 컴포넌트를 Edge도 씀</td><td>큼</td><td>Provider가 없으면 지금 값 그대로(0·1단계의 통과 기준)</td></tr>
<tr><td>portal로 그려지는 모달·팝오버</td><td>중간</td><td>CSS 상속이 아니라 React context 사용</td></tr>
<tr><td>53곳 + 위 3곳 코드 변경</td><td>중간</td><td><code>Card</code>의 기존 <code>radius</code> 속성 활용, 단계별 커밋</td></tr>
<tr><td>배경·그림자를 같이 바꾸면 화면 인상이 크게 달라짐</td><td>중간</td><td>모서리를 먼저 하고, 배경·그림자는 시험 빌드를 본 뒤 결정(결정 4)</td></tr>
<tr><td>되돌리기</td><td>작음</td><td>옛 토큰을 지우지 않음. Provider를 빼면 원래대로</td></tr></table>

<h2 id="decide">7. 결정할 것</h2>
<div class="note"><b>결정 기록(2026-10-26).</b> 1번(이 방식으로 진행)을 승인받았다. 2~7번은 따로 정하지 않아 이 문서의 제안값으로 진행한다: 모서리 16·12·8px, 모서리 0인 레이아웃 열은 깊이로 세지 않음, 모서리 먼저(배경·그림자·테두리는 시험 빌드 뒤 결정), 팝오버 그림자 유지, Edge는 4단계에서 결정, 최대 깊이 3. 각 값은 단계 진행 중에 바꿀 수 있다.</div>
<ol>
<li>이 방식(깊이 기준)으로 진행할지.</li>
<li>모서리 값 16 · 12 · 8px. 시험 빌드 (다) 6054, (라) 6055에서 확인 가능(임시 서버, 아래 부록).</li>
<li>모서리 0인 레이아웃 열을 깊이로 셀지(규칙 3). 세지 않으면 Catalog 사이드바 안의 카드가 깊이 1(16px)이 된다.</li>
<li>배경·그림자·테두리를 이번 범위에 넣을지, 모서리 먼저 할지.</li>
<li>팝오버의 파란 그림자를 유지할지.</li>
<li>Edge 적용 시점.</li>
<li>최대 깊이 3을 규칙으로 할지.</li>
</ol>

<h2 id="appendix">8. 부록</h2>
<h3>위계가 깨진 38개 스토리</h3>
<p>"같음"과 "역전"은 그 스토리의 중첩 쌍 수다. 예시는 바깥 → 안쪽(⊃)이다. 측정 한계는 1절과 같다.</p>
<table><tr><th>영역</th><th>스토리(<code>pages-platform-0-0-1-</code> 생략)</th><th>같음</th><th>역전</th><th>예시</th></tr>{badrows}</table>
<h3>측정 방법과 재현 자료</h3>
<ul>
<li>대상: Platform 0.0.1 스토리 128개, 1440×900, 애니메이션 끔, 폰트 로드 후 읽음. 각 스토리를 두 번 읽어 결과가 다르면 제외(1개 제외).</li>
<li>판정: 모서리가 있는 120×40px 이상 상자(버튼·입력창 제외) 중, 위치상 다른 상자 안에 들어간 쌍의 모서리 비교.</li>
<li>자료: <a href="{A}nesting-all-platform-stories.json">스토리별 측정 결과</a>, <a href="{A}radius-usage-by-role.json">53곳 역할 분류</a>, <a href="{A}trial-role-tokens.patch">(라) 시험 패치</a>, <a href="{A}trial-token-only-measure.json">(다) 측정</a>, <a href="{A}trial-role-tokens-measure.json">(라) 측정</a>.</li>
<li>시험 서버(임시, <code>/tmp</code> 빌드라 재부팅하면 사라짐): 6050 현재 커밋, 6051 (가), 6052 (나), 6053 (나-2), 6054 (다), 6055 (라). 주소 형식 <code>http://omarchy.tail3e2097.ts.net:&lt;포트&gt;/?path=/story/&lt;스토리 ID&gt;</code>.</li>
</ul>
'''
out = f'<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>표면 깊이 설계안</title><style>{css} pre{{white-space:pre-wrap}}</style></head><body><main>{body}</main></body></html>'
open(f'{ROOT}/docs/reports/2026-10-26-surface-depth-design.ko.html', 'w').write(out)
print('written', len(out), '| stable', len(st), '| nested stories', len(withn), '| pairs', pairs, ok, eq, inv, '| broken', len(bad), '| areas', areas)
