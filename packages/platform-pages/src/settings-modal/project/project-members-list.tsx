import styled from 'styled-components'
import { useState } from 'react'
import { Stack, Text } from '@ingradient/ui/primitives'
import { Button, EmptyState } from '@ingradient/ui/components'
import { DialogShell } from '@ingradient/ui/components'
import {
  ProjectMemberRow,
  type ProjectMemberRowMember,
  type ProjectMemberRowRoleOption,
} from './project-member-row'

const ListBox = styled(Stack)`
  list-style: none;
  margin: 0;
  padding: 0;
`
const DescriptionBox = styled(Text)`
  line-height: var(--ig-line-height-relaxed);
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

  if (loading) return <EmptyState>{loadingText}</EmptyState>
  if (error) return <EmptyState>{error}</EmptyState>
  if (members.length === 0) return <EmptyState>{emptyText}</EmptyState>

  const ownerCount = members.filter((m) => m.role === 'owner').length

  return (
    <>
      <ListBox forwardedAs="ul" gap="var(--ig-space-0)">
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
      </ListBox>
      {pendingRemove && (
        <DialogShell
          title="Remove Member"
          onClose={() => { if (!removingMemberId) setPendingRemove(null) }}
          width="min(var(--ig-popup-2xl-narrow), 100%)"
          actions={
            <>
              <Button type="button" variant="secondary" onClick={() => setPendingRemove(null)} disabled={!!removingMemberId}>Cancel</Button>
              <Button
                type="button"
                variant="secondary"
                tone="danger"
                disabled={!!removingMemberId}
                onClick={() => {
                  onRemove?.(pendingRemove.id)
                  setPendingRemove(null)
                }}
              >
                {removingMemberId === pendingRemove.id ? 'Removing…' : 'Remove'}
              </Button>
            </>
          }
        >
          <Stack gap="var(--ig-spacing-12)">
            <DescriptionBox forwardedAs="p" tone="muted" size="var(--ig-text-body)">
              Remove <strong>{pendingRemove.email}</strong> from this project?
            </DescriptionBox>
            <DescriptionBox forwardedAs="p" tone="muted" size="var(--ig-text-body)">This member will lose access to the project immediately.</DescriptionBox>
          </Stack>
        </DialogShell>
      )}
    </>
  )
}
