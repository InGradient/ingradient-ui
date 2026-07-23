import { iconSizeNumbers } from '@ingradient/ui'
import React from 'react'
import styled from 'styled-components'
import { Text } from '@ingradient/ui/primitives'
import { Table, type TableColumn } from '@ingradient/ui/components'
import { Checkbox, MenuIconButton as MenuButton } from '@ingradient/ui/components'
import { SyncStatusChip, type SyncState } from './sync-status-chip'
import { KebabIcon } from '@ingradient/ui/components'

const TableText = styled.div`
  --ig-catalog-gallery-table-min-width: var(--ig-popup-4xl);
  --ig-catalog-gallery-table-col-select: var(--ig-control-height-lg);
  --ig-catalog-gallery-table-col-thumb: var(--ig-popup-3xs);
  --ig-catalog-gallery-table-col-name: var(--ig-popup-sm);
  --ig-catalog-gallery-table-col-dataset: var(--ig-popup-xs-narrow);
  --ig-catalog-gallery-table-col-sequence: var(--ig-popup-2xs);
  --ig-catalog-gallery-table-col-pattern: var(--ig-popup-3xs-wide);
  --ig-catalog-gallery-table-col-sync: var(--ig-popup-2xs-narrow-tight);
  --ig-catalog-gallery-table-col-created: var(--ig-popup-2xs-tight);
  --ig-catalog-gallery-table-col-labeled: var(--ig-popup-3xs);
  --ig-catalog-gallery-table-col-menu: var(--ig-control-height-lg);
  --ig-catalog-gallery-table-thumb-size: var(--ig-control-height-3xl-plus);

  font-size: var(--ig-font-size-sm);

  table {
    min-width: var(--ig-catalog-gallery-table-min-width);
  }
`

const THUMB_STYLE = {
  width: 'var(--ig-catalog-gallery-table-thumb-size)',
  height: 'var(--ig-catalog-gallery-table-thumb-size)',
  objectFit: 'cover' as const,
  borderRadius: 'var(--ig-radius-sm)',
  display: 'block' as const,
}

const TRUNCATED_TEXT_STYLE = {
  display: 'inline-block' as const,
  maxWidth: '100%',
  overflow: 'hidden' as const,
  textOverflow: 'ellipsis' as const,
  whiteSpace: 'nowrap' as const,
  verticalAlign: 'middle' as const,
}

export interface GalleryImagesTableImage {
  id: string
  thumb_url: string
  name: string
  dataset_id?: string
  sequence_id?: string
  sequence_step?: number
  pattern_label?: string
  sync_state?: SyncState
  created_at?: string
  labeled_at?: string
}

export interface GalleryImagesTableProps {
  images: GalleryImagesTableImage[]
  selectedIds: Set<string>
  datasetNameById?: Record<string, string>
  openMenuId?: string
  onToggleSelect?: (id: string, checked: boolean) => void
  onSelectAll?: (checked: boolean) => void
  onOpenMenu?: (id: string, anchor: HTMLElement) => void
  onRowClick?: (id: string) => void
}

type Row = GalleryImagesTableImage

function renderTextCell(value: string) {
  return <Text as="span" title={value} style={TRUNCATED_TEXT_STYLE}>{value}</Text>
}

export function GalleryImagesTable({
  images, selectedIds, datasetNameById, openMenuId,
  onToggleSelect, onSelectAll, onOpenMenu, onRowClick,
}: GalleryImagesTableProps) {
  const allSelected = images.length > 0 && images.every((i) => selectedIds.has(i.id))
  const someSelected = images.some((i) => selectedIds.has(i.id))

  const columns: TableColumn<Row>[] = [
    {
      key: 'select',
      header: '',
      width: 'var(--ig-catalog-gallery-table-col-select)',
      render: (row) => (
        <Checkbox
          checked={selectedIds.has(row.id)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onToggleSelect?.(row.id, e.target.checked)}
          aria-label={`Select image ${row.name}`}
        />
      ),
    },
    { key: 'thumb', header: '', width: 'var(--ig-catalog-gallery-table-col-thumb)', render: (row) => <img src={row.thumb_url} alt={row.name} loading="lazy" style={THUMB_STYLE} /> },
    { key: 'name', header: 'Name', width: 'var(--ig-catalog-gallery-table-col-name)', render: (row) => renderTextCell(row.name) },
    {
      key: 'dataset', header: 'Dataset',
      width: 'var(--ig-catalog-gallery-table-col-dataset)',
      render: (row) => {
        const datasetName = row.dataset_id ? (datasetNameById?.[row.dataset_id] ?? row.dataset_id) : '—'
        return renderTextCell(datasetName)
      },
    },
    {
      key: 'sequence', header: 'Sequence',
      width: 'var(--ig-catalog-gallery-table-col-sequence)',
      render: (row) => {
        const sequence = row.sequence_id ? `${row.sequence_id} · ${row.sequence_step ?? 0}` : '—'
        return renderTextCell(sequence)
      },
    },
    { key: 'pattern', header: 'Pattern', width: 'var(--ig-catalog-gallery-table-col-pattern)', render: (row) => renderTextCell(row.pattern_label ?? '—') },
    {
      key: 'sync', header: 'Sync',
      width: 'var(--ig-catalog-gallery-table-col-sync)',
      render: (row) => row.sync_state ? <SyncStatusChip state={row.sync_state} /> : null,
    },
    { key: 'created', header: 'Created at', width: 'var(--ig-catalog-gallery-table-col-created)', render: (row) => renderTextCell(row.created_at ?? '—') },
    { key: 'labeled', header: 'Labeled', width: 'var(--ig-catalog-gallery-table-col-labeled)', render: (row) => row.labeled_at ? 'Yes' : 'No' },
    {
      key: 'menu', header: '',
      width: 'var(--ig-catalog-gallery-table-col-menu)',
      render: (row) => (
        <RowMenuButton
          imageId={row.id}
          name={row.name}
          active={openMenuId === row.id}
          onOpenMenu={onOpenMenu}
        />
      ),
    },
  ]

  void allSelected; void someSelected; void onSelectAll

  return (
    <TableText>
      <Table<Row>
        columns={columns}
        rows={images}
        onRowClick={(row) => onRowClick?.(row.id)}
        ariaLabel="Gallery images table"
      />
    </TableText>
  )
}

function RowMenuButton({
  imageId, name, active, onOpenMenu,
}: { imageId: string; name: string; active: boolean; onOpenMenu?: (id: string, anchor: HTMLElement) => void }) {
  const ref = React.useRef<HTMLButtonElement>(null)
  return (
    <MenuButton
      ref={ref}
      aria-label={`Open menu for ${name}`}
      aria-haspopup="menu"
      aria-expanded={active}
      $active={active}
      onClick={(e) => {
        e.stopPropagation()
        if (ref.current) onOpenMenu?.(imageId, ref.current)
      }}
    >
      <KebabIcon size={iconSizeNumbers.lg} />
    </MenuButton>
  )
}
