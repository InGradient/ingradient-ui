import { useCallback, useState } from 'react'
import type { DrawingObject } from './useDrawingCanvas'
import { getNormalizedCoord } from './normalized-coord'

export interface UseCanvasMouseConfig {
  /** Current tool — 'cursor' enables pan-when-zoomed + hit-test. */
  tool: 'cursor' | 'bbox' | 'point' | string
  /** Current zoom level (from useZoomPan). canPan = (tool==='cursor' && zoom > 1). */
  zoom: number
  /** Drawing object hit-test in normalized [0,1] coords. When true, click should
   *  go to drawing (resize/move) instead of pan. Default: checks rect bounds with
   *  a 12px hit padding (handles can stick out). */
  hitTestEditable?: (nx: number, ny: number) => boolean
  /** Drawing objects — used by the default hit-test if `hitTestEditable` omitted. */
  drawingObjects?: DrawingObject[]
  /** Drawing bindings from useDrawingCanvas — onMouseDown/Move/Up/Leave. */
  drawingBindings: {
    onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseLeave: () => void
  }
  /** Caller-provided cursor when not in pan mode (e.g. from useDrawingCanvas.cursor). */
  drawingCursor: React.CSSProperties['cursor']
  /** Zoom-pan API (from useZoomPan). */
  startPan: (clientX: number, clientY: number, currentPanX: number, currentPanY: number) => void
  movePan: (clientX: number, clientY: number) => void
  endPan: () => void
  isZoomPanning: () => boolean
  /** Current pan (for startPan currentPanX/Y arg). */
  pan: { x: number; y: number }
  /** Ref to the capture element — for normalized coord calc. */
  containerRef: React.RefObject<HTMLElement | null>
  /** Optional — called on every mousemove with normalized coords (null on leave). */
  onCrosshairUpdate?: (norm: { nx: number; ny: number } | null) => void
}

const HANDLE_HIT_PX = 12

function defaultHitTest(
  objects: DrawingObject[] | undefined,
  containerRef: React.RefObject<HTMLElement | null>,
  nx: number,
  ny: number,
): boolean {
  const el = containerRef.current
  if (!el || !objects) return false
  const rect = el.getBoundingClientRect()
  const padX = HANDLE_HIT_PX / Math.max(rect.width, 1)
  const padY = HANDLE_HIT_PX / Math.max(rect.height, 1)
  return objects.some((obj) => {
    if (obj.type !== 'rect' || obj.w == null || obj.h == null) return false
    return (
      nx >= obj.x - padX && nx <= obj.x + obj.w + padX &&
      ny >= obj.y - padY && ny <= obj.y + obj.h + padY
    )
  })
}

function toNorm(
  event: React.MouseEvent,
  containerRef: React.RefObject<HTMLElement | null>,
): { nx: number; ny: number } | null {
  return getNormalizedCoord(containerRef, event)
}

/**
 * Compose zoom/pan + drawing mouse handlers for a labeling canvas capture layer.
 *
 * Returns:
 * - `mouseHandlers` — spread into the capture div
 * - `cursor` — current CSS cursor (grabbing | grab | drawingCursor)
 * - `isHoveringEditable` — whether the cursor is over a drawing object in canPan mode
 *
 * Logic mirrors platform ImageDetailCanvas + edge BBoxCanvas mouse composition:
 * - Middle mouse + zoomed → pan regardless of tool
 * - canPan (tool='cursor' && zoom>1) + click on object → drawing (select/move/resize)
 * - canPan + click on empty → pan
 * - else → drawing
 */
export function useCanvasMouse({
  tool,
  zoom,
  hitTestEditable,
  drawingObjects,
  drawingBindings,
  drawingCursor,
  startPan,
  movePan,
  endPan,
  isZoomPanning,
  pan,
  containerRef,
  onCrosshairUpdate,
}: UseCanvasMouseConfig): {
  mouseHandlers: {
    onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseLeave: () => void
  }
  cursor: React.CSSProperties['cursor']
  isHoveringEditable: boolean
} {
  const [isHoveringEditable, setIsHoveringEditable] = useState(false)

  const canPan = tool === 'cursor' && zoom > 1

  const hitTest = useCallback(
    (nx: number, ny: number) => {
      if (hitTestEditable) return hitTestEditable(nx, ny)
      return defaultHitTest(drawingObjects, containerRef, nx, ny)
    },
    [hitTestEditable, drawingObjects, containerRef],
  )

  const onMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.button === 1 && zoom > 1) {
        event.preventDefault()
        startPan(event.clientX, event.clientY, pan.x, pan.y)
        return
      }
      if (canPan) {
        const norm = toNorm(event, containerRef)
        if (norm && hitTest(norm.nx, norm.ny)) {
          drawingBindings.onMouseDown(event)
          return
        }
        startPan(event.clientX, event.clientY, pan.x, pan.y)
        return
      }
      drawingBindings.onMouseDown(event)
    },
    [canPan, zoom, startPan, pan.x, pan.y, hitTest, drawingBindings, containerRef],
  )

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (onCrosshairUpdate) onCrosshairUpdate(toNorm(event, containerRef))
      if (isZoomPanning()) {
        movePan(event.clientX, event.clientY)
        return
      }
      drawingBindings.onMouseMove(event)
      if (canPan) {
        const norm = toNorm(event, containerRef)
        setIsHoveringEditable(norm ? hitTest(norm.nx, norm.ny) : false)
      } else if (isHoveringEditable) {
        setIsHoveringEditable(false)
      }
    },
    [onCrosshairUpdate, isZoomPanning, movePan, drawingBindings, canPan, hitTest, isHoveringEditable, containerRef],
  )

  const onMouseUp = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isZoomPanning()) {
        endPan()
        return
      }
      drawingBindings.onMouseUp(event)
    },
    [isZoomPanning, endPan, drawingBindings],
  )

  const onMouseLeave = useCallback(() => {
    if (onCrosshairUpdate) onCrosshairUpdate(null)
    setIsHoveringEditable(false)
    if (isZoomPanning()) {
      endPan()
      return
    }
    drawingBindings.onMouseLeave()
  }, [onCrosshairUpdate, isZoomPanning, endPan, drawingBindings])

  const cursor: React.CSSProperties['cursor'] = isZoomPanning()
    ? 'grabbing'
    : canPan && !isHoveringEditable
      ? 'grab'
      : drawingCursor

  return {
    mouseHandlers: { onMouseDown, onMouseMove, onMouseUp, onMouseLeave },
    cursor,
    isHoveringEditable,
  }
}
