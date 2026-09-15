import type { ChangeEvent } from 'react'
import { Button, SelectableListItem, Switch } from '@ingradient/ui'
import { SettingsIcon, VolumeIcon } from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui/tokens'

import type { GeneralTabViewProps } from '../types'
import { VolumeControl, VolumeRange, VolumeValue } from './GeneralTabView.styles'
import {
  ActionRow, Hint, RowBody, RowPrimary, RowSecondary, RowText, Rows, SectionLabel,
  TabTitle, TabWrap,
} from './tab-rows.styles'

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

      <RowBody>
        <RowText>
          <RowPrimary>{labels.soundLabel}</RowPrimary>
          <RowSecondary>{labels.soundDesc}</RowSecondary>
        </RowText>
        <Switch checked={soundEnabled} onChange={(e) => onToggleSound(e.target.checked)} />
      </RowBody>

      {/* 소리 토글이 꺼져 있어도 잠그지 않는다 — 먼저 들어 보고 켜는 것이 자연스럽다. */}
      <Rows>
        {soundOptions.map((option) => (
          <SelectableListItem
            key={option.id}
            selected={selectedSoundId === option.id}
            onClick={() => onSelectSound(option.id)}
          >
            <RowBody>
              <RowText><RowPrimary>{option.label}</RowPrimary></RowText>
              <Button
                size="sm"
                variant="secondary"
                // 행 클릭(=선택)까지 같이 발생하면 미리듣기만 하려던 사용자가 값을 바꾸게 된다.
                onClick={(e) => { e.stopPropagation(); onPreviewSound(option.id) }}
              >
                <VolumeIcon size={iconSizeNumbers.xs} />
                {labels.soundPreview}
              </Button>
            </RowBody>
          </SelectableListItem>
        ))}
      </Rows>

      <RowBody>
        <RowText>
          <RowPrimary>{labels.volumeLabel}</RowPrimary>
          <RowSecondary>{volumeLocked ? labels.volumeSystemHint : labels.volumeDesc}</RowSecondary>
        </RowText>
        <VolumeControl>
          <VolumeRange
            type="range"
            min={0}
            max={100}
            step={VOLUME_STEP_PERCENT}
            value={volumePercent}
            disabled={volumeLocked}
            aria-label={labels.volumeLabel}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeVolume(Number(e.target.value))}
            onMouseUp={onPreviewVolume}
            onKeyUp={onPreviewVolume}
            onTouchEnd={onPreviewVolume}
          />
          <VolumeValue>{volumePercent}%</VolumeValue>
        </VolumeControl>
      </RowBody>

      <RowBody>
        <RowText>
          <RowPrimary>{labels.messageLabel}</RowPrimary>
          <RowSecondary>{labels.messageDesc}</RowSecondary>
        </RowText>
        <Switch checked={messageEnabled} onChange={(e) => onToggleMessage(e.target.checked)} />
      </RowBody>

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
