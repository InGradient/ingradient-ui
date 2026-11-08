import styled from 'styled-components'
import { Text } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui/components'
import { SelectField } from '@ingradient/ui/components'

const Row = styled.li`
  display: grid;
  grid-template-columns: minmax(var(--ig-layout-size-grid-cell-min), 1.1fr) minmax(var(--ig-layout-size-grid-cell-min), 1fr) minmax(var(--ig-layout-size-cell-min-wide), 1.3fr) auto auto;
  align-items: center;
  gap: var(--ig-spacing-12);
  padding: var(--ig-spacing-8) 0;
  box-shadow: inset 0 var(--ig-space-neg-1px) 0 var(--ig-color-border-strong);
  list-style: none;
  &:last-child {
    border-bottom: none;
  }
`

const CellBox = styled(Text)`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const RoleSelectBox = styled(SelectField)`
  min-width: var(--ig-layout-size-field-xs);
`
const DangerBtnBox = styled(Button)`
  padding: var(--ig-spacing-8) var(--ig-spacing-8);
  font-size: var(--ig-text-caption);
  line-height: var(--ig-text-caption-leading);
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
      <CellBox forwardedAs="span" size="var(--ig-text-body)" title={member.name ?? member.email}>{member.name || '-'}</CellBox>
      <CellBox forwardedAs="span" size="var(--ig-text-body)" title={member.organization ?? ''}>{member.organization || '-'}</CellBox>
      <CellBox forwardedAs="span" size="var(--ig-text-body)" title={member.email}>{member.email}</CellBox>
      <RoleSelectBox
        value={member.role}
        onChange={(e) => onRoleChange?.((e.target as HTMLSelectElement).value)}
        disabled={!canManagePermissions || updatingRole || isOnlyOwner}
        aria-label={`Role for ${member.email}`}
        title={onlyOwnerTitle}
      >
        {roleOptions.map((role) => (
          <option key={role.value} value={role.value}>{role.label}</option>
        ))}
      </RoleSelectBox>
      <DangerBtnBox
        type="button"
        variant="secondary"
        tone="danger"
        onClick={onRemove}
        disabled={!canManagePermissions || removing || isOnlyOwner}
        title={onlyOwnerRemoveTitle}
      >
        Remove
      </DangerBtnBox>
    </Row>
  )
}
