import fs from 'node:fs'
const f = JSON.parse(fs.readFileSync('findings.json','utf8'))
const SHA='6c54603', GH=`https://github.com/InGradient/ingradient-ui/blob/${SHA}/`, SB='http://omarchy.tail3e2097.ts.net:6031/?path=/story/'
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
const area=p=>p.startsWith('src/primitives')?'primitives':p.startsWith('src/components')?'components':p.startsWith('src/patterns')?'patterns':p.startsWith('packages/platform')?'platform-pages':'edge-pages'
const px=o=>Math.abs(o.px)
const cls=o=>o.kind==='jsx-index'?(o.idx===0?'zero':'jsx'):px(o)===0?'zero':px(o)<=3?'hair':px(o)%4===0?'on4':'off4'
const link=o=>`<a href="${GH}${o.file}#L${o.line}"><code>${esc(o.file.replace(/^packages\//,'').replace(/^src\//,''))}:${o.line}</code></a>`
// story mapping by source path (best effort)
const map=[
 [/platform-pages\/src\/create-project/,'pages-platform-0-0-1-create-project-workspace--overview'],
 [/platform-pages\/src\/settings-modal/,'pages-platform-0-0-1-settings-modal-edge--work-options'],
 [/platform-pages\/src\/auth/,'pages-platform-0-0-1-auth-login-workspace--overview'],
 [/platform-pages\/src\/catalog/,'pages-platform-0-0-1-dataset-catalog-workspace--overview'],
 [/platform-pages\/src\/class-manage/,'pages-platform-0-0-1-class-management-workspace--overview'],
 [/platform-pages\/src\/dashboard/,'pages-platform-0-0-1-dashboard-workspace--overview'],
 [/edge-pages\/src\/connection/,'pages-edge-0-0-5-settingsworkflows--device-draft'],
 [/edge-pages\/src\/capture/,'pages-edge-0-0-5-workspace--capture'],
 [/edge-pages\/src\/images/,'pages-edge-0-0-5-imagesworkflows--selection-delete-workflow'],
 [/edge-pages\/src\/log/,'pages-edge-0-0-5-capturecontrols--log-filter-keyboard-image-workflow'],
 [/edge-pages\/src\/dataset/,'pages-edge-0-0-5-datasetselect--offline'],
 [/edge-pages\/src\/settings/,'pages-edge-0-0-5-settingsworkflows--device-draft'],
 [/edge-pages\/src\/(statics|system|app-shell|chrome|workspace)/,'pages-edge-0-0-5-workspace--capture'],
]
const sbLink=file=>{const m=map.find(([r])=>r.test(file));return m?`<a href="${SB}${m[1]}">화면</a>`:'<span class="muted">—</span>'}
const A={};for(const o of f){const a=area(o.file);A[a]??={total:0,on4:0,hair:0,off4:0,zero:0,jsx:0};A[a].total++;A[a][cls(o)]++}
const sum=Object.entries(A).map(([k,v])=>`<tr><td>${k}</td><td>${v.total}</td><td>${v.on4}</td><td>${v.hair}</td><td>${v.off4}</td><td>${v.jsx}</td><td>${v.zero}</td></tr>`).join('')
const tot=Object.values(A).reduce((a,v)=>{for(const k in v)a[k]=(a[k]||0)+v[k];return a},{})
const tokPx={};f.filter(o=>o.kind==='token'&&px(o)>0).forEach(o=>{tokPx[o.px]=(tokPx[o.px]||0)+1})
const gridRows=Object.entries(tokPx).sort((a,b)=>b[1]-a[1]).map(([p,c])=>`<tr><td>${p}px</td><td>${c}</td><td>${p%4===0?'4의 배수':p<=3?'헤어라인':'<b>그리드 밖</b>'}</td></tr>`).join('')
// jsx numeric
const jsx=f.filter(o=>o.kind==='jsx-index'&&o.idx>0)
const jsxRows=jsx.map(o=>`<tr><td>${link(o)}</td><td><code>${o.prop}={${o.idx}}</code></td><td>${o.idx}px <span class="muted">(<code>--ig-space-${o.idx}</code>은 ${({1:4,2:6,3:8,4:10,5:12}[o.idx])}px)</span></td><td>${sbLink(o.file)}</td></tr>`).join('')
const bare=f.filter(o=>o.kind==='raw-number'&&px(o)>0)
const bareRows=bare.map(o=>`<tr><td>${link(o)}</td><td><code>gap: ${o.value}</code></td><td>토큰 인덱스 ${o.value} → ${({2:'6px',3:'8px',5:'12px'})[o.value]}</td><td>${sbLink(o.file)}</td></tr>`).join('')
// off-grid per file
const byFile={};f.filter(o=>cls(o)==='off4').forEach(o=>(byFile[o.file]??=[]).push(o))
const top=Object.entries(byFile).sort((a,b)=>b[1].length-a[1].length)
const fileRows=top.slice(0,40).map(([file,os])=>`<tr><td>${os.length}</td><td><a href="${GH}${file}"><code>${esc(file.replace(/^packages\//,'').replace(/^src\//,''))}</code></a></td><td>${[...new Set(os.map(o=>o.px+'px'))].join(', ')}</td><td>${os.slice(0,6).map(o=>`<a href="${GH}${o.file}#L${o.line}">L${o.line}</a>`).join(' ')}${os.length>6?' …':''}</td><td>${sbLink(file)}</td></tr>`).join('')
// tight siblings: gap <=4px between flex/grid children
const tight=f.filter(o=>/gap/i.test(o.prop)&&px(o)>0&&px(o)<=4&&o.kind!=='jsx-index')
const tightRows=tight.map(o=>`<tr><td>${link(o)}</td><td><code>${esc(o.prop)}: ${esc(o.value)}</code></td><td>${o.px}px</td><td>${sbLink(o.file)}</td></tr>`).join('')
const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>2026-10-17 간격(spacing) 토큰 위계 점검</title>
<style>
${fs.readFileSync('/home/homebodify/Projects/ingradient-ui/docs/reports/2026-10-05-work-report.ko.html','utf8').match(/<style>([\s\S]*?)<\/style>/)[1]}
</style></head><body><main>
<h1>2026-10-17 간격(spacing) 토큰 위계 점검</h1>
<p class="muted">검사만 수행했고 코드는 수정하지 않았다. 기준 커밋 <code>${SHA}</code>, 대상 544개 파일(src/primitives·components·patterns, platform-pages, edge-pages. stories·test 제외), 간격 선언 ${f.length}건.</p>
<nav class="toc"><ol><li><a href="#basis">1. 결론</a></li><li><a href="#tokens">2. 토큰 단계 — 스케일 자체</a></li><li><a href="#jsx">3. 숫자 prop이 px로 해석됨</a></li><li><a href="#bare">4. 숫자 gap 값(스타일 객체)</a></li><li><a href="#tight">5. 붙어 보이는 간격(4px 이하)</a></li><li><a href="#files">6. 그리드 밖 값이 많은 파일</a></li><li><a href="#method">7. 검사 방법과 한계</a></li></ol></nav>

<h2 id="basis">1. 결론</h2>
<table>
<tr><th>질문</th><th>답</th></tr>
<tr><td>하드코딩이 많은가?</td><td><b>아니다.</b> <code>padding·margin·gap</code>에 직접 쓴 px 값은 <b>0건</b>이다. 모두 <code>var(--ig-space-*)</code>를 거친다. 다른 속성(width·top 등)의 px도 토큰 정의 파일 밖에서는 사이드바 컨테이너 쿼리 2줄뿐이다.</td></tr>
<tr><td>그런데 왜 불규칙한가?</td><td>원인이 하드코딩이 아니라 <b>세 가지</b>다. (a) 토큰 스케일이 4px 그리드가 아니라 2px 단위(<code>DESIGN.md</code> 명시), (b) 숫자 prop의 의미가 컴포넌트마다 다름, (c) 2~3px 토큰을 요소 사이 간격에 사용.</td></tr>
<tr><td>4px 그리드를 적용하려면?</td><td>코드 수정이 아니라 <b>스케일 정책 결정</b>이 먼저다(§2). 결정 없이 값만 고치면 토큰 위계가 깨진다.</td></tr>
</table>
<table><tr><th>레이어</th><th>선언 수</th><th>4의 배수</th><th>1~3px</th><th>그리드 밖</th><th>숫자 prop</th><th>0</th></tr>${sum}
<tr><td><b>합계</b></td><td><b>${tot.total}</b></td><td>${tot.on4}</td><td>${tot.hair}</td><td><b>${tot.off4}</b></td><td>${tot.jsx}</td><td>${tot.zero}</td></tr></table>
<p class="muted">"그리드 밖" = 토큰 값이 4px 단위가 아닌 경우(6·10·14·18·22px 등). "숫자 prop" = <code>gap={3}</code>처럼 토큰이 아닌 숫자를 넘긴 경우.</p>

<h2 id="tokens">2. 토큰 단계 — 스케일 자체</h2>
<p>토큰 정의(<a href="${GH}src/tokens/core/spacing.ts"><code>tokens/core/spacing.ts</code></a>)는 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32px이다. <b>4의 배수는 8개, 그리드 밖은 7개</b>(5·6·7·10·14·18·22px). 아래는 실제 사용 횟수다.</p>
<table><tr><th>토큰 값</th><th>사용 횟수</th><th>분류</th></tr>${gridRows}</table>
<div class="note">가장 많이 쓰는 값이 8px(<code>space-3</code>)이라 안정적으로 보이지만, 그다음이 <b>10px(<code>space-4</code>) 144회, 6px(<code>space-2</code>) 140회</b>다. 같은 역할의 간격이 8·10·12px로 흩어져 있어 "불규칙"하게 보이는 주된 원인으로 추정한다. 이는 코드 결함이 아니라 현재 스케일의 설계 결과다.</div>
<p><b>결정이 필요한 항목:</b> ① 스케일을 4px 단위로 재정의할지(예: 4·8·12·16·20·24·32). ② 그렇다면 6→8, 10→12(또는 8), 14→16, 18→20, 22→24 중 어디로 이동할지. ③ 5·7px 보조 토큰(<code>1-plus</code>, <code>2-plus</code>)과 1~3px 헤어라인 토큰의 허용 용도. 값은 이 결정 후에 일괄 변경하는 것이 안전하다.</p>

<h2 id="jsx">3. 숫자 prop이 px로 해석됨 (${jsx.length}건)</h2>
<p><code>Stack·Inline</code>의 <code>gap</code>은 <code>space()</code>를 거쳐 숫자를 <b>px 그대로</b> 쓴다(<a href="${GH}src/primitives/shared.ts#L15"><code>shared.ts:15</code></a>). 그래서 <code>gap={3}</code>은 8px 토큰이 아니라 <b>3px</b>이다. 반면 <code>GridContainer</code>·<code>VirtualizedImageGrid</code>의 <code>gap</code> 숫자는 토큰 인덱스다(<a href="${GH}src/components/data-display/grid-container.tsx#L12"><code>grid-container.tsx:12</code></a>). <b>같은 이름 prop의 의미가 다르다.</b> 렌더링 확인: Create Project 화면에서 3px 간격이 실제로 계산됨.</p>
<table><tr><th>위치</th><th>코드</th><th>실제 값</th><th>Storybook</th></tr>${jsxRows}</table>
<p class="muted">같은 값 <code>gap={0}</code> 27건은 의미가 같아 제외했다. 위 목록은 전부 1~5px로, 요소가 붙어 보이는 후보다. 의도한 값인지는 화면 확인이 필요하다.</p>

<h2 id="bare">4. 스타일 객체의 숫자 gap (${bare.length}건)</h2>
<p>이 셋은 토큰 인덱스로 해석되는 경로를 탄다. 의도는 맞지만 숫자만 보면 px처럼 읽혀 혼동되기 쉽다.</p>
<table><tr><th>위치</th><th>코드</th><th>해석</th><th>Storybook</th></tr>${bareRows}
<tr><td><a href="${GH}packages/platform-pages/src/create-project/CreateProjectView.styles.ts#L123"><code>CreateProjectView.styles.ts:123-125</code></a></td><td><code>Grid.attrs({gap: 3})</code></td><td><b>Grid의 gap은 px 해석 → 3px</b> (위 렌더링 확인과 일치)</td><td>${sbLink('platform-pages/src/create-project')}</td></tr></table>

<h2 id="tight">5. 붙어 보이는 간격 — gap 4px 이하 (${tight.length}건)</h2>
<table><tr><th>위치</th><th>코드</th><th>값</th><th>Storybook</th></tr>${tightRows}</table>
<p class="muted">2~3px 간격이 모두 문제는 아니다(아이콘과 텍스트 등). 요소 사이 간격으로 쓴 곳을 화면에서 확인해 분류해야 한다.</p>

<h2 id="files">6. 그리드 밖 값이 많은 파일 (상위 40 / 전체 ${top.length}개 파일)</h2>
<table><tr><th>건수</th><th>파일</th><th>값</th><th>줄</th><th>Storybook</th></tr>${fileRows}</table>

<h2 id="method">7. 검사 방법과 한계</h2>
<ul>
<li>정규식으로 <code>padding·margin·gap</code>(+방향별)과 <code>gap={n}</code>/<code>padding={n}</code> JSX prop을 추출해 토큰 값으로 환산했다. 스크립트: <code>/tmp/spacing-audit/scan.mjs</code>(저장소에는 넣지 않음).</li>
<li>한계: <code>top·left·width·height</code>, 중첩 <code>calc()</code>, 변수에 담았다가 쓰는 값, 스타일 객체의 동적 값은 이 검사에서 제외했다. 브라우저 계산값은 Create Project와 Breadcrumbs 두 화면만 직접 확인했다.</li>
<li>Storybook 링크는 파일 → 대표 화면 매핑(근사)이다. 해당 줄이 실제로 보이는 상태는 화면에서 찾아야 한다.</li>
<li>이 리포트는 Omarchy에서 제공하며 Tailscale 안에서만 열린다.</li>
</ul>
</main></body></html>`
fs.writeFileSync('/home/homebodify/Projects/ingradient-ui/docs/reports/2026-10-17-spacing-audit.ko.html',html)
console.log('ok', jsx.length, bare.length, tight.length, top.length)
