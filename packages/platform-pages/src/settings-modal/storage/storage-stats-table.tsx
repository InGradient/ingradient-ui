import type { ReactNode } from 'react'
import { Card, Skeleton, Table, type TableColumn } from '@ingradient/ui/components'

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
  ariaLabel?: string
}

export function StorageStatsTable<T>({
  columns, rows, footer, loading, loadingHeight = 'var(--ig-layout-loading-panel-height)', ariaLabel,
}: StorageStatsTableProps<T>) {
  if (loading) return <Skeleton $height={loadingHeight} />
  type Row = T & { id?: string | number }
  const resolvedAriaLabel = ariaLabel ?? (columns[0]?.header ? `${columns[0].header} storage statistics` : 'Storage statistics')
  return (
    <Card elevation="raised" flat border="strong" radius="var(--ig-radius-xxs)" padding="var(--ig-space-7)">
      <Table<Row>
        columns={columns as TableColumn<Row>[]}
        rows={rows as Row[]}
        footer={footer}
        minWidth="var(--ig-popup-3xl-narrow)"
        ariaLabel={resolvedAriaLabel}
      />
    </Card>
  )
}
