"""Builds the 2026-10-27 daytime section of the foundations report (inserted at the top)."""
import html, json

ROOT = '/home/homebodify/Projects/ingradient-ui'
A = 'assets/2026-10-27-foundations/'
e = html.escape
cmp = json.load(open(f'{ROOT}/docs/reports/{A}detailed/compare.json'))
commits = [l.rstrip('\n').split('|', 2) for l in open(f'{ROOT}/docs/reports/{A}day-commits.txt')]

def fig(src, alt, cap):
    return f"<figure><a href='{A}{src}'><img src='{A}{src}' alt='{e(alt)}'></a><figcaption>{cap}</figcaption></figure>"

def sb(story, label):
    return f"<a href='http://100.105.177.42:6040/?path=/story/{story}'>{label}</a>"

rows = ''.join(f"<tr><td>{t}</td><td><code>{h}</code></td><td>{e(m)}</td></tr>" for h, t, m in commits)

CHANGES = [
    ('d-regions', 'Dashboard 본문을 화면에 붙은 영역으로', '7e87672',
     '<p>Platform 128개 스토리를 검사해 페이지 영역을 카드로 나누는 화면이 Dashboard뿐임을 확인했다. 본문 "Project Overview"가 좌우 20px 띄운 둥근 카드(16px, 그림자)였고, 공용 <code>appShell</code> 바탕에 원형 그라데이션이 있었다. 본문을 화면 끝까지 붙이고 도구 막대와 본문을 1px 선으로 나눴다. 위젯은 그대로 두려고, 아무것도 그리지 않고 깊이 1로만 세는 <code>SurfaceRegion</code>을 추가해 위젯 모서리를 12px로 유지했다.</p>'
     + fig('regions/dashboard-region-compare.png', 'Dashboard 영역', '1 본문 영역, 2 왼쪽 위 그라데이션 제거, 3 도구 막대 아래 선')),
    ('d-forms', 'Login · Signup · Create Project: 단일 폼 화면 간격', '08d8e96, 77615b7, 69dcf63',
     '<p>세 화면이 작업 화면용 조밀한 간격을 쓰고 있었다. 할 일이 하나뿐인 폼 화면이므로 넉넉한 간격으로 바꿨다.</p>'
     '<table><tr><th>위치</th><th>이전</th><th>이후</th></tr>'
     '<tr><td>상자 안쪽</td><td>16</td><td>32</td></tr><tr><td>로고 → 상자, 제목 → 첫 칸, 마지막 칸 → 버튼</td><td>8 / 12 / 8</td><td>24</td></tr>'
     '<tr><td>칸 사이</td><td>8</td><td>16</td></tr><tr><td>라벨 → 칸</td><td>라벨 없음</td><td>8</td></tr><tr><td>버튼 → 하단 링크</td><td>12</td><td>16</td></tr>'
     '<tr><td>입력칸·버튼 높이</td><td>32</td><td>40</td></tr><tr><td>상자 높이 Login / Signup</td><td>242 / 296</td><td>396 / 523</td></tr></table>'
     '<ul><li>로그인·회원가입에 보이는 라벨을 붙였다(Create Project와 같은 <code>FieldLabel</code>, 13px 보통 글자). 안내 글자는 이메일 예시만 남겼다.</li>'
     '<li>주 버튼을 테두리형(<code>accent</code>)에서 다른 화면과 같은 <code>solid</code>로 바꿨다.</li>'
     '<li>Create Project 섹션을 상자 대신 제목과 1px 선으로 나눴다. 입력칸이 상자 가장자리에서 48px이던 것이 32px가 됐다. 유형 선택 카드의 간격 4→8px, 내용 위쪽 정렬.</li>'
     '<li>DESIGN.md에 "작업 화면은 조밀하게, 단일 폼 화면은 넉넉하게" 규칙을 추가했다.</li></ul>'
     + fig('regions/login-form-compare.png', 'Login', 'Login') + fig('regions/signup-form-compare.png', 'Signup', 'Signup')
     + fig('regions/login-final.png', 'Login 최종', 'Login 최종(라벨, solid 버튼)') + fig('regions/create-sections-compare.png', 'Create', 'Create Project 섹션')),
    ('d-shell', 'PlatformAppShell: 앱 전체 사이드바', '1e1fa48, 49d2fec',
     '<p>Platform 화면이 앱 내비게이션 없이 페이지 하나씩만 보였다. 패키지에 <code>PlatformAppShell</code>을 추가하고 Dashboard·Catalog·Class 스토리를 그 안에 넣었다.</p>'
     '<ul><li>로고, 프로젝트 선택, Dashboard·Catalog·Classes, 설정·로그아웃. 1440px 이상 펼침(180px), 그 아래 접힘(72px).</li>'
     '<li>라우터를 모른다. 앱이 <code>activeKey</code>와 <code>onNavigate</code>를 넘긴다. 메뉴는 실제 주소를 가져 Cmd/Ctrl+클릭으로 새 탭이 열린다.</li>'
     '<li>프로젝트 이름은 페이지 헤더에서 사이드바의 프로젝트 선택으로 옮겼다. 페이지 높이는 <code>var(--ig-page-height, 100vh)</code>로 껍데기 안에서 남은 영역을 채운다.</li>'
     '<li>사이드바 화살표를 공용 <code>PanelLeftClose/Open</code>으로 바꿔 결정 대기였던 "SidebarShell 화살표"가 해결됐다. 앱 아이콘, 폴더·로그아웃 아이콘을 공용 자산과 아이콘 갤러리에 추가했다.</li>'
     '<li>Class 목록을 접었을 때 펼치기 버튼이 앱 사이드바 경계에서 1px였던 것을 칩 줄 안쪽으로 옮겼다(21px, 공용 <code>FilterChipRow</code>에 <code>leading</code> 추가).</li>'
     '<li>앱 사이드바와 목록의 접기 버튼이 둘 다 "Collapse sidebar"여서 1440px에서 Class 자동 재생이 실패했다. 앱 사이드바 버튼을 "Collapse/Expand app sidebar"로 구분했다. 사이드바 <code>aside</code>에 이름이 없어 Catalog 댓글 패널과 랜드마크가 겹치던 접근성 위반도 고쳤다.</li></ul>'
     + fig('regions/app-shell-compare.png', '앱 사이드바', 'Catalog 1440px') + fig('regions/app-shell-class-1024.png', 'Class 1024', 'Class 1024px(접힌 사이드바)')
     + fig('regions/class-expand-after.png', 'Class 펼치기 버튼', 'Class 목록 접힘: 펼치기 버튼이 칩 줄 앞에')),
    ('d-settings', 'Settings 섹션을 상자 대신 제목과 선으로', 'c7885f8',
     '<p>처음 스크린샷으로 지적받은 화면이다. 모달 안의 섹션 상자(배경, 테두리, 모서리, 대문자 제목 띠)를 없애고 14px 제목과 1px 선(위아래 24px)으로 나눴다. 모달 본문·머리말 안쪽은 24px. 위험 섹션(계정·프로젝트 삭제)은 되돌릴 수 없는 동작의 경계라 빨간 상자로 남겼다.</p>'
     + fig('regions/settings-general-compare.png', 'General', 'General') + fig('regions/settings-account-compare.png', 'Account', 'Account(위험 섹션만 상자)')),
    ('d-text', '글자 역할 토큰', '8ca37dc',
     '<p>DESIGN.md에 적어 둔 역할(micro, caption, body-sm, body, title-sm, title, display)이 토큰으로 없었다. <code>--ig-text-&lt;역할&gt;</code>과 짝지은 줄 높이 <code>-leading</code>을 만들고 Platform의 글자 크기 190곳을 같은 값의 역할로 바꿨다. 전체 스토리 비교로 화면 변화 0을 확인했다.</p>'),
    ('d-dup', '중복 컴포넌트와 레이아웃 크기 토큰', 'b95abdc',
     '<ul><li>대시보드 카드 3벌을 <code>DashboardCard</code> 하나로(분석 카드 모서리 8→12px, 깊이 규칙). 빈 문구는 공용 <code>EmptyText</code>.</li>'
     '<li>Settings Edge 탭 섹션 제목을 다른 탭과 같게. 상자를 없앤 뒤 음수 여백 때문에 제목 띠가 본문 밖으로 삐져나와 있던 것도 고쳤다(1번 작업 때 놓친 것).</li>'
     '<li>Deflectometry 미리보기 탭(직접 만든 버튼)을 공용 <code>ChipTabs</code>로. <code>ChipTabs</code>에 <code>ariaLabel</code>을 추가했다. 이름만 겹치던 Edge 탭 <code>FieldRow</code>는 <code>ControlRow</code>로.</li>'
     '<li>사이드바·패널 폭, 표 열 폭, 격자 칸, 미리보기, 빈 상태, 드롭 영역, 폼 폭에 빌려 쓰던 팝업 크기 토큰을 같은 값의 <code>--ig-layout-size-*</code>로 옮겼다. 대화상자와 팝오버는 팝업 토큰을 그대로 쓴다.</li></ul>'
     + fig('regions/edgetab-compare.png', 'Edge 탭', 'Settings Edge 탭 제목') + fig('regions/deflecto-compare.png', 'Deflectometry', 'Settings Edge 탭 Deflectometry 섹션 제목(이 스토리에는 미리보기 탭이 나오지 않는다)')
     + fig('regions/analysis-compare.png', '분석 카드', '대시보드 분석 카드 모서리 8→12px')),
    ('d-spacing', '옛 간격 이름 정리', '50c427d',
     '<p>이름과 값이 맞지 않던 <code>--ig-space-*</code>(예: space-3이 8px) 333곳을 같은 값의 <code>--ig-spacing-{px}</code>로 바꿨다. 0, 1px, 음수 23곳은 새 이름이 없어 그대로. 숫자 z-index 1곳은 <code>--ig-z-base</code>로, 위치값으로 빌려 쓰던 컨트롤 높이 1곳은 레이아웃 크기 토큰으로. 화면 변화 0.</p>'),
]
changes = ''.join(f"<h3 id='{i}'>{e(t)} <span class='muted'>({c})</span></h3>{body}" for i, t, c, body in CHANGES)

detail = []
total = 0
for name, s in cmp.items():
    total += s['totalGroups']
    def item(g):
        count = f" <span class='muted'>×{g['count']}</span>" if g['count'] > 1 else ''
        ex = f" <span class='muted'>(예: {e(', '.join(g['labels'][:3]))})</span>" if g['labels'] and g['kind'] == 'changed' else ''
        return f"<li><b class='n'>{g['n']}</b> {e(g['sig'])}{count}{ex}</li>"
    items = ''.join(item(g) for g in s['top'])
    rest = ''.join(f"<li>{e(r['sig'])}{' ×' + str(r['count']) if r['count'] > 1 else ''}</li>" for r in s['rest'])
    rest_html = f"<details><summary>번호 없는 나머지 {len(s['rest'])}건 펼치기</summary><ul>{rest}</ul></details>" if s['rest'] else ''
    detail.append(
        f"<h3 id='cmp-{name}'>{e(s['title'])} <span class='muted'>· 변경 묶음 {s['totalGroups']}개 · {sb(s['id'], 'Storybook')}</span></h3>"
        + fig(f"detailed/{name}-detail.png", s['title'], '왼쪽 이전(어제 저녁 b497769, 주황) · 오른쪽 지금(50c427d, 청록). 같은 번호는 같은 요소. 이미지를 누르면 원래 크기')
        + f"<p class='muted'>화면 전체: 실제로 그려지는 글꼴 Liberation Sans(대체 글꼴) → IBM Plex Sans / Plex Sans KR</p>"
        + f"<ol class='legend'>{items}</ol>{rest_html}"
    )
toc_cmp = ' · '.join(f"<a href='#cmp-{n}'>{e(s['title'].split(' · ')[-1])}</a>" for n, s in cmp.items())

SECTION = f'''
<h2 id="day">0. 2026-10-27 낮 작업과 어제 저녁 대비 상세 비교</h2>
<p class="muted">10:17~16:57 · 브랜치 <code>feat/surface-depth</code> · push·PR 없음. 이 절이 가장 최신이다. 아래 "최종 결과(밤사이)"와 1~7절은 밤사이 기록이다.</p>
<div class="note"><b>요약.</b> 화면 영역은 모두 선으로 나뉘고(Dashboard 정리), 단일 폼 화면(로그인·회원가입·프로젝트 생성)은 넉넉한 간격과 보이는 라벨을 쓰며, Platform 작업 화면은 앱 전체 사이드바 안에 들어갔다. Settings 섹션은 상자 대신 선으로 나뉘었다. 이어서 글자 역할 토큰, 중복 컴포넌트 정리, 레이아웃 크기 토큰, 간격 이름 정리를 화면 변화 없이 마쳤다. 어제 저녁과 비교하면 17개 대표 화면에서 변경 묶음이 <b>{total}개</b>다.</div>

<h3>0-1. Simon이 확인할 것</h3>
<ol>
<li><b>push와 PR 나누기</b>: <code>refactor/space-props-and-removable-list</code> → <code>fix/broken-controls</code> → <code>feat/surface-depth</code>가 쌓여 있다.</li>
<li><b>CI 시각 기준선 승인</b>: 거의 모든 화면이 바뀌었다(아래 0-4). 로컬에서는 갱신하지 않았다.</li>
<li><b>사이드바 메뉴 이름</b>: "Classes"와 페이지 제목 "Class" 중 하나로 맞추기.</li>
<li><b>Settings 모달 안의 입력칸·표 폭(약 15곳)</b>: 아직 팝업 크기 토큰을 쓴다. 레이아웃 크기 토큰으로 옮길지.</li>
<li><b>4px 밖의 표 열 폭 3개</b>(Catalog 표 190·116·124px)를 맞출지.</li>
<li><b>숫자 입력칸 값이 잘리는 문제</b>(0-5): 고칠지와 방식.</li>
<li>Edge와 공용 컴포넌트의 옛 글자 크기·간격 이름 정리를 이어서 할지(이번 범위는 Platform).</li>
</ol>

<h3>0-2. 커밋</h3>
<table><tr><th>시각</th><th>커밋</th><th>내용</th></tr>{rows}</table>
<p>모든 커밋 뒤에 타입·린트·단위(492)·정적 검사·패키지 빌드·공개 export·전체 Storybook(888)을 통과했다. 화면이 바뀌지 않아야 하는 커밋(<code>8ca37dc</code>, <code>50c427d</code>, <code>b95abdc</code>의 크기 토큰 부분)은 전체 스토리 픽셀 비교로 확인했고, 다르게 나온 스토리는 양쪽 빌드에서 4~6번 다시 찍어 같은 빌드끼리도 흔들리는 노이즈임을 확인했다. 한계: 비교는 화면 위쪽 900px만 찍으므로 그 아래(대시보드 분석 카드)는 따로 쟀다.</p>
<table><tr><th>위계 검사(Platform 128 스토리)</th><th>어제 아침</th><th>지금</th></tr>
<tr><td>DOM 구조 기준 위반</td><td>—</td><td>0</td></tr>
<tr><td>위치 기준 같음 / 역전</td><td>81 / 84</td><td>2 / 2</td></tr></table>

<h3>0-3. 변경별 설명</h3>
{changes}

<h3 id="cmp">0-4. 어제 저녁 대비 화면별 상세 비교 (17개 화면, 변경 묶음 {total}개)</h3>
<p>방법: 어제 저녁(<code>b497769</code>, 밤사이 작업 전)과 지금(<code>50c427d</code>)을 각각 빌드해 같은 화면 크기(1440×900)로 찍고, 컴포넌트 이름과 글자로 같은 요소를 짝지어 모서리·안쪽 여백·간격·글자 크기·줄 높이·굵기·대문자·높이·폭·배경·테두리·그림자·안내 글자를 비교했다. 같은 변경이 여러 요소에 반복되면 하나로 묶었다(×개수). 입력칸은 순서로 짝지었다. 글자가 있는 요소의 폭 변화는 글꼴과 여백의 결과라 따로 적지 않았다. 화면마다 큰 변경 14묶음까지 번호를 붙였고, 나머지는 펼쳐 볼 수 있다. 한계: 위쪽 900px만 비교하고, 화면 구조가 크게 바뀐 곳(앱 사이드바가 생긴 화면)은 요소 짝이 일부 "사라짐/새로 생김"으로 나온다.</p>
<p class="muted">바로 가기: {toc_cmp}</p>
{''.join(detail)}

<h3 id="found">0-5. 새로 발견한 문제</h3>
<table><tr><th>문제</th><th>위치</th><th>원인</th><th>상태</th></tr>
<tr><td>숫자 입력칸 값이 잘려 숫자가 보이지 않음</td><td>Settings Edge 탭 Deflectometry(Phase shifts, Fringe period, Retry 등)</td><td><code>NumberField</code> 폭이 46~48px인데 안쪽 여백이 왼쪽 12px, 오른쪽 32px(위아래 버튼 자리)라 숫자 들어갈 자리가 0~2px</td><td><b>어제 저녁에도 있던 문제</b>(이번 변경이 만든 것 아님). 제안: <code>NumberField</code>에 최소 폭(예: 여백 + 숫자 4자리)을 두거나, Edge 탭이 폭을 지정</td></tr>
<tr><td>Edge 탭 제목 띠가 본문 밖으로 삐져나옴</td><td>Settings Edge 탭</td><td>Settings 섹션 상자를 없앨 때 Edge 탭 제목의 음수 여백을 놓침</td><td><code>b95abdc</code>에서 고침</td></tr>
<tr><td>Catalog 오른쪽 패널 제목 순서(접근성)</td><td>Catalog 데이터셋 목록 접힘</td><td>접힌 열을 inert로 만들면서 h2가 빠짐</td><td>밤사이 <code>e725981</code>에서 고침</td></tr></table>
'''
open(f'{ROOT}/docs/reports/{A}day-section.html', 'w').write(SECTION)
print('day section', len(SECTION), 'chars, groups', total)
