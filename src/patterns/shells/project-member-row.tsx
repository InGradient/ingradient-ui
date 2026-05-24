import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { SelectField } from '../../components/inputs/select-field'

const Row = styled.li`
  display: grid;
  grid-template-columns: minmax(140px, 1.1fr) minmax(140px, 1fr) minmax(220px, 1.3fr) auto auto;
  align-items: center;
  gap: var(--ig-space-5);
  padding: var(--ig-space-4) 0;
  border-bottom: 1px solid var(--ig-color-border-strong);
  list-style: none;
  &:last-child {
    border-bottom: none;
  }
`

const Cell = styled.span`
  font-size: 14px;
  color: var(--ig-color-text-primary);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const RoleSelect = styled(SelectField)`
  min-width: 100px;
`

const DangerButton = styled(Button).attrs({ variant: 'secondary' as const, tone: 'danger' as const })`
  padding: var(--ig-space-2) var(--ig-space-4);
  font-size: 12px;
`

export interface ProjectMemberRowMember {
  id: string
  name?: string | null
  organization?: string | null
  email: string
  role: string
}

export interface ProjectMemberRowRoleOption {
  value: string
  label: string
}

export interface ProjectMemberRowProps {
  member: ProjectMemberRowMember
  roleOptions: ProjectMemberRowRoleOption[]
  isOnlyOwner?: boolean
  canManagePermissions?: boolean
  onRoleChange?: (role: string) => void
  onRemove?: () => void
  removing?: boolean
  updatingRole?: boolean
}

export function ProjectMemberRow({
  member, roleOptions, isOnlyOwner, canManagePermissions,
  onRoleChange, onRemove, removing, updatingRole,
}: ProjectMemberRowProps) {
  const onlyOwnerTitle = isOnlyOwner ? 'Add another owner before changing this role.' : undefined
  const onlyOwnerRemoveTitle = isOnlyOwner ? 'Add another owner before removing this account.' : 'Remove from project'
  return (
    <Row>
      <Cell title={member.name ?? member.email}>{member.name || '-'}</Cell>
      <Cell title={member.organization ?? ''}>{member.organization || '-'}</Cell>
      <Cell title={member.email}>{member.email}</Cell>
      <RoleSelect
        value={member.role}
        onChange={(e) => onRoleChange?.((e.target as HTMLSelectElement).value)}
        disabled={!canManagePermissions || updatingRole || isOnlyOwner}
        aria-label={`Role for ${member.email}`}
        title={onlyOwnerTitle}
      >
        {roleOptions.map((role) => (
          <option key={role.value} value={role.value}>{role.label}</option>
        ))}
      </RoleSelect>
      <DangerButton
        type="button"
        onClick={onRemove}
        disabled={!canManagePermissions || removing || isOnlyOwner}
        title={onlyOwnerRemoveTitle}
      >
        Remove
      </DangerButton>
    </Row>
  )
}
