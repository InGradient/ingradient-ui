---
title: PR-E1a — LabelingCanvas Pattern + useCanvasMouse hook
date: 2026-05-11
parent: docs/plan/pr/5-E1-image-detail-shell.md
scope: ingradient-ui
status: planning — 사용자 review 대기
---

# PR-E1a — LabelingCanvas Pattern

## 1. 목적

PR-E1 phased plan 의 *Phase 1 마지막 PR*. labeling canvas 의 *공통 구조 + 마우스 합성 로직* 을 ui 로 추출. **양 repo cover** (platform ImageDetailCanvas + edge BBoxCanvas inner).

## 2. 조사 — 공통 substrate

### 2.1 공통 layout (양 repo 동일)

```
<Wrap>                              // relative + overflow hidden + center
  <ZoomWrap $zoom $panX $panY>      // transform: translate + scale
    <ImageAreaWrap $aspect>         // aspect-ratio container
      <img src={imageUrl} />        // base image
      {extra overlays slot}         // caller-provided (Archived/SAM/IsoLine/...)
      <DrawingLayer ... />          // ui (이미 존재)
      <CaptureLayer
        cursor=...
        {...mouseHandlers}
      />                            // 마우스 이벤트 캡쳐 div
    </ImageAreaWrap>
  </ZoomWrap>
  {floating overlays slot}          // caller-provided (HiRes pill, hint, etc.)
</Wrap>
```

### 2.2 공통 마우스 합성 (양 repo 거의 동일)

```ts
canPan = tool === 'cursor' && zoom > 1
isHoveringEditable = state // hit-test 결과

onMouseDown:
  - middle button + zoomed → startPan
  - canPan + hit-test bbox → drawing bindings
  - canPan → startPan
  - else → drawing bindings

onMouseMove:
  - update crosshair
  - panning → movePan
  - else → drawing bindings + update hover state

onMouseUp:
  - panning → endPan
  - else → drawing bindings

onMouseLeave: clear + endPan or drawing leave

cursor:
  - panning → grabbing
  - canPan && !hoverEditable → grab
  - else → drawingCursor
```

→ 동일 로직, 양 repo 에서 약 30~40 줄씩 중복. hook 으로 추출.

### 2.3 차이 — caller slot 흡수

| 기능 | platform | edge | 처리 |
|---|---|---|---|
| ArchivedOverlay | ✅ image area | ❌ | `overlays` slot |
| HiResLoadingPill | ✅ float top | ❌ | `floatingOverlays` slot |
| PatternTabBar (group nav) | ✅ float top | ❌ | `floatingOverlays` slot |
| SAM Mask + PointMarkers | ❌ | ✅ image area | `overlays` slot |
| IsoLineOverlay | ❌ | ✅ image area | `overlays` slot |
| Modulation/Debug overlay | ❌ | ✅ image src 변경 | caller 가 imageUrl prop 으로 처리 |
| AnnotationToggleBtn / FullscreenBtn | ❌ | ✅ Wrap 안 absolute | `floatingOverlays` slot |
| Hint overlay | ❌ | ✅ Wrap 안 absolute | `floatingOverlays` slot |

## 3. API 설계

### 3.1 `useCanvasMouse` hook

```tsx
export interface UseCanvasMouseConfig {
  /** Current tool — 'cursor' enables hit-test + pan-when-zoomed. */
  tool: string
  /** Current zoom (from useZoomPan). canPan 결정에 사용. */
  zoom: number
  /** Drawing bindings from useDrawingCanvas — onMouseDown/Move/Up/Leave. */
  drawingBindings: {
    onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseLeave: () => void
  }
  /** Drawing object hit-test (normalized 0~1 coords). When true, click should
   *  go to drawing (resize/move) instead of pan. */
  hitTestEditable: (nx: number, ny: number) => boolean
  /** Zoom-pan API (from useZoomPan). */
  startPan: (clientX: number, clientY: number, currentPanX: number, currentPanY: number) => void
  movePan: (clientX: number, clientY: number) => void
  endPan: () => void
  isZoomPanning: () => boolean
  /** Current pan (for startPan currentPanX/Y arg). */
  pan: { x: number; y: number }
  /** ref to the capture element — for normalized coord calc. */
  containerRef: React.RefObject<HTMLElement | null>
  /** Caller-provided cursor when not in pan mode (e.g. from useDrawingCanvas.cursor). */
  drawingCursor: React.CSSProperties['cursor']
  /** Optional — called on every mousemove with normalized coords. */
  onCrosshairUpdate?: (norm: { nx: number; ny: number } | null) => void
}

export function useCanvasMouse(config: UseCanvasMouseConfig): {
  /** Spread into capture div. */
  mouseHandlers: {
    onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseLeave: () => void
  }
  cursor: React.CSSProperties['cursor']
  isHoveringEditable: boolean
}
```

### 3.2 `LabelingCanvas` Pattern

```tsx
export interface LabelingCanvasProps {
  /** Image to render. */
  imageUrl?: string | null
  alt: string
  /** Image aspect ratio (width / height). Controlled — caller updates on load. */
  imageAspect: number
  /** Called when `<img>` natural dimensions load. caller updates `imageAspect`. */
  onImageLoad?: (naturalWidth: number, naturalHeight: number) => void
  onImageError?: () => void

  /** Zoom + pan from useZoomPan (controlled). */
  zoom: number
  pan: { x: number; y: number }

  /** Drawing data + render config (from useDrawingCanvas + state). */
  objects: DrawingObject[]
  preview?: DrawingPreview | null
  selectedId?: string | null
  showHandles?: boolean
  showLabels?: boolean
  previewColor?: string

  /** Capture layer mouse handlers (보통 useCanvasMouse 결과). */
  mouseHandlers: {
    onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseLeave: () => void
  }
  cursor: React.CSSProperties['cursor']

  /** Crosshair display. null/undefined = hidden. */
  crosshair?: { x: number; y: number; color?: string } | null

  /** Extra overlays inside the image area (positioned over the image, under
   *  DrawingLayer / above DrawingLayer? — see structure). Caller controls z. */
  overlays?: React.ReactNode

  /** Extra overlays inside Wrap (outside ImageAreaWrap, floating UI like
   *  PatternTabBar / HintOverlay / FullscreenBtn). */
  floatingOverlays?: React.ReactNode

  /** ref to the image area (for hit-test math via useCanvasMouse). */
  imageAreaRef?: React.Ref<HTMLDivElement>
  /** ref to outer wrap. */
  wrapRef?: React.Ref<HTMLDivElement>

  className?: string
}
```

### 3.3 layout 결정

```tsx
<Wrap ref={wrapRef} className={className}>
  <ZoomWrap $zoom={zoom} $panX={pan.x} $panY={pan.y}>
    <ImageAreaWrap ref={imageAreaRef} $aspect={imageAspect}>
      {imageUrl ? (
        <Image src={imageUrl} alt={alt} onLoad={...} onError={...} draggable={false} />
      ) : null}
      {overlays}                              {/* SAM mask / IsoLine / ArchivedOverlay */}
      <DrawingLayer
        objects={objects}
        selectedId={selectedId ?? null}
        drawingPreview={preview ?? null}
        showHandles={!!showHandles}
        showLabels={!!showLabels}
        showCrosshair={!!crosshair}
        cursorX={crosshair?.x}
        cursorY={crosshair?.y}
        crosshairColor={crosshair?.color}
        previewColor={previewColor}
        zoom={zoom}
      />
      <CaptureLayer style={{ cursor }} {...mouseHandlers} />
    </ImageAreaWrap>
  </ZoomWrap>
  {floatingOverlays}                          {/* HiRes pill / PatternTabBar / Hint */}
</Wrap>
```

**중요**: caller 가 *DrawingLayer 위에 추가 overlay (e.g. SAM PointMarkers)* 가 필요한 경우 — `overlays` 가 DrawingLayer 보다 *위에* 렌더되도록 순서 결정 필요. 현재는 *DrawingLayer 가 항상 overlays 위*. caller 가 다르게 layering 하려면 `floatingOverlays` 안에 absolute 로 추가. 차이 발생 시 `overlaysAfter` 같은 prop 추가 거리.

## 4. 파일 분할

| 파일 | 줄수 |
|---|---|
| `src/patterns/shells/labeling-canvas.tsx` | ~120 |
| `src/patterns/shells/labeling-canvas.styles.ts` | ~80 |
| `src/patterns/hooks/use-canvas-mouse.ts` (or `src/hooks/`) | ~100 |
| `stories/patterns/labeling-canvas.stories.tsx` | ~180 (interactive demo with useDrawingCanvas + useZoomPan + useCanvasMouse) |
| `stories/patterns/labeling-canvas.stories.helpers.tsx` | ~100 |

### 4.1 hook 위치

`useCanvasMouse` 는 React hook 이지 styled component 가 아님. 위치 두 옵션:
- `src/patterns/hooks/use-canvas-mouse.ts` — patterns 안 일원화
- `src/hooks/use-canvas-mouse.ts` — 다른 hooks 와 일관

ui 의 기존 hooks 위치 확인 후 결정 (`useZoomPan`, `useDrawingCanvas` 위치 따라).

## 5. Storybook variants

- **Review** (Interactive demo):
  - "Basic — bbox draw + zoom/pan" — sample image + useDrawingCanvas + useZoomPan + useCanvasMouse 모두 연결
  - "With extra overlay" — 가짜 SAM mask overlay 표시
  - "With floating overlay" — 우상단 가짜 FullscreenBtn + 하단 hint
  - "Multi-image (group)" — caller 가 PatternTabBar 같은 floatingOverlays 로 image swap UI

## 6. 영향 분석

**ui 추가**: ~580 줄 (component + styles + hook + stories + helpers)

**consumer 영향**: 0 (본 PR scope). PR-E1d 에서 platform 마이그 시점에 활용.

**기존 ui hooks**:
- useDrawingCanvas 유지 — 본 PR scope 밖
- useZoomPan 유지

useCanvasMouse 는 위 둘을 *조합* 만 함. 위 둘에 기능 추가 없음.

## 7. 검증 절차

1. typecheck `npx tsc --noEmit`
2. ui storybook (양 mode):
   - Interactive demo 가 실제로 bbox 그리기 + zoom pan 동작
   - 각 카드 카드 안 격리 (positioning="absolute" 처럼 caller 자유)
   - DrawingLayer self-measure + zoom-stable stroke 정상 (E0b fix 반영)
   - a11y `error` 위반 없음 (canvas role, 캡쳐 div 의 cursor/포커스 처리)
3. storybook tests pass

## 8. 위험

- **중간**. 마우스 합성 로직이 platform / edge 양 쪽에서 검증되었으나 *세부 동작* (middle mouse / hover state timing 등) edge case 존재. Storybook interactive demo 로 일차 검증. PR-E1d 마이그 시 platform 실 사용 검증.
- DrawingLayer 안 crosshair vs caller 별도 crosshair (edge SAM dashed 선) 충돌 — *crosshair color* override 로 cover 가능. ROI / SAM 모드는 별도 caller-side overlay 로 처리 (`overlays` slot)

## 9. 효과 (PR-E1d 시점)

본 Pattern + useCanvasMouse 가 platform / edge 양 쪽에서 사용 시:
- platform ImageDetailCanvas (298줄) → 약 80~100줄 (-200줄)
- edge BBoxCanvas (725줄) 중 canvas core 영역 약 -150줄 (sub-PR E1e 에서 점진)
- 양 repo 합 -350줄

## 10. 다음 단계

본 plan 사용자 review 후:
- 구현 진행 → ui Pattern + hook + stories
- 그 후 PR-E1d (platform 마이그) 진행
