import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { DialogShell } from '../../components/overlays/dialog-shell'
import { Table, type TableColumn } from '../../components/data-display/table'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--ig-color-text-primary);
`

const Empty = styled.p`
  margin: 16px 0 0;
  text-align: center;
  color: var(--ig-color-text-muted);
  font-size: 13px;
`

const Muted = styled.span`
  color: var(--ig-color-text-muted);
`

const DangerButton = styled(Button).attrs({ variant: 'secondary' as const, tone: 'danger' as const })``

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ig-color-text-muted);
`

const DialogStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

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

  if (loading) return <Empty>{loadingText}</Empty>
  if (error) return <Empty>{error}</Empty>

  const columns: TableColumn<OrgMember>[] = [
    { key: 'loginId', header: 'Login ID', render: (r) => r.user.loginId },
    { key: 'name', header: 'Name', render: (r) => r.user.displayName },
    { key: 'role', header: 'Role', render: (r) => <Muted>{r.role.code}</Muted> },
    { key: 'status', header: 'Status', render: (r) => <Muted>{r.status}</Muted> },
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
    <Wrap>
      <SectionTitle>{title}</SectionTitle>
      {members.length === 0 ? (
        <Empty>{emptyText}</Empty>
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
          <DialogStack>
            <Description>
              Remove <strong>{pendingRemove.user.displayName}</strong> ({pendingRemove.user.loginId}) from the organization?
            </Description>
          </DialogStack>
        </DialogShell>
      )}
    </Wrap>
  )
}
