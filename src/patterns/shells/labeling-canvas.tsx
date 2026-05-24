import React, { useCallback, useEffect, useRef } from 'react'
import { DrawingLayer, type DrawingObject, type DrawingPreview } from '../annotation/drawing-layer'
import {
  CaptureLayer,
  ImageAreaWrap,
  LabelingCanvasWrap,
  LabelingImage,
  ZoomWrap,
} from './labeling-canvas.styles'

export interface LabelingCanvasProps {
  /** Image source. */
  imageUrl?: string | null
  alt: string
  /** Image aspect ratio (width / height). Controlled — caller updates on load. */
  imageAspect: number
  /** Called when `<img>` natural dimensions load. caller updates `imageAspect`. */
  onImageLoad?: (naturalWidth: number, naturalHeight: number) => void
  onImageError?: () => void

  /** Zoom + pan (controlled, from useZoomPan). */
  zoom: number
  pan: { x: number; y: number }

  /** Drawing data (from useDrawingCanvas + state). */
  objects: DrawingObject[]
  preview?: DrawingPreview | null
  selectedId?: string | null
  showHandles?: boolean
  showLabels?: boolean
  /** Drawing preview color (e.g. selected class color). */
  previewColor?: string

  /** Capture layer mouse handlers (보통 useCanvasMouse 결과). */
  mouseHandlers: {
    onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseLeave: () => void
  }
  /** Capture layer CSS cursor. */
  cursor: React.CSSProperties['cursor']

  /** Crosshair display config. null/undefined = 숨김. */
  crosshair?: { x: number; y: number; color?: string } | null

  /** Image area 안 추가 overlays — DrawingLayer 보다 *위에* 렌더되어 caller 가
   *  SAM mask / IsoLine / Modulation 등 자유 layer 추가 가능. */
  overlays?: React.ReactNode

  /** Image area 안 + DrawingLayer 보다 *아래에* 렌더되는 underlay — 예: ArchivedOverlay. */
  underlays?: React.ReactNode

  /** Wrap 안 absolute floating UI (HiResPill / PatternTabBar / Hint / FullscreenBtn 등). */
  floatingOverlays?: React.ReactNode

  /** Image area ref (hit-test 계산용 — 보통 useCanvasMouse 의 containerRef 와 동일). */
  imageAreaRef?: React.Ref<HTMLDivElement>
  /** 외부 wrap ref. */
  wrapRef?: React.Ref<HTMLDivElement>

  /** Wheel handler — 마우스 휠로 zoom (보통 useZoomPan().handleWheel).
   *  Pattern 이 내부에서 `addEventListener('wheel', ..., { passive: false })` 로
   *  첨부하여 React 의 passive 기본값으로 인한 `preventDefault()` 실패 회피. */
  onWheel?: (event: WheelEvent) => void

  className?: string
}

export function LabelingCanvas({
  imageUrl,
  alt,
  imageAspect,
  onImageLoad,
  onImageError,
  zoom,
  pan,
  objects,
  preview,
  selectedId,
  showHandles,
  showLabels,
  previewColor,
  mouseHandlers,
  cursor,
  crosshair,
  overlays,
  underlays,
  floatingOverlays,
  imageAreaRef,
  wrapRef,
  onWheel,
  className,
}: LabelingCanvasProps) {
  const internalWrapRef = useRef<HTMLDivElement | null>(null)
  // 외부 wrapRef + 내부 ref 병합 (callback ref).
  const setWrapRef = useCallback(
    (node: HTMLDivElement | null) => {
      internalWrapRef.current = node
      if (typeof wrapRef === 'function') wrapRef(node)
      else if (wrapRef && 'current' in wrapRef) {
        ;(wrapRef as React.MutableRefObject<HTMLDivElement | null>).current = node
      }
    },
    [wrapRef],
  )

  // Wheel listener — React 의 onWheel 은 passive default 라 preventDefault 실패.
  // native addEventListener 로 첨부 + passive: false 명시.
  useEffect(() => {
    if (!onWheel) return
    const el = internalWrapRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
    }
  }, [onWheel])

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const el = event.currentTarget
    if (el.naturalWidth && el.naturalHeight && onImageLoad) {
      onImageLoad(el.naturalWidth, el.naturalHeight)
    }
  }
  return (
    <LabelingCanvasWrap ref={setWrapRef} className={className}>
      <ZoomWrap $zoom={zoom} $panX={pan.x} $panY={pan.y}>
        <ImageAreaWrap ref={imageAreaRef} $aspect={imageAspect}>
          {imageUrl ? (
            <LabelingImage
              src={imageUrl}
              alt={alt}
              draggable={false}
              onLoad={handleLoad}
              onError={onImageError}
            />
          ) : null}
          {underlays}
          <DrawingLayer
            objects={objects}
            selectedId={selectedId ?? null}
            drawingPreview={preview ?? null}
            showHandles={!!showHandles}
            showLabels={!!showLabels}
            showCrosshair={!!crosshair}
            cursorX={crosshair?.x}
            cursorY={crosshair?.y}
            previewColor={previewColor}
            crosshairColor={crosshair?.color}
            zoom={zoom}
          />
          {overlays}
          <CaptureLayer style={{ cursor }} {...mouseHandlers} />
        </ImageAreaWrap>
      </ZoomWrap>
      {floatingOverlays}
    </LabelingCanvasWrap>
  )
}
