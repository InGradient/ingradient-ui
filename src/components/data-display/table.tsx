import React, { useState, useRef, useCallback } from 'react'
import styled, { css } from 'styled-components'

/* ── Styled ── */

const TableWrap = styled.div`overflow-x: auto;`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`

const Th = styled.th`
  text-align: left;
  padding: var(--ig-space-4) var(--ig-space-5);
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-xs);
  font-weight: 500;
  border-bottom: 1px solid var(--ig-color-border-subtle);
`

const Td = styled.td`
  padding: var(--ig-space-5);
  color: var(--ig-color-text-secondary);
  border-bottom: 1px solid var(--ig-color-border-subtle);
`

const DragTh = styled(Th)`width: 36px; padding: var(--ig-space-4) var(--ig-space-2);`
const DragTd = styled(Td)`width: 36px; padding: var(--ig-space-3) var(--ig-space-2);`

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

const HandleBtn = styled.button.attrs({ type: 'button', 'aria-label': 'Reorder row' })`
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--ig-radius-sm);
  background: transparent;
  color: var(--ig-color-text-muted);
  flex-shrink: 0;
  user-select: none;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--ig-color-text-primary);
  }
`

const draggingRow = css`
  position: relative;
  z-index: 10;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  background: var(--ig-color-surface-raised);
`

const animatingRow = css`
  transition: transform 0.2s ease;
`

const StyledTr = styled.tr<{
  $clickable?: boolean
  $yOffset: number
  $isDragging: boolean
  $isAnimating: boolean
}>`
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
  transform: translateY(${(p) => p.$yOffset}px);
  ${(p) => p.$isDragging && draggingRow}
  ${(p) => p.$isAnimating && animatingRow}
  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`

const PlainTr = styled.tr<{ $clickable?: boolean }>`
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`

/* ── Grip icon ── */

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="5" cy="3" r="1.3" />
      <circle cx="11" cy="3" r="1.3" />
      <circle cx="5" cy="8" r="1.3" />
      <circle cx="11" cy="8" r="1.3" />
      <circle cx="5" cy="13" r="1.3" />
      <circle cx="11" cy="13" r="1.3" />
    </svg>
  )
}

/* ── Types ── */

export type TableColumn<T> = {
  key: string
  header: string
  render: (row: T) => React.ReactNode
}

export type TableProps<T extends { id?: string | number }> = {
  columns: TableColumn<T>[]
  rows: T[]
  /** Row click handler */
  onRowClick?: (row: T, index: number) => void
  /** Enable drag-to-reorder rows. Default: false */
  draggable?: boolean
  /** Called when rows are reordered via drag. Only fires when draggable=true */
  onReorder?: (rows: T[]) => void
  /** Estimated row height in px for drag calculation. Default: 48 */
  rowHeight?: number
}

/* ── Component ── */

export function Table<T extends { id?: string | number }>({
  columns,
  rows,
  onRowClick,
  draggable = false,
  onReorder,
  rowHeight = 48,
}: TableProps<T>) {
  const [dragState, setDragState] = useState<{ fromIdx: number; dy: number } | null>(null)
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

  /* ── Non-draggable (original behavior) ── */
  if (!draggable) {
    return (
      <TableWrap>
        <StyledTable>
          <thead>
            <tr>
              {columns.map((col) => (
                <Th key={col.key}>{col.header}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <PlainTr
                key={row.id ?? i}
                $clickable={!!onRowClick}
                onClick={() => onRowClick?.(row, i)}
              >
                {columns.map((col) => (
                  <Td key={col.key}>{col.render(row)}</Td>
                ))}
              </PlainTr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrap>
    )
  }

  /* ── Draggable ── */
  return (
    <TableWrap style={{ userSelect: dragState ? 'none' : undefined }}>
      <StyledTable>
        <thead>
          <tr>
            <DragTh scope="col">
              <VisuallyHidden>Reorder</VisuallyHidden>
            </DragTh>
            {columns.map((col) => (
              <Th key={col.key}>{col.header}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <StyledTr
              key={row.id ?? i}
              $clickable={!!onRowClick}
              $yOffset={getOffset(i)}
              $isDragging={fromIdx === i}
              $isAnimating={dragState !== null && fromIdx !== i}
              onClick={() => onRowClick?.(row, i)}
            >
              <DragTd>
                <HandleBtn onMouseDown={(e) => onDragStart(e, i)}>
                  <GripIcon />
                </HandleBtn>
              </DragTd>
              {columns.map((col) => (
                <Td key={col.key}>{col.render(row)}</Td>
              ))}
            </StyledTr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrap>
  )
}

export const DataGrid = Table
