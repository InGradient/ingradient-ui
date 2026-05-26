import { Box, Stack } from '@ingradient/ui/primitives'
import { Checkbox } from '@ingradient/ui/components'
import { DropdownSelect, type DropdownOption } from '@ingradient/ui/components'
import { SettingsHint, SettingsRow, SettingsSection } from '@ingradient/ui/patterns'

const SELECT_WRAP_STYLE = { minWidth: 160 }

export interface SettingsGeneralTabProps {
  locale: string
  onChangeLocale: (locale: string) => void
  enableHoverPreview: boolean
  onChangeEnableHoverPreview: (value: boolean) => void
  singleClickToEdit: boolean
  onChangeSingleClickToEdit: (value: boolean) => void
  showLabelsOnThumbnails: boolean
  onChangeShowLabelsOnThumbnails: (value: boolean) => void
  /** 기본 [en, ko, vi] */
  localeOptions?: DropdownOption[]
  hint?: string
}

const DEFAULT_LOCALES: DropdownOption[] = [
  { value: 'en', label: 'English' },
  { value: 'ko', label: 'Korean' },
  { value: 'vi', label: 'Vietnamese' },
]

const DEFAULT_HINT = 'These preferences are local to this browser and only affect how the portal UI behaves for your account.'

export function SettingsGeneralTab({
  locale, onChangeLocale,
  enableHoverPreview, onChangeEnableHoverPreview,
  singleClickToEdit, onChangeSingleClickToEdit,
  showLabelsOnThumbnails, onChangeShowLabelsOnThumbnails,
  localeOptions = DEFAULT_LOCALES,
  hint = DEFAULT_HINT,
}: SettingsGeneralTabProps) {
  return (
    <Stack gap={5}>
      <SettingsSection title="Language">
        <SettingsRow
          asLabel={false}
          label="Interface language"
          control={
            <Box style={SELECT_WRAP_STYLE}>
              <DropdownSelect value={locale} options={localeOptions} onChange={onChangeLocale} />
            </Box>
          }
        />
      </SettingsSection>

      <SettingsSection title="Workspace">
        <SettingsRow
          label="Enable hover preview in data grids"
          control={<Checkbox checked={enableHoverPreview} onChange={(e) => onChangeEnableHoverPreview(e.target.checked)} />}
        />
        <SettingsRow
          label="Use single click to open edit flow"
          control={<Checkbox checked={singleClickToEdit} onChange={(e) => onChangeSingleClickToEdit(e.target.checked)} />}
        />
        <SettingsRow
          label="Show label badges on thumbnails"
          control={<Checkbox checked={showLabelsOnThumbnails} onChange={(e) => onChangeShowLabelsOnThumbnails(e.target.checked)} />}
        />
      </SettingsSection>

      <SettingsHint>{hint}</SettingsHint>
    </Stack>
  )
}
