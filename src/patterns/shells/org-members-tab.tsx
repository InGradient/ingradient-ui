import { useState } from 'react'
import styled from 'styled-components'
import { Stack, Text } from '../../primitives'
import { Button } from '../../components/inputs/button'
import { DialogShell } from '../../components/overlays/dialog-shell'
import { Table, type TableColumn } from '../../components/data-display/table'

const EMPTY_STYLE = { margin: 'var(--ig-space-7) 0 0' }
const DESCRIPTION_STYLE = { lineHeight: 1.5 }

const DangerButton = styled(Button).attrs({ variant: 'secondary' as const, tone: 'danger' as const })``

export interface OrgMember {
  id: string
  userId: string
  user: { loginId: string; displayName: string }
  role: { code: string }
  status: string
}

export interface OrgMembersTabProps {
  members: OrgMember[]
  /** 본인 user id — 자기 자신은 Remove 버튼 hide */
  myUserId?: string
  isAdmin?: boolean
  loading?: boolean
  error?: string | null
  removingMemberId?: string | null
  onRemove?: (membershipId: string) => void
  title?: string
  emptyText?: string
  loadingText?: string
}

export function OrgMembersTab({
  members, myUserId, isAdmin, loading, error,
  removingMemberId, onRemove,
  title = 'Members',
  emptyText = 'No members',
  loadingText = 'Loading…',
}: OrgMembersTabProps) {
  const [pendingRemove, setPendingRemove] = useState<OrgMember | null>(null)

  if (loading) return <Text as="p" tone="muted" align="center" size="13px" style={EMPTY_STYLE}>{loadingText}</Text>
  if (error) return <Text as="p" tone="muted" align="center" size="13px" style={EMPTY_STYLE}>{error}</Text>

  const columns: TableColumn<OrgMember>[] = [
    { key: 'loginId', header: 'Login ID', render: (r) => r.user.loginId },
    { key: 'name', header: 'Name', render: (r) => r.user.displayName },
    { key: 'role', header: 'Role', render: (r) => <Text tone="muted">{r.role.code}</Text> },
    { key: 'status', header: 'Status', render: (r) => <Text tone="muted">{r.status}</Text> },
    ...(isAdmin
      ? [{
          key: 'actions',
          header: '',
          render: (r: OrgMember) => r.userId !== myUserId ? (
            <Button type="button" size="sm" tone="danger" variant="secondary" onClick={() => setPendingRemove(r)}>
              Remove
            </Button>
          ) : null,
        }]
      : []),
  ]

  return (
    <Stack gap={7}>
      <Text as="h3" size="15px" weight={600}>{title}</Text>
      {members.length === 0 ? (
        <Text as="p" tone="muted" align="center" size="13px" style={EMPTY_STYLE}>{emptyText}</Text>
      ) : (
        <Table<OrgMember> columns={columns} rows={members} ariaLabel="Members table" />
      )}
      {pendingRemove && (
        <DialogShell
          title="Remove this member?"
          onClose={() => { if (!removingMemberId) setPendingRemove(null) }}
          width="min(420px, 100%)"
          actions={
            <>
              <Button type="button" variant="secondary" onClick={() => setPendingRemove(null)} disabled={!!removingMemberId}>Cancel</Button>
              <DangerButton
                type="button"
                disabled={!!removingMemberId}
                onClick={() => {
                  onRemove?.(pendingRemove.id)
                  setPendingRemove(null)
                }}
              >
                {removingMemberId === pendingRemove.id ? 'Removing…' : 'Remove'}
              </DangerButton>
            </>
          }
        >
          <Stack gap={5}>
            <Text as="p" tone="muted" size="14px" style={DESCRIPTION_STYLE}>
              Remove <strong>{pendingRemove.user.displayName}</strong> ({pendingRemove.user.loginId}) from the organization?
            </Text>
          </Stack>
        </DialogShell>
      )}
    </Stack>
  )
}
