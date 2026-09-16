import { Badge, Button, InlineMessage, NumberField, Stack, Switch } from '@ingradient/ui'

import type { PsLightPanelViewProps } from '../types'
import { ActionRow, Hint, Rows, SectionLabel } from './tab-shell'
import { SettingsRow } from '@ingradient/ui/patterns'

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
          <SettingsRow
            divider={false}
            label={labels.portOpen}
            description={`${port} · ${baud} baud`}
            control={<Badge>{labels.connected}</Badge>}
          />
        </Rows>
      ) : (
        <InlineMessage $tone="warning">
          <Stack gap="var(--ig-space-3)">
            <span>{unreachable ? labels.unreachable : labels.openFailed}</span>
            {statusError && <Hint>{statusError}</Hint>}
          </Stack>
        </InlineMessage>
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
          <SettingsRow
            divider={false}
            key={channel}
            label={labels.channel(channel)}
            control={
              <Switch
                checked={channelOn[channel] ?? false}
                disabled={!canControl}
                aria-label={labels.channel(channel)}
                onChange={(e) => onToggleChannel(channel, e.target.checked)}
              />
            }
          />
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
      <SettingsRow
        divider={false}
        label={labels.idleLights}
        description={labels.idleDesc}
        control={
          <Switch
            checked={idleEnabled}
            disabled={locked}
            aria-label={labels.idleLights}
            onChange={(e) => onToggleIdle(e.target.checked)}
          />
        }
      />

      {sequenceRunning && <Hint>{labels.sequenceBusy}</Hint>}
      {actionError && <Hint>{actionError}</Hint>}
    </>
  )
}
