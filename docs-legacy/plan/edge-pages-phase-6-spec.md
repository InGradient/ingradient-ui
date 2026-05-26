---
title: Phase 6 — CaptureView + SetupPanel + Deflectometry sub-view 추출
purpose: capture 탭 본문 (CaptureView 349줄), setup 탭 본문 (SetupPanel 438줄), deflectometry sub-panel 2개 (SequencePatternPanel 104줄, DeflectometryTuningControls 193줄) 를 @ingradient/edge-pages/capture 로 pure view 추출
audience: ingradient-ui contributor
date: 2026-05-19
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./edge-pages-package-plan.md
  - ./edge-pages-phase-5-spec.md
---

# Phase 6 — CaptureView + SetupPanel + Deflectometry sub-view 추출

> Roadmap: [edge-pages-extraction-roadmap.md](./edge-pages-extraction-roadmap.md) § Phase 6
> Phase 5 의 5 slot 중 `captureContent` + `setupPanelContent` 를 채울 sub-view 본격 추출. **200줄 룰 위반 다수 — multi-file 분해 필수**.

---

## 1. 목적

Phase 5 의 WorkspaceView 가 받는 slot 중 `captureContent` (capture 탭 본문) + `setupPanelContent` (setup 모드 portal 안 내용) 의 실체를 본 phase 에서 정의.

대상 4 파일:

| 파일 | 줄 수 | styles 줄 수 | 200 룰 |
|---|---|---|---|
| `components/capture/CaptureView.tsx` | 349 | 357 | ❌ |
| `components/capture/SetupPanel.tsx` | 438 | 100 | ❌ |
| `components/capture/deflectometry/SequencePatternPanel.tsx` | 104 | ? | ✅ |
| `components/capture/deflectometry/DeflectometryTuningControls.tsx` | 193 | ? | ✅ |

CaptureView 349 + SetupPanel 438 = 787 줄 → multi-file 분해 필수. SequencePatternPanel / DeflectometryTuningControls 은 그대로 이전해도 200 룰 안에 들지만, store/IPC 의존이 무겁다 — pure view 로 변환 시 props surface 크게 늘어남.

`CaptureReviewWithFullscreen` (Phase 5 에서 위임됨, Workspace.tsx 의 line 911-933 inline 컴포넌트) 도 본 phase 에서 같이 추출.

---

## 2. 4 view 의 IPC / store / 부작용 의존

### 2.1 CaptureView

| 의존 | 종류 | 처리 |
|---|---|---|
| `useTranslation` | i18n | labels prop |
| `Switch`, `useZoomPan` | `@ingradient/ui` | view 안 OK |
| `useFullscreen` | shared hook | view 안 OK (visual-only) |
| `AGENT_URL` constant | static | view 안 OK |
| snapshot polling (fetch `${AGENT_URL}/api/camera/snapshot`) | side effect | **container 잔류** |
| `trackMount('CaptureView')` | telemetry side effect | container |
| `capLog` | logging | container |
| `RetryButton` from `Workspace.styles.ts` | style | view 안 OK |

snapshot polling 은 view 의 핵심이지만 fetch 호출이라 container 로 끌어내야 함. view 는 `liveFrameSrc: string | null` prop 만 받음.

### 2.2 SetupPanel

| 의존 | 종류 | 처리 |
|---|---|---|
| `useTranslation` | i18n | labels prop |
| `useSequencePanelStore` (autoAnalyze, enabledFeatures) | zustand | props (lifted) |
| `Accordion`, `Button`, `Switch`, `SelectField`, `TextField`, `Tooltip` | `@ingradient/ui` | view 안 OK |
| `FieldGroup`, `FieldHint`, `SectionTitle` from `@ingradient/ui/patterns` | `@ingradient/ui` | view 안 OK |
| `buildPatternLabels`, `patternLabelToUI`, `computeTotalPatterns`, `DERIVED_ORDER` | edge module | **edge-pages 로 복사** (pure helper) |
| `NumberField` from `@ingradient/ui/components` | `@ingradient/ui` | view 안 OK |
| 모든 props (15개) | controlled state | 그대로 |

`buildPatternLabels` / `patternLabelToUI` / `computeTotalPatterns` / `DERIVED_ORDER` 은 모듈 분리. **결정**: edge-pages 안 `capture/pattern-helpers.ts` 로 복사 (pure, side effect 없음). Phase 13 에서 edge 측 원본 삭제.

### 2.3 SequencePatternPanel

| 의존 | 종류 | 처리 |
|---|---|---|
| `useSequencePanelStore` (images, activeImageId, viewMode, setActiveImageId, setViewMode, onSelect, enabledFeatures) | zustand | props |
| `useTranslation` | i18n | labels |
| `isDerivedPattern`, `patternLabelToUI`, `sortOriginalPatterns`, `sortDerivedPatterns` | edge module | helpers 복사 |
| `DeflectometryTuningControls` child | 다음 sub-view | direct import |

### 2.4 DeflectometryTuningControls

| 의존 | 종류 | 처리 |
|---|---|---|
| `useTranslation` | i18n | labels |
| `useSequencePanelStore` (sequenceId, tuning, setTuning, resetTuning, activeImageId, images) | zustand | props |
| `useDeflectometryTuning` (runRecompute) | edge module hook (IPC) | callback prop |
| `useToast` | `@ingradient/ui` | **view 안 OK** (UI infra) |
| `COLORMAP_OPTIONS`, `labelToDerivedKind`, `ColormapName` | edge module (colormaps) | helpers 복사 |
| `window.electron` (ElectronWin) | IPC | callback prop |

`useToast` 는 `@ingradient/ui` 의 ToastProvider 가 storybook 에 이미 마운트되어 있으면 view 안 사용 OK. confirm: storybook 의 root decorator 가 ToastProvider 포함하는지 확인 필요 (검증 #2).

---

## 3. 모듈 구조

```
packages/edge-pages/src/capture/
├─ CaptureView.tsx                 — capture 탭 shell (≤ 200 줄)
├─ LivePreviewLayer.tsx            — snapshot 또는 frame img + grid overlay + center crosshair + connecting box
├─ SetupOverlay.tsx                — setup 모드의 metrics + blocking overlay
├─ CaptureBar.tsx                  — capture button + status text + disabled reason
├─ OverlayControls.tsx             — header (grid/controls toggle) + popover (focus peaking/histogram)
├─ CapturingBadge.tsx              — capturing 상태 표시 badge
├─ CaptureReviewFullscreen.tsx     — Workspace.tsx 의 inline CaptureReviewWithFullscreen (≤ 50 줄)
├─ CaptureView.styles.ts           — capture/CaptureView.styles.ts 그대로 이전 (357 줄 — 200 룰 검토)
├─ SetupPanelView.tsx              — setup 탭 shell + header (≤ 180 줄)
├─ SetupPanelHeader.tsx            — 제목 + Save/Reset 버튼 + progress text
├─ CameraParamsForm.tsx            — exposure/gain/whiteBalance 등 cameraParams 입력
├─ DeflectometryConfigForm.tsx     — phase_shift_count / capture_directions / include_solid / fringe_period 등
├─ PatternPreviewGrid.tsx          — pattern grid + preview 트리거
├─ SetupActionsRow.tsx             — measure settle delay / white balance calibrate 등 action 버튼들
├─ SetupPanelView.styles.ts        — capture/SetupPanel.styles.ts 그대로 이전 (100줄)
├─ SequencePatternPanelView.tsx    — sequence list (104줄 그대로)
├─ SequencePatternPanelView.styles.ts
├─ DeflectometryTuningControlsView.tsx — tuning sliders (190줄, multi-file 검토)
├─ DeflectometryTuningControlsView.styles.ts
├─ pattern-helpers.ts              — buildPatternLabels / patternLabelToUI / computeTotalPatterns / DERIVED_ORDER / isDerivedPattern / sortOriginalPatterns / sortDerivedPatterns
├─ colormap-helpers.ts             — COLORMAP_OPTIONS / labelToDerivedKind / ColormapName type
├─ types.ts                        — 5 view props + sub-types
└─ index.ts                        — barrel
```

총 21 파일. 모두 ≤ 200 줄 목표.

**styles 200 룰 위반 처리**:

- `CaptureView.styles.ts` 357줄 — **분할 필요**. 다음 3 파일로:
  - `styles/preview.styles.ts` — PreviewArea / CaptureZoomWrap / StreamImg / GridOverlay / CenterCrosshair / ConnectingBox / ConnectingSpinnerBox / FocusPeakingOverlay / HistogramOverlay / HistogramImage / AbsolutePlaceholder / CapturePreviewFullscreenBtn
  - `styles/overlay.styles.ts` — OverlayControls / OverlayHeader / OverlayPopover / ControlRow / ControlLabel / SetupBlockingOverlay / SetupBlockingCard / PlaceholderText / SetupMetrics / MetricCard / MetricLabel / MetricValue / CapturingBadge / ConnectingSpinner
  - `styles/bar.styles.ts` — CaptureBar / CaptureButtonWrap / CaptureButton / StatusText
  - `styles/index.ts` — re-export all
- `SetupPanel.styles.ts` 100줄 — 그대로.
- `DeflectometryTuningControls.styles.ts` — 미확인. 200 초과 시 분할.

---

## 4. Props Interface

### 4.1 CaptureViewProps

```ts
export interface CaptureLabels {
  capturing: string                               // 'workspace.capturing'
  capturingStep: (step: number, total: number) => string  // "Capturing N/total"
  ready: string                                   // 'workspace.ready'
  reconnect: string                               // 'workspace.reconnect'
  // overlay controls
  grid: string                                    // 'capture.grid'
  controls: string                                // 'capture.controls'
  focusPeaking: string                            // 'capture.focusPeaking'
  histogram: string                               // 'capture.histogram'
  // capture bar
  capture: string                                 // 'capture.capture'
  // setup metrics
  setupMetrics: string                            // 'capture.setupMetrics'
}

export interface CaptureViewProps {
  // status
  isConnected: boolean
  isConnecting: boolean
  isCapturing: boolean
  isSetupMode: boolean
  isSetupBusy: boolean
  isSavingSequence: boolean
  isAutoReconnecting: boolean                     // container 의 reconnect side effect 결과

  // preview
  liveFrameSrc: string | null                     // snapshot polling 결과 — container 가 setInterval 로 채움
  previewSrc: string | null                       // setup mode preview (uploaded test shot)
  frozenFrameSrc: string | null                   // capture 중 frozen frame
  hasReceivedSnapshot: boolean
  snapshotError: string | null

  // progress
  progressText: string                            // already translated
  captureStep: number | null
  captureTotalSteps: number | null

  // deflectometry / setup
  setupMetrics: DeflectometryMetrics | null
  previewPatternLabel: PreviewPatternLabel | null
  setupPatternLabel: PreviewPatternLabel | null
  captureDisabledReason: string | null            // already translated
  captureStatusHint: string | null

  // visual-only state (view 가 직접 관리 가능하지만 storybook 검증 위해 props 로)
  showGrid: boolean
  showControls: boolean

  // i18n
  labels: CaptureLabels

  // callbacks
  onCapture: () => void
  onReconnect?: () => void
  onToggleGrid: () => void
  onToggleControls: () => void
}
```

설계 노트:
- snapshot polling 의 모든 useEffect / setInterval / Blob URL revoke 는 container.
- view 는 `liveFrameSrc` / `frozenFrameSrc` / `previewSrc` 셋 중 적절한 것을 render (우선순위 결정 로직은 view 안 OK — visual).
- `showGrid` / `showControls` 도 props 로 lift (visual 이지만 storybook 에서 hover/click scenario 위해).
- `useFullscreen` 은 view 안 — 단 fullscreen 토글 자체가 visual-only.

### 4.2 SetupPanelViewProps

```ts
export interface SetupPanelLabels {
  title: string                                   // 'setup.title'
  save: string                                    // 'setup.save'
  reset: string                                   // 'setup.reset'
  saved: string                                   // 'setup.saved'
  // section titles
  cameraParams: string
  deflectometryConfig: string
  patternPreview: string
  // field labels (다수 — 약 25 key)
  exposure: string
  gain: string
  whiteBalance: string
  whiteBalanceCalibrate: string
  phaseShiftCount: string
  captureDirections: string
  includeSolid: string
  includeBlack: string
  fringePeriod: string
  exposurePerPattern: string
  sequenceRetryPolicy: string
  minFringeContrast: string
  maxSaturation: string
  settleDelay: string
  measureSettleDelay: string
  measuring: string
  monitor: string
  // tooltip
  tooltips: Record<string, string>                // helpKey → text
  // store-backed (lifted)
  autoAnalyze: string
  enabledFeatures: string
}

export interface SetupPanelViewProps {
  // status
  isConnected: boolean
  isSetupBusy: boolean
  isSetupSaved: boolean
  canSave: boolean
  canEditSetup: boolean
  progressText: string
  setupStatusMessage: string | null

  // deflectometry config
  deflectometryEnabled: boolean
  deflectometryConfig: DeflectometryConfigState
  availableMonitors: DeflectometryMonitor[]
  isMeasuringSettleDelay: boolean

  // camera params
  setupConfig: SetupConfigState
  cameraParams: CameraParams

  // preview state
  previewPatternLabel: PreviewPatternLabel | null

  // sequence panel store state (lifted)
  autoAnalyze: boolean
  enabledFeatures: Record<string, boolean>

  // i18n
  labels: SetupPanelLabels

  // callbacks
  onSave: () => void
  onReset: () => void
  onSetSetupConfig: React.Dispatch<React.SetStateAction<SetupConfigState>>
  onUpdateCameraParams: React.Dispatch<React.SetStateAction<CameraParams>>
  onWhiteBalanceCalibrate: () => void
  onPreviewPattern: (pattern: PreviewPatternLabel | null) => void
  onMeasureSettleDelay: () => void
  onAutoAnalyzeChange: (value: boolean) => void
  onEnabledFeaturesChange: (value: Record<string, boolean>) => void
}
```

설계 노트:
- `setSetupConfig` / `updateCameraParams` 는 `Dispatch<SetStateAction>` 시그니처 그대로 (edge 의 useState 결과). 더 단순한 `onChange(value: T)` 로 바꾸려면 container 측 변환 필요 — 본 phase 에선 그대로 유지 (요청받은 것만 구현).
- helpers (`buildPatternLabels` 등) 는 view 안 import.
- tooltips 25+ 항목 → labels.tooltips Record 로 묶음.

### 4.3 SequencePatternPanelViewProps

```ts
export interface PatternImage {
  imageId: string
  patternLabel: string | null
  sequenceStep: number | null
  width: number | null
  height: number | null
}

export interface SequencePatternPanelLabels {
  original: string                                // 'sequencePanel.original'
  derived: string                                 // 'sequencePanel.derived'
  empty: string                                   // 'sequencePanel.empty'
  patternHint: Record<string, string>             // tuning.patternHint.* keys
}

export interface SequencePatternPanelViewProps {
  images: PatternImage[]
  activeImageId: string | null
  viewMode: 'original' | 'derived'
  enabledFeatures: Record<string, boolean>
  labels: SequencePatternPanelLabels
  // tuning controls slot (DeflectometryTuningControlsView)
  tuningControls?: React.ReactNode
  onSelectImage: (imageId: string) => void
  onSetViewMode: (mode: 'original' | 'derived') => void
}
```

설계 노트:
- `DeflectometryTuningControls` child component 를 직접 import 하지 않고 slot 으로 받음 — 의존성 줄임.
- 또는 직접 import (`DeflectometryTuningControlsView` 가 edge-pages 안 같이 있어 import OK). **결정**: 직접 import — 별도 slot 아님. 둘 다 같은 package 안이고 늘 함께 마운트.

### 4.4 DeflectometryTuningControlsViewProps

```ts
export interface DeflectometryTuning {
  modulationThreshold: number
  modulationOverlayEnabled: boolean
  debugOverlayEnabled: boolean
  edgeExclusionPx: number
  roiEditMode: 'none' | 'box' | ...
  roi: ROIBox | null
  derivedOverrides: Record<string, string> | null
  colormaps: Record<string, ColormapName>
}

export interface TuningQualityMetrics {
  modulation: number | null
  contrast: number | null
  saturation: number | null
}

export interface DeflectometryTuningControlsLabels {
  // 약 20 key — slider labels, button labels, warning texts, quality labels
}

export interface DeflectometryTuningControlsViewProps {
  disabled: boolean                               // sequenceId 없을 때
  tuning: DeflectometryTuning
  activeImageLabel: string | null                 // 현재 active image 의 pattern
  qualityMetrics: TuningQualityMetrics | null
  isSavingDefault: boolean
  isRecomputing: boolean
  warning: string | null
  expanded: boolean                               // 본 phase 에선 props (storybook scenario 위해)
  labels: DeflectometryTuningControlsLabels
  onTuningChange: (next: Partial<DeflectometryTuning>) => void
  onReset: () => void
  onRecompute: () => void                         // container 에서 useDeflectometryTuning.runRecompute 호출
  onSaveDefault: () => void
  onToggleExpanded: () => void
  // toast 는 container 가 처리 — view 에는 useToast 안 씀
}
```

설계 노트:
- `useToast` 는 view 가 직접 호출하지 않음 — container 가 `runRecompute` 결과 받고 toast (의존성 줄이기). **revise**: §2.4 의 "view 안 OK" 결정 번복 — 일관성 위해 container 로 옮김.
- expanded state lift — storybook 에서 collapsed/expanded 둘 다 검증.

### 4.5 CaptureReviewFullscreenProps

```ts
export interface CaptureReviewFullscreenLabels {
  exitFullscreen: string                          // 'workspace.exitFullscreen'
  enterFullscreen: string                         // 'workspace.enterFullscreen'
  skip: string                                    // 'workspace.skip'
  save: string                                    // 'setup.save'
}

export interface CaptureReviewFullscreenProps {
  src: string
  showSkip: boolean
  labels: CaptureReviewFullscreenLabels
  onSkip: () => void
  onSave: () => void
}
```

매우 단순 — Workspace.tsx 904-933 의 inline 컴포넌트 그대로.

---

## 5. 변경 파일

### 5.1 신규 (21 file)

§3 의 capture/ 21 파일.

### 5.2 수정 (1 file)

#### `packages/edge-pages/src/index.ts`

```diff
  export * from './workspace'
+ export * from './capture'
```

### 5.3 신규 story

```
stories/pages/edge/0.0.1/capture/
├─ CaptureView.stories.tsx           — 8 scenario (Disconnected / Connecting / LivePreview / Capturing / SetupMode / SetupBusy / GridOff / ControlsOpen)
├─ SetupPanelView.stories.tsx        — 6 scenario (Default / Saved / Saving / NotConnected / NoPermission / Measuring)
├─ SequencePatternPanelView.stories.tsx — 4 scenario (Empty / OriginalView / DerivedView / WithTuning)
├─ DeflectometryTuningControlsView.stories.tsx — 5 scenario (Collapsed / Expanded / Recomputing / Warning / Disabled)
└─ CaptureReviewFullscreen.stories.tsx — 3 scenario (Normal / SkipHidden / Fullscreen)
```

총 5 story file × 4~8 scenario = 26 scenario.

신규 fixture:
- `stories/fixtures/edge/0.0.1/capture-state.ts` — DeflectometryMetrics / SetupConfigState / CameraParams mock
- `stories/fixtures/edge/0.0.1/sequence-images.ts` — PatternImage[] mock

### 5.4 건드리지 않음

- `ingradient-edge/src/frontend/components/capture/*` — Phase 13
- `ingradient-edge/src/frontend/modules/capture/*` (helpers 원본) — Phase 13 에서 일부 삭제 (edge-pages 가 복사 가져갔으므로)
- 단 helpers 복사 시점에 edge 측이 같은 함수 import 중 → Phase 13 까지 양쪽 공존 OK (helpers 는 pure 라 동작 동일)

---

## 6. i18n 키 매핑

총 ~60 key 예상. spec 본문에 전부 나열하지 않고 구현 시 helper hook (`useCaptureLabels()`, `useSetupPanelLabels()` 등) 으로 묶음 — Phase 13 spec 에서 결정.

요약:

- CaptureLabels: ~10 key
- SetupPanelLabels: ~30 key + tooltips 10+
- SequencePatternPanelLabels: ~5 key + patternHint Record
- DeflectometryTuningControlsLabels: ~20 key
- CaptureReviewFullscreenLabels: 4 key

본 phase 의 storybook 은 fixture 의 labels object 한 곳에 hard-coded English.

---

## 7. helper 모듈 복사 정책

`capture/pattern-helpers.ts` 와 `capture/colormap-helpers.ts` 는 edge 의 다음 원본을 복사:

- `ingradient-edge/src/frontend/modules/capture/model/capture.constants.ts` — buildPatternLabels / patternLabelToUI / computeTotalPatterns / DERIVED_ORDER / isDerivedPattern / sortOriginalPatterns / sortDerivedPatterns / AGENT_URL / FOCUS_PEAKING_PATTERN / patternLabelToHintKey (helper 만, 가져올 것만)
- `ingradient-edge/src/frontend/modules/labeling/model/colormaps.ts` — COLORMAP_OPTIONS / labelToDerivedKind / ColormapName

복사 정책:
- pure helper 만 (side effect 없음)
- typescript types 동봉
- edge 의 원본은 그대로 유지 (Phase 13 에서 정리)
- 향후 두 버전이 divergence 발생하면 별도 작업으로 통합

**대안**: helper 를 별도 sub-export (`@ingradient/edge-pages/helpers`) 로? — 본 phase 에선 안 함. edge-pages 안에서만 import (외부 노출 안 함).

---

## 8. 실행 순서

1. helpers:
   - `capture/pattern-helpers.ts`
   - `capture/colormap-helpers.ts`
2. styles 이전 + 분할:
   - `capture/styles/preview.styles.ts` + `overlay.styles.ts` + `bar.styles.ts` + `index.ts` (CaptureView.styles.ts 분할)
   - `capture/SetupPanelView.styles.ts`
   - `capture/SequencePatternPanelView.styles.ts`
   - `capture/DeflectometryTuningControlsView.styles.ts`
3. `capture/types.ts` — 5 view props + sub-types
4. sub-view (의존성 적은 것부터):
   - `capture/CaptureReviewFullscreen.tsx`
   - `capture/CapturingBadge.tsx`
   - `capture/OverlayControls.tsx`
   - `capture/SetupOverlay.tsx`
   - `capture/CaptureBar.tsx`
   - `capture/LivePreviewLayer.tsx`
5. CaptureView shell:
   - `capture/CaptureView.tsx`
6. SetupPanel sub-view:
   - `capture/SetupPanelHeader.tsx`
   - `capture/CameraParamsForm.tsx`
   - `capture/DeflectometryConfigForm.tsx`
   - `capture/PatternPreviewGrid.tsx`
   - `capture/SetupActionsRow.tsx`
7. SetupPanel shell:
   - `capture/SetupPanelView.tsx`
8. Deflectometry sub-view:
   - `capture/DeflectometryTuningControlsView.tsx`
   - `capture/SequencePatternPanelView.tsx`
9. `capture/index.ts` — barrel
10. `packages/edge-pages/src/index.ts` 수정
11. fixtures + stories
12. typecheck + build + storybook build

---

## 9. 검증

| # | 명령 | 기대 결과 |
|---|---|---|
| 1 | `ls packages/edge-pages/src/capture/` | 21~24 파일 (styles 분할 포함) |
| 2 | `cd packages/edge-pages && npx tsc --noEmit` | 0 error |
| 3 | `cd packages/edge-pages && npm run build` | 5 view + 2 helper module export |
| 4 | `find packages/edge-pages/src/capture -name "*.tsx" -o -name "*.ts" \| xargs wc -l` | 모든 파일 < 200 |
| 5 | `npx tsc --noEmit -p tsconfig.json` (root) | 0 error |
| 6 | `npm run build:storybook` | exit 0 |
| 7 | Storybook 수동 확인 — 26 scenario | 모두 props 만으로 렌더 |
| 8 | grep — 금지 import 0 | `grep -rE 'useTranslation\|window\.electron\|zustand\|i18next\|fetch(\|useEffect' packages/edge-pages/src/capture/` → 단 `useEffect` 는 visual-only (fullscreen toggle) 한정으로 허용. fetch / store / IPC / i18n hook 0 |
| 9 | ingradient-edge 측 `npx tsc --noEmit` | 0 error |

---

## 10. 성공 기준

- 검증 1~9 통과
- 5 view (CaptureView / SetupPanelView / SequencePatternPanelView / DeflectometryTuningControlsView / CaptureReviewFullscreen) 가 store/IPC/i18n hook/fetch 의존 0
- 26 storybook scenario 가 props 만으로 렌더
- 모든 파일 < 200 줄
- helper 2개 (pattern-helpers / colormap-helpers) 가 pure 로 분리
- Phase 5 의 `captureContent` + `setupPanelContent` slot 이 본 phase 의 view 로 plug-in 가능 확인 (Workspace.stories 의 scenario 에 실제 view mount 시도)

---

## 11. 리스크

### 11.1 props surface 폭증 — SetupPanel 30+ props

위험: SetupPanelViewProps 의 prop 개수가 25+ — 호출 측 코드가 장황해짐.

대응:
- props group object 패턴 ([package-plan §9.3](./edge-pages-package-plan.md)) — `cameraParams: { exposure, gain, whiteBalance, onChange }` 같이 묶음
- 본 phase 에선 평면 prop 그대로 (edge 의 기존 시그니처 1:1 호환). group object 화는 후속 refactor
- 호출 측은 `useSetupPanelProps()` 같은 helper hook 으로 묶음 (Phase 13)

### 11.2 snapshot polling 의 container 화로 view 가 단순한 img 로

위험: edge 의 CaptureView 는 polling + blob URL revoke + 동일 frame dedup 까지 view 안에서 처리. container 로 옮기면 storybook 에서 live preview 시뮬레이트 불가.

대응:
- view 는 `liveFrameSrc: string | null` prop 만 — storybook 은 static image src
- container 가 polling 책임. blob revoke 도 container 의 useEffect cleanup
- live preview 동작 검증은 Phase 13 의 edge runtime 에서

### 11.3 helper 복사로 인한 divergence

위험: edge 의 `capture.constants.ts` 가 변경되면 edge-pages 의 copy 와 어긋남.

대응:
- 본 phase 에선 일방향 복사 (edge → edge-pages)
- Phase 13 에서 edge 가 edge-pages 의 helper 를 import 하는 방향으로 전환
- 중간 단계 (Phase 6 ~ Phase 13) 동안 양쪽 공존 — divergence 발생 시 edge-pages 가 source of truth

### 11.4 `useSequencePanelStore` 의 large surface

위험: SetupPanel + SequencePatternPanel + DeflectometryTuningControls 셋이 모두 useSequencePanelStore 사용. props 로 lift 시 caller 가 store 전체를 props 로 변환해야 함.

대응:
- 각 view 가 필요한 slice 만 props 로
- Phase 13 spec 에서 container 측 `useSequencePanelProps()` helper hook 작성 (3 view 공유)

### 11.5 `useToast` view 안 vs container

위험: DeflectometryTuningControls 의 toast 호출은 visual feedback 인데 container 로 옮기면 caller 가 toast 책임.

대응:
- 본 spec §4.4 의 revise 결정: container 가 toast 호출
- view 의 `onRecompute` callback 결과는 `isRecomputing: boolean` props 로 표시
- 성공/실패 분기는 caller 가 결정 (toast / error display 등)

### 11.6 styles 분할 (357 → 3 파일) import 폭증

위험: CaptureView 가 12+ styled export 를 3 파일에서 import.

대응:
- `capture/styles/index.ts` re-export 패턴 (Phase 3 와 동일)
- view 는 `import { ... } from './styles'` 한 줄

### 11.7 fullscreen `useFullscreen` hook 의 view 내부 사용

위험: `useFullscreen` 은 DOM API (`document.fullscreenElement`) 사용 — storybook 에서 iframe 안 fullscreen 제약.

대응:
- view 안 OK (visual-only, fallback 동작 가능)
- storybook 에선 fullscreen 토글 시 의도대로 안 될 수 있으나 view 자체 render 는 정상
- 검증 시 fullscreen scenario 는 manual 확인

### 11.8 CaptureView 의 9 useState (showGrid, showControls, streamLoaded, hasReceivedSnapshot, snapshotError, isAutoReconnecting, liveFrameSrc, frozenFrameSrc)

위험: 9 useState 중 어디까지 lift?

대응:
- visual-only (showGrid, showControls, isAutoReconnecting): view 안 가능하지만 storybook 검증 위해 lift
- container 결과 (liveFrameSrc, frozenFrameSrc, previewSrc, snapshotError, hasReceivedSnapshot): container 잔류 → props
- streamLoaded: 더 이상 사용 안 함 (snapshot polling 으로 대체됨) — 제거

---

## 12. Rollback

git revert. 산출물:
- `packages/edge-pages/src/capture/` 디렉토리 삭제
- `packages/edge-pages/src/index.ts` 의 capture export 제거
- `stories/pages/edge/0.0.1/capture/` 디렉토리 삭제
- 신규 fixture 2개 삭제
- `npm run build --workspace packages/edge-pages` 재실행

---

## 13. 종료 후 상태

- `@ingradient/edge-pages` 가 14+ view export (Login / License / DatasetSelect / 3 modal / 4 chrome / Workspace / CaptureView / SetupPanelView / SequencePatternPanelView / DeflectometryTuningControlsView / CaptureReviewFullscreen)
- 200줄 룰 위반 5 파일 (CaptureView / SetupPanel / CaptureView.styles / ...) 모두 multi-file 분해 완료
- helper 2개 (pattern / colormap) pure 분리 — edge-pages 안에서만 사용
- Phase 5 의 captureContent + setupPanelContent slot 이 plug-in 가능
- Phase 7 (ImagesView + BBoxCanvas, 가장 큰 두 파일) 진입 준비 완료

---

## 14. 다음 액션

1. 본 spec ok
2. 실행 (§8 의 12 step)
3. 검증 (§9 의 9 step)
4. Phase 7 spec 작성 (`edge-pages-phase-7-spec.md`) — ImagesView 1223줄 + BBoxCanvas 701줄 + EdgeImagesGrid 152줄
