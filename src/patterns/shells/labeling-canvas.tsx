import React from 'react'
import { DrawingLayer, type DrawingObject, type DrawingPreview } from '../../components/data-display/drawing-layer'
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
  className,
}: LabelingCanvasProps) {
  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const el = event.currentTarget
    if (el.naturalWidth && el.naturalHeight && onImageLoad) {
      onImageLoad(el.naturalWidth, el.naturalHeight)
    }
  }
  return (
    <LabelingCanvasWrap ref={wrapRef} className={className}>
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
