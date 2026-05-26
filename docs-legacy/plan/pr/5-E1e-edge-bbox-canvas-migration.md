---
title: PR-E1e — edge BBoxCanvas → ui LabelingCanvas 마이그
date: 2026-05-11
parent: docs/plan/pr/5-E1-image-detail-shell.md
scope: ingradient-edge
status: planning — 사용자 review 대기
---

# PR-E1e — edge BBoxCanvas 마이그

## 1. 목적

PR-E1 phased plan 의 *Phase 3*. edge [BBoxCanvas.tsx](src/frontend/components/capture/BBoxCanvas.tsx) (725줄) 의 base canvas 영역을 ui LabelingCanvas 로 마이그. SAM/IsoLine/Modulation/Debug/ColormapUrl 등 edge 도메인 overlay 는 `overlays` / `floatingOverlays` slot 으로 caller-provided.

PR-E1 완전 종료 + 양 repo cross-app substrate 검증 마지막.

## 2. 마이그 매핑

### 2.1 base canvas → LabelingCanvas

**현재 구조** ([BBoxCanvas.tsx:604-655](src/frontend/components/capture/BBoxCanvas.tsx#L604-L655)):
```
<Wrap>
  <div ref={wrapRef} flex: 1>
    <ZoomWrap $zoom $panX $panY>
      <div ref={imageAreaRef} aspectRatio>
        <img src={debugOverlayUrl ?? overlayUrl ?? effectiveBase} onLoad />
        {isoLines && <IsoLineOverlay />}
        {(samRoiMode || samViewerMode) && samMaskPng && <MaskOverlay />}
        {samRoiMode && <PointMarkers />}
        <DrawingLayer ... />
        {/* custom crosshair SVG (normalized) */}
        <div style={{ position: absolute, inset: 0, cursor }} {...bindings} />
      </div>
    </ZoomWrap>
    {hintOverlay / annotationToggle / fullscreenBtn / pixelInfo / blockMsg / SamRoi*}
  </div>
  {bottom Toolbar (skip/save/reset)}
</Wrap>
```

**마이그 후**:
```tsx
<Wrap>
  <LabelingCanvas
    imageUrl={debugOverlayEnabled && debugOverlayUrl ? debugOverlayUrl : overlayActive && overlayUrl ? overlayUrl : effectiveBase}
    alt="Capture for labeling"
    imageAspect={imageAspect}
    onImageLoad={(w, h) => setImageAspect(w / h)}
    zoom={zoom} pan={pan} onWheel={handleWheel}
    objects={renderedDrawingObjects}
    preview={renderedDrawingPreview}
    selectedId={renderedSelectedId}
    showHandles={editMode === 'cursor' && !roiEditMode && !samRoiMode}
    showLabels
    previewColor={samRoiMode ? '#22d3ee' : previewColor}
    mouseHandlers={mouseHandlers}      {/* custom — useCanvasMouse 의 일부 + SAM 추가 */}
    cursor={effectiveCursor}
    crosshair={cursorPos && (editMode === 'bbox' || samRoiMode)
      ? { x: cursorPos.x, y: cursorPos.y, color: samRoiMode ? '#22d3ee' : (classColor ?? 'rgba(255,255,255,0.3)') }
      : null}
    imageAreaRef={imageAreaRef}
    wrapRef={wrapRef}
    overlays={
      <>
        {isoLines?.enabled && <IsoLineOverlay ... />}
        {(samRoiMode || samViewerMode) && samMaskPng && <MaskOverlay ... />}
        {samRoiMode && <PointMarkers ... />}
      </>
    }
    floatingOverlays={
      <>
        {!hideHint && <HintOverlay>{hintText}</HintOverlay>}
        {showAnnotationToggle && <AnnotationToggleBtn>...</AnnotationToggleBtn>}
        <FullscreenBtn>...</FullscreenBtn>
        {hoverPixel && <PixelInfo>...</PixelInfo>}
        {blockMsg && <BlockMsg>{blockMsg}</BlockMsg>}
        {samRoiMode && samEmbedStatus === 'loading_model' && <SamRoiStatus />}
        {samRoiMode && <SamRoiToolbar />}
      </>
    }
  />
  {!hideActions && !roiEditMode && !samRoiMode && <Toolbar>{Skip / Save / Reset}</Toolbar>}
</Wrap>
```

### 2.2 mouse 합성 — custom 유지 + useCanvasMouse 부분 사용

BBoxCanvas 의 `composedMouseDown` 가 SAM ROI mode 의 click vs drag 구분, positive point 등 *edge 전용 로직* 포함. useCanvasMouse default 만으로 cover 불가.

**옵션 A**: 전체 custom 유지 — composedMouseDown/Move/Up/Leave 그대로. LabelingCanvas 에 `mouseHandlers` prop 으로 전달.

**옵션 B**: useCanvasMouse 사용 + SAM 클릭 로직만 wrapper. composedMouseDown 안:
```ts
const baseMouseDown = useCanvasMouse({...}).mouseHandlers.onMouseDown
const composedMouseDown = (e) => {
  // SAM 클릭 시작 추적
  if (samRoiMode && e.button === 0) {
    samClickStartRef.current = { x: e.clientX, y: e.clientY }
  }
  baseMouseDown(e)
}
```

→ **옵션 B 추천** — useCanvasMouse 의 표준 동작 (canPan / hit-test / middle pan) 활용 + SAM 만 wrapper 로 보강.

### 2.3 pixel readback / hoverPixel

`pixelCanvasRef` + `readPixelAt` 는 edge 도메인 (deflectometry 분석용). 유지.

`composedMouseMove` 안 setHoverPixel(readPixelAt(nx, ny)) 호출 — useCanvasMouse 의 onCrosshairUpdate 콜백 안에서 호출 가능:
```ts
onCrosshairUpdate: (norm) => {
  if (norm) {
    setHoverPixel(readPixelAt(norm.nx, norm.ny))
    if (editMode === 'bbox' || samRoiMode) setCursorPos({ x: norm.nx, y: norm.ny })
  } else {
    setHoverPixel(null)
    setCursorPos(null)
  }
}
```

### 2.4 styled 정리

[BBoxCanvas.styles.ts](src/frontend/components/capture/BBoxCanvas.styles.ts):
- `Wrap` 유지 (외부 wrap + bottom Toolbar 컨테이너)
- `ZoomWrap` 제거 (LabelingCanvas 가 자체)
- `Toolbar` / `CenterActions` / `RightActions` / `IconBtn` / `BBoxCount` 유지 (page-level bottom toolbar)
- `HintOverlay` / `FullscreenBtn` / `AnnotationToggleBtn` / `PixelInfo` / `PixelSwatch` / `BlockMsg` 유지 (floatingOverlays slot 내용)

→ 약 -50줄 styled.

## 3. 변경 파일

| 파일 | 변경 | 줄수 |
|---|---|---|
| `BBoxCanvas.tsx` | useCanvasMouse 호출 + LabelingCanvas 사용 + composedMouseDown SAM wrapper 만 | 725 → ~500 (-225) |
| `BBoxCanvas.styles.ts` | ZoomWrap 제거 | -50 |

**합 추정**: **-275줄 edge**

## 4. 위험

### 4.1 시각

- BBoxCanvas 의 base `<img>` style + ImageAreaWrap aspect 동작이 LabelingCanvas 의 LabelingImage + ImageAreaWrap 와 정합. 모두 `object-fit: contain` + aspect-ratio 동일
- DrawingLayer 의 containerWidth/Height 가 자동 self-measure (PR-E0b) — BBoxCanvas 가 직접 ResizeObserver 측정한 containerSize 와 동등 (BBoxCanvas 의 setContainerSize useEffect 도 제거 가능)
- Crosshair: BBoxCanvas custom (samRoiMode 분기) → LabelingCanvas 의 crosshair prop. 색상은 prop 에 전달

### 4.2 동작

- SAM ROI mode click-vs-drag 구분 (composedMouseUp 5px threshold) — wrapper 로 보존
- right-click context menu (negative point on SAM) — useCanvasMouse 에 통합 안 됨. drawingBindings.onContextMenu 가 처리하던 부분 — useCanvasMouse 의 mouseHandlers 가 onContextMenu 없으니 별도 처리 필요 가능
- pixel hover (deflectometry) — onCrosshairUpdate 콜백으로 통합
- keyboard handlers (Delete / Escape / Enter) — useEffect 안 useEffect 그대로 (영향 없음)

### 4.3 split 옵션

**A 단일 PR**: 전체 마이그. 큰 변경, 검증 부담.

**B 추천: 2 sub-PR**:
- **PR-E1e-1**: Base canvas 만 — LabelingCanvas + useCanvasMouse 적용. SAM/IsoLine/Modulation 다 caller-side 그대로 (overlays slot). 검증
- **PR-E1e-2**: Mouse composition 의 SAM wrapper 정리 + 모든 floatingOverlays slot 으로 이전

또는 **C**: 단일 PR 로 완성. 사용자 결정.

## 5. 검증 절차

1. ui rebuild → edge sync
2. edge typecheck
3. edge `npm run dev:web` → Capture 화면:
   - 일반 라벨링 (cursor / bbox 모드 토글, drag-create, select-move-resize)
   - zoom (휠 + 두 손가락 trackpad) + pan
   - keyboard (Delete / Escape / Enter / Backspace)
   - SAM ROI 모드: bbox prompt drag + positive point click + right-click negative point
   - ROI edit mode (yellow box drag)
   - IsoLine overlay (derived 이미지)
   - Modulation overlay 토글
   - Debug overlay (geometry view)
   - Colormap (derived 이미지)
   - annotationToggle (눈 아이콘)
   - fullscreen
   - pixel info hover
   - block msg (min count 미달)

## 6. 다음 (PR-E1 종료 후)

- PR-E11/E12 cross-repo modal 통합
- PR-E3 image-detail-modal split (818줄)
- PR-E4 BBoxCanvas split (PR-E1e 후에도 200줄 limit 초과 가능)
- 기타 Phase 5 거리
