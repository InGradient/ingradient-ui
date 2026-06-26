import { useState } from 'react'
import { iconSizeNumbers } from '@ingradient/ui'
import { Button, EmptyState, Table as UiTable, TextField, PencilIcon } from '@ingradient/ui/components'
import { InlineActions, ProgressNote, Section, SectionTitle, StatusPill } from './edge.styles'
import { getEdgeStatusTone } from './edge-status-tone'
import type { EdgePackageView } from './edge-types'

export interface ExportHistoryProps {
  packages: EdgePackageView[]
  downloadPending?: boolean
  reissuePending?: boolean
  renamePending?: boolean
  onDownload: (packageId: string) => void
  onReissue: (packageId: string) => void
  onRenameDevice: (packageId: string, newName: string) => void
}

/**
 * Edge package 이력 표 — device name 인라인 편집 + status pill + download / reissue 액션.
 * Platform 의 `ExportHistory` 와 시각·구조 동일.
 */
export function ExportHistory({
  packages,
  downloadPending = false,
  reissuePending = false,
  renamePending = false,
  onDownload,
  onReissue,
  onRenameDevice,
}: ExportHistoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const startEditing = (pkg: EdgePackageView) => {
    setEditingId(pkg.id)
    setEditingName(pkg.device_name ?? '')
  }

  const commitEdit = () => {
    if (editingId && editingName.trim()) {
      onRenameDevice(editingId, editingName.trim())
    }
    setEditingId(null)
  }

  return (
    <Section>
      <SectionTitle>Project File History</SectionTitle>
      {packages.length === 0 ? (
        <EmptyState>No packages yet.</EmptyState>
      ) : (
        <UiTable<EdgePackageView>
          columns={[
            {
              key: 'device_name',
              header: 'Device Name',
              render: (pkg) =>
                editingId === pkg.id ? (
                  <TextField
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => e.key === 'Enter' && commitEdit()}
                    disabled={renamePending}
                    autoFocus
                  />
                ) : (
                  <span onClick={() => startEditing(pkg)} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 'var(--ig-space-2)' }}>
                    {pkg.device_name || '—'} <PencilIcon size={iconSizeNumbers.xs} />
                  </span>
                ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (pkg) => (
                <>
                  <StatusPill tone={getEdgeStatusTone(pkg.status)}>{pkg.status}</StatusPill>
                  {pkg.status === 'pending' || pkg.status === 'running' ? (
                    <ProgressNote>{pkg.progress}%</ProgressNote>
                  ) : null}
                </>
              ),
            },
            {
              key: 'created',
              header: 'Created',
              render: (pkg) => new Date(pkg.created_at).toLocaleString(),
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (pkg) => (
                <InlineActions>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => onDownload(pkg.id)}
                    disabled={pkg.status !== 'completed' || downloadPending}
                  >
                    Download (.ige)
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => onReissue(pkg.id)}
                    disabled={pkg.status !== 'completed' || reissuePending}
                  >
                    Reissue
                  </Button>
                </InlineActions>
              ),
            },
          ]}
          rows={packages}
        />
      )}
    </Section>
  )
}
