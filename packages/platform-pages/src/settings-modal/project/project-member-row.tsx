import styled from 'styled-components'
import { Text } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui/components'
import { SelectField } from '@ingradient/ui/components'

const Row = styled.li`
  display: grid;
  grid-template-columns: minmax(140px, 1.1fr) minmax(140px, 1fr) minmax(220px, 1.3fr) auto auto;
  align-items: center;
  gap: var(--ig-space-5);
  padding: var(--ig-space-4) 0;
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-strong);
  list-style: none;
  &:last-child {
    border-bottom: none;
  }
`

const CELL_STYLE = {
  minWidth: 0,
  overflow: 'hidden' as const,
  textOverflow: 'ellipsis' as const,
  whiteSpace: 'nowrap' as const,
}

const ROLE_SELECT_STYLE = { minWidth: 100 }
const DANGER_BTN_STYLE = { padding: 'var(--ig-space-2) var(--ig-space-4)', fontSize: 12 }

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
      <Text as="span" size="var(--ig-font-size-md)" title={member.name ?? member.email} style={CELL_STYLE}>{member.name || '-'}</Text>
      <Text as="span" size="var(--ig-font-size-md)" title={member.organization ?? ''} style={CELL_STYLE}>{member.organization || '-'}</Text>
      <Text as="span" size="var(--ig-font-size-md)" title={member.email} style={CELL_STYLE}>{member.email}</Text>
      <SelectField
        value={member.role}
        onChange={(e) => onRoleChange?.((e.target as HTMLSelectElement).value)}
        disabled={!canManagePermissions || updatingRole || isOnlyOwner}
        aria-label={`Role for ${member.email}`}
        title={onlyOwnerTitle}
        style={ROLE_SELECT_STYLE}
      >
        {roleOptions.map((role) => (
          <option key={role.value} value={role.value}>{role.label}</option>
        ))}
      </SelectField>
      <Button
        type="button"
        variant="secondary"
        tone="danger"
        onClick={onRemove}
        disabled={!canManagePermissions || removing || isOnlyOwner}
        title={onlyOwnerRemoveTitle}
        style={DANGER_BTN_STYLE}
      >
        Remove
      </Button>
    </Row>
  )
}
