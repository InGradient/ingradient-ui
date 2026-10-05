from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib,datetime
P=Path(__file__).parent; B=P.parent/'2026-09-20-edge-phase0'; R=P.parent.parent
FONT='/System/Library/Fonts/AppleSDGothicNeo.ttc'
def font(n): return ImageFont.truetype(FONT,n)
# Rectangles use original screenshot coordinates; pixels are never stretched or repainted.
items=[
 ('settings-menu','edge-settings-menu','Settings 메뉴',[(247,103,394,195)],[(247,99,394,199)],['① 선택 항목: 좌측 선 + 배경 → 공용 Settings 탭의 둥근 배경·아이콘 강조'], 'workspace--settings','Settings / Connection 초기 상태'),
 ('general','settings-general','General — 선택과 Preview 분리',[(425,237,1175,288),(425,517,1175,567)],[(425,233,1175,280),(425,493,1175,540)],['① Preview가 항목명 옆에서 행 오른쪽으로 이동; 선택과 재생 액션 분리','② 선택된 음색의 글자·배경 강조. 초기 음색은 두 화면 모두 Two-tone alarm'], 'workspace--settings','Settings → General; 기본 선택 유지'),
 ('datasets','datasets-offline','Dataset 카드와 메뉴',[(307,390,349,432),(24,374,303,490)],[(312,389,352,433),(24,377,303,493)],['① 가로 점 메뉴 → 세로 kebab / 공용 MenuIconButton. Export 메뉴는 아래 동작 증거','② 일반 카드의 선택 버튼과 메뉴 버튼 분리. 키보드 계약은 소스/기존 검증 기록 근거'], 'datasetselect--offline','Offline 초기 카드; 메뉴 닫힘'),
 ('images','images-mock','Images — 선택·필터·삭제',[(306,151,1134,197),(325,208,475,420)],[(306,199,1134,244),(305,153,1129,192)],['① 선택/필터/삭제 컨트롤: local fixture 상태와 연결 (결과는 아래 실제 조작 캡처)','② 데이터 fixture가 다름: 최신 12개 합성 이미지/10셀. 운영 이미지 삭제 전후가 아님'], 'workspace--images','초기 미선택; 데이터 fixture 불일치 명시'),
 ('capture','capture','Capture와 header',[(1152,40,1207,80),(556,481,890,531)],[(1096,29,1209,83),(556,481,890,531)],['① EN 표시 → 이름이 있는 Language 선택 컨트롤; 전체 번역 완료를 뜻하지 않음','② 빈 격자 → Waiting for camera frames 안내. 실제 장비 연결/촬영 증거가 아님'], 'workspace--capture','Capture 초기 상태; 기본 globals'),
 ('capture-768','supplemental-clean-capture-768','768px constrained desktop',[(304,95,465,148),(352,673,422,749)],[(14,90,655,143),(299,675,370,749)],['① 잘린 탭/중앙 폭 160px → 중앙 최소폭 640px 및 수평 스크롤 정책','② 촬영 버튼의 중앙 위치 유지. 좌우 패널은 화면 밖에 존재; 모바일 재배치가 아님'], 'workspace--capture','768×800 동일 viewport; 초기 중앙 노출'),
 ('setup','setup','Setup — 파생 미리보기',[(1162,850,1410,961)],[(1162,824,1410,961)],['① fringe 미리보기·설명에 simulation 명시. Gamma 변경 시 파형/요약 갱신은 아래 결과','초기 상태끼리 비교. Gamma=3 결과는 우측 패널이 입력 위치로 스크롤된 별도 캡처'], 'workspace--setup','Setup 초기 gamma 2.2; 조작 전'),
 ('server','settings-server','Settings 장치 설정 — Server',[(573,109,1175,217),(424,232,487,266)],[(573,105,1175,214),(424,228,487,260)],['① Base URL / Runtime mode: 외형보다 편집·검증·세션 상태 연결이 핵심','② Save 결과는 아래 mock 저장 문구로 확인. 서버 접속이나 영속 저장을 수행하지 않음'], 'workspace--settings','Settings → Server; 조작 전'),
 ('logs','settings-logs','Settings Logs — 검색과 결과',[(425,150,1175,191),(425,197,1175,320)],[(425,145,1175,184),(425,189,1175,298)],['① 검색/level/source/작업 버튼을 fixture 상태에 연결','② 고정 높이 목록 → 내용 높이 및 mock 상태 표시. 검색 1건/내보내기 결과는 아래 증거'], 'workspace--settings','Settings → Logs; 검색 전'),
 ('lighting-ps','settings-lighting','신규 PS 분기 — 미도달에서 named Story로',[(425,139,1175,383)],[(425,249,1175,451)],['① AS-IS는 기존 Lighting 진입면(모니터 선택). PS는 당시 미도달 — 옛 PS 화면을 만든 것이 아님','TO-BE는 실제 LightingPs Story에서 All on 후 4채널 켜짐. 같은 상태의 픽셀 비교가 아님'], 'settingsworkflows--lighting-ps','AS-IS: Deflectometry / TO-BE: 신규 PS synthetic Story; All on'),
]
records=json.loads((P/'fresh-captures.json').read_text());byname={r['name']:r for r in records};manifest={'baseline':'c2b2606','latest':'4c414bf','sourceCommit':'4a85c21','primaryCheckout':'/home/homebodify/Projects/ingradient-ui','listener':{'port':6015,'pid':79855,'cwdVerifiedWith':'lsof -a -p 79855 -d cwd'},'scope':'documentation only; no old checkout rerun; no phase1 baseline','baselineProvenance':['../2026-09-20-edge-phase0/capture-manifest.json','../2026-09-20-edge-phase0/settings-manifest.json','../../2026-09-20-edge-layer-audit-and-plan.ko.md sections 12.1, 12.10, 13'],'globals':'default Story globals; Edge preset; dark screenshots; deviceScaleFactor=1; no theme/density override','pairs':[],'images':[]}
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def add_image(path,kind,parents=None,meta=None):
 im=Image.open(path);manifest['images'].append({'file':path.name,'kind':kind,'dimensions':list(im.size),'sha256':sha(path),'sources':parents or [],**(meta or {})})
def annotate(src,dst,heading,subtitle,boxes,legends,color):
 im=Image.open(src).convert('RGB');w,h=im.size;top=100;bottom=104 if w>1000 else 140
 canvas=Image.new('RGB',(w,h+top+bottom),'#111827');canvas.paste(im,(0,top));d=ImageDraw.Draw(canvas)
 d.text((20,13),heading,font=font(29 if w>1000 else 25),fill=color)
 d.text((20,57),subtitle,font=font(20 if w>1000 else 17),fill='#e5e7eb')
 for n,(x1,y1,x2,y2) in enumerate(boxes,1):
  d.rectangle((x1,y1+top,x2,y2+top),outline=color,width=4)
  lx=max(0,x1-4);ly=max(top,y1+top-27);d.rounded_rectangle((lx,ly,lx+30,ly+27),radius=5,fill=color);d.text((lx+9,ly+1),str(n),font=font(22),fill='#111827')
 for n,line in enumerate(legends):
  # Korean legends fit natural image width; narrow panel uses smaller font.
  d.text((18,h+top+15+n*35),line,font=font(21 if w>1000 else 16),fill='#f3f4f6')
 canvas.save(dst)
 return canvas
prefix='assets/2026-09-21-edge-comparison/'
report=['# Edge 이전 pull → 최신 main: AS-IS / TO-BE 이미지 비교','', '## 1. 비교 기준','', '| 항목 | 기준 |','|---|---|','| AS-IS | `c2b2606`: 당시 phase0 원본 캡처. 이전 코드를 이번에 다시 실행한 결과가 아님 |','| TO-BE | `4c414bf` (UI 구현 `4a85c21`): primary checkout의 Storybook **6015**에서 새로 캡처 |','| 범위 | 10개 전후 패널 + 7개 조작 결과 이미지. 화면 속 번호·사각형과 아래 설명이 대응 |','| 크기 | 기본 1440×1000, 좁은 화면은 양쪽 모두 **768×800**. 원본 픽셀/비율 유지 |','| 조건 | Edge 기본 dark/preset/density, 새 browser context. theme/density override 없음 |','', '**주황 = AS-IS, 청록 = TO-BE.** 아래 합성 이미지를 클릭하거나 개별 확대 링크를 열면 작은 컨트롤도 원래 해상도로 볼 수 있다. 표시 박스는 변경 부위/동작 대상이며 자동 pixel-diff가 아니다. 다른 날짜의 fixture·로그 문구는 디자인 변경과 구분한다.','', '[전체 소스 diff](https://github.com/InGradient/ingradient-ui/compare/c2b2606...4c414bf) · [원본별 출처/viewport/상태 manifest]('+prefix+'comparison-manifest.json) · [실제 캡처/행동 기록]('+prefix+'fresh-captures.json)','', 'baseline 근거: [기본 캡처](assets/2026-09-20-edge-phase0/capture-manifest.json), [Settings 캡처](assets/2026-09-20-edge-phase0/settings-manifest.json), [기존 감사 §12의 primary c2b2606 및 clean 768 기록](2026-09-20-edge-layer-audit-and-plan.ko.md). phase1 중간 이미지는 사용하지 않았다.','']
for idx,(name,old,title,br,ar,leg,story,state) in enumerate(items,1):
 oldpath=B/(old+'.png');newpath=P/(name+'.png');bname=f'{idx:02d}-{name}-as-is.png';aname=f'{idx:02d}-{name}-to-be.png';pairname=f'{idx:02d}-{name}-comparison.png'
 subtitle='동일 초기 상태 비교' if name!='lighting-ps' else 'AS-IS: PS formerly unreachable / TO-BE: 신규 Story 실제 상태'
 if name=='images':subtitle='주의: 서로 다른 fixture — 운영 데이터 삭제 전후가 아님'
 before=annotate(oldpath,P/bname,'AS-IS · c2b2606',title+' | '+subtitle,br,leg,'#fbbf24')
 after=annotate(newpath,P/aname,'TO-BE · 4c414bf',title+' | '+subtitle,ar,leg,'#2dd4bf')
 pair=Image.new('RGB',(before.width+after.width+24,max(before.height,after.height)),'#334155');pair.paste(before,(0,0));pair.paste(after,(before.width+24,0));pair.save(P/pairname)
 meta={'commit':'c2b2606','source':'../2026-09-20-edge-phase0/'+old+'.png','viewport':list(Image.open(oldpath).size),'state':state,'sha256':sha(oldpath)}
 manifest['pairs'].append({'number':idx,'name':name,'title':title,'asIs':meta,'toBe':byname[name],'callouts':{'asIs':br,'toBe':ar,'legend':leg},'panel':pairname})
 add_image(P/bname,'annotated historical screenshot',[meta['source']],{'commit':'c2b2606','viewport':meta['viewport'],'state':state});add_image(P/aname,'annotated fresh screenshot',[name+'.png'],{'commit':'4c414bf','viewport':byname[name]['viewport'],'state':state});add_image(P/pairname,'side-by-side panel',[bname,aname])
 report += [f'## {idx+1}. {title}','',f'[![{title}]({prefix}{pairname})]({prefix}{pairname})','',f'[AS-IS 확대]({prefix}{bname}) · [TO-BE 확대]({prefix}{aname}) · [현재 Story](http://localhost:6015/?path=/story/pages-edge-0-0-5-{story})','']+['- '+line for line in leg]+['']
# Actual interaction evidence, not historical behavior claims.
evidence=[
 ('dataset-menu','Dataset 메뉴 열기',[(311,389,354,432),(127,426,346,472)],['① 첫 More options 클릭 → ② 실제 Export 메뉴 표시. 파일 내보내기 실행은 아님']),
 ('images-selected','Images 전체 선택',[(320,204,415,239),(1022,204,1122,239)],['① Select all → ② Delete (12) 활성화; 합성 fixture 12개 선택']),
 ('images-deleted','Images 삭제 확인 후',[(305,150,1133,211),(658,598,788,630)],['① 삭제 확인 후 Removed 12 synthetic fixture images 상태','② No images yet. 브라우저 메모리의 합성 fixture만 제거; 실제 파일/운영 데이터 삭제 없음']),
 ('images-filtered','Images 날짜 필터',[(780,244,1040,324),(305,150,1133,195)],['① Filter → Date → Today → ② 4 images / 2 cells','고정 preview clock은 2026-05-20. 현재 날짜의 운영 데이터 검색이 아님']),
 ('setup-gamma','Setup Gamma 결과',[(1160,912,1412,960),(1160,535,1412,713)],['① Gamma 3 입력 → ② 파형·gamma 3 캡션/33 patterns 요약','입력으로 우측 패널이 아래로 스크롤됨. 실제 광학 측정 결과가 아닌 simulation']),
 ('server-saved','Server mock 저장',[(573,106,1175,138),(424,228,944,284)],['① Base URL 변경 → Save → ② Mock settings saved in this session','No connection was attempted: 실제 네트워크 연결·영속 저장 아님']),
 ('logs-filtered','Logs 검색 / mock 내보내기',[(425,146,904,181),(425,189,1175,269)],['① capture-agent 검색 → Copy all → ② 1 backend entries / No file written','목록 1건과 완료 문구를 실제 브라우저에서 확인; 클립보드/파일 작업 아님'])]
report += ['## 12. 기능 변경 — 실제 조작 결과','', '아래는 최신 화면에서 짧게 조작하고 결과를 기다린 캡처다. baseline의 미동작 판정은 [당시 기록 §5·§12](2026-09-20-edge-layer-audit-and-plan.ko.md)과 소스 근거이며 이번 baseline 재실행 주장이 아니다.','']
for name,title,boxes,leg in evidence:
 dest='proof-'+name+'.png';annotate(P/(name+'.png'),P/dest,'TO-BE · 4c414bf · 실제 조작 결과',title,boxes,leg,'#2dd4bf');add_image(P/dest,'annotated interaction result',[name+'.png'],{'commit':'4c414bf','viewport':byname[name]['viewport'],'actions':byname[name]['actions']})
 report += [f'### {title}','',f'[![{title}]({prefix}{dest})]({prefix}{dest})','']+['- '+line for line in leg]+['']
for rec in records:add_image(P/(rec['name']+'.png'),'fresh raw screenshot',[],rec)
add_image(P/'inspection-contact.png','inspection-only contact sheet',[i[0]+'.png' for i in items],{'note':'intermediate inspection overview; final raw Images capture supersedes thumbnail; not comparison evidence'})
manifest['generatedAtUtc']=datetime.datetime.now(datetime.timezone.utc).isoformat();manifest['freshScreenshotCount']=len(records);manifest['interactionResultCount']=len(evidence);manifest['pairCount']=len(items)
(P/'comparison-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
report += ['## 13. 확인 범위와 한계','', '- primary 경로 `/home/homebodify/Projects/ingradient-ui`, HEAD `4c414bf`, 6015 listener PID 79855의 cwd를 확인했다. 6016/worktree 화면은 사용하지 않았다. 새 worktree·의존성 설치·UI 소스 변경·commit/push 없음.',f'- fresh 원본 {len(records)}개, 전후 패널 10개, 추가 동작 결과 7개. 기존 캡처는 수정하지 않고 사본 위에 Pillow/Apple SD Gothic Neo로 번호·범례를 합성했다. 원본 이미지 비율과 픽셀 크기를 유지했다.','- readiness는 실제 컨트롤/문구·font ready·Images img.complete로 확인했다. 768은 중앙 최소폭을 지키는 desktop scroll 정책이며 화면 밖 패널이 사라진 것이 아니다.','- PS는 기존 모니터 선택 진입면과 신규 named Story의 비교다. 기존 UI 안에서 같은 버튼을 눌러 동일 모달로 간 전후 비교가 아니다. Export/system/inspector의 모든 신규 분기를 이번 10쌍에 담지는 않았다.','- [MCP preview 응답]('+prefix+'mcp-preview.json): 1회 호출에서 인자 schema 오류(`storyIds`가 아닌 `stories` 필요). 반복 호출/전체 테스트는 하지 않았고, 실제 Playwright 캡처를 증거로 사용했다. 이는 MCP preview 성공 보고가 아니다.','- 캡처 과정의 숨은 checkbox visibility 및 빈 화면 문구 selector 오류는 수정 후 재실행했다. 최종 이미지 생성은 완료했지만 full regression/a11y/device integration 검증을 새로 실행한 것은 아니다.','- 기능은 Storybook의 세션 한정 simulation. 실제 카메라·조명·서버·OS·파일·production 데이터 작업은 검증하지 않았다. 테마/폰트/fixture 차이 때문에 자동 pixel regression baseline으로 사용하면 안 된다.','', '재현 코드: [capture]('+prefix+'capture.cjs), [추가 menu/filter/768]('+prefix+'supplement.cjs), [Images 로딩 완료]('+prefix+'images-ready.cjs), [주석·manifest 생성]('+prefix+'render.py).','']
(R/'2026-09-21-edge-as-is-to-be.ko.md').write_text('\n'.join(report))
print({'pairs':len(items),'fresh':len(records),'proof':len(evidence),'images':len(manifest['images'])})
