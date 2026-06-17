import { SettingsSection } from '@ingradient/ui/patterns'
import { OrgSettingsTab } from '../../organization'
import type { OrgSettingsTabProps } from '../../organization'

export function AdminOrganization(props: OrgSettingsTabProps) {
  return (
    <SettingsSection title={props.title ?? 'Organization'}>
      <OrgSettingsTab {...props} title="" />
    </SettingsSection>
  )
}
