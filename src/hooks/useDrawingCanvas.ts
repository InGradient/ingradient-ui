import { useCallback, useRef, useState } from 'react'

// ── Types ──────────────────────────────────────────────────────────

export interface DrawingObject {
  id: string
  type: 'rect' | 'point'
  x: number
  y: number
  w?: number
  h?: number
  color?: string
  label?: string
}

export type DrawingMode = 'cursor' | 'rect' | 'point'

export interface DrawingPreview {
  x: number; y: number; w: number; h: number
}

export type DrawingAction = 'create' | 'move' | 'resize' | null

export interface UseDrawingCanvasOptions {
  objects: DrawingObject[]
  mode: DrawingMode
  minSize?: number
  handleRadius?: number
  onObjectsChange: (objects: DrawingObject[]) => void
  onSelectionChange?: (id: string | null) => void
  /** Called on mouseup after a drawing action completes (create/move/resize) */
  onComplete?: (objects: DrawingObject[], action: DrawingAction) => void
  /** Called on right-click with normalized coordinates */
  onContextMenu?: (e: React.MouseEvent, nx: number, ny: number) => void
  /** If true, empty-space click in cursor mode is ignored (for pan fallback) */
  passThroughEmptyClick?: boolean
}

type DragState =
  | null
  | { type: 'draw'; startX: number; startY: number }
  | { type: 'move'; id: string; startX: number; startY: number; origX: number; origY: number }
  | { type: 'resize'; id: string; handle: string; startX: number; startY: number; orig: DrawingObject }

// ── Helpers ────────────────────────────────────────────────────────

function hitTestPoint(
  mx: number, my: number, obj: DrawingObject, radius: number,
): boolean {
  return obj.type === 'point' && Math.hypot(mx - obj.x, my - obj.y) < radius
}

function hitTestRect(mx: number, my: number, obj: DrawingObject): boolean {
  if (obj.type !== 'rect' || !obj.w || !obj.h) return false
  return mx >= obj.x && mx <= obj.x + obj.w && my >= obj.y && my <= obj.y + obj.h
}

function hitTestHandle(
  mx: number, my: number, obj: DrawingObject, radius: number,
): string | null {
  if (obj.type !== 'rect' || !obj.w || !obj.h) return null
  const corners: [string, number, number][] = [
    ['nw', obj.x, obj.y],
    ['ne', obj.x + obj.w, obj.y],
    ['sw', obj.x, obj.y + obj.h],
    ['se', obj.x + obj.w, obj.y + obj.h],
  ]
  for (const [name, cx, cy] of corners) {
    if (Math.hypot(mx - cx, my - cy) < radius) return name
  }
  return null
}

let nextId = 1
function genId(): string { return `draw-${nextId++}` }

// ── Hook ───────────────────────────────────────────────────────────

export function useDrawingCanvas({
  objects, mode, minSize = 0.01, handleRadius = 0.03,
  onObjectsChange, onSelectionChange,
  onComplete, onContextMenu, passThroughEmptyClick,
}: UseDrawingCanvasOptions) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drawingPreview, setDrawingPreview] = useState<DrawingPreview | null>(null)
  const dragRef = useRef<DragState>(null)
  const actionRef = useRef<DrawingAction>(null)

  const select = useCallback(
    (id: string | null) => {
      setSelectedId(id)
      onSelectionChange?.(id)
    },
    [onSelectionChange],
  )

  const getNorm = useCallback(
    (e: React.MouseEvent): { nx: number; ny: number } | null => {
      const rect = e.currentTarget.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return null
      return {
        nx: (e.clientX - rect.left) / rect.width,
        ny: (e.clientY - rect.top) / rect.height,
      }
    },
    [],
  )

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 2) return // right-click handled by onContextMenu
      const norm = getNorm(e)
      if (!norm) return
      const { nx, ny } = norm
      actionRef.current = null

      if (mode === 'cursor') {
        if (selectedId) {
          const sel = objects.find((o) => o.id === selectedId)
          if (sel) {
            const handle = hitTestHandle(nx, ny, sel, handleRadius)
            if (handle) {
              dragRef.current = { type: 'resize', id: sel.id, handle, startX: nx, startY: ny, orig: { ...sel } }
              actionRef.current = 'resize'
              return
            }
          }
        }
        for (let i = objects.length - 1; i >= 0; i--) {
          const obj = objects[i]
          if (hitTestPoint(nx, ny, obj, handleRadius * 1.5) || hitTestRect(nx, ny, obj)) {
            select(obj.id)
            dragRef.current = { type: 'move', id: obj.id, startX: nx, startY: ny, origX: obj.x, origY: obj.y }
            actionRef.current = 'move'
            return
          }
        }
        if (!passThroughEmptyClick) select(null)
        return
      }

      if (mode === 'rect') {
        dragRef.current = { type: 'draw', startX: nx, startY: ny }
        actionRef.current = 'create'
        return
      }

      if (mode === 'point') {
        const newObj: DrawingObject = { id: genId(), type: 'point', x: nx, y: ny }
        const next = [...objects, newObj]
        onObjectsChange(next)
        select(newObj.id)
        actionRef.current = 'create'
        onComplete?.(next, 'create')
      }
    },
    [mode, objects, selectedId, handleRadius, onObjectsChange, select, getNorm, onComplete, passThroughEmptyClick],
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const drag = dragRef.current
      if (!drag) return
      const norm = getNorm(e)
      if (!norm) return
      const { nx, ny } = norm

      if (drag.type === 'draw') {
        const x = Math.min(drag.startX, nx)
        const y = Math.min(drag.startY, ny)
        const w = Math.abs(nx - drag.startX)
        const h = Math.abs(ny - drag.startY)
        setDrawingPreview({ x, y, w, h })
        return
      }

      if (drag.type === 'move') {
        const dx = nx - drag.startX
        const dy = ny - drag.startY
        onObjectsChange(objects.map((o) =>
          o.id === drag.id ? { ...o, x: drag.origX + dx, y: drag.origY + dy } : o,
        ))
        return
      }

      if (drag.type === 'resize') {
        const { orig, handle } = drag
        const ow = orig.w ?? 0
        const oh = orig.h ?? 0
        let newX = orig.x, newY = orig.y, newW = ow, newH = oh
        if (handle.includes('e')) newW = nx - orig.x
        if (handle.includes('w')) { newX = nx; newW = orig.x + ow - nx }
        if (handle.includes('s')) newH = ny - orig.y
        if (handle.includes('n')) { newY = ny; newH = orig.y + oh - ny }
        onObjectsChange(objects.map((o) =>
          o.id === drag.id ? { ...o, x: newX, y: newY, w: Math.max(minSize, newW), h: Math.max(minSize, newH) } : o,
        ))
      }
    },
    [objects, onObjectsChange, minSize, getNorm],
  )

  const onMouseUp = useCallback(() => {
    const drag = dragRef.current
    if (drag?.type === 'draw' && drawingPreview) {
      if (drawingPreview.w >= minSize && drawingPreview.h >= minSize) {
        const newObj: DrawingObject = {
          id: genId(), type: 'rect',
          x: drawingPreview.x, y: drawingPreview.y,
          w: drawingPreview.w, h: drawingPreview.h,
        }
        const next = [...objects, newObj]
        onObjectsChange(next)
        select(newObj.id)
        onComplete?.(next, 'create')
      }
      setDrawingPreview(null)
    } else if (drag && actionRef.current) {
      onComplete?.(objects, actionRef.current)
    }
    dragRef.current = null
    actionRef.current = null
  }, [drawingPreview, objects, onObjectsChange, minSize, select, onComplete])

  const onMouseLeave = useCallback(() => {
    dragRef.current = null
    actionRef.current = null
    setDrawingPreview(null)
  }, [])

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (!onContextMenu) return
      const norm = getNorm(e)
      if (!norm) return
      e.preventDefault()
      onContextMenu(e, norm.nx, norm.ny)
    },
    [onContextMenu, getNorm],
  )

  const cursor =
    mode === 'rect' ? 'crosshair' :
    mode === 'point' ? 'crosshair' :
    'default'

  return {
    selectedId,
    drawingPreview,
    cursor,
    bindings: { onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onContextMenu: handleContextMenu },
  }
}
