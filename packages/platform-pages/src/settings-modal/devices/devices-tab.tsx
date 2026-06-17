import { Stack } from '@ingradient/ui/primitives'
import { SettingsSection } from '@ingradient/ui/patterns'
import { DevicesLicenseSection, type DevicesLicenseSectionProps } from './devices-license-section'
import { DevicesForms, type DevicesFormsProps } from './devices-forms'
import { DevicesTable, type DevicesTableProps } from './devices-table'

export interface DevicesTabProps {
  license: DevicesLicenseSectionProps
  forms: DevicesFormsProps
  table: DevicesTableProps
}

export function DevicesTab({ license, forms, table }: DevicesTabProps) {
  return (
    <Stack gap="var(--ig-space-4)">
      <SettingsSection title={license.title ?? 'License'}>
        <DevicesLicenseSection {...license} title="" />
      </SettingsSection>
      <SettingsSection title={table.title ?? 'Devices'}>
        <DevicesForms {...forms} />
        <DevicesTable {...table} title="" />
      </SettingsSection>
    </Stack>
  )
}
