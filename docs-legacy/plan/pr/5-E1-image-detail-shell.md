---
title: PR-E1 — Labeling substrate phased plan (LabelingCanvas + AnnotationToolbar + DialogShell)
date: 2026-05-11
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-ui (foundation) + ingradient-platform / ingradient-edge (consumers)
status: planning — phased PR 설계
---

# PR-E1 — Labeling substrate phased plan

## 1. 배경 재정의

audit 의 "ImageDetailShell" 명세는 *제품 특화* 추상화로, platform image-detail vs edge labeling 의 *실제* 공유 영역과 어긋남.

**실제 공유 substrate**:
1. **Canvas core**: image + zoom/pan + drawing overlay — *양 repo 공통* ⭐
2. **Annotation toolbar**: mode toggle + zoom + undo/redo — *구조 동일*
3. **Modal primitive**: backdrop + content box — *platform + 신규 modal 거리*

**Shell 자체** (fixed viewport modal vs Workspace absolute modal) 은 공유 가치 낮음 → 각자 유지.

향후 segmentation / polygon / brush 도구 추가 시 LabelingCanvas 의 *drawing 모드 확장* 만으로 cover 가능 — substrate 가 forward-compatible.

## 2. 신규 Pattern (ui)

### 2.1 LabelingCanvas — *Layer 2*

ImageViewer + DrawingLayer + crosshair + caller-provided extra overlays 를 컴포즈. 양 repo 공통 substrate.

```tsx
<LabelingCanvas
  src={imageUrl}
  alt={altText}
  tool={tool}                           // 'cursor' | 'bbox' | 'point' | string (future tools)
  objects={drawingObjects}              // DrawingObject[] from useDrawingCanvas
  preview={drawingPreview}              // current drag preview
  selectedId={selectedId}
  /** drawing handler bindings from useDrawingCanvas */
  bindings={drawingBindings}
  /** crosshair */
  showCrosshair={tool !== 'cursor'}
  crosshairColor={crosshairColor}
  /** drawing color (active class) */
  previewColor={previewColor}
  /** bbox labels visibility */
  showLabels
  /** zoom/pan — controlled */
  zoom={zoom}
  onZoomChange={setZoom}
  pan={pan}
  onPanChange={setPan}
  /** Slot for extra layers (SAM ROI, isoLine, modulation, etc.) — caller-provided */
  overlays={[<SamRoiLayer />, <IsoLineOverlay />]}
  /** Optional events (group nav swipe, etc.) */
  onMouseMove={updateCrosshair}
  onMouseLeave={clearCrosshair}
/>
```

**responsibilities**:
- 이미지 렌더링 (img 또는 ImageViewer 의 자체 img)
- zoom/pan 통합 (useZoomPan or controlled via props)
- DrawingLayer wiring (objects + preview)
- crosshair display
- extra overlay slot (캘러가 SAM/isoLine 등 자유 추가)

**핸들러는 caller**:
- mode 전환은 caller 가 외부 toolbar 에서 처리
- useDrawingCanvas 는 caller 가 보유 — bindings prop 으로 전달

### 2.2 AnnotationToolbar — *Layer 3*

```tsx
<AnnotationToolbar
  modes={[                                          // mode toggle slot
    { key: 'cursor', label: 'Select', icon: <CursorIcon />, active, onClick },
    { key: 'bbox', label: 'Bbox', icon: <BboxIcon />, active, onClick },
    { key: 'point', label: 'Point', icon: <PointIcon />, active, onClick },
  ]}
  /** 공통 액션 (built-in) */
  zoom={zoom}
  onZoomIn={zoomIn}
  onZoomOut={zoomOut}
  canUndo
  canRedo
  onUndo={undo}
  onRedo={redo}
  /** Optional live coord readout */
  liveCoords={liveNorm}                             // { x, y } or null
  /** Trailing slot — product-specific extra buttons (Delete/Close/Classification/ROI 등) */
  trailing={<><DangerIconBtn onClick={onDelete}><TrashIcon /></DangerIconBtn><IconBtn onClick={onClose}><CloseIcon /></IconBtn></>}
  /** Layout position (top-overlay vs bottom-bar) */
  position="bottom"                                 // 'top' | 'bottom'
/>
```

### 2.3 DialogShell — *Layer 1 (modal-only)*

Radix-style primitive. **platform image-detail + AddDatasetModal + ExportModal + NoticeModal + 신규 modal 거리 공통**.

```tsx
<DialogShell
  open={open}
  onClose={onClose}                                 // backdrop click + Esc + onClose ?
  width="95vw"                                       // override (default fit-content)
  height="calc(100vh - 80px)"
  /** 추가 핸들러 forward */
  onContextMenu={openContextMenu}
  onTouchStart={...}
  /** sidebar slot (optional). platform image-detail = yes, AddDataset/Export = no */
  sidebar={<SidePanel />}
  sidebarWidth={320}
  onSidebarResize={...}
  /** absolute layer (ContextMenu 등) */
  overlay={<ContextMenu />}
  /** Dialogs/Confirmations sibling */
  extras={<Dialogs />}
>
  {/* main content */}
</DialogShell>
```

**edge labeling 은 사용 안 함** (workspace-absolute, fixed-viewport 가 아님).

## 3. Phased PR 분할

| PR | 작업 | scope | risk |
|---|---|---|---|
| **PR-E1a** | ui LabelingCanvas Pattern + Stories | ui only | low |
| **PR-E1b** | ui AnnotationToolbar Pattern + Stories | ui only | low |
| **PR-E1c** | ui DialogShell Pattern + Stories | ui only | low |
| **PR-E1d** | platform image-detail-modal: DialogShell + AnnotationToolbar + LabelingCanvas 동시 마이그 | platform | **medium-high** (회귀 검증 필수) |
| PR-E1e | edge BBoxCanvas → LabelingCanvas (점진적, SAM/isoLine 은 overlays slot) | edge | medium (BBoxCanvas 725줄 분할 동반) |
| PR-E1f (future) | LabelingCanvas 에 polygon/segmentation mode 추가 | ui | small (mode 추가만) |

각 sub-PR 은 *별도 plan* 작성 후 사용자 review.

## 4. Phase 1 — ui Pattern 3개 추출 우선

**진행 순서 추천**:
1. PR-E1c **DialogShell** 먼저 (가장 단순. 즉시 PR-E11/E12 (Modal 통합) 와 연결)
2. PR-E1b **AnnotationToolbar** (LabelingCanvas 보다 작음. 단독으로도 useful)
3. PR-E1a **LabelingCanvas** (가장 복잡. 위 둘이 끝난 뒤)

→ 단계별 진행하면서 각 ui Pattern 검증 후 consumer 마이그 (E1d, E1e).

## 5. Phase 2 — platform 마이그 (PR-E1d)

**대상**: image-detail-modal.tsx (765줄) + styled.layout.ts (159줄) + styled.sidebar.ts (197줄)

**마이그 결과**:
- image-detail-modal.tsx: 765 → 약 580 (-185줄). JSX 가 DialogShell + LabelingCanvas + AnnotationToolbar 호출로 축약
- image-detail-modal.styles.layout.ts: 159 → 약 20 (-140줄). 대부분 ui Pattern 흡수
- image-detail-modal.styles.sidebar.ts: 197 → 약 100 (-90줄). ClassSidebarResizer 가 ui Pattern 안
- ImageDetailToolbar.tsx (175줄): AnnotationToolbar 사용으로 약 -80줄
- ImageDetailCanvas.tsx (298줄): LabelingCanvas 사용으로 약 -150줄

**합 -645줄 platform 추정** (audit -150 대비 훨씬 큼)

## 6. Phase 3 — edge 마이그 (PR-E1e, 후속)

**대상**: BBoxCanvas.tsx (725줄) → LabelingCanvas 사용

**마이그 결과**:
- BBoxCanvas 자체는 LabelingCanvas wrap + edge-specific overlays (SAM/isoLine/modulation/colormap) 전달
- 약 -300줄 edge
- 200줄 limit 위반도 동시 해결 (PR-E4 흡수)

## 7. Phase 4 — future tools (PR-E1f, audit 밖)

segmentation / polygon / brush 추가:
- DrawingLayer 확장 (polygon path 렌더)
- useDrawingCanvas 확장 (polygon click-to-add-vertex 등)
- LabelingCanvas 의 tool prop 에 'polygon' 추가
- AnnotationToolbar 의 modes 배열에 buttons 추가

→ substrate 가 forward-compatible

## 8. governance 검토

D-007 ("props ≤ 5"):
- LabelingCanvas: 13+ props — *chart cards 예외 동일 적용*. labeling 도메인 config-rich. 모든 props slot 또는 optional default
- AnnotationToolbar: 9+ props — 동일
- DialogShell: 9+ props — 동일

각 Pattern 별 file < 200줄 유지 (Pattern + styles 분리)

D-016 (storybook 의무): 각 Pattern 별 Review story + variants

## 9. 다음 단계

사용자가 phased plan 검토 후:
- **순서 동의 시**: PR-E1c (DialogShell) 부터 sub-plan 작성 → 구현
- **수정 의견 시**: 우선순위 / scope 조정

각 sub-PR (E1a~E1d) 은 별도 plan 작성 후 구현.

## 10. 효과 합 추정

| Repo | 줄수 변화 |
|---|---|
| ui | +700 (3 Pattern + stories) |
| platform | -645 (image-detail 영역) |
| edge | -300 (BBoxCanvas) |
| **양 repo 합** | **-945줄** |

audit -150 추정 대비 6배 효과 + future segmentation tool 자연스러운 확장 + cross-repo 일관 시각 + 200줄 limit governance 동반 해결.
