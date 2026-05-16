/**
 * Compute summary checkbox state for a group of atomic permission keys.
 * - All keys true → checked
 * - All keys false → unchecked (indeterminate=false)
 * - Mixed → indeterminate
 */
export function getSummaryPermissionState(
  rolePermissions: Record<string, boolean>,
  permissionKeys: string[],
): { checked: boolean; indeterminate: boolean } {
  const values = permissionKeys.map((key) => Boolean(rolePermissions[key]))
  const checked = values.every(Boolean)
  const unchecked = values.every((value) => !value)
  return {
    checked,
    indeterminate: !checked && !unchecked,
  }
}
