import { DevicesTab } from '../../devices'
import type {
  DevicesFormsProps,
  DevicesLicenseSectionProps,
  DevicesTableProps,
} from '../../devices'

interface Props {
  license: DevicesLicenseSectionProps
  forms: DevicesFormsProps
  table: DevicesTableProps
}

export function AdminDevices({ license, forms, table }: Props) {
  return <DevicesTab license={license} forms={forms} table={table} />
}
