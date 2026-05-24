import React from 'react'
import styled from 'styled-components'
import { Table, type TableColumn } from '../../components/data-display/table'
import { Checkbox, IconButton } from '../../components/inputs'
import { SyncStatusChip, type SyncState } from '../../components/feedback/sync-status-chip'
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
    min-width: 1200px;
  }
`

const MenuButton = styled(IconButton).attrs({
  variant: 'secondary' as const,
  size: 'sm' as const,
})<{ $active: boolean }>`
  && {
    border-color: ${(p) => (p.$active ? 'var(--ig-color-accent-border-strong)' : 'transparent')};
    background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-18)' : 'transparent')};
    color: ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-text-muted)')};
  }

  &&:hover:not(:disabled) {
    border-color: ${(p) => (p.$active ? 'var(--ig-color-accent-border-strong)' : 'var(--ig-color-border-subtle)')};
    background: ${(p) =>
      p.$active ? 'var(--ig-color-accent-soft-surface-hover)' : 'var(--ig-color-surface-interactive-hover)'};
    color: var(--ig-color-text-primary);
  }
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
      width: '44px',
      render: (row) => (
        <Checkbox
          checked={selectedIds.has(row.id)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onToggleSelect?.(row.id, e.target.checked)}
          aria-label={`Select image ${row.name}`}
        />
      ),
    },
    {
      key: 'thumb',
      header: '',
      width: '84px',
      render: (row) => <Thumb src={row.thumb_url} alt={row.name} loading="lazy" />,
    },
    {
      key: 'name',
      header: 'Name',
      width: '280px',
      render: (row) => <NameCell title={row.name}>{row.name}</NameCell>,
    },
    {
      key: 'dataset', header: 'Dataset',
      width: '180px',
      render: (row) => {
        const datasetName = row.dataset_id ? (datasetNameById?.[row.dataset_id] ?? row.dataset_id) : '—'
        return <TextCell title={datasetName}>{datasetName}</TextCell>
      },
    },
    {
      key: 'sequence', header: 'Sequence',
      width: '140px',
      render: (row) => {
        const sequence = row.sequence_id ? `${row.sequence_id} · ${row.sequence_step ?? 0}` : '—'
        return <TextCell title={sequence}>{sequence}</TextCell>
      },
    },
    { key: 'pattern', header: 'Pattern', width: '104px', render: (row) => row.pattern_label ?? '—' },
    {
      key: 'sync', header: 'Sync',
      width: '116px',
      render: (row) => row.sync_state ? <SyncStatusChip state={row.sync_state} /> : null,
    },
    { key: 'created', header: 'Created at', width: '124px', render: (row) => row.created_at ?? '—' },
    { key: 'labeled', header: 'Labeled', width: '84px', render: (row) => row.labeled_at ? 'Yes' : 'No' },
    {
      key: 'menu', header: '',
      width: '44px',
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

  void allSelected; void someSelected; void onSelectAll  // header checkbox 는 toolbar 가 담당

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
      <KebabIcon size={18} />
    </MenuButton>
  )
}
