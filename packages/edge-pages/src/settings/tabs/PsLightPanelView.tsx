import { Badge, Button, NumberField, Switch } from '@ingradient/ui'

import type { PsLightPanelViewProps } from '../types'
import {
  ActionRow, ErrorBox, Hint, RowBody, RowPrimary, RowSecondary, RowText, Rows, SectionLabel,
} from './tab-rows.styles'

export function PsLightPanelView(props: PsLightPanelViewProps): JSX.Element {
  const {
    connected, port, baud, unreachable, statusError, sequenceRunning,
    channelCount, channelOn, pwm, pwmMax, idleEnabled, busy, actionError, disabled, labels,
    onReopen, onToggleChannel, onAllOn, onAllOff, onChangePwm, onToggleIdle,
  } = props

  // 조명은 촬영 시퀀스와 같은 시리얼 포트를 쓴다. 촬영 중 채널을 건드리면 프레임이 섞인다.
  const locked = Boolean(disabled) || sequenceRunning || busy
  const canControl = connected && !locked
  const channels = Array.from({ length: Math.max(1, channelCount) }, (_, i) => i + 1)
  const pwmPercent = pwmMax > 0 ? Math.round((pwm / pwmMax) * 100) : 0

  return (
    <>
      <SectionLabel>{labels.statusSection}</SectionLabel>
      {connected ? (
        <Rows>
          <RowBody>
            <RowText>
              <RowPrimary>{labels.portOpen}</RowPrimary>
              <RowSecondary>{port} · {baud} baud</RowSecondary>
            </RowText>
            <Badge>{labels.connected}</Badge>
          </RowBody>
        </Rows>
      ) : (
        <ErrorBox>
          <span>{unreachable ? labels.unreachable : labels.openFailed}</span>
          {statusError && <Hint>{statusError}</Hint>}
        </ErrorBox>
      )}
      <ActionRow>
        <Button size="sm" variant="secondary" disabled={locked} onClick={onReopen}>
          {labels.reopen}
        </Button>
        <Hint>{labels.detectHint}</Hint>
      </ActionRow>

      <SectionLabel>{labels.channelSection}</SectionLabel>
      <Hint>{labels.channelDesc}</Hint>
      <Rows>
        {channels.map((channel) => (
          <RowBody key={channel}>
            <RowText><RowPrimary>{labels.channel(channel)}</RowPrimary></RowText>
            <Switch
              checked={channelOn[channel] ?? false}
              disabled={!canControl}
              onChange={(e) => onToggleChannel(channel, e.target.checked)}
            />
          </RowBody>
        ))}
      </Rows>
      <ActionRow>
        <Button size="sm" variant="secondary" disabled={!canControl} onClick={onAllOn}>
          {labels.allOn}
        </Button>
        <Button size="sm" variant="secondary" disabled={!canControl} onClick={onAllOff}>
          {labels.allOff}
        </Button>
      </ActionRow>

      <SectionLabel>{labels.pwmSection}</SectionLabel>
      <Hint>{labels.pwmDesc}</Hint>
      <ActionRow>
        <NumberField
          value={pwm}
          min={0}
          max={pwmMax}
          step={1}
          format={String}
          parse={(raw: string) => parseInt(raw, 10)}
          disabled={locked}
          aria-label={labels.pwmSection}
          onChange={onChangePwm}
        />
        <Hint>{pwmPercent}%</Hint>
      </ActionRow>

      <SectionLabel>{labels.idleSection}</SectionLabel>
      <RowBody>
        <RowText>
          <RowPrimary>{labels.idleLights}</RowPrimary>
          <RowSecondary>{labels.idleDesc}</RowSecondary>
        </RowText>
        <Switch
          checked={idleEnabled}
          disabled={locked}
          onChange={(e) => onToggleIdle(e.target.checked)}
        />
      </RowBody>

      {sequenceRunning && <Hint>{labels.sequenceBusy}</Hint>}
      {actionError && <Hint>{actionError}</Hint>}
    </>
  )
}
