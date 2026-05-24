import React from 'react'
import {
  DragTd, DragTh, HandleBtn, PlainTr, StyledTable, StyledTr, TableWrap, Td, Th, VisuallyHidden,
} from './table.styles'
import { useTableDrag } from './use-table-drag'

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

export type TableColumn<T> = {
  key: string
  header: string
  width?: string | number
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
  /** Accessible label for the table's scrollable region. Required when multiple tables on a page. */
  ariaLabel?: string
}

export function Table<T extends { id?: string | number }>({
  columns,
  rows,
  onRowClick,
  draggable = false,
  onReorder,
  rowHeight = 48,
  ariaLabel = 'Data table',
}: TableProps<T>) {
  const { dragState, fromIdx, getOffset, onDragStart } = useTableDrag<T>({ rows, rowHeight, onReorder })

  if (!draggable) {
    return (
      <TableWrap aria-label={ariaLabel}>
        <StyledTable>
          <thead>
            <tr>
              {columns.map((col) => (
                <Th key={col.key} style={{ width: col.width }}>{col.header}</Th>
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
                  <Td key={col.key} style={{ width: col.width }}>{col.render(row)}</Td>
                ))}
              </PlainTr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrap>
    )
  }

  return (
    <TableWrap aria-label={ariaLabel} style={{ userSelect: dragState ? 'none' : undefined }}>
      <StyledTable>
        <thead>
          <tr>
            <DragTh scope="col">
              <VisuallyHidden>Reorder</VisuallyHidden>
            </DragTh>
            {columns.map((col) => (
              <Th key={col.key} style={{ width: col.width }}>{col.header}</Th>
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
                <Td key={col.key} style={{ width: col.width }}>{col.render(row)}</Td>
              ))}
            </StyledTr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrap>
  )
}

export const DataGrid = Table
