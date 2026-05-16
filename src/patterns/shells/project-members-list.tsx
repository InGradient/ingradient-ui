import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { DialogShell } from '../../components/overlays/dialog-shell'
import {
  ProjectMemberRow,
  type ProjectMemberRowMember,
  type ProjectMemberRowRoleOption,
} from './project-member-row'

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

const Placeholder = styled.p`
  color: var(--ig-color-text-soft);
  font-size: 14px;
  margin: 0;
`

const DangerButton = styled(Button).attrs({ variant: 'secondary' as const, tone: 'danger' as const })``

const DialogStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ig-color-text-muted);
`

export interface ProjectMembersListProps {
  members: ProjectMemberRowMember[]
  roleOptions: ProjectMemberRowRoleOption[]
  loading?: boolean
  error?: string | null
  canManagePermissions?: boolean
  onChangeRole?: (memberId: string, role: string) => void
  onRemove?: (memberId: string) => void
  removingMemberId?: string | null
  updatingRoleMemberId?: string | null
  loadingText?: string
  emptyText?: string
}

export function ProjectMembersList({
  members, roleOptions,
  loading, error, canManagePermissions,
  onChangeRole, onRemove, removingMemberId, updatingRoleMemberId,
  loadingText = 'Loading members...',
  emptyText = 'No members yet. Invite users above.',
}: ProjectMembersListProps) {
  const [pendingRemove, setPendingRemove] = useState<{ id: string; email: string } | null>(null)

  if (loading) return <Placeholder>{loadingText}</Placeholder>
  if (error) return <Placeholder>{error}</Placeholder>
  if (members.length === 0) return <Placeholder>{emptyText}</Placeholder>

  const ownerCount = members.filter((m) => m.role === 'owner').length

  return (
    <>
      <List>
        {members.map((m) => {
          const isOnlyOwner = m.role === 'owner' && ownerCount <= 1
          return (
            <ProjectMemberRow
              key={m.id}
              member={m}
              roleOptions={roleOptions}
              isOnlyOwner={isOnlyOwner}
              canManagePermissions={canManagePermissions}
              onRoleChange={(role) => onChangeRole?.(m.id, role)}
              onRemove={() => setPendingRemove({ id: m.id, email: m.email })}
              removing={removingMemberId === m.id}
              updatingRole={updatingRoleMemberId === m.id}
            />
          )
        })}
      </List>
      {pendingRemove && (
        <DialogShell
          title="Remove Member"
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
              Remove <strong>{pendingRemove.email}</strong> from this project?
            </Description>
            <Description>This member will lose access to the project immediately.</Description>
          </DialogStack>
        </DialogShell>
      )}
    </>
  )
}
