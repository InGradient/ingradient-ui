import { SettingsGeneralTab } from '@ingradient/ui/patterns'
import type { GeneralTabProps } from '../types'

export function GeneralTab(props: GeneralTabProps) {
  return (
    <SettingsGeneralTab
      locale={props.locale}
      onChangeLocale={props.onChangeLocale}
      enableHoverPreview={props.enableHoverPreview}
      onChangeEnableHoverPreview={props.onChangeEnableHoverPreview}
      singleClickToEdit={props.singleClickToEdit}
      onChangeSingleClickToEdit={props.onChangeSingleClickToEdit}
      showLabelsOnThumbnails={props.showLabelsOnThumbnails}
      onChangeShowLabelsOnThumbnails={props.onChangeShowLabelsOnThumbnails}
    />
  )
}
