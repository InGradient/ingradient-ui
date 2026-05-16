import { DevicesTab } from '@ingradient/ui/patterns'
import type {
  DevicesFormsProps,
  DevicesLicenseSectionProps,
  DevicesTableProps,
} from '@ingradient/ui/patterns'

interface Props {
  license: DevicesLicenseSectionProps
  forms: DevicesFormsProps
  table: DevicesTableProps
}

export function AdminDevices({ license, forms, table }: Props) {
  return <DevicesTab license={license} forms={forms} table={table} />
}
