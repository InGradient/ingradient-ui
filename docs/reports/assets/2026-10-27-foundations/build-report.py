import json, re, html, os

ROOT = '/home/homebodify/Projects/ingradient-ui'
A = 'assets/2026-10-27-foundations/'
css = re.search(r'<style>([\s\S]*?)</style>', open(f'{ROOT}/docs/reports/2026-10-05-work-report.ko.html').read()).group(1)
m = json.load(open(f'{ROOT}/docs/reports/{A}measure.json'))
e = lambda s: html.escape(str(s))
H = 'http://omarchy.tail3e2097.ts.net'

def sb(port, story, label):
    return f'<a href="{H}:{port}/?path=/story/{story}">{label}</a>'

TITLES = {'settings': 'Settings 모달', 'catalog': 'Dataset Catalog', 'class': 'Class Management', 'dashboard': 'Dashboard',
          'create': 'Create Project', 'login': 'Login', 'buttons': 'Button 컴포넌트', 'iconbuttons': 'IconButton 컴포넌트'}

def legend(name):
    v = m[name]
    rows = []
    for i, (c, r) in enumerate(zip(v['cur'], v['rec'])):
        if c.get('missing') or r.get('missing'):
            continue
        ch = []
        if c['radius'] != r['radius']: ch.append(f"모서리 {c['radius']}→{r['radius']}px")
        if (c['w'], c['h']) != (r['w'], r['h']): ch.append(f"크기 {c['w']}×{c['h']}→{r['w']}×{r['h']}")
        if c.get('icon') and c['icon'] != r['icon']: ch.append(f"아이콘 {c['icon']}→{r['icon']}px")
        if c['padX'] != r['padX']: ch.append(f"좌우 여백 {c['padX']}→{r['padX']}")
        rows.append(f"<li><b class='n'>{i + 1}</b> {e(c['role'])}: {e(', '.join(ch) or '변화 없음')}</li>")
    return '<ol class="legend">' + ''.join(rows) + '</ol>'

shots = ''.join(
    f"<h3>{e(TITLES[n])}</h3><figure><img src='{A}{n}-compare.png' alt='{e(TITLES[n])} 비교'><figcaption>왼쪽 지금(주황), 오른쪽 추천안 합본(청록). 번호는 같은 요소다. "
    f"{sb(6057, m[n]['id'], '지금 열기')} · {sb(6060, m[n]['id'], '추천안 열기')}</figcaption></figure>{legend(n)}"
    for n in TITLES)

DECISIONS = [
    ('간격 단계', '4px 단계(4·8·12·16·20·24·32·40·48)와 광학 보정용 2px', '채택해 진행', '지금 15단계(5·6·7·10·14·18·22px 포함)를 4의 배수로 모은다'),
    ('지금 간격을 어디로 보낼지', '6·7→8, 10→8, 14→12, 18→16, 22→24, 28→32, 5→4, 3px→4', '채택(시험 6061·6060)', '작은 간격은 8로 키우고 중간 간격은 줄여 가장 많이 쓰는 4·8·12·16에 모음. 내림·올림 일괄 변환은 앞서 시험해 비추천'),
    ('간격 토큰 이름', '새 이름 `--ig-spacing-{px}`(예: `--ig-spacing-8` = 8px)를 만들고 기존 `--ig-space-*`는 사용 중단 표시', '추천, 아직 적용 안 함', '기존 이름의 값을 바꾸면 `space-3`이 8→12px처럼 1,600여 곳의 뜻이 조용히 바뀐다. 이름=값이면 혼동이 없다'),
    ('의미 간격 토큰', '컨트롤 안 4 · 관련 항목 사이 8 · 카드 안쪽 16 · 섹션 사이 24 · 페이지 가장자리 24', '추천, 아직 적용 안 함', '컴포넌트가 숫자 대신 역할을 고르게 하면 같은 역할의 간격이 갈라지지 않는다'),
    ('모서리', '깊이 1·2·3 = 16·12·8px, 버튼·입력창 8px, 작은 요소 4px, 알약 999px', '채택(시험 6063·6060)', '4의 배수이고 바깥이 안쪽보다 둥글다. 작은 요소 6px는 4의 배수가 아니라 4px로'),
    ('아이콘', '12·16·20·24px, 기본 16px. 28·32px 컨트롤은 16, 40px는 20, 48px 이상은 24', '채택(시험 6062·6060)', '선 아이콘(lucide)은 24px 격자로 그려져 16·20·24에서 선명하다. 14·18px는 흐려진다'),
    ('컨트롤 높이', '밀도별 값 유지(compact 28·32·40). 안 쓰는 30·34px 토큰 삭제, 같은 값 이름(xs=sm=28, mid-plus=lg=40) 정리', '추천, 아직 적용 안 함', '값은 이미 4의 배수다. 문제는 이름이 겹치는 것'),
    ('버튼 안쪽', '좌우 여백 8·12·16px(작음·보통·큼), 아이콘-글자 간격 28px 이하 4·그 이상 8px', '간격 시험에 일부 반영', '지금 좌우 여백 8·14·18·22px는 14·18·22가 4의 배수가 아니다'),
    ('테두리', '1px(경계)·2px(포커스와 강조) 두 가지. 1.5px(2곳) 없앰. 3px(6곳: 세로 탭 선택 표시, 드롭 영역 점선 등)는 2px로', '추천, 아직 적용 안 함', '포커스는 지금 규칙대로 안쪽 2px'),
    ('글자 크기', '11(작은 겹침 표시만)·12·13·14·16·20·24px. 10→11, 15→16, 18→20, 22(미사용) 삭제, 28→24', '추천, 아직 적용 안 함', '13·12px가 가장 많이 쓰여(199·188회) 조밀한 화면 성격은 유지'),
    ('줄 높이', '배수 대신 px: 11·12→16, 13·14→20, 16→24, 20→28, 24→32', '추천, 아직 적용 안 함', '13px × 1.5 = 19.5px처럼 배수는 4px 격자를 벗어난다'),
    ('크기·위치에 남의 토큰 빌려 쓰기', '체크박스 크기·토글 손잡이 위치처럼 다른 축 토큰을 쓰는 곳을 각자 축의 토큰으로 옮김', '추천, 아직 적용 안 함', '지금은 간격과 아이콘 중 하나만 바꿔도 토글 손잡이가 어긋난다(아래 4절)'),
    ('폰트 IBM Plex 로드', '<b>의견 필요.</b> 패키지 의존성 추가가 따르므로 제가 정하지 않았다', '결정 대기', '`DESIGN.md`는 IBM Plex라고 하지만 로드하는 코드가 없어, 이 PC에서는 Liberation Sans로 보인다'),
]
drows = ''.join(f'<tr><td>{i + 1}</td><td>{e(q)}</td><td>{rec}</td><td>{e(st)}</td><td>{e(why)}</td></tr>' for i, (q, rec, st, why) in enumerate(DECISIONS))

FINAL = '\n<h2 id="final">0. 최종 결과 (밤사이 6단계 완료)</h2>\n<p>합의한 순서(표면 깊이 → 기초 값 → <code>DESIGN.md</code> → 공용 컴포넌트 → Platform → Edge)를 끝까지 진행했다. 브랜치 <code>feat/surface-depth</code>, push·PR 없음. 아래 1~7절은 밤사이 앞부분에 쓴 제안 기록이고, 이 절이 최종 상태다.</p>\n<h3>Simon이 확인할 것</h3>\n<ol>\n<li><b>4px 값이 적용된 화면</b>(0-2): 버튼 좌우 여백이 18→12px로 좁아지고, 모서리가 24→16·20→12px로, 체크박스가 18→16px로 바뀌었다.</li>\n<li><b>줄 높이 px(D11)</b>: <code>Text</code>·<code>Heading</code>에서만 글자 크기와 짝지은 px(16·20·24·28·32)를 쓴다. <code>body</code>와 개별 컴포넌트의 배수 줄 높이 49곳은 그대로다(<code>body</code>를 px로 바꾸면 큰 제목이 작은 줄 높이를 물려받아 겹친다).</li>\n<li><b>폰트</b>(0-3): IBM Plex Sans·Sans KR이 실제로 적용됐다. 이전에는 이 PC에서 영문 Liberation Sans, 한글은 일본어용 Noto Sans CJK JP로 그려졌다. Mac에서도 같은 폰트로 보이는지 확인해 주세요.</li>\n<li><b>Edge 구성</b>(0-4): 카드 → Platform과 같은 선으로 나눈 구성, 밑줄 탭, 로그 줄 배경 제거(오류만 강조).</li>\n<li><b>시각 기준선</b>: 거의 모든 화면이 바뀌어 visual 테스트는 CI(ubuntu) 캡처로 새 기준선을 받고 승인해야 한다. 로컬에서 갱신하지 않았다. push·PR이 필요하다.</li>\n<li><b>원인을 다 못 본 것</b>: 위치 기준 위계 검사에서 Settings Storage 로딩(같음 3), Settings Edge 가져오기 업로드(같음 1), Edge 시스템 정리(같음 1)는 원인을 확인하지 않았다. 나머지 남은 쌍은 팝오버·메뉴·확인창이 겹쳐 보이는 경우다.</li>\n<li><b>브랜치 나누기</b>: <code>refactor/space-props-and-removable-list</code> → <code>fix/broken-controls</code> → <code>feat/surface-depth</code>가 순서대로 쌓여 있다. PR을 어떻게 나눌지 정해 주세요.</li>\n</ol>\n<h3>0-1. 커밋과 검증</h3>\n<table><tr><th>시각</th><th>커밋</th><th>내용</th></tr><tr><td>23:19</td><td><code>b497769</code></td><td>docs(reports): 모서리 위계를 중첩 깊이로 정하는 표면 깊이 설계안을 추가한다</td></tr><tr><td>23:56</td><td><code>73a7405</code></td><td>feat(primitives): 표면 깊이를 전달하는 SurfaceDepthProvider와 깊이별 모서리 토큰을 추가한다</td></tr><tr><td>00:37</td><td><code>81e18ef</code></td><td>feat(components): 공용 표면 10개가 표면 깊이를 읽어 모서리를 정하게 한다</td></tr><tr><td>00:45</td><td><code>d7aacdd</code></td><td>docs(reports): 4px 기초 값 제안과 시험 비교를 리포트로 남긴다</td></tr><tr><td>00:46</td><td><code>738f4e0</code></td><td>docs(reports): 크기에 다른 축 토큰을 빌려 쓰는 곳 72건을 리포트에 추가한다</td></tr><tr><td>00:48</td><td><code>fb17db8</code></td><td>docs: 4px 기초 값과 기본 컴포넌트 규칙으로 DESIGN.md 재작성 초안을 만든다</td></tr><tr><td>00:49</td><td><code>8068949</code></td><td>docs(reports): 공용 컴포넌트 단계의 작업 목록을 리포트에 추가한다</td></tr><tr><td>02:02</td><td><code>810c4a6</code></td><td>feat(tokens): 4px 간격 토큰과 컴포넌트 크기 토큰을 추가하고 빌려 쓰던 크기를 옮긴다</td></tr><tr><td>02:19</td><td><code>e725981</code></td><td>fix(platform-pages): Catalog 오른쪽 패널 섹션 제목을 h2로 올려 접힌 사이드바에서도 제목 순서를 지킨다</td></tr><tr><td>02:19</td><td><code>3a780a4</code></td><td>feat: IBM Plex Sans·Sans KR·Mono를 패키지에서 불러와 어느 컴퓨터에서나 같은 폰트로 보이게 한다</td></tr><tr><td>02:51</td><td><code>7f71ae2</code></td><td>feat(tokens): 간격·아이콘·모서리·크기·글자를 4px 기준 값으로 바꾼다</td></tr><tr><td>03:06</td><td><code>4639514</code></td><td>feat(platform-pages): Platform 화면에 표면 깊이를 켜고 모서리 위계를 막던 덮어쓰기를 정리한다</td></tr><tr><td>03:21</td><td><code>3871220</code></td><td>feat(edge-pages): Edge 레이아웃을 카드에서 Platform과 같은 선으로 나눈 구성으로 바꾼다</td></tr><tr><td>03:22</td><td><code>4379689</code></td><td>style(edge-pages): 로그 줄을 Platform 목록처럼 투명하게 두고 오류만 강조한다</td></tr></table>\n<p>모든 코드 커밋 뒤 타입·린트·단위(483)·정적 검사·패키지 빌드·공개 export를 통과했다. 공용 컴포넌트를 바꾼 커밋은 전체 Storybook 888개를 돌렸다. 화면이 바뀌지 않아야 하는 커밋(<code>73a7405</code>, <code>81e18ef</code>, <code>810c4a6</code>)은 전체 스토리 픽셀 비교로 변화 0을 확인했다. 밤사이 찾은 회귀 1건(<code>7914df9</code>의 inert로 Catalog 제목 순서가 깨짐)은 <code>e725981</code>에서 고쳤다.</p>\n<table><tr><th>위계 검사</th><th>전</th><th>후</th></tr>\n<tr><td>Platform 128 스토리, 위치 기준 같음/역전</td><td>81 / 84 (깨진 스토리 38)</td><td>12 / 2 (8)</td></tr>\n<tr><td>Platform, DOM 구조 기준 위반</td><td>—</td><td>0 / 292쌍</td></tr>\n<tr><td>Edge 59 스토리, 위치 기준 같음/역전</td><td>37 / 5</td><td>1 / 0</td></tr></table>\n<h3>0-2. 4px 값 적용 전후(폰트 적용 후 → 값 적용 후)</h3>\nVALUESHOTS\n<h3>0-3. 폰트</h3>\n<figure><img src="assets/2026-10-27-foundations/font-settings-compare.png" alt="폰트 비교 Settings"><figcaption>Settings 제목과 본문</figcaption></figure>\n<figure><img src="assets/2026-10-27-foundations/font-edge-log-compare.png" alt="폰트 비교 Edge 로그"><figcaption>Edge 로그: 영문과 한글이 섞인 줄</figcaption></figure>\n<h3>0-4. Edge: 카드 → Platform 구성</h3>\nEDGESHOTS\n<h3>0-5. 남은 이전 작업(DESIGN.md의 받아들인 부채)</h3>\n<ul><li>기존 간격 토큰 이름 <code>--ig-space-*</code>(CSS 약 1,650곳, JSX 약 330곳). 값은 이미 4px로 바뀌었고, 이름만 <code>--ig-spacing-{px}</code>로 옮기면 된다.</li>\n<li>역할 간격 토큰(<code>--ig-gap-*</code>, <code>--ig-inset-*</code>)은 만들었지만 Button 아이콘 간격 외에는 아직 쓰지 않는다.</li>\n<li>깊이별 배경·그림자는 시험 뒤 적용(모서리만 먼저 적용).</li>\n<li>안 쓰는 컨트롤 높이 토큰(30·34px, 겹치는 <code>mid-plus</code>)은 공개 이름이라 다음 breaking release에서 삭제.</li></ul>\n'
import glob as _g
VT={'settings':'Settings 모달','catalog':'Dataset Catalog','class':'Class Management','dashboard':'Dashboard','create':'Create Project','login':'Login','buttons':'Button','iconbuttons':'IconButton','edgecapture':'Edge 캡처','edgedataset':'Edge 데이터셋 선택','edgelogin':'Edge 로그인'}
ET={'edgecapture':'Edge 캡처','edgeimages':'Edge 이미지','edgestatics':'Edge 통계','edgesettings':'Edge 설정','edgedataset':'Edge 데이터셋 선택','edgelogin':'Edge 로그인'}
FINAL = FINAL.replace('VALUESHOTS', ''.join(f"<figure><img src='{A}values/{k}-compare.png' alt='{v}'><figcaption>{v}</figcaption></figure>" for k,v in VT.items()))
FINAL = FINAL.replace('EDGESHOTS', ''.join(f"<figure><img src='{A}edge/{k}-compare.png' alt='{v}'><figcaption>{v}</figcaption></figure>" for k,v in ET.items()))
body = f'''
<h1>4px 기초 값, 밤사이 진행 결과, 10-27 낮 Platform 정리</h1>
<p class="muted">2026-10-27 · 브랜치 <code>feat/surface-depth</code> · push·PR 없음. 진행 기록은 <code>docs/reports/2026-10-27-overnight-progress.ko.md</code>.</p>
<div class="note"><b>요약.</b> 표면 깊이 1단계까지 마쳤고(화면 변화 0 확인), 합의한 대로 Platform 적용 전에 멈췄다. 이어서 간격·모서리·아이콘을 4px 기준으로 다시 정한 추천값을 시험 빌드로 만들어 지금과 비교했다. 결정이 필요한 곳은 제 추천을 채택해 진행했고, 아래 1절에 모두 모았다. 뒤집으실 항목만 알려주시면 된다.</div>

<nav class="toc"><ol>
<li><a href="#day">10-27 낮 작업과 어제 저녁 대비 상세 비교</a></li><li><a href="#final">최종 결과와 확인할 것</a></li><li><a href="#decide">의견이 필요했던 것과 제 추천</a></li><li><a href="#done">밤사이 한 일</a></li>
<li><a href="#compare">화면 비교(번호 박스)</a></li><li><a href="#coupling">구조 문제: 남의 토큰 빌려 쓰기</a></li>
<li><a href="#trials">시험 빌드와 재현</a></li><li><a href="#next">다음 단계</a></li><li><a href="#worklist">4번 단계(공용 컴포넌트) 작업 목록</a></li></ol></nav>

<h2 id="decide">1. 의견이 필요했던 것과 제 추천</h2>
<p>"채택"은 시험 빌드에 반영해 진행한 것, "추천"은 제안만 하고 코드에 넣지 않은 것이다. 제품 코드에 들어간 것은 아직 없다(표면 깊이 장치 제외, 화면 변화 0).</p>
<table><tr><th>#</th><th>질문</th><th>제 추천</th><th>상태</th><th>근거</th></tr>{drows}</table>

<h2 id="done">2. 밤사이 한 일</h2>
<table><tr><th>커밋</th><th>내용</th><th>확인</th></tr>
<tr><td><code>b497769</code></td><td>표면 깊이 설계안 문서</td><td>Platform 128개 스토리 측정 근거 포함</td></tr>
<tr><td><code>73a7405</code></td><td>0단계: <code>SurfaceDepthProvider</code>, 깊이 토큰 16·12·8px</td><td>전체 스토리(안정 875개) 화면 변화 0, 단위 474</td></tr>
<tr><td><code>81e18ef</code></td><td>1단계: 공용 표면 10개가 깊이를 읽음</td><td>전체 스토리 화면 변화 0(다르게 나온 3개는 같은 빌드끼리도 달라지는 진행 막대·타이밍 노이즈), 단위 478, Storybook 브라우저 28</td></tr></table>
<p>1단계에서 <code>MediaDialogContent</code>는 뺐다. 좁은 화면에서 모서리를 0으로 만드는 미디어 쿼리가 있어 화면 적용 단계에서 함께 처리한다.</p>

<h2 id="compare">3. 화면 비교</h2>
<p>추천안 합본(간격+모서리+아이콘)을 지금과 같은 화면 크기(1440×900)로 찍었다. 시험은 토큰 값만 바꿔 두 빌드의 DOM이 같으므로, 번호 박스는 DOM 경로로 짝지은 <b>같은 요소</b>다. 각 화면의 대표 요소를 자동으로 골랐다(가장 큰 둥근 상자, 그 안의 상자, 글자 버튼, 아이콘 버튼, 입력창, 작은 요소).</p>
<h3>모서리 확대(4배)</h3>
<figure><img src="{A}corners-zoom.png" alt="모서리 확대 비교"><figcaption>모달·카드 바깥 24→16px, 안쪽 20→12px, 버튼 10→8px.</figcaption></figure>
{shots}
<h3>비교에서 보인 것</h3>
<ul>
<li><b>Dashboard와 Class는 바깥과 안쪽 모서리가 아직 같다</b>(Dashboard 16=16, Class 참조 이미지 8=8). 위젯 껍데기와 참조 이미지 틀이 아직 깊이를 읽지 않는 컴포넌트라서다. 화면별 적용 단계에서 고친다.</li>
<li>체크박스가 18→16px로 작아졌다. 크기를 아이콘 토큰으로 정하고 있어서다(4절).</li>
<li>화면 높이는 거의 그대로다(Create 1080→1077px). 대부분 화면이 뷰포트 높이에 고정돼 있어, 간격 변화는 높이보다 안쪽 배치로 나타난다.</li>
<li>토큰 값만 바꾼 근사치다. 의미 간격 토큰과 역할별 판단은 반영되지 않았다.</li>
</ul>

<h2 id="coupling">4. 구조 문제: 다른 축의 토큰을 빌려 쓰는 곳</h2>
<p><code>src/components/inputs/toggles.tsx</code>에서 확인했다.</p>
<table><tr><th>요소</th><th>쓰는 토큰</th><th>값</th><th>문제</th></tr>
<tr><td>체크박스 크기(53~54행)</td><td><code>icon-lg</code></td><td>18px</td><td>아이콘 크기를 바꾸면 체크박스가 같이 바뀐다</td></tr>
<tr><td>토글 손잡이 크기(33~34행)</td><td><code>icon-lg</code></td><td>18px</td><td rowspan="2">손잡이 크기는 아이콘, 위치는 간격 토큰이다. 둘 중 하나만 바꾸면 손잡이가 트랙에서 어긋난다</td></tr>
<tr><td>토글 켜짐 위치(32행)</td><td><code>space-8</code></td><td>18px</td></tr>
<tr><td>토글 트랙(15~16행)</td><td><code>control-height-mid-plus</code>, <code>icon-3xl</code></td><td>40×24px</td><td>너비는 컨트롤 높이, 높이는 아이콘 토큰</td></tr></table>
<p><b>전수 조사(검사가 위 체크박스 사례를 잡는지 먼저 확인함):</b> 크기(<code>width</code>/<code>height</code>)에 아이콘 토큰을 쓴 곳이 36건(13개 파일), 간격 토큰을 쓴 곳이 36건(19개 파일)이다. 아이콘 토큰 쪽 예: Catalog 이미지 카드 메뉴 버튼(18px), 알림 배지, 개수 배지, 단축키 표시. 간격 토큰 쪽 예: 상태 점(6px), 상태 원(12px). 간격 쪽에는 화면 읽기 전용 1px 처리처럼 정상인 것도 섞여 있다. <a href="assets/2026-10-27-foundations/borrowed-size-tokens.json">전체 목록</a>. 위치 여백(<code>top</code>/<code>right</code>에 간격 토큰)은 정상이라 세지 않았다.</p>
<p>이런 곳이 있으면 간격·아이콘·컨트롤을 따로 정리할 수 없다. 공용 컴포넌트 단계(4번)에서 컴포넌트 크기 토큰(예: <code>--ig-checkbox-size</code>, <code>--ig-switch-*</code>)으로 옮기는 것을 추천한다. </p>

<h2 id="trials">5. 시험 빌드와 재현</h2>
<table><tr><th>포트</th><th>내용</th></tr>
<tr><td>6057</td><td>지금(1단계 커밋, 화면은 지금과 같음)</td></tr>
<tr><td>6060</td><td>추천안 합본: 간격 + 모서리(깊이 Provider 켬) + 아이콘</td></tr>
<tr><td>6061</td><td>간격만</td></tr><tr><td>6062</td><td>아이콘만</td></tr><tr><td>6063</td><td>모서리만</td></tr></table>
<p>시험 서버는 <code>/tmp</code> 빌드라 재부팅하면 사라진다. 재현 자료는 <code>{A}</code>에 있다: 시험 패치(<code>patches/</code>), 빌드 스크립트(<code>foundations-trials.sh</code>), 측정·캡처(<code>capture-measure.mjs</code>, <code>measure.json</code>), 주석(<code>annotate-found.mjs</code>, <code>zoom-corners.mjs</code>). 모서리 시험은 Storybook 미리보기 전체에 Provider를 켜서 Edge 스토리도 바뀐다. 실제 적용 때는 Platform만 켠다.</p>

<h2 id="next">6. 다음 단계</h2>
<ol>
<li>1절에서 뒤집을 항목을 알려주시면 그 값으로 바꾼다.</li>
<li><code>DESIGN.md</code> 재작성 초안을 만들었다: <code>DESIGN.draft.md</code>(저장소 루트). 색·모션·접근성·Platform 계약은 유지하고, 3~9절(글자, 간격, 모양, 크기, 테두리·포커스, 표면, 컴포넌트 규칙)을 위 추천값으로 새로 썼다. 값마다 결정 번호(D1~D13)와 상태(코드에 있음/제안)를 붙였다. 값이 코드에 들어간 뒤 <code>DESIGN.md</code>와 교체한다.</li>
<li>공용 컴포넌트 수정 → Platform 화면별 적용 → Edge 순서는 그대로다.</li>
</ol>

<h2 id="worklist">7. 4번 단계(공용 컴포넌트) 작업 목록</h2>
<p>공용 컴포넌트는 Platform과 Edge가 함께 쓰므로 바꾸면 Edge 화면도 바뀐다. 밤사이에는 Edge 화면을 바꾸지 않기로 해서 코드는 건드리지 않고 목록만 만들었다. 숫자는 <code>feat/surface-depth</code> 기준으로 센 값이다.</p>
<table><tr><th>#</th><th>작업</th><th>범위</th><th>결정</th></tr>
<tr><td>1</td><td>새 토큰 추가(<code>--ig-spacing-*</code>, 의미 간격, 컴포넌트 크기, 글자·줄 높이). 아직 아무도 쓰지 않으므로 화면 변화 0</td><td>토큰 파일</td><td>D1·D3·D4·D10·D11·D12</td></tr>
<tr><td>2</td><td>크기에 다른 축 토큰을 빌려 쓰는 곳을 컴포넌트 크기 토큰으로</td><td>72건(아이콘 36·간격 36)</td><td>D12</td></tr>
<tr><td>3</td><td>숫자로 넣은 아이콘 크기를 아이콘 토큰으로</td><td>10곳, 8개 파일(검색창, 복사 버튼, 날짜 선택, 표 등)</td><td>D6</td></tr>
<tr><td>4</td><td>Button 좌우 여백과 아이콘-글자 간격</td><td><code>button-types.ts</code>, <code>button-root.tsx</code></td><td>D8</td></tr>
<tr><td>5</td><td>compact 밀도 <code>xs</code> 24px, 안 쓰는·겹치는 높이 토큰 정리</td><td>밀도 토큰</td><td>D7</td></tr>
<tr><td>6</td><td>테두리 1.5·3px를 2px로</td><td>8곳</td><td>D9</td></tr>
<tr><td>7</td><td>아직 깊이를 읽지 않는 표면을 깊이 인식으로(대시보드 위젯 껍데기, 참조 이미지 틀, 페이지 패널, 사이드바 등)</td><td>분류 53곳 중 남은 43곳 + 위젯 <code>Card</code> 2곳</td><td>D5</td></tr>
<tr><td>8</td><td><code>MediaDialogContent</code> 깊이 적용과 좁은 화면 모서리 0 유지</td><td>1곳</td><td>D5</td></tr>
<tr><td>9</td><td>기존 간격 토큰 사용처를 새 토큰으로(화면별 이전 단계에서)</td><td>CSS 1,646곳 + JSX 327곳</td><td>D1~D4</td></tr></table>
<p>진행 순서 제안: 1번(화면 변화 0, 표면 깊이 0단계와 같은 방식으로 검증) → 2~6번(컴포넌트별로 Storybook에서 확인) → 7~9번은 화면별 이전(5번 단계)과 함께.</p>
'''
DAY = open(f'{ROOT}/docs/reports/{A}day-section.html').read()
body = body.replace('<h2 id="decide">', DAY + FINAL + '<h2 id="decide">', 1)
out = f'<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>4px 기초 값 제안</title><style>{css}</style></head><body><main>{body}</main></body></html>'
open(f'{ROOT}/docs/reports/2026-10-27-foundations-report.ko.html', 'w').write(out)
print('written', len(out))
