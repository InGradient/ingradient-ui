import React from 'react'

export function Table<T extends { id?: string | number }>({
  columns,
  rows,
}: {
  columns: Array<{ key: string; header: string; render: (row: T) => React.ReactNode }>
  rows: T[]
}) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={{ textAlign: 'left', padding: '12px 14px', color: 'var(--ig-color-text-muted)', fontSize: 12, borderBottom: '1px solid var(--ig-color-border-subtle)' }}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id ?? rowIndex}>
              {columns.map((column) => (
                <td key={column.key} style={{ padding: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--ig-color-text-secondary)' }}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const DataGrid = Table
