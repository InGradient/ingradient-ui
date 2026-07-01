import React from 'react'
import {
  DragTd, DragTh, HandleBtn, PlainTr, StyledTable, StyledTr, TableWrap, Td, Tfoot, Th, VisuallyHidden,
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
  /** 고정 컬럼 너비 (px 또는 CSS 길이). */
  width?: string | number
  /** Right-align cell + header, tabular-nums (숫자 정렬). */
  numeric?: boolean
  /** 회색 텍스트 (보조 정보 컬럼). */
  muted?: boolean
  /** Monospace 폰트 (token / UID 같은 코드 표시). */
  mono?: boolean
  render: (row: T) => React.ReactNode
}

export type TableProps<T> = {
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
  /** Footer row (tfoot). Length should match columns.length. 각 column 의 numeric/mono prop 이 그대로 적용됨. */
  footer?: React.ReactNode[]
}

export function Table<T>({
  columns,
  rows,
  onRowClick,
  draggable = false,
  onReorder,
  rowHeight = 48,
  ariaLabel = 'Data table',
  footer,
}: TableProps<T>) {
  const { dragState, fromIdx, getOffset, onDragStart } = useTableDrag<T>({ rows, rowHeight, onReorder })

  const renderFooter = () =>
    footer ? (
      <Tfoot>
        <tr>
          {footer.map((cell, i) => {
            const col = columns[i]
            return (
              <Td
                key={i}
                style={{ width: col?.width }}
                $numeric={col?.numeric}
                $muted={col?.muted}
                $mono={col?.mono}
              >
                {cell}
              </Td>
            )
          })}
        </tr>
      </Tfoot>
    ) : null

  if (!draggable) {
    return (
      <TableWrap aria-label={ariaLabel}>
        <StyledTable>
          <thead>
            <tr>
              {columns.map((col) => (
                <Th key={col.key} style={{ width: col.width }} $numeric={col.numeric}>{col.header}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <PlainTr
                key={(row as { id?: string | number }).id ?? i}
                $clickable={!!onRowClick}
                onClick={() => onRowClick?.(row, i)}
              >
                {columns.map((col) => (
                  <Td
                    key={col.key}
                    style={{ width: col.width }}
                    $numeric={col.numeric}
                    $muted={col.muted}
                    $mono={col.mono}
                  >
                    {col.render(row)}
                  </Td>
                ))}
              </PlainTr>
            ))}
          </tbody>
          {renderFooter()}
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
              <Th key={col.key} style={{ width: col.width }} $numeric={col.numeric}>{col.header}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <StyledTr
              key={(row as { id?: string | number }).id ?? i}
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
                <Td
                  key={col.key}
                  style={{ width: col.width }}
                  $numeric={col.numeric}
                  $muted={col.muted}
                  $mono={col.mono}
                >
                  {col.render(row)}
                </Td>
              ))}
            </StyledTr>
          ))}
        </tbody>
        {renderFooter()}
      </StyledTable>
    </TableWrap>
  )
}

export const DataGrid = Table
