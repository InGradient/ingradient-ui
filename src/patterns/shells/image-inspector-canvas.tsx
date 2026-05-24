import { useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import {
  useCanvasMouse,
  useDrawingCanvas,
  useZoomPan,
  type DrawingObject,
} from '../../components'
import { IconButton } from '../../components/inputs/icon-button'
import { LabelingCanvas } from './labeling-canvas'

export interface AnnotationBoundingBox {
  id: string
  label?: string
  color: string
  /** Normalized 0~1 coordinates (left / top / width / height) */
  x: number
  y: number
  width: number
  height: number
}

export interface AnnotationPolygon {
  id: string
  label?: string
  color: string
  /** Normalized 0~1 points (relative to image) */
  points: { x: number; y: number }[]
  fillOpacity?: number
}

const TopRightGroup = styled.div`
  position: absolute;
  top: 8px;
  right: 16px;
  z-index: 20;
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
`

export interface InspectorPoint {
  id: string
  label?: string
  color: string
  /** Normalized 0~1 coordinates */
  x: number
  y: number
}

export interface ImageInspectorCanvasProps {
  imageUrl: string
  imageAlt?: string
  /** Display-only bounding boxes (normalized). */
  boxes?: AnnotationBoundingBox[]
  /** Display-only points (normalized). */
  points?: InspectorPoint[]
  /** Max zoom factor (default 8). */
  maxZoom?: number
  /** Show label chips on boxes (default true). */
  showLabels?: boolean
  /** Show floating zoom-in / zoom-out IconButtons at top-right (default true). */
  showZoomControls?: boolean
  /** When provided, renders a close `X` IconButton next to zoom controls. */
  onClose?: () => void
  className?: string
}

function fakeWheelEvent(deltaY: number): WheelEvent {
  return { deltaY, preventDefault: () => undefined } as WheelEvent
}

/**
 * Inspector-mode wrapper around `LabelingCanvas`.
 *
 * Provides zoom + pan + cursor-only mouse handling for read-only annotation
 * display. Optionally renders floating top-right controls (zoom in/out + close)
 * matching platform 의 `TopRightFloatingControls`.
 */
export function ImageInspectorCanvas({
  imageUrl,
  imageAlt = '',
  boxes = [],
  points = [],
  maxZoom = 8,
  showLabels = true,
  showZoomControls = true,
  onClose,
  className,
}: ImageInspectorCanvasProps) {
  const [imageAspect, setImageAspect] = useState(4 / 3)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const { zoom, pan, handleWheel, startPan, movePan, endPan, isZoomPanning } = useZoomPan({
    maxZoom,
  })

  const objects: DrawingObject[] = useMemo(
    () => [
      ...boxes.map((b) => ({
        id: b.id,
        type: 'rect' as const,
        x: b.x,
        y: b.y,
        w: b.width,
        h: b.height,
        color: b.color,
        label: b.label,
      })),
      ...points.map((p) => ({
        id: p.id,
        type: 'point' as const,
        x: p.x,
        y: p.y,
        color: p.color,
        label: p.label,
      })),
    ],
    [boxes, points],
  )

  const drawing = useDrawingCanvas({
    objects,
    mode: 'cursor',
    onObjectsChange: () => undefined,
  })

  const { mouseHandlers, cursor } = useCanvasMouse({
    tool: 'cursor',
    zoom,
    drawingObjects: objects,
    drawingBindings: drawing.bindings,
    drawingCursor: drawing.cursor,
    startPan,
    movePan,
    endPan,
    isZoomPanning:
      typeof isZoomPanning === 'function' ? isZoomPanning : () => Boolean(isZoomPanning),
    pan,
    containerRef: wrapRef,
  })

  const zoomIn = () => handleWheel(fakeWheelEvent(-100))
  const zoomOut = () => handleWheel(fakeWheelEvent(100))

  const floatingControls = showZoomControls || onClose ? (
    <TopRightGroup>
      {showZoomControls ? (
        <>
          <IconButton
            variant="secondary"
            aria-label="Zoom out"
            title="Zoom out"
            disabled={zoom <= 1}
            onClick={(e) => {
              e.stopPropagation()
              zoomOut()
            }}
          >
            <ZoomOut size={18} />
          </IconButton>
          <IconButton
            variant="secondary"
            aria-label="Zoom in"
            title="Zoom in"
            onClick={(e) => {
              e.stopPropagation()
              zoomIn()
            }}
          >
            <ZoomIn size={18} />
          </IconButton>
        </>
      ) : null}
      {onClose ? (
        <IconButton
          variant="secondary"
          aria-label="Close"
          title="Close"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        >
          <X size={18} />
        </IconButton>
      ) : null}
    </TopRightGroup>
  ) : null

  return (
    <LabelingCanvas
      className={className}
      imageUrl={imageUrl}
      alt={imageAlt}
      imageAspect={imageAspect}
      onImageLoad={(w, h) => setImageAspect(w / h)}
      zoom={zoom}
      pan={pan}
      objects={objects}
      selectedId={drawing.selectedId}
      showLabels={showLabels}
      mouseHandlers={mouseHandlers}
      cursor={cursor}
      wrapRef={wrapRef}
      onWheel={handleWheel}
      floatingOverlays={floatingControls}
    />
  )
}
