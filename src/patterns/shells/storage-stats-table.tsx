import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Skeleton } from '../../components/feedback/skeleton'

const Card = styled.div`
  background: var(--ig-color-surface-raised);
  border: 1px solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-xxs);
  padding: var(--ig-space-7);
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  & th {
    text-align: left;
    color: var(--ig-color-text-muted);
    font-weight: 500;
    padding: var(--ig-space-3) var(--ig-space-5);
    border-bottom: 1px solid var(--ig-color-border-strong);
  }
  & td {
    color: var(--ig-color-text-secondary);
    padding: var(--ig-space-3) var(--ig-space-5);
    border-bottom: 1px solid var(--ig-color-border-subtle);
  }
  & td.num {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  & tr:last-child td { border-bottom: none; }
  & tfoot td {
    font-weight: 600;
    color: var(--ig-color-text-primary);
    border-top: 1px solid var(--ig-color-border-subtle);
  }
`

export interface StorageStatsTableColumn<T> {
  key: string
  header: string
  /** numeric column → right-align + tabular-nums */
  numeric?: boolean
  render: (row: T) => ReactNode
}

export interface StorageStatsTableProps<T> {
  columns: StorageStatsTableColumn<T>[]
  rows: T[]
  /** 마지막 fixed-row (e.g. "Total") */
  footer?: ReactNode[]
  loading?: boolean
  loadingHeight?: string
}

export function StorageStatsTable<T>({
  columns, rows, footer, loading, loadingHeight = '180px',
}: StorageStatsTableProps<T>) {
  if (loading) return <Skeleton $height={loadingHeight} />
  return (
    <Card>
      <Table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.numeric ? 'num' : undefined}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key} className={c.numeric ? 'num' : undefined}>{c.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
        {footer ? (
          <tfoot>
            <tr>
              {footer.map((cell, i) => (
                <td key={i} className={columns[i]?.numeric ? 'num' : undefined}>{cell}</td>
              ))}
            </tr>
          </tfoot>
        ) : null}
      </Table>
    </Card>
  )
}
