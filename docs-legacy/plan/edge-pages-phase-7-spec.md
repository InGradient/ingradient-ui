---
title: Phase 7 — ImagesView + BBoxCanvas + EdgeImagesGrid 추출
purpose: 가장 큰 두 파일 (ImagesView 1223줄, BBoxCanvas 701줄) + EdgeImagesGrid 152줄 + SamRoiLayer 217줄 을 @ingradient/edge-pages/{images,labeling} 으로 pure view 추출. canvas mutation 패턴 정책 결정
audience: ingradient-ui contributor
date: 2026-05-19
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./edge-pages-package-plan.md
  - ./edge-pages-phase-6-spec.md
---

# Phase 7 — ImagesView + BBoxCanvas + EdgeImagesGrid 추출

> Roadmap: [edge-pages-extraction-roadmap.md](./edge-pages-extraction-roadmap.md) § Phase 7
> 가장 큰 두 파일. **multi-file 분해의 극한 사례** + **canvas mutation 패턴 정책** 결정 phase.

---

## 1. 목적

`packages/edge-pages/src/images/` + `packages/edge-pages/src/labeling/` 에 다음 5 파일의 view 를 추출:

| 파일 | 줄 수 | 비고 |
|---|---|---|
| `components/capture/ImagesView.tsx` | **1223** | 가장 큰 파일. dataset image grid + 모달 + bulk delete + filter |
| `components/capture/BBoxCanvas.tsx` | **701** | labeling canvas + SAM ROI + modulation overlay |
| `components/capture/EdgeImagesGrid.tsx` | 152 | virtualized image grid (이미 ≤ 200) |
| `components/capture/sam-roi/SamRoiLayer.tsx` | 217 | SAM mask overlay + toolbar |
| `components/capture/ImagesView.styles.ts` | 288 | styles |
| `components/capture/BBoxCanvas.styles.ts` | 145 | styles |

총 ~2700 줄. 추출 후 ~35 파일 (multi-file 분해).

본 phase 후 Phase 5 의 `imagesContent` slot + Phase 8 의 labeling 분기 (`labelingContent`) 가 실체화.

---

## 2. ImagesView 분해 계획

ImagesView.tsx 1223 줄의 핵심 책임:

| 책임 | 줄 범위 | 분해 대상 |
|---|---|---|
| state + hook orchestration | 75-380 | container 잔류 |
| useImages / useImageActions / IPC | 75-100 | container |
| modal blob URL / image preload | 100-240 | container |
| sequence panel sync | 280-345 | container |
| SAM ROI integration | 350-500 | container |
| keyboard shortcut | 500-510 | container |
| auto-clear timer | 685-695 | container |
| **render JSX** | 939-1220 | view 추출 대상 |

view JSX 부분 (~280줄) 도 단일 파일에 안 들어감. 다음 sub-view 로 분해:

```
packages/edge-pages/src/images/
├─ ImagesView.tsx                  — page shell (≤ 200 줄)
├─ ImagesToolbar.tsx               — filter row + selection toolbar  ≤ 130 줄
├─ ImagesFilter.tsx                — date filter popover  ≤ 120 줄
├─ ImagesEmpty.tsx                 — empty state + retry  ≤ 50 줄
├─ ImageDetailModal.tsx            — modal shell (overlay / header / inner / hint)  ≤ 180 줄
├─ ImageDetailLabeling.tsx         — modal 안 BBoxCanvas wrapper (Phase 7 labeling slot)
├─ ImagesView.styles.ts            — ImagesView.styles.ts 그대로 이전 (288 줄 — 200 룰 검토)
├─ ImagesEmptyState.styles.ts      — empty + retry styles
├─ image-helpers.ts                — imagePassesDateFilter / 기타 pure helpers
├─ types.ts                        — ImagesViewProps + sub-types
└─ index.ts                        — barrel
```

EdgeImagesGrid 는 별도 sub-view 가 아니라 본 phase 의 `images/` 안에 같이:

```
├─ EdgeImagesGridView.tsx          — 152 줄 그대로 (≤ 200)
```

총 12 파일.

**styles 분할**: ImagesView.styles.ts 288 줄 → 200 룰 위반. 다음 3 파일로:
- `styles/toolbar.styles.ts` — ImagesFilter* / SelectionToolbar / SelectAllCheckbox / DeletingLabel / SyncDot / SyncSummary
- `styles/modal.styles.ts` — Modal* (Overlay / Inner / Header / Center / Spacer / CloseBtn / Filename / Hint / BBoxCanvasWrap / BBoxToolbar / BBoxToolbarBtn)
- `styles/grid.styles.ts` — ImagesWrapper / ImagesContainer / GroupBadge / GroupBadgeWrap / GroupDeleteBtn / SyncStateIcon
- `styles/index.ts` — re-export

총 `images/` 디렉토리 파일 수: 12 + 3 styles split = ~15.

---

## 3. BBoxCanvas + SamRoiLayer 분해 계획

BBoxCanvas 701 줄 + SamRoiLayer 217 줄 = 918 줄. 다음으로 분해:

```
packages/edge-pages/src/labeling/
├─ BBoxCanvasView.tsx              — main canvas wrapper (≤ 200 줄)
├─ LabelingToolbar.tsx             — Save / Skip / Retry / Fullscreen / Eraser / Eye 등 (≤ 150 줄)
├─ BBoxOverlayLayer.tsx            — BBox 그리기 + handle + class color logic
├─ ModulationOverlay.tsx           — modulation darken overlay
├─ DebugOverlay.tsx                — valid_mask / edge band tint
├─ PixelInfoPopover.tsx            — hover pixel value + swatch
├─ AnnotationToggle.tsx            — bbox visibility toggle button
├─ sam-roi/SamRoiLayerView.tsx     — SAM mask + point markers + ROI toolbar (≤ 150 줄)
├─ sam-roi/SamRoiToolbar.tsx       — Undo/Redo/Reset/Done/Cancel buttons
├─ sam-roi/SamRoiStatus.tsx        — embed status indicator
├─ sam-roi/MaskOverlay.tsx         — mask PNG overlay
├─ sam-roi/PointMarkers.tsx        — SAM point markers
├─ BBoxCanvasView.styles.ts        — BBoxCanvas.styles.ts 그대로 (145 줄)
├─ canvas-helpers.ts               — toDrawingObjects / toBboxes / HANDLE_HIT_PX / constants
├─ types.ts                        — BBoxCanvasViewProps + sub-types
└─ index.ts                        — barrel
```

총 15 파일.

**canvas mutation 정책 결정**: BBoxCanvas 는 `useDrawingCanvas` (from `@ingradient/ui/components`) 를 사용. canvas mutation 은 `@ingradient/ui` 의 hook 이 책임 — view 는 callback 받아 props 로 변환. ROI / SAM mask 같은 다른 mutation 도 같은 패턴:

- view 안 mutation 허용 범위:
  - `useRef<HTMLCanvasElement>` + 그 위 imperative draw — visual-only OK
  - `useEffect` 로 캔버스에 imageBitmap 또는 mask 그리기 — visual-only OK
  - `requestAnimationFrame` 으로 hover pixel sampling — visual-only OK
- view 안 mutation 금지 범위:
  - IPC 호출 (`window.electron.getRoiMask` 등) — container 잔류
  - localStorage / sessionStorage 접근 — container
  - zustand store mutation — container

본 phase 의 모든 ref + useEffect 는 위 정책에 따라 분류.

---

## 4. Props Interface

### 4.1 ImagesViewProps

```ts
export interface ImagesViewLabels {
  // toolbar
  filterTitle: string                             // 'images.filter'
  selectAll: string                               // 'images.selectAll'
  deleteSelected: (count: number) => string       // 'images.deleteSelected'
  // empty
  empty: string
  emptyOffline: string
  retry: string                                   // 'workspace.retry'
  // modal
  modalHint: string
  modalClose: string
  // delete confirm
  deleteConfirmTitle: string
  deleteConfirmDesc: (count: number) => string
  deleteConfirm: string
  cancel: string
  // sync
  syncing: string
  synced: string
  syncFailed: string
  // loading
  loading: string
  loadingMore: string
  // labels for date filter sub-view
  dateFilter: DateFilterLabels
}

export interface DateFilterLabels {
  title: string
  all: string
  today: string
  last7: string
  last30: string
  custom: string
  from: string
  to: string
}

export interface ImagesViewProps {
  // data
  groupedImages: { groupKey: string; images: ImageItem[] }[]  // 이미 buildGroups + filter 적용 완료
  groupSettings: ProjectGroupSettings
  classes: { class_id: string; class_name: string; color: string }[]
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  isOnline: boolean
  isDeleting: boolean

  // filter state
  datePreset: ImagesDatePreset
  fromDate: string
  toDate: string
  filterOpen: boolean

  // selection state
  selectedImageIds: Set<string>
  selectionMode: boolean

  // modal state
  modalGroup: ImageItem[] | null
  modalIdx: number
  modalImageSrc: string | null                     // already loaded (container 가 blob URL 관리)

  // labeling slot (modal 안 BBoxCanvas 또는 IGE viewer)
  modalLabelingContent?: React.ReactNode

  // delete confirm
  pendingDelete: { count: number } | null
  bulkDeleteSummary: { unitCount: number; imageCount: number } | null

  // i18n
  labels: ImagesViewLabels

  // callbacks
  onLoadMore: () => void
  onSetDatePreset: (preset: ImagesDatePreset) => void
  onSetFromDate: (date: string) => void
  onSetToDate: (date: string) => void
  onToggleFilter: () => void
  onSelectAll: () => void
  onClearSelection: () => void
  onToggleImageSelection: (id: string) => void
  onOpenModal: (group: ImageItem[], idx: number) => void
  onCloseModal: () => void
  onSetModalIdx: (idx: number) => void
  onConfirmDelete: () => void
  onCancelDelete: () => void
  onDeleteGroup: (group: ImageItem[]) => void
  onRetryReload: () => void
}
```

설계 노트:
- IPC / fetch / blob URL revoke / keyboard listener / sequence panel sync 모두 container 잔류.
- `groupedImages` 는 container 가 `buildGroups + filter + sort` 후 전달 — view 는 그대로 render.
- `modalImageSrc` 도 container 가 blob URL 미리 로드 + revoke 책임.
- `modalLabelingContent` slot 으로 BBoxCanvas 마운트 (Phase 8 의 labeling 패턴과 일관).

### 4.2 BBoxCanvasViewProps

기존 edge `BBoxCanvasProps` (line 22-82) 의 모든 props 를 props group 패턴으로 묶어 정리:

```ts
export interface BBoxCanvasViewProps {
  // 핵심 이미지
  imageDataUrl: string
  displayImageUrl?: string | null

  // 라벨링 상태
  classes: ClassInfo[]
  selectedClassId: string | null
  editMode: 'cursor' | 'bbox'
  initialBboxes?: BBox[]
  options?: EdgeOptions | null
  pendingClassChange?: { bboxIdx: number; classId: string } | null

  // 모듈레이션 / 디버그 오버레이 (props group)
  modulation: {
    dataUrl?: string | null
    threshold?: number
    darkenFactor?: number
    overlayEnabled?: boolean
    disableOverlay?: boolean
  }
  debug: {
    overlayEnabled?: boolean
    edgeExclusionPx?: number
  }

  // ROI 편집 (props group)
  roi: {
    editMode?: boolean
    box?: { x: number; y: number; w: number; h: number } | null
    onChange?: (roi: { x: number; y: number; w: number; h: number } | null) => void
  }

  // SAM ROI (props group)
  samRoi: {
    active?: boolean
    viewerActive?: boolean
    maskPng?: string | null
    prompts?: SamPrompt[]
    promptCursor?: number
    imageSize?: { w: number; h: number } | null
    maskBbox?: { x1: number; y1: number; x2: number; y2: number } | null
    embedStatus?: 'idle' | 'loading_model' | 'embedding' | 'ready' | 'error'
    inflight?: number
    canUndo?: boolean
    canRedo?: boolean
    canDone?: boolean
    onPromptBox?: (box: SamBox, op: 'add' | 'subtract') => void
    onPromptPoint?: (x: number, y: number, label: 0 | 1) => void
    onUndo?: () => void
    onRedo?: () => void
    onReset?: () => void
    onDone?: () => void
    onCancel?: () => void
  }

  // 색상맵 (derived 뷰)
  colormap?: ColormapName | null

  // 라벨링 actions
  onSave: (bboxes: BBox[]) => void
  onSkip: () => void
  onRetry: () => void
  onSelectionChange?: (idx: number | null, classId?: string | null) => void
  onBboxesChange?: (bboxes: BBox[]) => void

  // UI options
  hideActions?: boolean
  hideHint?: boolean

  // i18n
  labels: BBoxCanvasLabels
}

export interface BBoxCanvasLabels {
  save: string                                    // 'workspace.save'
  skip: string                                    // 'workspace.skip'
  retry: string                                   // 'workspace.retry'
  fullscreen: string                              // 'workspace.enterFullscreen'
  exitFullscreen: string                          // 'workspace.exitFullscreen'
  bboxCount: (count: number) => string            // "{count} boxes"
  blockMsgRequireLabel: string                    // 'labeling.requireLabel'
  blockMsgRequireMinBbox: (count: number) => string
  hint: string                                    // 'labeling.hint'
  showAnnotations: string                         // 'labeling.showAnnotations'
  hideAnnotations: string                         // 'labeling.hideAnnotations'
  modulationOverlay: string                       // 'labeling.modulationOverlay'
  // SAM ROI
  sam: {
    undo: string
    redo: string
    reset: string
    done: string
    cancel: string
    statusIdle: string
    statusLoading: string
    statusEmbedding: string
    statusReady: string
    statusError: string
  }
}
```

설계 노트:
- props group 5개 (modulation / debug / roi / samRoi) — Phase 6 의 [package-plan §9.3](./edge-pages-package-plan.md) 패턴 첫 본격 적용.
- `useColormapUrl` 은 edge 의 hook (IPC 없음, 단순 URL 변환) — edge-pages 안 helper 로 복사.
- `useFullscreen` / `useZoomPan` / `useDrawingCanvas` / `LabelingCanvas` 는 모두 `@ingradient/ui` (또는 그 sub-export) — view 안 사용 OK.

### 4.3 SamRoiLayerViewProps

```ts
export interface SamRoiLayerViewProps {
  maskPng: string | null
  prompts: SamPrompt[]
  promptCursor: number
  imageSize: { w: number; h: number } | null
  embedStatus: 'idle' | 'loading_model' | 'embedding' | 'ready' | 'error'
  inflight: number
  canUndo: boolean
  canRedo: boolean
  canDone: boolean
  active: boolean
  viewerOnly: boolean
  labels: BBoxCanvasLabels['sam']
  onPromptBox?: (box: SamBox, op: 'add' | 'subtract') => void
  onPromptPoint?: (x: number, y: number, label: 0 | 1) => void
  onUndo?: () => void
  onRedo?: () => void
  onReset?: () => void
  onDone?: () => void
  onCancel?: () => void
}
```

### 4.4 EdgeImagesGridViewProps

```ts
export interface EdgeImagesGridViewProps {
  groupedImages: { groupKey: string; images: ImageItem[] }[]
  groupSettings: ProjectGroupSettings
  classes: { class_id: string; color: string }[]
  selectedIds: Set<string>
  selectionMode: boolean
  cellMinPx?: number
  gapPx?: number
  cellHeightPx?: number
  onImageClick: (image: ImageItem, groupKey: string) => void
  onToggleSelection: (id: string) => void
  onDeleteGroup: (groupKey: string) => void
}
```

기존 `EdgeImagesGrid.tsx` 152줄 거의 그대로. zustand 의존 없음 — props lift 만.

---

## 5. helper 모듈 복사

본 phase 가 복사할 helper:

- `shared/images.ts` (119줄) — `ImageItem`, `ProjectGroupSettings`, `dedupeSequenceMembers`, `buildGroups`, `getGroupKey` → `packages/edge-pages/src/images/image-helpers.ts`
- `modules/capture/utils/generate-thumb-bbox.ts` — `generateThumbBbox` (필요 시 — modal 안 save 가 호출하면 container 잔류로 충분)
- `modules/labeling/state/use-colormap-url.ts` (small hook) — `packages/edge-pages/src/labeling/use-colormap-url.ts`
- `modules/labeling/model/colormaps.ts` — 이미 Phase 6 에서 복사. labeling phase 도 동일 import.
- `modules/capture/model/capture.constants.ts` — DERIVED_VIRTUAL_IMAGE_ID_PREFIX / getDerivedLabelFromVirtualId — `images/image-helpers.ts` 에 추가

복사 원칙은 Phase 6 와 동일 — 일방향, pure 만.

---

## 6. 변경 파일

### 6.1 신규 (~30 file)

- `images/` 12 + styles 분할 3 = 15
- `labeling/` 15
- 총 ~30

### 6.2 수정 (1 file)

```diff
  export * from './capture'
+ export * from './images'
+ export * from './labeling'
```

### 6.3 신규 story

```
stories/pages/edge/0.0.1/images/
├─ ImagesView.stories.tsx              — 8 scenario (Empty / Loading / LoadingMore / WithImages / SelectionMode / FilterCustom / DeleteConfirm / ModalOpen)
├─ EdgeImagesGridView.stories.tsx      — 4 scenario (Empty / SmallGrid / LargeGrid / Selection)
└─ ImageDetailModal.stories.tsx        — 3 scenario (Default / Labeling / NavigateNext)

stories/pages/edge/0.0.1/labeling/
├─ BBoxCanvasView.stories.tsx          — 8 scenario (Empty / WithBboxes / RoiEdit / SamActive / ModulationOverlay / DebugOverlay / Fullscreen / Blocked)
├─ SamRoiLayerView.stories.tsx         — 5 scenario (Idle / Embedding / Ready / WithMask / Error)
└─ LabelingToolbar.stories.tsx         — 4 scenario (Default / SaveDisabled / SkipHidden / Fullscreen)
```

총 6 story file × 5~8 scenario = 32 scenario.

신규 fixture:
- `stories/fixtures/edge/0.0.1/images.ts` — ImageItem[] mock + ProjectGroupSettings
- `stories/fixtures/edge/0.0.1/bboxes.ts` — BBox[] + ClassInfo[]
- `stories/fixtures/edge/0.0.1/sam-prompts.ts` — SamPrompt[]

### 6.4 건드리지 않음

- `ingradient-edge/src/frontend/components/capture/{ImagesView,BBoxCanvas,EdgeImagesGrid}*` — Phase 13
- `ingradient-edge/src/frontend/components/capture/sam-roi/*` — Phase 13
- `ingradient-edge/src/frontend/shared/images.ts` — Phase 13
- `ingradient-edge/src/frontend/modules/capture/utils/generate-thumb-bbox.ts` — Phase 13
- `ingradient-edge/src/frontend/modules/labeling/*` — Phase 13

---

## 7. i18n 키 매핑

총 ~50 key. Phase 6 와 비슷한 규모. 본 spec 본문에 전부 나열하지 않음.

요약:
- ImagesViewLabels: ~25 key + DateFilterLabels 8
- BBoxCanvasLabels: ~15 key + sam Record 9
- EdgeImagesGridViewLabels: 0 (no text)
- SamRoiLayerViewLabels: sam Record (BBoxCanvas 와 공유)

container 가 `useImagesViewLabels()` / `useBBoxCanvasLabels()` hook 으로 묶음 (Phase 13).

---

## 8. canvas mutation 패턴 정책 (재확인)

§3 의 결정을 reiterate:

**view 안 OK** (visual-only):
- `useRef<HTMLCanvasElement>` + imperative draw
- `useEffect` 로 imageBitmap / mask PNG 그리기
- `requestAnimationFrame` 으로 hover pixel sampling
- DOM event listener (mousemove, mousedown, keydown) — visual-only
- pan/zoom transform
- ROI box visual feedback
- mask PNG overlay

**container 잔류**:
- `window.electron.getRoiMask` 같은 IPC
- mask 저장 IPC
- sequence bbox 업데이트 IPC
- thumbnail 생성 후 disk 저장
- store mutation (`useSamRoiStore.setActive` 등)
- localStorage / sessionStorage

**구체적인 BBoxCanvas 경계**:
- `useDrawingCanvas` (`@ingradient/ui/components` 의 hook) — view 안 (UI infra)
- `useZoomPan` — view 안
- `LabelingCanvas` (`@ingradient/ui/patterns`) — view 안
- `MaskOverlay` / `PointMarkers` 컴포넌트 — view 안 (rendering only)
- `trackMount('BBoxCanvas')` — telemetry side effect → container 잔류

---

## 9. 실행 순서

1. helpers:
   - `images/image-helpers.ts` (buildGroups / dedupe / getGroupKey / imagePassesDateFilter / DERIVED_VIRTUAL_*)
   - `labeling/canvas-helpers.ts` (toDrawingObjects / toBboxes / constants)
   - `labeling/use-colormap-url.ts`
2. styles:
   - `images/styles/{toolbar,modal,grid}.styles.ts` + `index.ts` (ImagesView.styles.ts 분할)
   - `images/ImagesEmptyState.styles.ts`
   - `labeling/BBoxCanvasView.styles.ts`
3. types:
   - `images/types.ts`
   - `labeling/types.ts`
4. sam-roi sub-view:
   - `labeling/sam-roi/MaskOverlay.tsx`
   - `labeling/sam-roi/PointMarkers.tsx`
   - `labeling/sam-roi/SamRoiToolbar.tsx`
   - `labeling/sam-roi/SamRoiStatus.tsx`
   - `labeling/sam-roi/SamRoiLayerView.tsx`
5. labeling sub-view:
   - `labeling/ModulationOverlay.tsx`
   - `labeling/DebugOverlay.tsx`
   - `labeling/BBoxOverlayLayer.tsx`
   - `labeling/PixelInfoPopover.tsx`
   - `labeling/AnnotationToggle.tsx`
   - `labeling/LabelingToolbar.tsx`
   - `labeling/BBoxCanvasView.tsx`
   - `labeling/index.ts`
6. images sub-view:
   - `images/EdgeImagesGridView.tsx`
   - `images/ImagesEmpty.tsx`
   - `images/ImagesFilter.tsx`
   - `images/ImagesToolbar.tsx`
   - `images/ImageDetailLabeling.tsx`
   - `images/ImageDetailModal.tsx`
   - `images/ImagesView.tsx`
   - `images/index.ts`
7. `packages/edge-pages/src/index.ts` 수정
8. fixtures + stories
9. typecheck + build + storybook build

---

## 10. 검증

| # | 명령 | 기대 |
|---|---|---|
| 1 | `find packages/edge-pages/src/images packages/edge-pages/src/labeling -type f \| wc -l` | ~30 파일 |
| 2 | `cd packages/edge-pages && npx tsc --noEmit` | 0 error |
| 3 | `cd packages/edge-pages && npm run build` | 4 view (ImagesView / BBoxCanvasView / SamRoiLayerView / EdgeImagesGridView) + helper export |
| 4 | 모든 파일 `wc -l` | 모두 < 200 |
| 5 | `npx tsc --noEmit -p tsconfig.json` (root) | 0 error |
| 6 | `npm run build:storybook` | exit 0 |
| 7 | Storybook 수동 — 32 scenario | 모두 props 만으로 렌더 |
| 8 | grep — 금지 import 0 | `grep -rE 'useTranslation\|window\.electron\|zustand\|i18next\|fetch(\|localStorage\|sessionStorage' packages/edge-pages/src/images/ packages/edge-pages/src/labeling/` → 0 match |
| 9 | grep — store hook 0 | `grep -rE 'useSequencePanelStore\|useSamRoiStore\|useImageActions\|useImages\|useWorkspaceUIStore\|useCaptureStore\|useDatasetStore' packages/edge-pages/src/{images,labeling}/` → 0 match |
| 10 | ingradient-edge 측 `npx tsc --noEmit` | 0 error |

---

## 11. 성공 기준

- 검증 1~10 통과
- 4 view 가 store/IPC/i18n/fetch/storage 의존 0
- 32 storybook scenario 가 props 만으로 렌더
- 모든 파일 < 200 줄 (BBoxCanvas 701 → 12 파일로 분해, ImagesView 1223 → 15 파일로 분해)
- canvas mutation 정책 (§8) 코드 수준에서 명확히 분리
- Phase 5 의 `imagesContent` slot + Phase 8 의 `labelingContent` slot 이 본 phase view 로 plug-in 가능

---

## 12. 리스크

### 12.1 BBoxCanvas 30+ props 의 group object refactor 부담

위험: 기존 edge 의 BBoxCanvas 는 평면 props. group object 패턴 도입 시 caller 측 코드 변경 폭증.

대응:
- 본 phase 에서 group object 적극 도입 (§4.2 의 5 group)
- Phase 13 에서 edge container 가 group 화 전달 — caller 수정 비용은 Phase 13 의 일부
- 향후 view 의 props 추가 시 group 안에서 처리 가능 — 평면 props 의 폭증 방지

### 12.2 ImagesView 1223 → 15 파일 분해 후 props drilling

위험: container → ImagesView → ImagesToolbar / ImageDetailModal / EdgeImagesGridView 로 props 가 3-4 단계 drilling.

대응:
- 최상위 ImagesView 가 prop 분배 책임 (다른 sub-view 는 평면 prop)
- 깊이 2 단계까지만 허용
- 그 이상은 view model 도입 또는 sub-view group 재설계 (본 phase 에선 회피)

### 12.3 modal blob URL 의 container 화

위험: ImagesView 의 modal 은 이미지 클릭 시 fetch + blob URL 생성 + revoke. container 로 옮기면 storybook 에서 modal 시뮬레이트 어려움.

대응:
- container 가 `modalImageSrc: string | null` 결정 — open 시 blob URL, close 시 revoke 후 null
- view 는 `modalImageSrc` prop 만 받음
- storybook 은 fixture 의 정적 image src

### 12.4 keyboard shortcut (Esc / arrows)

위험: ImagesView 의 modal 안 keyboard listener (`keydown` for Esc + arrows for navigation) 가 side effect.

대응:
- container 가 `useEffect` 로 listener 등록
- view 는 `onCloseModal` / `onSetModalIdx` callback 받음
- storybook 은 키보드 동작 모킹 (button click 으로 같은 callback 호출)

### 12.5 `useColormapUrl` 의 IPC 의존성 확인

위험: `use-colormap-url.ts` 가 단순 URL 변환인지 IPC 호출인지 확인 필요.

대응:
- 본 phase 시작 전 hook 내용 확인. IPC 면 container 로, pure 면 edge-pages 로 복사
- IPC 의 경우: container 가 `displayImageUrl` prop 으로 미리 변환

### 12.6 `LabelingCanvas` (`@ingradient/ui/patterns`) 의 의존 깊이

위험: BBoxCanvas 가 `LabelingCanvas` 사용 → `@ingradient/ui/patterns` 의 의존성이 edge-pages 의 peer 에 추가 필요?

대응:
- `@ingradient/ui` 의 sub-export 라 이미 peer 에 포함 (tsup external 리스트에 있음)
- 본 phase 에서 추가 패키지 등록 불필요

### 12.7 SAM ROI 의 storybook 시뮬레이션

위험: SAM mask 는 실제 ONNX inference 결과. storybook 에선 mock PNG.

대응:
- fixture 에 pre-generated mask PNG (data URL) 1~2개
- scenario 별로 mask 유무 / prompts 위치 다르게
- 실제 SAM 동작은 Phase 13 의 edge runtime 에서 검증

### 12.8 `trackMount` telemetry 의 view 안 호출 금지

위험: BBoxCanvas 에 `trackMount('BBoxCanvas')` 가 view 안 호출 (perf snapshot 용).

대응:
- container 잔류 (`useEffect(() => trackMount('BBoxCanvas'), [])` 를 container 에 옮김)
- view 는 telemetry 모름

### 12.9 ImagesView 의 cellHeightPx / gapPx 같은 magic number

위험: edge 의 `EdgeImagesGrid.tsx` 가 `CELL_MIN_PX=140`, `GAP_PX=8` 등 hardcoded.

대응:
- view 의 `cellMinPx` / `gapPx` 등 prop 으로 lift (디폴트는 기존 값)
- 향후 responsive 변경 시 caller 가 결정

### 12.10 styles 분할 후 import 폭증

위험: ImagesView.styles.ts 288 → 3 파일 + index. 사용자가 어디서 import 했는지 헷갈림.

대응:
- `images/styles/index.ts` re-export — view 는 한 곳에서만 import
- Phase 3 / Phase 6 와 동일 패턴

---

## 13. Rollback

git revert. 산출물:
- `packages/edge-pages/src/{images,labeling}/` 디렉토리 삭제
- `packages/edge-pages/src/index.ts` 의 export 제거
- `stories/pages/edge/0.0.1/{images,labeling}/` 삭제
- 신규 fixture 3개 삭제
- `npm run build --workspace packages/edge-pages` 재실행

---

## 14. 종료 후 상태

- `@ingradient/edge-pages` 가 18+ view export (Phase 1-6 누적 14 + Phase 7 의 4)
- 가장 큰 두 파일 (1223 + 701) multi-file 분해 완료. 모든 파일 < 200 줄
- canvas mutation 정책 (§8) 코드로 검증
- props group 패턴 본격 적용 (BBoxCanvas 5 group)
- helper 3개 (images / canvas / colormap-url) pure 분리
- Phase 5 의 imagesContent + labelingContent slot 이 본 phase view 로 plug-in 가능
- Phase 8 (StaticsView + charts) 진입 준비 완료 — 비교적 단순한 chart 추출

---

## 15. 다음 액션

1. 본 spec ok
2. 실행 (§9 의 9 step)
3. 검증 (§10 의 10 step)
4. Phase 8 spec 작성 (`edge-pages-phase-8-spec.md`)
