import styled from 'styled-components'
import { DevicesLicenseSection, type DevicesLicenseSectionProps } from './devices-license-section'
import { DevicesForms, type DevicesFormsProps } from './devices-forms'
import { DevicesTable, type DevicesTableProps } from './devices-table'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-11);
`

export interface DevicesTabProps {
  license: DevicesLicenseSectionProps
  forms: DevicesFormsProps
  table: DevicesTableProps
}

export function DevicesTab({ license, forms, table }: DevicesTabProps) {
  return (
    <Wrap>
      <DevicesLicenseSection {...license} />
      <DevicesForms {...forms} />
      <DevicesTable {...table} />
    </Wrap>
  )
}
