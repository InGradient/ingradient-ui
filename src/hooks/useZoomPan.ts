import { useRef, useState, useCallback } from 'react'

export const ZOOM_MIN_DEFAULT = 1
export const ZOOM_MAX_DEFAULT = 8
export const ZOOM_STEP_DEFAULT = 0.25
export const PAN_DELTA_THRESHOLD = 5

export interface UseZoomPanOptions {
  minZoom?: number
  maxZoom?: number
  zoomStep?: number
  /** Optional — function returning the container dimensions. When provided, pan is
   *  clamped so the scaled content cannot move beyond `containerSize * (zoom - 1) / 2`
   *  on each side (image edges stay near canvas edges, no scroll past empty space). */
  getBounds?: () => { width: number; height: number } | null
}

function clampPan(
  x: number,
  y: number,
  zoom: number,
  bounds: { width: number; height: number } | null | undefined,
): { x: number; y: number } {
  if (!bounds || zoom <= 1) return { x, y }
  const maxX = (bounds.width * (zoom - 1)) / 2
  const maxY = (bounds.height * (zoom - 1)) / 2
  return {
    x: Math.max(-maxX, Math.min(maxX, x)),
    y: Math.max(-maxY, Math.min(maxY, y)),
  }
}

export function useZoomPan(options: UseZoomPanOptions = {}) {
  const {
    minZoom = ZOOM_MIN_DEFAULT,
    maxZoom = ZOOM_MAX_DEFAULT,
    zoomStep = ZOOM_STEP_DEFAULT,
    getBounds,
  } = options

  const [zoom, setZoom] = useState(minZoom)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const hasPannedRef = useRef(false)
  // zoom + getBounds 를 ref 로 보관 — movePan 의 deps 가 비어 안정 callback 유지.
  const zoomRef = useRef(zoom)
  zoomRef.current = zoom
  const getBoundsRef = useRef(getBounds)
  getBoundsRef.current = getBounds

  const reset = useCallback(() => {
    setZoom(minZoom)
    setPan({ x: 0, y: 0 })
    isDraggingRef.current = false
  }, [minZoom])

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      setZoom((prev) => {
        const delta = e.deltaY < 0 ? zoomStep : -zoomStep
        const next = Math.min(maxZoom, Math.max(minZoom, prev + delta))
        if (next === minZoom) {
          setPan({ x: 0, y: 0 })
        } else {
          // zoom 이 바뀌면 기존 pan 이 새 bounds 를 벗어날 수 있어 clamp.
          setPan((p) => clampPan(p.x, p.y, next, getBoundsRef.current?.() ?? null))
        }
        return next
      })
    },
    [minZoom, maxZoom, zoomStep],
  )

  const startPan = useCallback(
    (clientX: number, clientY: number, currentPanX: number, currentPanY: number) => {
      isDraggingRef.current = true
      hasPannedRef.current = false
      dragStartRef.current = { x: clientX, y: clientY, panX: currentPanX, panY: currentPanY }
    },
    [],
  )

  const movePan = useCallback((clientX: number, clientY: number): boolean => {
    if (!isDraggingRef.current) return false
    const dx = clientX - dragStartRef.current.x
    const dy = clientY - dragStartRef.current.y
    if (!hasPannedRef.current && Math.abs(dx) < PAN_DELTA_THRESHOLD && Math.abs(dy) < PAN_DELTA_THRESHOLD) {
      return false
    }
    hasPannedRef.current = true
    const nextX = dragStartRef.current.panX + dx
    const nextY = dragStartRef.current.panY + dy
    const clamped = clampPan(nextX, nextY, zoomRef.current, getBoundsRef.current?.() ?? null)
    setPan(clamped)
    return true
  }, [])

  const endPan = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  const isZoomPanning = useCallback(() => isDraggingRef.current, [])
  const hasPanned = useCallback(() => hasPannedRef.current, [])

  return { zoom, pan, reset, handleWheel, startPan, movePan, endPan, isZoomPanning, hasPanned }
}
