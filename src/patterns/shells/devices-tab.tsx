import styled from 'styled-components'
import { DevicesLicenseSection, type DevicesLicenseSectionProps } from './devices-license-section'
import { DevicesForms, type DevicesFormsProps } from './devices-forms'
import { DevicesTable, type DevicesTableProps } from './devices-table'
import { SettingsSection } from './settings-section'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

export interface DevicesTabProps {
  license: DevicesLicenseSectionProps
  forms: DevicesFormsProps
  table: DevicesTableProps
}

export function DevicesTab({ license, forms, table }: DevicesTabProps) {
  return (
    <Wrap>
      <SettingsSection title={license.title ?? 'License'}>
        <DevicesLicenseSection {...license} title="" />
      </SettingsSection>
      <SettingsSection title={table.title ?? 'Devices'}>
        <DevicesForms {...forms} />
        <DevicesTable {...table} title="" />
      </SettingsSection>
    </Wrap>
  )
}
