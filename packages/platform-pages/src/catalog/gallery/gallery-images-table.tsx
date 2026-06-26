import { iconSizeNumbers } from '@ingradient/ui'
import React from 'react'
import styled from 'styled-components'
import { Text } from '@ingradient/ui/primitives'
import { Table, type TableColumn } from '@ingradient/ui/components'
import { Checkbox, MenuIconButton as MenuButton } from '@ingradient/ui/components'
import { SyncStatusChip, type SyncState } from './sync-status-chip'
import { KebabIcon } from '@ingradient/ui/components'

const TextCell = styled.span`
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
`

const TableText = styled.div`
  font-size: var(--ig-font-size-sm);

  table {
    min-width: var(--ig-popup-4xl);
  }
`

const THUMB_STYLE = {
  width: 'var(--ig-control-height-3xl-plus)',
  height: 'var(--ig-control-height-3xl-plus)',
  objectFit: 'cover' as const,
  borderRadius: 'var(--ig-radius-sm)',
  display: 'block' as const,
}

const NAME_CELL_STYLE = {
  display: 'inline-block' as const,
  maxWidth: 'var(--ig-popup-sm)',
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
      width: 'var(--ig-control-height-lg)',
      render: (row) => (
        <Checkbox
          checked={selectedIds.has(row.id)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onToggleSelect?.(row.id, e.target.checked)}
          aria-label={`Select image ${row.name}`}
        />
      ),
    },
    { key: 'thumb', header: '', width: 'var(--ig-layout-histogram-height)', render: (row) => <img src={row.thumb_url} alt={row.name} loading="lazy" style={THUMB_STYLE} /> },
    { key: 'name', header: 'Name', width: 'var(--ig-popup-sm)', render: (row) => <Text as="span" title={row.name} style={NAME_CELL_STYLE}>{row.name}</Text> },
    {
      key: 'dataset', header: 'Dataset',
      width: 'var(--ig-layout-loading-panel-height)',
      render: (row) => {
        const datasetName = row.dataset_id ? (datasetNameById?.[row.dataset_id] ?? row.dataset_id) : '—'
        return <TextCell title={datasetName}>{datasetName}</TextCell>
      },
    },
    {
      key: 'sequence', header: 'Sequence',
      width: 'var(--ig-popup-2xs)',
      render: (row) => {
        const sequence = row.sequence_id ? `${row.sequence_id} · ${row.sequence_step ?? 0}` : '—'
        return <TextCell title={sequence}>{sequence}</TextCell>
      },
    },
    { key: 'pattern', header: 'Pattern', width: 'var(--ig-popup-3xs-wide)', render: (row) => row.pattern_label ?? '—' },
    {
      key: 'sync', header: 'Sync',
      width: 'var(--ig-popup-2xs-narrow-tight)',
      render: (row) => row.sync_state ? <SyncStatusChip state={row.sync_state} /> : null,
    },
    { key: 'created', header: 'Created at', width: 'var(--ig-popup-2xs-tight)', render: (row) => row.created_at ?? '—' },
    { key: 'labeled', header: 'Labeled', width: 'var(--ig-layout-histogram-height)', render: (row) => row.labeled_at ? 'Yes' : 'No' },
    {
      key: 'menu', header: '',
      width: 'var(--ig-control-height-lg)',
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
