---
title: Phase 3.5 — Phase 3 이후 후속 작업 묶음
date: 2026-05-10
scope: ingradient-ui ↔ ingradient-platform ↔ ingradient-edge
status: planning — 사용자 review 후 PR 단위 분해
parent: docs/MASTER-PLAN.md
---

# Phase 3.5 — Phase 3 이후 후속 작업

> Phase 0~3 완료 (2026-05-09 ~ 2026-05-10) 직후 발견된 후속 거리 모음. Phase 4 (장기 expansion) 진입 전, 단기/중기로 정리해야 할 PR들. 각 항목 D-012 (plan-first) 따라 별도 sub-plan + 사용자 합의 후 진행.

## 0. 요약 — 우선순위 순 PR 목록

| PR | 분류 | 거리 | 우선 |
|---|---|---|---|
| **PR-D1** ✅ | ui (도메인) | bbox/annotation overlay zoom 처리 기본화 (ImageViewer ↔ DrawingLayer 자동 연결) | 완료 |
| **PR-D2** | 검증 | 시각 검증 후 발견 issue fix | 단기 |
| **PR-D3** ✅ | ui (test) | Phase 2 신규 컴포넌트 단위 test 보강 (39 신규 tests) | 완료 |
| **PR-D4** ✅ | ui (storybook) | storybook a11y `'todo'` → `'error'` 전환 (41 enforced, 18 deferred → D4b) | 완료 |
| **PR-D4b** ✅ | ui (token + 컴포넌트) | color-contrast token + nested label fix → 11 stories newly enforced (18 → 7 deferred) | 완료 |
| **PR-D4c** ✅ | ui (story-level + 일부 component) | 8 stories Switch/Radio/textarea aria-label + Breadcrumbs aria-label prop + heading-order. global default 'error' 이행. 3 pattern/page 는 scrollable-region (구조적) 으로 explicit 'todo' | 완료 |
| **PR-D5** ✅ | edge | `tests/upload-error.test.ts` cleanup hook ENOTEMPTY fix (rm maxRetries 추가) | 완료 |
| **PR-D6** ✅ | edge | `@tanstack/react-virtual` dep 제거 (ui bundled) | 완료 |
| **PR-D7** ✅ | dev infra | edge ui sync 자동화 (`scripts/sync-ui.mjs` + watch 모드) | 완료 |
| **PR-D8** | git | platform + edge `wip:` commit 정리 | 중기 |
| Phase 4 | 장기 | light mode, new tokens, semantic colors, 새 ui 컴포넌트, monorepo | 장기 |

---

## 1. PR-D1 — bbox/annotation overlay zoom 처리 기본화 (최우선)

### 1.1 배경 — 현재 처리 현황

#### edge `BBoxCanvas` (라벨링 캔버스)
- `useZoomPan` hook + `<DrawingLayer>` 사용
- DrawingLayer 호출부 (`BBoxCanvas.tsx:635~638`):
  ```tsx
  <DrawingLayer
    objects={...} selectedId={...} drawingPreview={...}
    showHandles={...} showLabels
    containerWidth={containerSize.w} containerHeight={containerSize.h}
    previewColor={...} zoom={zoom}
  />
  ```
- crosshair (BBoxCanvas.tsx:640~647): `vectorEffect="non-scaling-stroke"` + `strokeWidth={1}` 직접 사용
- 결과: zoom 1→8 변경 시 bbox 선 두께/class label 크기 일정 ✅

#### ui `DrawingLayer` (drawing-layer.tsx:62~140)
- `containerWidth/Height` + `zoom` prop 받으면 정상 동작:
  - `s(px) = px / zoom` 으로 strokeWidth 보정
  - `vectorEffect="non-scaling-stroke"` 적용 (SVG 표준 — transform scale 무관 stroke 일정)
  - label `<g transform={scale(1/(cw*z), 1/(ch*z))}>` 로 일정 크기
  - handle ellipse `rx={HANDLE_PX/(cw*z)}` 동일
- 단 `containerWidth/Height` 둘 다 0 보다 커야 `uniform=true`. 누락/0 이면 fallback path (uniform=false) → strokeWidth 0.002 등 viewBox 비례 → zoom 시 두꺼워짐

#### ui `ImageViewer` (image-viewer.tsx)
- `useZoomPan` 자체 보유, transform 적용
- children 으로 overlay 받지만 **zoom + container size 를 children 에 자동 전달 X**
- caller 가 명시적으로:
  1. `<ImageViewer onZoomChange={setZoom}>` 으로 zoom 잡고
  2. ResizeObserver 또는 별도 wrap ref 로 container size 측정
  3. `<DrawingLayer zoom={zoom} containerWidth={...} containerHeight={...}>` 전달
- 빠뜨리면 fallback path → zoom 시 stroke 두꺼워짐

#### platform `AnnotationOverlay` (PR-1.3 추출)
- 자체 `<div>` + percentage 위치. DrawingLayer 미사용
- 현재 ClassImagesPanel 에서 zoom 미사용 → 두께 문제 없음
- 향후 zoom 도입 시 DrawingLayer 마이그 거리 (본 PR scope X)

### 1.2 사용자 의도

> "bbox 그리고서 확대할 때 bbox선의 두꺼워 지지 않게 하고, class도 커지지 않도록 ingradient edge랑 platform에서도 어떻게 처리 했었거든? 그게 ingradient ui에서 처리가 되지 않은 것 같은데. **이 처리가 기본이 되게 해줘.**"

→ ingradient-ui 의 ImageViewer 안에 DrawingLayer 를 children 으로 넣으면 caller 가 prop 신경쓰지 않아도 zoom 시 stroke/label 일정 크기 유지가 **자동 적용** 되도록.

### 1.3 옵션 비교

| 옵션 | 메커니즘 | 장점 | 단점 |
|---|---|---|---|
| **A (권장)** | ImageViewer 가 React Context (`ImageViewerContext`) 로 `{ zoom, containerWidth, containerHeight }` 공급. DrawingLayer 는 Context 있으면 자동 read, 없으면 기존 prop. props 는 explicit override 로 유지. | caller 보일러 0. 단독 사용 호환. type-safe. | DrawingLayer 가 Context 결합 (단 optional 이라 noop) |
| B | `React.cloneElement` 로 children 에 prop 자동 주입 | explicit | hacky. children 이 ReactElement 한정. fragment/배열 처리 까다 |
| C | 새 통합 컴포넌트 `BboxImageViewer({ src, objects, selectedId, ... })` 추가 | caller 단순 | components 증가. ImageViewer + DrawingLayer 직접 조합 사용처 (edge BBoxCanvas) cover X. governance D-007 의 "재사용 가능성" 만족 OK 지만 props 폭증 위험 |

→ **옵션 A 채택** 추천. governance 2.2 (props ≤ 5) 위반 없고, D-007 정신 (components 최소화) 만족.

### 1.4 구현 (옵션 A)

#### 1.4.1 ui `image-viewer.tsx` 변경
```tsx
import { createContext, useEffect, useRef, useState } from 'react'

export interface ImageViewerContextValue {
  zoom: number
  containerWidth: number
  containerHeight: number
}

export const ImageViewerContext = createContext<ImageViewerContextValue | null>(null)

export function ImageViewer({ src, alt, zoomOptions, onZoomChange, children, className }: ImageViewerProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  // ... 기존 useZoomPan ...

  // ResizeObserver — container 실 픽셀 측정
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setSize({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const ctx = useMemo(() => ({ zoom, containerWidth: size.w, containerHeight: size.h }), [zoom, size.w, size.h])

  return (
    <Wrap ref={wrapRef} ...>
      <ZoomLayer ...>
        <Img ... />
        <ImageViewerContext.Provider value={ctx}>
          {children}
        </ImageViewerContext.Provider>
      </ZoomLayer>
    </Wrap>
  )
}
```

#### 1.4.2 ui `drawing-layer.tsx` 변경
```tsx
import { useContext } from 'react'
import { ImageViewerContext } from './image-viewer'

export function DrawingLayer({
  objects, selectedId, drawingPreview,
  showHandles = true, showLabels = false,
  showCrosshair = false, cursorX, cursorY,
  containerWidth, containerHeight,
  previewColor = '#4a9eff',
  crosshairColor,
  zoom: zoomProp,
}: DrawingLayerProps) {
  // Context fallback — caller 가 prop 안 줘도 ImageViewer 안이면 자동 공급
  const ctx = useContext(ImageViewerContext)
  const cw = containerWidth ?? ctx?.containerWidth ?? 0
  const ch = containerHeight ?? ctx?.containerHeight ?? 0
  const z = zoomProp ?? ctx?.zoom ?? 1
  const uniform = cw > 0 && ch > 0
  // ... 이하 기존 로직 동일 ...
}
```

#### 1.4.3 sub-component 격리 (200줄 limit 점검)
- image-viewer.tsx 현재 100줄 → ResizeObserver + Context 추가로 ~140줄 예상. limit 안.
- drawing-layer.tsx 현재 245줄 → 이미 limit 초과. 본 PR 에서 split 같이 (옵션 A 추가만이면 +5 줄. split 은 별도 PR-D9 고려).

#### 1.4.4 edge BBoxCanvas — 변경 없음
- BBoxCanvas 는 ImageViewer 미사용 (자체 wrap + useZoomPan 사용). DrawingLayer 호출부 그대로 prop 전달 유지. Context 미발견 → prop 사용. 기존 동작 호환.

#### 1.4.5 platform AnnotationOverlay — 변경 없음 (별도 PR)
- 현재 zoom 미사용 → 영향 X
- 향후 ClassImagesPanel 에 zoom 도입 거리 발견 시 AnnotationOverlay → DrawingLayer 마이그 별도 PR

### 1.5 storybook 갱신
- `drawing-layer.stories.tsx` — 추가 시나리오:
  1. **ImageViewer 안에서 사용** (zoom 1→4 wheel) → stroke/label 일정 시각 확인
  2. **단독 사용** (prop 명시) — 기존 시나리오
  3. **prop 누락 fallback** — 두꺼워지는 시각 (의도적, fallback path 시각화)
- `image-viewer.stories.tsx` — overlay slot 예시 갱신

### 1.6 검증
- typecheck (ui)
- ui storybook: drawing-layer + image-viewer story 의 zoom 시각 회귀 (수동)
- edge dev server: 라벨링 화면 (`BBoxCanvas`) zoom 회귀 — 변경 없으니 동일 동작 기대
- platform dev server: ClassImagesPanel zoom 미사용 → 영향 X 확인만

### 1.7 위험 / trade-off

- **non-scaling-stroke 브라우저 호환**: Chromium/Firefox/Safari 14+ 지원. iOS Safari 12 이하 제한 있지만 보조 `strokeWidth = base/zoom` 으로 대부분 cover. 추가 우려 X.
- **Context 결합 우려**: DrawingLayer 가 ImageViewerContext 알게 됨 → 둘이 같은 module 그룹 (`data-display/`) 안. governance 위반 아님. 단 향후 DrawingLayer 만 별도 사용처 (예: 외부 zoom container) 가 있을 때 prop 으로 override 가능 → backward compat 유지.
- **ResizeObserver 비용**: ImageViewer 마다 1개 추가. 일반 case 부담 없음. zoom 안 쓰는 caller 도 ResizeObserver 동작하지만 size 변경 안 되면 setState 호출 X (initial 1회만).

### 1.8 영향 / 측정 지표
- ui: image-viewer +30 줄, drawing-layer +5 줄 (총 ~35 줄 추가)
- edge: 변경 없음
- platform: 변경 없음 (현재)
- 효과: ImageViewer 신규 사용처 (platform / 향후 프로젝트) 가 zoom + bbox overlay 결합 시 보일러 0 — zoom 시 시각 일정 자동

### 1.9 follow-up (본 PR 안 포함하지 않음)
- D-1' (별도): platform AnnotationOverlay 가 DrawingLayer 로 전환 — ClassImagesPanel zoom 도입 결정 시
- D-1'' (별도): edge BBoxCanvas 가 ImageViewer 사용으로 전환 (현재 자체 wrap + useZoomPan) — refactor 가치 vs 영향 검토 후

---

## 2. PR-D2 — 시각 검증 후 발견 issue fix

### 배경
- Phase 0~2 의 시각 검증은 D-013 합의에 따라 마지막 일괄 검증 (각 PR 마다 X)
- Phase 3 storybook 33 stories 작성으로 컴포넌트 단위 시각 확인 완료
- platform + edge dev server 띄워서 통합 시각 (real data + interaction) 확인 미완

### 절차
1. platform dev server 띄우기 (`cd ingradient-platform/frontend && npm run dev`)
2. edge dev server 띄우기 (`cd ingradient-edge && npm run dev`)
3. 사용자가 골든 패스 시각 확인:
   - platform: catalog 사이드바 / Add Dataset modal / catalog grid / classes panel / settings
   - edge: ImagesView grid + filter popover / 라벨링 캔버스 / SetupPanel / NicStatus / RightPanel ClassItem
4. 발견된 회귀/차이 → 본 PR 안에서 fix (각 issue 별 작은 commit)

### 위험
- 각 PR 의 시각 의도 (D-013 — ui 표준 통일) vs 사용자 기대 (platform 원래 분위기) 차이 발견 가능. 개별 합의 후 fix.

---

## 3. PR-D3 — Phase 2 신규 컴포넌트 단위 test 보강

### 대상 컴포넌트
- InfoRow (PR-0.2)
- CheckboxGroup (PR-A5)
- RadioCardGroup (PR-A6)
- StepIndicator (PR-B2)
- FilterPopover + FilterPopoverSection (PR-B4)
- SelectableListItem (PR-C1)
- ModeSwitcher (기존, 누락)

### 시나리오 (각 컴포넌트 ~3-5 케이스)
- render with default props
- props variant (size, variant, disabled 등)
- interaction (click, change, keyboard)
- a11y (role, aria-attribute)

### 위험
- 시간 배분: 7 컴포넌트 × 4 케이스 ≈ 28 test. 1 PR 에 묶으면 큼 → 2~3 PR 분할 고려 (예: D3a inputs / D3b data-display / D3c overlays).

---

## 4. PR-D4 — Storybook a11y enforce ✅ **완료 (2026-05-10)**

### 작업
1. 54 stories + global preview.tsx `'todo'` → `'error'` 일괄 변경 (애초 33 외 기존 21도 함께)
2. `npx vitest run --config vitest.storybook.config.ts` 결과: 19 stories fail
3. fail 분류:
   - **trivial fix (1 story)**: text-fields PasswordField/TextField/TextareaField 에 `aria-label` 추가 → pass
   - **color-contrast (12 stories explicit 'todo')**: 활성 accent state 흰 글씨 배경 대비 1.81:1, placeholder text-soft 위 surface-panel 위 등 — token 단계 조정 거리 → 별도 PR-D4b
   - **inheriting 'todo' (6 stories)**: explicit a11y 없음, preview.tsx 글로벌 통해 'todo' inherit. dialog-shell, tag-list, settings-workspace-page, dashboard-grid, shell-and-layouts, interaction-utils-lab — 마찬가지 PR-D4b
4. preview.tsx 글로벌은 `'todo'` 로 복귀 (status quo) — explicit `'error'` opt-in 모델
5. 결과: 102 storybook tests 모두 pass (text-fields explicit 'error' 1 추가, 12 stories explicit 'todo' 유지)

### 결과
- 'error' enforced (explicit): 약 41 stories
- 'todo' (explicit): 12 stories
- 'todo' (inherit from global): 6 stories
- 향후 PR-D4b 에서 18 deferred 의 색 토큰 조정 + a11y fix

### 후속 PR-D4b ✅ **완료 (2026-05-10)** — color-contrast 토큰 + nested label fix

#### 컴포넌트 fix
1. **ModeSwitcher**: active state `accent-soft` (= solid `#8cb6ff`) + `text-primary` (light) → `accent-soft-surface` (transparent tint) + `accent` color. RadioCardGroup 과 동일 패턴. contrast 1.81 → pass
2. **textSoft 토큰**: `#708196` → `#7e8fa3` — surface-panel(`#1a1e26`) 위 contrast 4.19 → 4.7 (>= 4.5 만족). 광범위 영향 — D-001 정신 따라 새 토큰 추가 X
3. **upload-dropzone disabled**: `opacity: 0.5` 제거 + `text-soft` 직접 사용 (composition `#545c68` 2.7:1 fix)
4. **CheckboxGroup**: ItemRow `<label>` → `<div>` + Checkbox label prop 위임 (nested label = 잘못된 markup, axe 가 hidden input 못 찾음)

#### 결과
- Phase 3.5 시작 시 19 fail → 본 PR 완료 시 8 fail = 11 newly enforced
- 8 fail 모두 "Form elements must have labels" — story 안 Switch/Radio 직접 사용 (label prop 없음). component-level 문제 아님 — story rewrite 거리 → PR-D4c 분리

#### 영향
- textSoft 톤 변경 (#708196 → #7e8fa3) 은 **모든 사용처에 약간 lighter** 시각 적용. 약 50+ 곳 사용 — visual regression 검증 거리 (PR-D2 후속)
- ModeSwitcher 시각 변경 — active state 가 solid blue → tint blue + accent text. 더 일관되고 가벼운 시각

---

## 4b. PR-D4c — story-level a11y rewrite ✅ **완료 (2026-05-10)**

### 대상 + fix 적용

| story | violation | fix |
|---|---|---|
| filter-popover | nested `<label>` 안 Switch | Switch `label="Local only"` prop 위임 |
| assignment-row | bare Switch (no label/aria-label) | `aria-label="..."` 추가 |
| settings-dialog | bare `<input>` | `aria-label="Workspace name"` 추가 |
| form-section | TextField/Switch no label | `aria-label="..."` 추가 (FieldRow visual label 옆에) |
| interaction-utils-lab | bare `<input>` | `aria-label` 추가 |
| mention-textarea | bare `<textarea>` | **컴포넌트 자체에 `aria-label` prop 추가** + placeholder fallback |
| breadcrumbs | landmark-unique (4 nav 동일 aria-label) | **Breadcrumbs 에 `ariaLabel` prop 추가** + 각 story 인스턴스에 unique label |
| charts (States) | heading-order 점프 (h1 → h3) | StorybookSection 추가 (h1 → h2 → h3) |

### 컴포넌트 변경
- `Breadcrumbs`: `ariaLabel?: string` prop 추가 (default 'Breadcrumb')
- `MentionTextarea`: `'aria-label'?: string` prop 추가 — textarea 에 spread, placeholder fallback

### global default 이행
- preview.tsx 의 a11y `test` 글로벌 → `'error'` (D4 직후 'todo' fallback 이었음)
- 3 stories 만 explicit `'todo'` (구조적 scrollable-region 위반):
  - stories/pages/settings-workspace-page.stories.tsx
  - stories/patterns/dashboard-grid.stories.tsx (TanStack Table scroll container)
  - stories/patterns/shell-and-layouts.stories.tsx

### 결과
- 102 storybook tests pass (3 explicit 'todo' 제외)
- a11y enforced: 99 stories error mode + 3 deferred (scrollable-region — Phase 4 거리)

### 후속 거리 PR-D4d ✅ **완료 (2026-05-10)** — scrollable-region a11y

#### 컴포넌트 변경
- **Table**: `TableWrap` 에 `tabIndex=0 + role=region` + focus-visible outline 추가. `ariaLabel?: string` prop (default "Data table") — 다중 Table 상황에서 unique label 필요

#### 스토리 fix
- dashboard-grid: 2 Table 에 unique `ariaLabel` ("Active queues — realistic" / "Queue summary — overloaded")
- shell-and-layouts: 4 SidebarNav 에 unique `aria-label` (Desktop/Mobile/AppShell/NavigationReview)
- settings-workspace-page: FieldBlock `<input>` 에 `aria-label="Workspace name"`

#### 결과
- **102 storybook tests pass + 모든 stories 'error' enforced (3 deferred → 0)**

---

## 5. PR-D5 — edge tests/upload-error.test.ts cleanup hook ENOTEMPTY fix ✅ **완료 (2026-05-10)**

### 원인
- 두 `describe` 의 `after` 가 `rm(tmpDir, { recursive: true, force: true })` 실행
- sql.js `persistDbSafe` 가 async 라 cleanup 시점에 backend 가 file 쓰는 race → ENOTEMPTY

### fix
- 두 `after` 의 `rm` 옵션에 `maxRetries: 3, retryDelay: 100` 추가 — 표준 race mitigation
- afterAll/afterEach 분할은 불필요 — `node:test` 의 `after` 는 이미 describe 단위. 재시도만으로 충분

### 검증
- 67 edge tests pass (upload-error 1-1~2-5 + 다른 suite). retry 동작은 race 발생 시에만 invoke

---

## 6. PR-D6 — edge `@tanstack/react-virtual` dep 제거 ✅ **완료 (2026-05-10)**

### 작업
1. `package.json` 에서 `@tanstack/react-virtual: ^3.13.23` 라인 삭제
2. `src/` 직접 import 검색 — 0건 확인
3. `npm install --prefer-offline` → `package-lock.json` 자동 갱신
4. typecheck — 새 error 없음 (pre-existing sql.js / favicon / ElectronAPI typing 만)

### 결과
- transitive dep 으로 `@ingradient/ui` 가 여전히 보유 (lockfile peer 표시)
- edge 직접 의존성 list 에서 제거 → version drift 위험 감소

---

## 7. PR-D7 — edge ui sync 자동화 ✅ **완료 (2026-05-10)**

### 결정 (옵션 A 채택)
- 새 dep 추가 없이 Node 내장 `fs.watch({ recursive: true })` (Node 20+ Linux 지원) 활용
- chokidar 거부 — 단일 dev script 위해 dep 추가는 과한 비용

### 산출물
- **`scripts/sync-ui.mjs`**: one-shot 또는 `--watch` 모드. `fs.cp(recursive)` 로 `../ingradient-ui/lib` + `package.json` → `node_modules/@ingradient/ui/`
  - debounce 250ms (tsup 가 burst 로 다수 파일 쓰기)
  - env `INGRADIENT_UI_PATH` 로 경로 override 가능
- **package.json scripts 추가**: `sync-ui` (one-shot), `sync-ui:watch` (자동)

### 사용 흐름
```
# Terminal 1 (ui repo)
cd ingradient-ui && npm run dev:lib       # tsup --watch

# Terminal 2 (edge repo)
cd ingradient-edge && npm run sync-ui:watch  # ui/lib 변경 감지 + 자동 cp

# Terminal 3 (edge repo)
cd ingradient-edge && npm run dev          # electron + backend
```

### 검증
- one-shot: PR-D1 의 `ImageViewerContext` 가 ui lib build 후 sync 시 edge `node_modules/@ingradient/ui/lib/components.js` 에 4 occurrences 반영 확인
- watch: 구현 완료, 사용 시 검증 (장시간 watch 테스트 생략)

### 영향 / D-014 후속
- 기존 D-014 의 "수동 cp 또는 npm pack" 흐름 자동화
- 향후 monorepo 전환 (Phase 4) 시 본 script 가 자연 deprecate

---

## 8. PR-D8 — platform + edge `wip:` commit 정리

### 현황
- platform: `812b590 wip: save current platform changes` — Phase 0~3 결과 묶음
- edge: `257bd32 wip: save current edge changes` — 동일
- 한국어 commit 규칙 (CLAUDE.md) 위반

### 작업
1. interactive rebase (사용자 합의 후) — `git rebase -i HEAD~N`
2. 각 wip 을 PR 단위로 분할:
   - feat(catalog): SelectableListItem 마이그
   - feat(catalog): MenuPopover anchor 적용
   - feat(catalog): TextField size 적용
   - ... 등
3. force push (사용자 합의 후)

### 위험
- rebase + force push = 위험 작업 (CLAUDE.md 시스템 가이드). 별도 합의 필요. 본 PR 진행 전 사용자가 명시적 OK 줘야 함.

---

## 9. Phase 4 — 장기 (참고)

본 plan scope 외. master plan § 4.4 / § 5 참고.

- light mode (token swap)
- 새 spacing/radius/shadow 단계 (실 사용처 발견 시)
- semantic color (`--ig-color-warning-soft` 등)
- 새 ui 컴포넌트 (소비자 needs 발견 시)
- monorepo 또는 npm workspace 전환 (D-014 후속, PR-D7 옵션 B 의 본 거리)

---

## 10. 진행 순서 권장

```
PR-D1 (bbox zoom 기본화) ─ 최우선, 사용자 명시 요청
   ↓
PR-D2 (시각 검증 fix) ─ 사용자가 dev server 시각 확인 후
   ↓
PR-D3 (test 보강) ─ 회귀 안전망 강화
   ↓
PR-D4 (a11y enforce) ─ storybook 의무화
   ↓
PR-D5 (edge test fix) + PR-D6 (dep 제거) ─ 병렬 가능
   ↓
PR-D7 (sync 자동화) ─ dev infra 개선
   ↓
PR-D8 (commit 정리) ─ 사용자 명시 합의 후만
   ↓
Phase 4 진입 검토
```

D-012 따라 각 PR 시작 전 별도 sub-plan + 사용자 합의.

---

## 부록 A — bbox zoom 처리 SVG 트릭 정리 (PR-D1 참고)

zoom 시 stroke 두께 / label 크기 일정 유지 = SVG transform scale 무관 표시 = 두 가지 방법 결합:

1. **`vector-effect="non-scaling-stroke"`** (SVG 표준)
   - stroke 가 transform scale 무관으로 1:1 픽셀 두께 유지
   - 단 일부 구형 브라우저 제한 있음
2. **수동 보정 — `strokeWidth = base / zoom`**
   - 1번 미지원 시 fallback. zoom 2배 = strokeWidth 절반.
3. **label 크기 — `transform=scale(1/(cw*z), 1/(ch*z))`**
   - SVG `viewBox="0 0 1 1"` 안 normalized 좌표계라 label fontSize 11px 유지하려면 컨테이너 크기 + zoom 으로 역스케일

세 가지 모두 조합 시 zoom 1→8 변경에도 시각 두께/크기 일정. ui DrawingLayer 가 이미 구현 — 본 PR 은 caller 보일러 제거 (Context 자동).
