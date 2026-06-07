import { useState } from 'react'
import styled from 'styled-components'
import { Stack, Text, stateTitleText } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui/components'
import { DialogShell } from '@ingradient/ui/components'
import {
  ProjectMemberRow,
  type ProjectMemberRowMember,
  type ProjectMemberRowRoleOption,
} from './project-member-row'

const LIST_STYLE = { listStyle: 'none' as const, margin: 0, padding: 0 }
const DESCRIPTION_STYLE = { lineHeight: 'var(--ig-line-height-relaxed)' }

const Placeholder = styled.p`
  ${stateTitleText}
  margin: 0;
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
      <Stack as="ul" gap={0} style={LIST_STYLE}>
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
      </Stack>
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
          <Stack gap="var(--ig-space-5)">
            <Text as="p" tone="muted" size="var(--ig-font-size-md)" style={DESCRIPTION_STYLE}>
              Remove <strong>{pendingRemove.email}</strong> from this project?
            </Text>
            <Text as="p" tone="muted" size="var(--ig-font-size-md)" style={DESCRIPTION_STYLE}>This member will lose access to the project immediately.</Text>
          </Stack>
        </DialogShell>
      )}
    </>
  )
}
