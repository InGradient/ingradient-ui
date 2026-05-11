import { useCallback, useRef, useState } from 'react'

type DragState = { fromIdx: number; dy: number } | null

/**
 * Hook for vertical-drag row reorder. Tracks current drag state and provides
 * onDragStart handler + per-row y-offset getter for animating displacement.
 */
export function useTableDrag<T>({
  rows,
  rowHeight,
  onReorder,
}: {
  rows: T[]
  rowHeight: number
  onReorder?: (rows: T[]) => void
}) {
  const [dragState, setDragState] = useState<DragState>(null)
  const startY = useRef(0)
  const latestDy = useRef(0)
  const rowsRef = useRef(rows)
  rowsRef.current = rows

  const fromIdx = dragState?.fromIdx ?? -1
  const toIdx = dragState
    ? Math.max(0, Math.min(rows.length - 1, dragState.fromIdx + Math.round(dragState.dy / rowHeight)))
    : -1

  const getOffset = useCallback(
    (i: number) => {
      if (!dragState) return 0
      if (i === fromIdx) return dragState.dy
      if (fromIdx < toIdx && i > fromIdx && i <= toIdx) return -rowHeight
      if (fromIdx > toIdx && i < fromIdx && i >= toIdx) return rowHeight
      return 0
    },
    [dragState, fromIdx, toIdx, rowHeight],
  )

  const onDragStart = useCallback(
    (e: React.MouseEvent, idx: number) => {
      e.preventDefault()
      e.stopPropagation()
      startY.current = e.clientY
      latestDy.current = 0
      setDragState({ fromIdx: idx, dy: 0 })
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'

      const onMove = (ev: MouseEvent) => {
        const dy = ev.clientY - startY.current
        latestDy.current = dy
        setDragState({ fromIdx: idx, dy })
      }
      const onUp = () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''

        const final = Math.max(
          0,
          Math.min(rowsRef.current.length - 1, idx + Math.round(latestDy.current / rowHeight)),
        )
        setDragState(null)

        if (final !== idx && onReorder) {
          const next = [...rowsRef.current]
          const [moved] = next.splice(idx, 1)
          next.splice(final, 0, moved)
          onReorder(next)
        }
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [onReorder, rowHeight],
  )

  return { dragState, fromIdx, getOffset, onDragStart }
}
