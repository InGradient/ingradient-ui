import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Box, Inline } from '../../primitives'
import { Checkbox } from '../../components/inputs/toggles'
import { TextField } from '../../components/inputs/text-fields'
import { getSummaryPermissionState } from '../../utils/permission-state'
import { HelpTooltip } from '../../components/overlays/help-tooltip'

const SEARCH_WRAP_STYLE = {
  marginBottom: 'var(--ig-space-5)',
  maxWidth: 240,
}

const SCROLLER_STYLE = { overflow: 'auto' as const, maxWidth: '100%' }

const TABLE_WRAP_STYLE = {
  display: 'inline-block' as const,
  width: 'fit-content',
  border: '1px solid var(--ig-color-border-strong)',
  borderRadius: 'var(--ig-radius-xxs)',
  background: 'var(--ig-color-surface-panel)',
}

const HEADER_CONTENT_STYLE = {
  justifyContent: 'center' as const,
  flexWrap: 'wrap' as const,
}

const StyledTable = styled.table`
  width: max-content;
  border-collapse: collapse;
  & th {
    padding: var(--ig-space-4) var(--ig-space-3);
    border-bottom: 1px solid var(--ig-color-border-strong);
    border-right: 1px solid var(--ig-color-border-subtle);
    background: var(--ig-color-surface-raised);
    color: var(--ig-color-text-secondary);
    font-size: 12px;
    text-align: center;
    vertical-align: bottom;
  }
  & th.sticky-role {
    position: sticky;
    left: 0;
    z-index: 2;
  }
  & td {
    padding: var(--ig-space-3);
    border-bottom: 1px solid var(--ig-color-border-subtle);
    border-right: 1px solid var(--ig-color-border-subtle);
    text-align: center;
  }
  & td.role {
    padding: var(--ig-space-4) var(--ig-space-5);
    color: var(--ig-color-text-primary);
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    position: sticky;
    left: 0;
    z-index: 1;
    background: var(--ig-color-surface-panel);
    text-align: left;
  }
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
      <Box style={SEARCH_WRAP_STYLE}>
        <TextField
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search role"
        />
      </Box>
      <Box style={SCROLLER_STYLE}>
        <Box style={TABLE_WRAP_STYLE}>
          <StyledTable>
            <thead>
              <tr>
                <th className="sticky-role" rowSpan={2} style={{ minWidth: 120 }}>Role</th>
                {visibleGroups.map((group) => (
                  <th key={group.key} colSpan={group.permissions.length}>{group.label}</th>
                ))}
              </tr>
              <tr>
                {visibleGroups.flatMap((group) =>
                  group.permissions.map((permission) => (
                    <th key={permission.key}>
                      <Inline as="span" gap={2} style={HEADER_CONTENT_STYLE}>
                        <span>{permission.label}</span>
                        {permission.description ? <HelpTooltip text={permission.description} /> : null}
                      </Inline>
                    </th>
                  )),
                )}
              </tr>
            </thead>
            <tbody>
              {visibleRoles.map((role) => (
                <tr key={role.value}>
                  <td className="role">{role.label}</td>
                  {expandAll
                    ? groups.flatMap((group) =>
                        group.permissions.map((permission) => {
                          const disabled = role.value === ownerRoleValue
                          const checked = Boolean(draftRoles[role.value]?.[permission.key])
                          return (
                            <td key={`${role.value}-${permission.key}`}>
                              <Checkbox
                                checked={checked}
                                disabled={disabled}
                                onChange={(e) => onChangeRolePermission(role.value, permission.key, e.target.checked)}
                                aria-label={`${role.label} ${permission.label}`}
                              />
                            </td>
                          )
                        }),
                      )
                    : summaryGroups.flatMap((group) =>
                        group.permissions.map((permission) => {
                          const disabled = role.value === ownerRoleValue
                          const rolePermissions = draftRoles[role.value] ?? {}
                          const state = getSummaryPermissionState(rolePermissions, permission.permissionKeys)
                          return (
                            <td key={`${role.value}-${permission.key}`}>
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
                            </td>
                          )
                        }),
                      )}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </Box>
      </Box>
    </div>
  )
}
