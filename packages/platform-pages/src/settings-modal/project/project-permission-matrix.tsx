import { Checkbox } from '@ingradient/ui/components'
import { getSummaryPermissionState } from '@ingradient/ui/utils'
import {
  PermissionMatrix,
  type PermissionMatrixColumnGroup,
  type PermissionMatrixRow,
} from './permission-matrix'

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

/**
 * Project role × permission matrix — 도메인 wrapper.
 * generic PermissionMatrix (sticky-col + checkbox grid + search) 위에
 * role / permission 도메인 매핑 (RoleMatrix state + expandAll/summary 모드) 을 얹는다.
 */
export function ProjectPermissionMatrix({
  roles,
  expandAll,
  groups,
  summaryGroups,
  draftRoles,
  onChangeRolePermission,
  onChangeRolePermissions,
  ownerRoleValue = 'owner',
  searchPlaceholder = 'Search role…',
  className,
}: ProjectPermissionMatrixProps) {
  const visibleGroups = expandAll ? groups : summaryGroups

  const rows: PermissionMatrixRow[] = roles.map((role) => ({
    key: role.value,
    label: role.label,
  }))

  const columnGroups: PermissionMatrixColumnGroup[] = visibleGroups.map((group) => ({
    key: group.key,
    label: group.label,
    columns: group.permissions.map((permission) => ({
      key: permission.key,
      label: permission.label,
      description: permission.description,
    })),
  }))

  const summaryByKey = new Map<string, SummaryPermissionDescriptor>()
  if (!expandAll) {
    for (const group of summaryGroups) {
      for (const permission of group.permissions) {
        summaryByKey.set(permission.key, permission)
      }
    }
  }

  return (
    <PermissionMatrix
      className={className}
      rows={rows}
      columnGroups={columnGroups}
      rowHeaderLabel="Role"
      searchPlaceholder={searchPlaceholder}
      searchAriaLabel="Search role"
      renderCell={(row, column) => {
        const disabled = row.key === ownerRoleValue
        const ariaLabel = `${typeof row.label === 'string' ? row.label : row.key} ${typeof column.label === 'string' ? column.label : column.key}`

        if (expandAll) {
          const checked = Boolean(draftRoles[row.key]?.[column.key])
          return (
            <Checkbox
              checked={checked}
              disabled={disabled}
              onChange={(e) => onChangeRolePermission(row.key, column.key, e.target.checked)}
              aria-label={ariaLabel}
            />
          )
        }

        const summaryPermission = summaryByKey.get(column.key)
        if (!summaryPermission) return null
        const rolePermissions = draftRoles[row.key] ?? {}
        const state = getSummaryPermissionState(rolePermissions, summaryPermission.permissionKeys)
        return (
          <Checkbox
            checked={state.checked}
            indeterminate={state.indeterminate}
            disabled={disabled}
            onChange={(e) => {
              if (onChangeRolePermissions) {
                onChangeRolePermissions(row.key, summaryPermission.permissionKeys, e.target.checked)
              } else {
                for (const key of summaryPermission.permissionKeys) {
                  onChangeRolePermission(row.key, key, e.target.checked)
                }
              }
            }}
            aria-label={ariaLabel}
          />
        )
      }}
    />
  )
}
