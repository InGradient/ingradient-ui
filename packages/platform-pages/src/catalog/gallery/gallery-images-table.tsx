import React from 'react'
import { Text } from '@ingradient/ui/primitives'
import { Table, type TableColumn } from '@ingradient/ui/components'
import { Checkbox, IconButton } from '@ingradient/ui/components'
import { SyncStatusChip, type SyncState } from '@ingradient/ui/patterns'
import { KebabIcon } from '@ingradient/ui/components'

const THUMB_STYLE = {
  width: 64,
  height: 64,
  objectFit: 'cover' as const,
  borderRadius: 'var(--ig-radius-sm)',
  display: 'block' as const,
}

const NAME_CELL_STYLE = {
  display: 'inline-block' as const,
  maxWidth: 280,
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
  onToggleSelect?: (id: string, checked: boolean) => void
  onSelectAll?: (checked: boolean) => void
  onOpenMenu?: (id: string, anchor: HTMLElement) => void
  onRowClick?: (id: string) => void
}

type Row = GalleryImagesTableImage

export function GalleryImagesTable({
  images, selectedIds, datasetNameById,
  onToggleSelect, onSelectAll, onOpenMenu, onRowClick,
}: GalleryImagesTableProps) {
  const allSelected = images.length > 0 && images.every((i) => selectedIds.has(i.id))
  const someSelected = images.some((i) => selectedIds.has(i.id))

  const columns: TableColumn<Row>[] = [
    {
      key: 'select',
      header: '',
      render: (row) => (
        <Checkbox
          checked={selectedIds.has(row.id)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onToggleSelect?.(row.id, e.target.checked)}
          aria-label={`Select image ${row.name}`}
        />
      ),
    },
    { key: 'thumb', header: '', render: (row) => <img src={row.thumb_url} alt={row.name} loading="lazy" style={THUMB_STYLE} /> },
    { key: 'name', header: 'Name', render: (row) => <Text as="span" title={row.name} style={NAME_CELL_STYLE}>{row.name}</Text> },
    {
      key: 'dataset', header: 'Dataset',
      render: (row) => row.dataset_id ? (datasetNameById?.[row.dataset_id] ?? row.dataset_id) : '—',
    },
    {
      key: 'sequence', header: 'Sequence',
      render: (row) => row.sequence_id ? `${row.sequence_id} · ${row.sequence_step ?? 0}` : '—',
    },
    { key: 'pattern', header: 'Pattern', render: (row) => row.pattern_label ?? '—' },
    {
      key: 'sync', header: 'Sync',
      render: (row) => row.sync_state ? <SyncStatusChip state={row.sync_state} /> : null,
    },
    { key: 'created', header: 'Created at', render: (row) => row.created_at ?? '—' },
    { key: 'labeled', header: 'Labeled', render: (row) => row.labeled_at ? 'Yes' : 'No' },
    {
      key: 'menu', header: '',
      render: (row) => <RowMenuButton imageId={row.id} name={row.name} onOpenMenu={onOpenMenu} />,
    },
  ]

  void allSelected; void someSelected; void onSelectAll

  return (
    <Table<Row>
      columns={columns}
      rows={images}
      onRowClick={(row) => onRowClick?.(row.id)}
      ariaLabel="Gallery images table"
    />
  )
}

function RowMenuButton({
  imageId, name, onOpenMenu,
}: { imageId: string; name: string; onOpenMenu?: (id: string, anchor: HTMLElement) => void }) {
  const ref = React.useRef<HTMLButtonElement>(null)
  return (
    <IconButton
      ref={ref}
      aria-label={`Open menu for ${name}`}
      size="sm"
      onClick={(e) => {
        e.stopPropagation()
        if (ref.current) onOpenMenu?.(imageId, ref.current)
      }}
    >
      <KebabIcon size={18} />
    </IconButton>
  )
}
