import { Button, SelectableListItem, Slider, Switch } from '@ingradient/ui'
import { SettingsIcon, VolumeIcon } from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui/tokens'

import type { GeneralTabViewProps } from '../types'
import { ActionRow, Hint, Rows, SectionLabel, TabTitle, TabWrap } from './tab-shell'
import { SettingsRow } from '@ingradient/ui/patterns'

const VOLUME_STEP_PERCENT = 5

export function GeneralTabView(props: GeneralTabViewProps): JSX.Element {
  const {
    soundEnabled, soundOptions, selectedSoundId, volumePercent, volumeLocked,
    messageEnabled, testResult, labels,
    onToggleSound, onSelectSound, onPreviewSound, onChangeVolume, onPreviewVolume,
    onToggleMessage, onTestMessage,
  } = props

  return (
    <TabWrap>
      <TabTitle>
        <SettingsIcon size={iconSizeNumbers.xs} />
        {labels.title}
      </TabTitle>

      <SectionLabel>{labels.captureDoneSection}</SectionLabel>
      <Hint>{labels.captureDoneDesc}</Hint>

      <SettingsRow
        divider={false}
        label={labels.soundLabel}
        description={labels.soundDesc}
        control={<Switch checked={soundEnabled} onChange={(e) => onToggleSound(e.target.checked)} />}
      />

      {/* 소리 토글이 꺼져 있어도 잠그지 않는다 — 먼저 들어 보고 켜는 것이 자연스럽다. */}
      <Rows>
        {soundOptions.map((option) => (
          <SelectableListItem
            key={option.id}
            selected={selectedSoundId === option.id}
            onClick={() => onSelectSound(option.id)}
          >
            <SettingsRow
              divider={false}
              label={option.label}
              control={
                <Button
                  size="sm"
                  variant="secondary"
                  // 행 클릭(=선택)까지 같이 발생하면 미리듣기만 하려던 사용자가 값을 바꾸게 된다.
                  onClick={(e) => { e.stopPropagation(); onPreviewSound(option.id) }}
                >
                  <VolumeIcon size={iconSizeNumbers.xs} />
                  {labels.soundPreview}
                </Button>
              }
            />
          </SelectableListItem>
        ))}
      </Rows>

      <SettingsRow
        divider={false}
        label={labels.volumeLabel}
        description={volumeLocked ? labels.volumeSystemHint : labels.volumeDesc}
        control={
          <Slider
            min={0}
            max={100}
            step={VOLUME_STEP_PERCENT}
            value={volumePercent}
            disabled={volumeLocked}
            valueLabel={`${volumePercent}%`}
            aria-label={labels.volumeLabel}
            onChange={(e) => onChangeVolume(Number(e.target.value))}
            // 드래그 중 매 프레임 재생하면 소리가 겹쳐 뭉갠다 — 놓는 순간에만.
            onMouseUp={onPreviewVolume}
            onKeyUp={onPreviewVolume}
            onTouchEnd={onPreviewVolume}
          />
        }
      />

      <SettingsRow
        divider={false}
        label={labels.messageLabel}
        description={labels.messageDesc}
        control={
          <Switch checked={messageEnabled} onChange={(e) => onToggleMessage(e.target.checked)} />
        }
      />

      <ActionRow>
        <Button size="sm" variant="secondary" onClick={onTestMessage}>
          {labels.messageTest}
        </Button>
        {testResult === 'failed' && <Hint>{labels.messageTestFailed}</Hint>}
      </ActionRow>
      <Hint>{labels.messageHint}</Hint>
    </TabWrap>
  )
}
