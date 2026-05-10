---
title: Phase 5 — components/ 최소화 audit (도메인 공통 패턴 추출)
date: 2026-05-10
scope: ingradient-ui (foundation) + ingradient-platform / ingradient-edge (consumers)
status: planning — 사용자 review 후 PR 단위 진행
parent: docs/MASTER-PLAN.md
---

# Phase 5 — components/ 최소화 audit

> Phase 0~3 (D-010 의 11 PR + Phase 3.5/4 후속) 이후 양 repo components/ 추가 sweep. 회사 프로젝트들이 *이미지 분석/라벨링* 도메인 공통성 위에 있다는 인식 반영 — § 2.5 거부 명단 재검토 + Pattern layer 추출.

## 1. 핵심 인식 — 3-layer 분류 (D-018 신규)

`components/ 최소화 ≠ 무조건 ui 이전`. 다음 3 layer 로 분류:

| Layer | 정의 | ui 이전 여부 | 예 |
|---|---|---|---|
| **Primitive** | building block. 도메인 무관 generic shape | ✅ 적극 ui | Button, Modal, ImageViewer, DrawingLayer, InfoRow, CommentThread |
| **Pattern** | primitive 조합 layout. 도메인 무관 slot 인터페이스 | 🟡 slot 형태 ui | `<ImageDetailShell sidebar={...} content={...} />`, `<SettingsLayout />`, `<LabelingShell />` |
| **Page** | Pattern + 도메인 logic. 도메인 model + store 결합 | 🔴 components/ 유지 | platform CatalogImageDetailModal, edge BBoxCanvas (SAM/ROI), 회사 설정 폼 |

**§ 2.5 거부 명단 의미 재정의**:
- "Page 거부" 가 정확
- Pattern 은 slot 인터페이스로 ui 후보 (이번 audit 에서 식별)
- Primitive 는 D-007 정신대로 적극 추출

## 2. 양 repo inventory 요약

| repo | components 줄수 | 주요 영역 |
|---|---|---|
| platform | ~17,825 | image-detail (gallery), settings, dialogs, catalog, classes, dashboard |
| edge | ~11,686 | capture (labeling), settings, log, system, stats |
| ui | ~50 컴포넌트 | data-display, overlays, navigation, feedback, inputs, charts |

### 큰 파일 (split / 추출 거리 후보)

| 파일 | 줄수 | 비고 |
|---|---|---|
| edge ImagesView.tsx | 1272 | Phase 1 PR-1.5 후 (-172). 추가 추출 거리 약함 |
| platform image-detail-modal.tsx | **765** | ⭐ 거대. Pattern (ImageDetailShell) 추출 + sub-component 분리 후보 |
| edge BBoxCanvas.tsx | **725** | ⭐ labeling canvas + SAM ROI + isoLine + colormap. SAM/ROI/isoLine 분리 |
| edge SetupPanel.tsx | 451 | PR-B1 후 부분 처리 |
| edge ConnectionTab.tsx | 508 | PR-0.1 후 |
| edge FieldTestTab.tsx | 541 | 도메인 특수 (필드 테스트 wizard) |
| platform InvitationsTab.tsx | 459 | 도메인 특수 (조직 초대) |
| edge SurfaceVizControls.tsx | 524 | 도메인 특수 (deflectometry) |
| edge DeflectometryTuningControls.tsx | 533 | 도메인 특수 |

→ **⭐ 표시 = Phase 5 핵심 거리**. 도메인 특수 (FieldTest, SurfaceViz, Deflectometry) 는 page-specific 유지.

## 3. 추출 거리 식별 (PR 단위)

### PR-E0g ⭐⭐ UploadDropzone disabled visual affordance 강화 (발견 약점)

**증상**: ui Storybook UploadDropzone "Disabled state" 카드가 active 상태와 거의 동일 — 텍스트 색만 약간 흐릿. 사용자가 "지금 비활성"임을 인지하기 어려움.

**원인 + 이력**: PR-D4b 에서 `opacity: 0.5` 제거 (a11y contrast 이유 — text-muted on white at 50% opacity 가 contrast 2.7:1 fail). text-soft 직접 사용으로 a11y 통과는 했지만 시각적 disabled 표시 약화.

**현재** (upload-dropzone.tsx:11~17):
```tsx
border: 2px dashed ${(p) => (p.$active ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-border-subtle)')};
background: ${(p) => (p.$active ? 'var(--ig-color-accent-soft-surface)' : 'transparent')};
color: ${(p) => (p.$disabled ? 'var(--ig-color-text-soft)' : 'var(--ig-color-text-muted)')};
cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};
```

**Fix**: disabled 시 `background: var(--ig-color-surface-muted)` + 약간 weaker border. a11y contrast 유지 (text-soft 가 surface-muted 위 4.5:1 이상 — text-soft #7e8fa3 light vs surface-muted #f7f9fb light → contrast OK)

```tsx
border: 2px dashed ${(p) =>
  p.$disabled
    ? 'var(--ig-color-border-subtle)'
    : p.$active
      ? 'var(--ig-color-accent-soft)'
      : 'var(--ig-color-border-strong)'};
background: ${(p) =>
  p.$disabled
    ? 'var(--ig-color-surface-muted)'
    : p.$active
      ? 'var(--ig-color-accent-soft-surface)'
      : 'transparent'};
color: ${(p) => (p.$disabled ? 'var(--ig-color-text-soft)' : 'var(--ig-color-text-muted)')};
cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};   // not-allowed 가 더 명확
```

**검증**:
- ui storybook 시각: disabled 카드가 명확히 darker/grayer
- 양 mode (light/dark) 모두 a11y contrast 만족
- ui storybook 102 tests pass

**효과**: 발견 약점 fix + UploadDropzone disabled affordance 명확. PR-D4b 정신 (opacity 안 사용 + token 활용) 유지.

---

### PR-E0f ⭐⭐ SearchField double clear button fix (발견 버그)

**증상**: ui Storybook SearchField input 에 텍스트 입력 + 클릭 시 우측에 × 가 *두 개* 표시.
- 좌측 큰 ×: 컴포넌트의 custom `<ClearBtn>`
- 우측 작은 ×: 브라우저 native `<input type="search">` clear 버튼

**근본 원인** (search-field.tsx:64):
```tsx
<Input ref={ref} type="search" $size={size} value={value} {...rest} />
```
- `type="search"` 가 브라우저 native clear button (`::-webkit-search-cancel-button`) 자동 표시
- 컴포넌트는 이미 custom ClearBtn 제공 → 중복

**Fix**: `type="text"` 사용 + (보조) `::-webkit-search-cancel-button { display: none; -webkit-appearance: none; }` 추가

```tsx
<Input ref={ref} type="text" $size={size} value={value} {...rest} />
```

**type="search" → "text" 영향**:
- 사라지는 native 동작: native clear button (이미 custom 으로 cover), Escape clear (컴포넌트 onClear 로 cover 가능 — 별도 필요 시)
- 변경 없음: 입력/포커스/style 모두 동일

**검증**:
- ui storybook: × 1개만 정상 표시
- consumer 영향 없음 (semantic input type 만 변경)
- ui storybook 102 tests pass

**효과**: 발견 버그 fix + 의도한 custom UI 만 표시

---

### PR-E0e ⭐⭐ DropdownSelect / SelectField menu portal 렌더 (발견 버그)

**증상**: ui Storybook DropdownSelect "Variants" 의 Date preset trigger 클릭 시 menu 가 trigger 바로 아래가 아니라 *섹션 한참 아래* 로 표시.

**근본 원인 추정** (dropdown-shared.tsx:67~85):
```tsx
export const DropdownMenu = styled.div...`
  position: fixed;
  ...
`
```
- `position: fixed` 는 *원칙적* 으로 viewport 기준
- 단 ancestor 에 `transform`, `filter`, `contain: layout/paint` 같은 *containing block creator* 가 있으면 fixed 가 그 ancestor 기준이 됨
- Storybook iframe / 특정 layout 조건에서 이런 영향이 발생 — getBoundingClientRect 좌표 vs 실제 fixed 위치 mismatch
- platform/edge 에서는 안 보임 (어떤 조건이 다른지 정확하지 않으나 ui-level 강건성 부족)

**Fix**: `createPortal(menu, document.body)` 로 menu 를 body 에 직접 렌더 — ancestor CSS 영향 0 + position fixed 가 viewport 기준 보장

```tsx
import { createPortal } from 'react-dom'

{open && menuLayout && createPortal(
  <DropdownMenu role="listbox" $layout={menuLayout}>
    {options.map(...)}
  </DropdownMenu>,
  document.body
)}
```

**대상**:
- `dropdown-select.tsx` (DropdownSelect)
- `select-field.tsx` (SelectField — dropdown-shared 사용)
- 둘 다 동일 패턴

**검증**:
- ui storybook 시각: menu 가 trigger 바로 아래에 정상
- click outside 닫기 동작 — 이미 document mousedown listener 가 rootRef.current 안 검사 → portal 렌더해도 동작 유지
- platform/edge 회귀 없음 (portal 사용은 기존 layout calc 보존, 위치 안정성만 향상)
- ui storybook 102 tests pass

**효과**: 발견 버그 fix + 어떤 ancestor 컨텍스트에서도 robust. FilterPopover 도 동일 처리 거리 있을 수 있음 (별도 PR).

---

### PR-E0d ⭐⭐ NotificationBadge bubble position fix (발견 버그)

**증상**: ui Storybook NotificationBadge "Compact trigger review" 카드에서 bubble (9, 2) 이 icon 우측 상단이 아닌 *카드 우측 상단* 에 표시.

**근본 원인** (notification-badge.tsx:4~10):
```tsx
const Root = styled.span`
  position: relative;
  display: inline-flex;
  ...
`
```
- `Root` 가 `inline-flex` 라 *block flow* 부모 안에서는 content 크기로 wrap (정상)
- 단 *flex 부모* (StorybookCard 의 `display: flex; flex-direction: column`) 안에서는 default `align-items: stretch` 가 자식 cross-axis 를 부모 width 까지 stretch
- `inline-flex` 여도 flex item 으로서 stretch → Root 가 카드 전체 너비 차지 → `Bubble` 의 `top: 0; right: 0` 가 카드 우측 상단에 위치

**Fix**: `Root` 에 `width: fit-content` 추가. flex item 의 stretch 무시 + 모든 부모 컨텍스트에서 content 만큼 wrap

```tsx
const Root = styled.span`
  position: relative;
  display: inline-flex;
  width: fit-content;        // 추가
  align-items: center;
  ...
`
```

**검증**:
- ui storybook 시각: bubble 이 icon 바로 우측 상단
- consumer 영향: 만약 consumer 가 의도적으로 Root 를 stretch 시켰던 경우 시각 변화 가능 (드물 것 — typical 사용 = icon trigger wrap)

**효과**: 발견 버그 fix + flex 부모 안에서도 robust 한 inline 컴포넌트

---

### PR-E0c ⭐⭐ VirtualizedImageGrid overflow fix (발견 버그)

**증상**: ui Storybook VirtualizedImageGrid 의 "Basic 20 items, 4 columns" + "Large dataset" 카드에서 grid 셀이 wrapper 경계 밖으로 흘러나옴 + 다음 section 위로 겹침.

**근본 원인** (virtualized-image-grid.tsx:7~11):
```tsx
const Scroll = styled.div`
  overflow-y: auto;
  min-width: 0;
  position: relative;
`
```
- `Scroll` 에 **`height` 가 없음**
- TanStack `useVirtualizer({ getScrollElement: () => parentRef.current })` 가 Scroll 의 viewport 측정
- height 가 없으면 Scroll 이 Inner ($totalHeight = rowCount × estimatedItemHeight) 까지 자람 → 200×5 grid 면 ~9600px
- 부모의 `<div style={{ height: 480 }}>` 가 clip 의도지만 Scroll 자체가 480px 안 채움 → 가상화 viewport 거대 → 모든 row 렌더 + overflow

**왜 platform/edge 에서 안 보였나?** consumer 가 직접 `display: flex; min-height: 0;` 처리한 부모 안에 두거나, `height: 100%` 명시한 wrapper 안에 두는 패턴이 우연히 작동했을 가능성. ui-level 버그.

**Fix** (1줄):
```tsx
const Scroll = styled.div`
  height: 100%;
  overflow-y: auto;
  min-width: 0;
  position: relative;
`
```

**검증**:
- ui storybook 시각: 셀이 wrapper 안에서 정상 가상화 + 스크롤
- ui storybook 102 tests pass
- platform/edge 시각 회귀 없음 (consumer 가 wrapper height 명시했으면 동일, 명시 안 했으면 100% 가 자연스럽게 동작)

**효과**: 발견 버그 fix + ui API consumer-friendly (wrapper height 만 주면 됨)

---

### PR-E0a ⭐⭐ ChartContainer story 실 chart 예시로 (Storybook UX 개선)

**증상**: ui Storybook ChartContainer 스토리가 5 곳 모두 `<Placeholder label="(chart area)" />` 텍스트 placeholder. 컴포넌트 실 사용 모습 안 보임 — 비직관적.

**해결**:
- `chart-container.stories.tsx` 의 5 Placeholder → 실 차트 (recharts 또는 ui `BarChartCard / LineChartCard / PieChartCard` 의 inner 사용)
- "Basic" section: LineChart with sample trend data
- "With legend" section: stacked BarChart with synced/pending/failed series + ChartLegend
- "Loading" section: ChartContainer loading=true (skeleton). chart child 는 dummy LineChart (loading 가려짐)
- "Empty" section: ChartContainer empty=true. 동일
- "Custom height" section: 다른 높이 LineChart

**스코프**: stories 파일 1개 수정. 약 +50 ~ -10 줄. 컴포넌트 변경 0.

**검증**:
- ui storybook 102 tests pass (양 mode)
- 시각: chart 가 실제 렌더되어 직관적 — 사용자 재확인

**효과**: chart-container.stories 가 "실제 어떻게 쓰는지" 보여줌. caller 가 ui chart cards 마이그 (PR-E10) 시 reference 로 사용.

---

### PR-E0b ⭐⭐ DrawingLayer 자체 measure (최우선 — 발견 버그 fix)

**증상**: ui Storybook DrawingLayer 의 "Annotation set / Selected object / Drafting preview" 카드에서 class label 글자가 위아래로 눌림. platform/edge 실 사용에서는 정상.

**근본 원인** (drawing-layer.tsx:145):
```tsx
<g transform={`translate(${obj.x}, ${obj.y}) scale(${1 / (cw * z)}, ${1 / (ch * z)})`}>
```
- 비-등방성 (non-uniform) x/y scale — `cw ≠ ch` 일 때 글자 aspect ratio 왜곡
- viewBox `0 0 1 1` + `preserveAspectRatio="none"` 와 결합 시 *position 은 맞지만 glyph 모양 왜곡*
- **prop `containerWidth/Height` 가 실 DOM 크기와 다를 때만 발생** (스토리북 caller 가 하드코딩 640/360 vs 실 DOM 320x280 등 가변 — mismatch)

**왜 platform/edge 는 정상?**
- BBoxCanvas + ImageViewer 모두 `ResizeObserver` 로 컨테이너 실측 → prop 값과 실제 DOM 크기 일치 → 왜곡 없음
- 즉 **PR-D1 의 Context auto-supply (ImageViewer + ResizeObserver) 가 적용된 곳에서만 정상**

**해결 — DrawingLayer 자체 ResizeObserver**:
- `useRef<SVGSVGElement>` + `useEffect` 로 SVG 자신의 contentRect 측정
- 우선순위: `prop > Context > self-measured > 0`
- caller 가 prop 안 주고 ImageViewer 안에도 안 들어가는 standalone 사용 시 자동 정상 동작

**구현**:
```tsx
const svgRef = useRef<SVGSVGElement>(null)
const [measured, setMeasured] = useState({ w: 0, h: 0 })
useEffect(() => {
  const el = svgRef.current
  if (!el) return
  const ro = new ResizeObserver(([entry]) => {
    if (!entry) return
    const { width, height } = entry.contentRect
    setMeasured((p) => (p.w === width && p.h === height ? p : { w: width, h: height }))
  })
  ro.observe(el)
  return () => ro.disconnect()
}, [])

const cw = (containerWidth ?? ctx?.containerWidth ?? measured.w) || 0
const ch = (containerHeight ?? ctx?.containerHeight ?? measured.h) || 0
```

**Storybook 정리**:
- `drawing-layer.stories.tsx` 의 3 standalone 카드에서 `containerWidth/Height` 명시 prop 제거 — self-measure 동작 검증

**검증**:
- typecheck pass
- ui storybook 102 tests pass (양 mode)
- 시각: 라벨 글자 정상 비율 (사용자 storybook 시각 확인)
- platform/edge 영향 없음 (prop 명시 + Context 둘 다 우선순위 위)

**추가 효과**: ImageViewer 안 사용 시 Context fallback. 그 외 standalone 사용 시 self-measure. **API 단순화** — caller 가 prop 신경쓸 일 거의 없음 (D-007 정신 — components 최소화 + ui simple).

**MASTER-PLAN D-016 보강**: Context 우선 + self-measure fallback. DrawingLayer 가 어디 쓰여도 정상.

→ **본 PR 을 Phase 5 의 시작점 + 단독 진행 (다른 PR 보다 먼저)**. Phase 5 plan 의 다른 거리는 본 fix 이후 진행.

---

### Group A — Pattern 추출 (도메인 공통 layout)

#### PR-E1 ⭐ ImageDetailShell (Pattern) ui 신규
**의도**: platform `image-detail-modal` 과 edge labeling `ImagesView` 의 공통 layout (Modal + Image area + Right sidebar + Toolbar) 을 ui Pattern 으로 추출. *도메인 logic 0*, slot 인터페이스만.

**API**:
```tsx
<ImageDetailShell
  open={open}
  onClose={onClose}
  imageArea={<ImageViewer src={src}><DrawingLayer ... /></ImageViewer>}
  sidebar={<MyClassList />}            // 도메인 logic 은 caller
  toolbar={<MyToolbar />}                // (cursor/bbox/save/skip)
  bottomBar={<MyMetadata />}             // optional
  width="95vw"                           // configurable
  sidebarWidth={320}                     // configurable
/>
```

**현재 platform image-detail-modal.tsx (765줄) 내 layout 부분**:
- Backdrop / ModalContent / MainArea (~80줄) → ui 흡수
- ImageAndTabsCol / ImageWrap / ZoomWrap (~30줄) → ui 흡수 (또는 ImageViewer 사용)
- ClassSidebarResizer / ClassSidebar (~40줄) → ui 흡수 (ResizablePanel 활용)

**현재 edge ImagesView.tsx 내 layout 부분**:
- 이미 PR-1.5 로 grid 추출. 라벨링 화면의 Modal + canvas + RightPanel layout 은 별개 — BBoxCanvas 로 통합되어 있음

**효과**: platform image-detail-modal 약 -150줄 (layout styled 제거). edge 영향 적음 (이미 fullscreen + RightPanel 분리).

**위험**: Modal 95vw 가 platform 만의 결정인지 검증 필요. edge labeling 은 fullscreen 이라 Modal 자체 안 씀.

#### PR-E2 AnnotationOverlay 통합 (Primitive 추가 추출)
**의도**: platform `AnnotationOverlay` (87줄, PR-1.3 추출) + edge `BboxOverlay` (33줄, PR-1.5 추출) 가 *비슷한 의도* (이미지 위에 bbox/point 레이어). 통합 가능.

**현재 차이**:
- platform: `<div>` + percentage. zoom 미처리. classes color map.
- edge: SVG + viewBox. zoom 미처리 (썸네일용). object-fit: cover 보정.

**API**:
```tsx
<AnnotationOverlay
  bboxes={...}
  points={...}
  classColors={{...}}
  imageWidth={w}
  imageHeight={h}
  fit="contain" | "cover"            // 양 케이스 cover
  selectedClassId?={id}              // platform classes filter
/>
```

**효과**: platform AnnotationOverlay 87줄 + edge BboxOverlay 33줄 → ui 단일 (~100줄). 양 repo 합 -120줄.

**위험**: SVG vs div 시각적 정합성 검증 필요. zoom 환경에서 사용할 때 vector-effect 처리 (PR-D1 의 DrawingLayer 정신).

### Group B — 큰 파일 split

#### PR-E3 ⭐ platform image-detail-modal.tsx split (765 → < 200 each)
**의도**: 200줄 limit 위반 (governance § 2.2). Sub-component 추가 추출.

**식별 sub-component**:
- ImageDetailModalCanvas (zoom + drawing + class color) ~250줄 — ImageDetailCanvas.tsx (298) 와 통합?
- ImageDetailModalToolbar (cursor/bbox/zoom 등) ~100줄 — ImageDetailToolbar.tsx (175) 와 통합?
- ImageDetailModalShell (modal + layout) ~100줄 — PR-E1 의 ImageDetailShell 사용

**effect**: 765 → 약 300줄 main + sub-components. 200 limit 만족.

#### PR-E4 edge BBoxCanvas.tsx split (725 → < 400 each)
**의도**: 200줄 limit 위반. 도메인 layer (SAM ROI / isoLine) 추가 분리.

**식별**:
- 이미 sam-roi/SamRoiLayer.tsx (217) 분리됨
- 이미 IsoLineOverlay.tsx (154) 분리됨
- BBoxCanvas 내부에 ROI edit / Modulation overlay / Debug overlay logic 잔여 (~300줄)
  - ModulationOverlay → 별도 파일 (75줄)
  - DebugOverlay → 별도 파일 (60줄)
  - ROI edit logic → useRoiEdit hook (50줄)

**effect**: 725 → 약 350줄 main + 3 sub-files.

**위험**: edge labeling 은 안정 동작 중. split 시 회귀 가능성 — 단위 test 추가 필요

### Group C — 추가 audit 거리

#### PR-E5 ImageDetailComments.tsx audit (193줄 platform)
**의도**: 이미 ui CommentThread 사용 중 (확인됨). wrap 줄수 / 도메인 처리만 남았는지 확인. 더 마이그 가능 시 진행.

#### PR-E6 ImageDetailContextMenu.tsx audit (130줄 platform)
**의도**: ui MenuPopover 사용 중인지 확인 + wrap 줄수 검증.

#### PR-E7 ImageDetailToolbar.tsx audit (175줄 platform)
**의도**: toolbar 패턴이 ui 후보인지 검토 — `image-viewer-toolbar.tsx` 가 이미 ui 에 있음. 통합 가능?

#### PR-E8 RightPanel audit (193줄 edge labeling)
**의도**: edge 라벨링 우측 패널 — class list (SelectableListItem 마이그됨, PR-C1) + bbox list + comment (CommentThread). 추가 마이그 거리 있는지.

#### PR-E9 ImageDetailSidebar / ImageDetailSidePanel / ImageDetailClassList (platform)
**의도**: image-detail 의 우측 sidebar 패턴. PR-E1 의 ImageDetailShell sidebar slot 사용으로 정리 가능

### Group E — Cross-repo 중복 통합 (양 repo 모두 사용)

추가 sweep 발견. *이미 ui 에 컴포넌트 있는데 양 repo 에서 마이그 안 한* 영역 + *양 repo 에서 비슷한 modal/form 을 각자 styled* 영역.

#### PR-E10 ⭐ Chart cards 양 repo 마이그
**현황**: ui 의 `BarChartCard / LineChartCard / PieChartCard / ChartContainer / ChartLegend` 가 **양 repo 모두 미사용**. 직접 styled chart 작성.
- **platform** `settings/storage-analytics/`: TierChart (28) / ProjectChart (33) / FormatChart (31) / ResolutionChart (23) — 4 chart, 합 ~115줄
- **edge** `stats/`: ImageCharts (68) / LabelingCharts (170) / CameraCharts (70) / SessionCharts (130) — 4 chart, 합 ~438줄

→ 양 repo 의 8 chart 를 ui chart cards 로 마이그. 도메인 data shape 만 caller. 효과: -300+ 줄 양 repo, 시각 일관 cross-app

#### PR-E11 AddDatasetModal cross-repo 통합 (이미 PR-A5/A6 부분)
**현황**: 양 repo `AddDatasetModal` 가 아직 별개 (platform 107 + edge 161 = 268줄)
- 이미 추출됨: CheckboxGroup (PR-A5), RadioCardGroup (PR-A6) 의 inner
- 미추출: modal shell + form layout + name/description fields

→ ui 에 `<DatasetFormModal>` Pattern 추출 가능. caller 가 dataset 도메인 (api 호출, validation) 책임.

#### PR-E12 ExportModal cross-repo 통합
**현황**: platform `IgpExportModal` (76) + edge `ExportModal` (97) — 비슷한 form-in-dialog (export format selection + filename + start button).

→ ui `<ExportModal>` Pattern 또는 `<ExportFormFields>` 추출. options + onExport callback API.

#### PR-E13 ⭐ Sidebar Pattern 마이그 (platform → ui patterns 사용)
**현황**: platform `Sidebar.tsx` (119) + 5 sub-files = **477줄**. MobileNavigation 추가 308줄. ui patterns `SidebarNav` / `AppSidebar` / `MobileNavDrawer` 가 *이미 있는데* 사용 안 함.

→ platform Sidebar 를 ui patterns 사용으로 마이그. -200+ 줄 platform.

**위험**: Sidebar.config.tsx (route + icon mapping) 는 platform 도메인 — 유지. shells 만 마이그.

#### PR-E14 platform 최상위 modals audit
**대상**: CommentModal (168) / NoticeModal (158) / ProjectModal (116) — 합 442줄
- DialogShell 사용 여부 확인 + 본체 마이그 검토. 일부는 이미 마이그됨 가능.

#### PR-E15 platform components/edge/ folder audit (1290줄)
**대상**: platform 에서 *edge 디바이스 관리* 화면 — ExportTab (217) / ImportTab (243) / WorkOptionsTab (247) / EdgeManagementPanel (66) / DeflectometryPreview (211) / ExportHistory (109)
- 각 Tab 안의 form section / table / chart pattern 마이그 거리
- DeflectometryPreview 는 edge 도메인 특수 (page 거부)

#### PR-E16 LogPanel / Logs Tab 통합 (edge)
**대상**: edge LogPanel (154) + BackendLogsContent (214) + UnifiedLogsTab (105) + LogDetailTable (37) — 합 510줄
- log row + filter + detail panel 패턴이 ui Pattern 후보 (단 *edge only* 라 D-007 의 "재사용 가능성" 확인 필요)
- platform 도 log/audit 화면이 향후 들어올 가능성 — Pattern 추출 가치

#### PR-E17 Member / Invite row Pattern (platform)
**대상**: InvitationsTab (459) + OrgMembersTab (131) + ProjectMembers (185) + ProjectMemberInvite (126) + ProjectPermissions (271) + ProjectPermissionMatrix (299) — 합 ~1471줄
- Member row 표시 + role select + remove action — 공통 row 패턴
- Invite form — email + role + send 패턴
- → ui Pattern (`<MemberRow />`, `<InviteForm />`) 후보. 도메인 logic (api/permission rule) 은 caller
- *주의*: 거대 영역. 부분 추출만 (row + form layout). 전체 page 는 거부 명단

#### PR-E18 Settings Tab framework 검토
**대상**: 양 repo settings tabs (~10 tabs total). 이미 ui Tabs / VerticalTabs 사용 중. 추가로 *tab content layout pattern* (header + content + footer + actions) 이 공통화 가능?
- 현재 ui patterns 의 PageHeader / PageContent / PanelHeader 일부 활용
- 추가 Pattern 추출 가치 검토 — *audit-only* PR

### Group D — Page-specific 명시적 거부 (§ 2.5 갱신)

| 컴포넌트 | repo | 거부 이유 |
|---|---|---|
| BBoxCanvas (라벨링 캔버스) | edge | SAM ROI / isoLine / modulation overlay 등 다수 도메인 layer |
| ImagesView (라벨링 shell) | edge | 가상화 grid + labeling state machine, 도메인 store 결합 |
| FieldTestTab | edge | 도메인 wizard (필드 테스트 시퀀스) |
| SurfaceVizControls / SurfaceVizCanvas | edge | deflectometry 시각화 도메인 |
| DeflectometryTuningControls | edge | 도메인 튜닝 UI |
| sam-roi/SamRoiLayer | edge | SAM 도메인 |
| ConnectionGuidePanel | edge | 도메인 가이드 |
| InvitationsTab / OrgMembersTab / ProjectMembers / ProjectPermissions | platform | 회사 조직 도메인 |
| DevicesTable / DeviceDetailDialog | platform | 라이선스 / 디바이스 도메인 |
| storage-analytics/* | platform | 스토리지 분석 도메인 |

→ MASTER-PLAN § 2.5 에 추가.

## 4. 우선순위 + 효과 추정

| PR | 우선 | 효과 추정 | 위험 |
|---|---|---|---|
| **PR-E0c** ⭐⭐ VirtualizedImageGrid overflow fix | **최최우선** | 1줄 fix, 발견 버그 즉시 해결 | 없음 (consumer wrapper 호환) |
| **PR-E0d** ⭐⭐ NotificationBadge bubble position fix | **최최우선** | 1줄 fix, flex 부모 안 stretch 회피 | 없음 (typical 사용 호환) |
| **PR-E0e** ⭐⭐ DropdownSelect / SelectField portal | **최최우선** | menu 위치 robust, ancestor CSS 무관 | 없음 (위치 calc 동일, 렌더 위치만 portal) |
| **PR-E0f** ⭐⭐ SearchField type="text" (double × fix) | **최최우선** | 1줄 fix, native clear 제거 | 없음 (custom clear 유지) |
| **PR-E0g** ⭐⭐ UploadDropzone disabled affordance 강화 | **최최우선** | bg/border 추가 + cursor not-allowed | 없음 (a11y contrast 유지) |
| **PR-E0a** ⭐⭐ ChartContainer story 실 chart 예시 | **최최우선** | Storybook 직관성 향상, PR-E10 reference | 없음 (stories only) |
| **PR-E0b** ⭐⭐ DrawingLayer self-measure (storybook label 왜곡 fix) | **최최우선** | 라벨 글자 정상 + API 단순화 | 낮음 (prop > Context > measured 우선순위 유지) |
| **PR-E1** ImageDetailShell ui Pattern | 단기 | -150줄 platform, Pattern cross-app | layout 결정 합의 필요 |
| **PR-E2** AnnotationOverlay 통합 | 단기 | -120줄 양 repo | SVG/div 시각 정합 |
| **PR-E10** ⭐ Chart cards 양 repo 마이그 | **단기** | -300+줄 양 repo, 시각 일관 | chart data shape 매핑 |
| **PR-E13** ⭐ Sidebar Pattern 마이그 (platform) | **단기** | -200+줄 platform | Sidebar.config 도메인 유지 |
| PR-E11 AddDatasetModal 통합 | 단기 | -100줄 양 repo | dataset api 차이 |
| PR-E12 ExportModal 통합 | 단기 | -50줄 양 repo | export format 차이 |
| PR-E3 image-detail-modal split | 중기 | 200 limit 만족 | 회귀 위험 |
| PR-E4 BBoxCanvas split | 중기 | 200 limit 만족 | 안정 동작 중 — test 필수 |
| PR-E14 platform 최상위 modals audit | 중기 | -50~100줄 | 낮음 |
| PR-E15 platform components/edge/ audit | 중기 | -100줄 추정 | 도메인 분류 신중 |
| PR-E16 LogPanel Pattern (edge) | 중기 | edge cleanup, 향후 platform log 거리 cover | "재사용 가능성" 검증 |
| PR-E17 Member/Invite row Pattern | 중기 | -200줄 platform | 부분 추출만 |
| PR-E18 Settings Tab framework audit | 후기 | audit-only | 낮음 |
| PR-E5~E9 image-detail sub-audit | 단기 | 각 ~30~50줄 | 낮음 |
| Group D 거부 record (§ 2.5 갱신) | 즉시 | governance 명확 | 없음 |

## 5. 진행 절차

D-012 plan-first 따라:
1. 본 plan 사용자 review + 합의
2. PR-E1 부터 시작 — sub-plan `docs/plan/pr/5-E1-image-detail-shell.md` 작성 → review → 구현
3. PR 별 sub-plan 작성 → review → 구현 반복
4. 각 PR 완료 시 MASTER-PLAN § 4.1 + § 7 갱신

## 6. governance 재확인

- 도메인 무관 + 재사용 가능성 + props ≤ 5 + 파일 ≤ 200줄 (D-007)
- 새 컴포넌트는 storybook + a11y 'error' 의무 (D-016 정신)
- light mode 양 mode pass 의무 (D-017 정신)

## 7. monorepo 거리 deregister (D-014 후속 정정)

본 audit 진행과 동시 처리:
- 사용자 의도: ingradient-ui 가 *npm package* 로 publish → 새 프로젝트가 `npm install @ingradient/ui` 로 즉시 사용. monorepo 안 함
- 이유: 새 프로젝트 추가 시 monorepo 는 권한 / build / release cycle 확장성 이슈
- 정정:
  - post-phase3-followups.md § 7 monorepo 옵션 B 제거
  - post-phase3-followups.md § 9 Phase 4 monorepo 거리 제거 (이미 완료된 PR-D7 sync-ui.mjs 가 dev 흐름 충분)
  - MASTER-PLAN § 4.4 / § 5 monorepo 언급 제거
  - D-014 본문에 "monorepo 후속 검토" → "sync-ui.mjs 정착 + 향후 npm registry publish 거리" 로 정정
- D-019 신규 record 작성 (본 결정의 근거)
