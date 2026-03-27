import React from 'react'
import styled from 'styled-components'

const TableWrap = styled.div`
  overflow-x: auto;
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
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

export function Table<T extends { id?: string | number }>({
  columns,
  rows,
}: {
  columns: Array<{ key: string; header: string; render: (row: T) => React.ReactNode }>
  rows: T[]
}) {
  return (
    <TableWrap>
      <StyledTable>
        <thead>
          <tr>
            {columns.map((column) => (
              <Th key={column.key}>{column.header}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id ?? rowIndex}>
              {columns.map((column) => (
                <Td key={column.key}>{column.render(row)}</Td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrap>
  )
}

export const DataGrid = Table
