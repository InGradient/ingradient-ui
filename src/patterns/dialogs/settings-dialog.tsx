import React from 'react'
import { TwoColumnDialog, type TwoColumnDialogProps } from '../../components/overlays/two-column-dialog'

export type SettingsDialogProps = TwoColumnDialogProps

export function SettingsDialog(props: SettingsDialogProps) {
  return <TwoColumnDialog {...props} />
}
