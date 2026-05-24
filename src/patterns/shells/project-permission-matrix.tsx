import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Checkbox } from '../../components/inputs/toggles'
import { TextField } from '../../components/inputs/text-fields'
import { getSummaryPermissionState } from '../../utils/permission-state'
import { PermissionHelpTooltip } from './permission-help-tooltip'

const SearchWrap = styled.div`
  margin-bottom: var(--ig-space-5);
  max-width: 240px;
`

const Scroller = styled.div`
  overflow: auto;
  max-width: 100%;
`

const TableWrap = styled.div`
  display: inline-block;
  width: fit-content;
  border: 1px solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-xs);
  background: var(--ig-color-surface-panel);
`

const StyledTable = styled.table`
  width: max-content;
  border-collapse: collapse;
`

const HeaderCell = styled.th`
  padding: var(--ig-space-4) var(--ig-space-3);
  border-bottom: 1px solid var(--ig-color-border-strong);
  border-right: 1px solid var(--ig-color-border-subtle);
  background: var(--ig-color-surface-raised);
  color: var(--ig-color-text-secondary);
  font-size: 12px;
  text-align: center;
  vertical-align: bottom;
`

const StickyRoleHeaderCell = styled(HeaderCell)`
  position: sticky;
  left: 0;
  z-index: 2;
`

const HeaderContent = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ig-space-2);
  flex-wrap: wrap;
`

const RoleCell = styled.td`
  padding: var(--ig-space-4) var(--ig-space-5);
  border-bottom: 1px solid var(--ig-color-border-subtle);
  border-right: 1px solid var(--ig-color-border-subtle);
  color: var(--ig-color-text-primary);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  position: sticky;
  left: 0;
  z-index: 1;
  background: var(--ig-color-surface-panel);
`

const Cell = styled.td`
  padding: var(--ig-space-3);
  border-bottom: 1px solid var(--ig-color-border-subtle);
  border-right: 1px solid var(--ig-color-border-subtle);
  text-align: center;
`

export interface PermissionMatrixRole {
  value: string
  label: string
}

export interface PermissionDescriptor {
  key: string
  label: string
  description?: string
}

export interface ExpandedPermissionGroup {
  key: string
  label: string
  permissions: PermissionDescriptor[]
}

export interface SummaryPermissionDescriptor extends PermissionDescriptor {
  permissionKeys: string[]
}

export interface SummaryPermissionGroup {
  key: string
  label: string
  permissions: SummaryPermissionDescriptor[]
}

export type RoleMatrix = Record<string, Record<string, boolean>>

export interface ProjectPermissionMatrixProps {
  roles: PermissionMatrixRole[]
  expandAll?: boolean
  groups: ExpandedPermissionGroup[]
  summaryGroups: SummaryPermissionGroup[]
  draftRoles: RoleMatrix
  onChangeRolePermission: (role: string, key: string, checked: boolean) => void
  /** summary mode 일 때, 그룹 단위로 한 번에 set/unset */
  onChangeRolePermissions?: (role: string, keys: string[], checked: boolean) => void
  ownerRoleValue?: string
  searchPlaceholder?: string
  className?: string
}

export function ProjectPermissionMatrix({
  roles, expandAll, groups, summaryGroups,
  draftRoles, onChangeRolePermission, onChangeRolePermissions,
  ownerRoleValue = 'owner',
  searchPlaceholder = 'Search role…',
  className,
}: ProjectPermissionMatrixProps) {
  const [search, setSearch] = useState('')
  const visibleGroups = expandAll ? groups : summaryGroups
  const visibleRoles = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return roles
    return roles.filter((r) => r.label.toLowerCase().includes(query) || r.value.toLowerCase().includes(query))
  }, [roles, search])

  return (
    <div className={className}>
      <SearchWrap>
        <TextField
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search role"
        />
      </SearchWrap>
      <Scroller>
        <TableWrap>
          <StyledTable>
            <thead>
              <tr>
                <StickyRoleHeaderCell rowSpan={2} style={{ minWidth: 120 }}>Role</StickyRoleHeaderCell>
                {visibleGroups.map((group) => (
                  <HeaderCell key={group.key} colSpan={group.permissions.length}>{group.label}</HeaderCell>
                ))}
              </tr>
              <tr>
                {visibleGroups.flatMap((group) =>
                  group.permissions.map((permission) => (
                    <HeaderCell key={permission.key}>
                      <HeaderContent>
                        <span>{permission.label}</span>
                        {permission.description ? <PermissionHelpTooltip text={permission.description} /> : null}
                      </HeaderContent>
                    </HeaderCell>
                  )),
                )}
              </tr>
            </thead>
            <tbody>
              {visibleRoles.map((role) => (
                <tr key={role.value}>
                  <RoleCell>{role.label}</RoleCell>
                  {expandAll
                    ? groups.flatMap((group) =>
                        group.permissions.map((permission) => {
                          const disabled = role.value === ownerRoleValue
                          const checked = Boolean(draftRoles[role.value]?.[permission.key])
                          return (
                            <Cell key={`${role.value}-${permission.key}`}>
                              <Checkbox
                                checked={checked}
                                disabled={disabled}
                                onChange={(e) => onChangeRolePermission(role.value, permission.key, e.target.checked)}
                                aria-label={`${role.label} ${permission.label}`}
                              />
                            </Cell>
                          )
                        }),
                      )
                    : summaryGroups.flatMap((group) =>
                        group.permissions.map((permission) => {
                          const disabled = role.value === ownerRoleValue
                          const rolePermissions = draftRoles[role.value] ?? {}
                          const state = getSummaryPermissionState(rolePermissions, permission.permissionKeys)
                          return (
                            <Cell key={`${role.value}-${permission.key}`}>
                              <Checkbox
                                checked={state.checked}
                                indeterminate={state.indeterminate}
                                disabled={disabled}
                                onChange={(e) => {
                                  if (onChangeRolePermissions) {
                                    onChangeRolePermissions(role.value, permission.permissionKeys, e.target.checked)
                                  } else {
                                    for (const key of permission.permissionKeys) {
                                      onChangeRolePermission(role.value, key, e.target.checked)
                                    }
                                  }
                                }}
                                aria-label={`${role.label} ${permission.label}`}
                              />
                            </Cell>
                          )
                        }),
                      )}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrap>
      </Scroller>
    </div>
  )
}
