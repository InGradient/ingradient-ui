import { Stack } from '@ingradient/ui/primitives'
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
    <Stack gap={11}>
      <DevicesLicenseSection {...license} />
      <DevicesForms {...forms} />
      <DevicesTable {...table} />
    </Stack>
  )
}
