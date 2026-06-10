import styled from 'styled-components'
import { Checkbox } from '../../components/inputs/toggles'
import { DropdownSelect, type DropdownOption } from '../../components/inputs/dropdown-select'
import { SettingsSection } from './settings-section'
import { SettingsRow } from './settings-row'
import { SettingsHint } from './settings-hint'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

const SelectWrap = styled.div`
  min-width: 160px;
`

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
    <Wrap>
      <SettingsSection title="Language">
        <SettingsRow
          asLabel={false}
          label="Interface language"
          control={
            <SelectWrap>
              <DropdownSelect value={locale} options={localeOptions} onChange={onChangeLocale} />
            </SelectWrap>
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
    </Wrap>
  )
}
