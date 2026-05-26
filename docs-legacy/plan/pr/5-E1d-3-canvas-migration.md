---
title: PR-E1d-3 — platform ImageDetailCanvas → ui LabelingCanvas 마이그
date: 2026-05-11
parent: docs/plan/pr/5-E1d-platform-image-detail-migration.md
scope: ingradient-platform
status: planning — 사용자 review 대기
---

# PR-E1d-3 — Canvas 마이그

## 1. 목적

PR-E1d phased plan 의 마지막 sub-PR. [ImageDetailCanvas.tsx](frontend/components/gallery/image-detail/ImageDetailCanvas.tsx) (298줄) 를 ui `LabelingCanvas` + `useCanvasMouse` hook 으로 교체. 마우스 합성 로직 / hit-test / cursor 분기 / ZoomWrap / ImageAreaWrap / ModalImg / BboxLayer 모두 ui 흡수.

## 2. 마이그 매핑

### 2.1 ImageDetailCanvas.tsx 내부 → LabelingCanvas

**현재 구조**:
```tsx
<ImageAndTabsCol>
  <ImageWrap ref={imageWrapRef}>
    <ZoomWrap $zoom $panX $panY>
      <ImageAreaWrap ref={wrapRef} $aspect={imageAspect}>
        <ModalImg src={imageUrl} onLoad={...} />
        {currentImage.archived && <ArchivedOverlay />}
        {isImageLoading && <ModalImageLoading><Spinner /></ModalImageLoading>}
        {isHiResLoading && <HiResLoadingPill>Loading hi-res…</HiResLoadingPill>}
        {(mode === 'cursor' || mode === 'bbox' || mode === 'point') && (
          <BboxLayer
            style={{ cursor: ... }}
            onMouseDown={...}
            onMouseMove={...}
            ...
          />
        )}
        <DrawingLayer
          objects={...}
          ...
        />
      </ImageAreaWrap>
    </ZoomWrap>
    {hasGroup && groupImages && (
      <PatternTabBar>...</PatternTabBar>
    )}
  </ImageWrap>
</ImageAndTabsCol>
```

**마이그 후**:
```tsx
<LabelingCanvas
  imageUrl={imageUrl}
  alt={currentImage.name ?? currentImage.id}
  imageAspect={imageAspect}
  onImageLoad={(w, h) => { setImageAspectFromLoad(w / h); setIsImageLoading(false) }}
  zoom={zoom}
  pan={pan}
  objects={drawingObjects}
  preview={drawingCanvasPreview}
  selectedId={drawingSelectedId}
  showHandles={mode === 'cursor' && selectedBboxIndex != null}
  showLabels={showBboxClassNames}
  previewColor={previewColor}
  mouseHandlers={mouseHandlers}                  // useCanvasMouse 결과
  cursor={cursor}                                 // useCanvasMouse 결과
  crosshair={crosshairPos && (mode === 'bbox' || mode === 'point' || mode === 'cursor')
    ? { x: crosshairPos.x, y: crosshairPos.y, color: crosshairColor }
    : null}
  imageAreaRef={wrapRef}
  wrapRef={imageWrapRef}
  underlays={currentImage.archived ? <ArchivedOverlay style={{ zIndex: 1 }} /> : null}
  overlays={
    <>
      {isImageLoading && <ModalImageLoading><Spinner size="md" tone="white" /></ModalImageLoading>}
      {isHiResLoading && !isImageLoading && (
        <HiResLoadingPill role="status" aria-live="polite">
          <Spinner size="sm" tone="white" /> Loading hi-res…
        </HiResLoadingPill>
      )}
    </>
  }
  floatingOverlays={hasGroup && groupImages ? <PatternTabBar ...>... </PatternTabBar> : null}
/>
```

### 2.2 useCanvasMouse 사용

[ImageDetailCanvas.tsx:104-237](frontend/components/gallery/image-detail/ImageDetailCanvas.tsx#L104-L237) 의 마우스 합성 로직 (canPan / hit-test / middle-mouse pan / 등) 모두 `useCanvasMouse` hook 으로 대체.

**caller (image-detail-modal.tsx)**:
```tsx
const tool: 'cursor' | 'bbox' | 'point' = mode === 'bbox' ? 'bbox' : mode === 'point' ? 'point' : 'cursor'

const { mouseHandlers, cursor: composedCursor } = useCanvasMouse({
  tool,
  zoom,
  drawingBindings: drawingCanvasBindings,  // useDrawingCanvas 결과
  drawingObjects: drawingCanvasObjects,
  drawingCursor,                           // useDrawingCanvas.cursor
  startPan, movePan, endPan, isZoomPanning,
  pan,
  containerRef: wrapRef,
  onCrosshairUpdate: (n) => setCrosshairPos(n ? { x: n.nx, y: n.ny } : null),
})
```

기존 hit-test (12px padding) 는 useCanvasMouse 의 default. 단 `updateCrosshair` / `clearCrosshair` 가 platform 자체 함수였다면 `onCrosshairUpdate` 콜백으로 통합.

### 2.3 PatternTabBar (group nav)

[ImageDetailCanvas.tsx:256-294](frontend/components/gallery/image-detail/ImageDetailCanvas.tsx#L256-L294) 의 PatternTabBar 는 `floatingOverlays` slot 으로 이동. PatternTabBar / PatternTabBtn styled 는 platform 유지 (group nav 는 platform 도메인).

### 2.4 styled 제거

[image-detail-modal.styles.canvas.ts](frontend/components/gallery/image-detail/image-detail-modal.styles.canvas.ts) (189줄):
- `ZoomWrap` 제거 — LabelingCanvas 가 자체 ZoomWrap
- `ImageAreaWrap` 제거 — LabelingCanvas 가 자체 ImageAreaWrap
- `ModalImg` 제거 — LabelingCanvas 의 LabelingImage
- `BboxLayer` 제거 — LabelingCanvas 의 CaptureLayer
- `CrosshairOverlay` / `CrosshairLineV` / `CrosshairLineH` 제거 — DrawingLayer 가 자체 crosshair (이미 LabelingCanvas 안)
- `CursorSelectLayer` 제거 (사용 안 함)
- `ModalImageLoading` 유지 (caller 가 overlays slot 으로 전달)
- `HiResLoadingPill` 유지 (caller 가 overlays slot 으로 전달)

[image-detail-modal.styles.layout.ts](frontend/components/gallery/image-detail/image-detail-modal.styles.layout.ts):
- `ImageAndTabsCol` 제거 (LabelingCanvas 가 column flex)
- `ImageWrap` 제거 (LabelingCanvas 가 자체)
- `PatternTabBar` / `PatternTabBtn` 유지 (group nav floatingOverlays 안)

## 3. 변경 파일 추정

| 파일 | 변경 |
|---|---|
| `image-detail-modal.tsx` | ImageDetailCanvas 호출 → LabelingCanvas 직접 + useCanvasMouse 호출 추가. PatternTabBar JSX 도 modal 안 또는 별도 helper |
| `ImageDetailCanvas.tsx` | **삭제** (298줄) — 모든 로직이 LabelingCanvas + useCanvasMouse 에 흡수, group nav 만 modal 안 floatingOverlays 로 |
| `image-detail-modal.styles.canvas.ts` | 189 → 약 50줄. ModalImageLoading + HiResLoadingPill 만 유지 |
| `image-detail-modal.styles.layout.ts` | 57 → 약 50줄. ImageAndTabsCol/ImageWrap 제거, PatternTabBar/PatternTabBtn 유지 |

**합 추정**: 약 **-350~400줄 platform**

## 4. 위험

- **중간**. ImageDetailCanvas 의 hit-test / 마우스 합성 / cursor 결정 가 useCanvasMouse 의 default 와 *완전 동등* 한지 확인
- `setIsHoveringEditable` 가 useCanvasMouse 안 내부 상태 — caller 가 별도 추적할 필요 없음 (cursor 결정만 사용)
- `imageWrapRef` 가 `wrapRef` 와 `imageAreaRef` 로 분리 — 기존 platform 의 `imageWrapRef` 는 외부 wrap (HiResPill / PatternTabBar 의 ref 부모), `wrapRef` 는 ImageAreaWrap (hit-test 측정용). 매핑 정확히
- `updateCrosshair` / `clearCrosshair` 가 외부 onMouseMove/Leave 에서 직접 호출되던 부분 — useCanvasMouse 의 `onCrosshairUpdate` 콜백으로 통합

## 5. 검증 절차

1. ui rebuild
2. platform typecheck
3. platform dev → 모달:
   - 이미지 표시 + aspect 정상 (onImageLoad 갱신)
   - zoom (휠 + 버튼) — pan clamp 동작
   - cursor mode + zoom>1 + 빈 공간 드래그 → pan
   - cursor mode + bbox 위 드래그 → select/move/resize
   - bbox mode + 드래그 → 새 bbox 생성
   - point mode + 클릭 → 새 point
   - crosshair 표시 (cursor 이동 시) + 캔버스 밖 leave 시 사라짐
   - selected bbox 시 handles 표시
   - bbox label (showBboxClassNames)
   - ModalImageLoading (이미지 처음 로드 시)
   - HiResLoadingPill (zoom > 1 시)
   - ArchivedOverlay (archived 이미지)
   - group images 좌우 nav (PatternTabBar)

## 6. 후속 거리

본 PR 후 PR-E1 완전 종료. 다음 거리:
- PR-E1e: edge BBoxCanvas → LabelingCanvas 마이그 (SAM/isoLine/modulation 은 overlays slot)
- 또는 다른 Phase 5 거리 (PR-E11/E12 등)
