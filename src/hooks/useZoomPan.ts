import { useRef, useState, useCallback } from 'react'

export const ZOOM_MIN_DEFAULT = 1
export const ZOOM_MAX_DEFAULT = 8
export const ZOOM_STEP_DEFAULT = 0.25
export const PAN_DELTA_THRESHOLD = 5

export interface UseZoomPanOptions {
  minZoom?: number
  maxZoom?: number
  zoomStep?: number
}

export function useZoomPan(options: UseZoomPanOptions = {}) {
  const {
    minZoom = ZOOM_MIN_DEFAULT,
    maxZoom = ZOOM_MAX_DEFAULT,
    zoomStep = ZOOM_STEP_DEFAULT,
  } = options

  const [zoom, setZoom] = useState(minZoom)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const hasPannedRef = useRef(false)

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
        if (next === minZoom) setPan({ x: 0, y: 0 })
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
    setPan({ x: dragStartRef.current.panX + dx, y: dragStartRef.current.panY + dy })
    return true
  }, [])

  const endPan = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  const isZoomPanning = useCallback(() => isDraggingRef.current, [])
  const hasPanned = useCallback(() => hasPannedRef.current, [])

  return { zoom, pan, reset, handleWheel, startPan, movePan, endPan, isZoomPanning, hasPanned }
}
