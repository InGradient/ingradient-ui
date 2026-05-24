import React from 'react'
import styled from 'styled-components'
import { Table, type TableColumn } from '../../components/data-display/table'
import { Checkbox, IconButton } from '../../components/inputs'
import { SyncStatusChip, type SyncState } from './sync-status-chip'
import { KebabIcon } from '../../components/icons/catalog-icons'

const Thumb = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: var(--ig-radius-sm);
  display: block;
`

const NameCell = styled.span`
  display: inline-block;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
`

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
    { key: 'thumb', header: '', render: (row) => <Thumb src={row.thumb_url} alt={row.name} loading="lazy" /> },
    { key: 'name', header: 'Name', render: (row) => <NameCell title={row.name}>{row.name}</NameCell> },
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

  void allSelected; void someSelected; void onSelectAll  // header checkbox 는 toolbar 가 담당

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
