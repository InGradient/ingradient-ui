import { OrgSettingsTab, SettingsSection } from '@ingradient/ui/patterns'
import type { OrgSettingsTabProps } from '@ingradient/ui/patterns'

export function AdminOrganization(props: OrgSettingsTabProps) {
  return (
    <SettingsSection title={props.title ?? 'Organization'}>
      <OrgSettingsTab {...props} title="" />
    </SettingsSection>
  )
}
