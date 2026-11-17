import { useId } from 'react'
import { Button, CodeBlock, CopyButton, DropdownSelect, FieldRow, Inline, NumberField, StatusDot, Text, TextField } from '@ingradient/ui'
import { FactoryIcon } from '@ingradient/ui/components'
import { SettingsRow } from '@ingradient/ui/patterns'
import { iconSizeNumbers } from '@ingradient/ui/tokens'

import {
  PLC_OUTPUT_KEYS, PLC_RANGES, PLC_READY_KINDS,
  type PlcLinkState, type PlcRange, type PlcTabLabels, type PlcTabViewProps,
} from '../types'
import { ActionRow, Hint, SectionLabel, TabTitle, TabWrap } from './tab-shell'

const intOf = (raw: string) => parseInt(raw, 10)
const oneDecimal = (v: number) => v.toFixed(1)

function linkText(link: PlcLinkState, labels: PlcTabLabels): string {
  switch (link.kind) {
    case 'agentDown': return labels.testAgentDown
    case 'noAddress': return labels.testNoAddress
    case 'connected': return labels.testConnected(link.host, link.port)
    case 'disconnected': return labels.testDisconnected(link.reason)
  }
}

/** 점 + 글자. 점은 색만 보태므로 화면 읽기 도구에는 글자만 읽힌다. */
function DotText({ tone, children }: { tone: 'success' | 'danger' | 'neutral'; children: string }) {
  return (
    <Inline gap="var(--ig-spacing-8)" align="center">
      <StatusDot as="span" aria-hidden $tone={tone} />
      <Text size="var(--ig-text-body-sm)" tone="muted">{children}</Text>
    </Inline>
  )
}

/** 숫자 칸 + 옆 설명. */
function NumberRow({ id, label, hint, value, range, locked, decimals, onChange }: {
  id: string; label: string; hint: string; value: number; range: PlcRange; locked: boolean
  decimals?: boolean; onChange: (v: number) => void
}) {
  return (
    <FieldRow label={label} htmlFor={id}>
      <Inline gap="var(--ig-spacing-8)" align="center">
        <NumberField
          id={id}
          value={value}
          {...range}
          disabled={locked}
          format={decimals ? oneDecimal : String}
          parse={decimals ? parseFloat : intOf}
          onChange={onChange}
        />
        <Hint>{hint}</Hint>
      </Inline>
    </FieldRow>
  )
}

export function PlcTabView(props: PlcTabViewProps): JSX.Element {
  const {
    dataset, settings, locked, duplicateAddresses, handoverText, test, labels,
    onChange, onChangeOutput, onTestConnect, onToggleOutput,
  } = props
  const baseId = useId()
  const fieldId = (name: string) => `${baseId}-${name}`

  const title = (
    <TabTitle>
      <FactoryIcon size={iconSizeNumbers.xs} />
      {labels.title}
    </TabTitle>
  )

  if (!dataset) {
    return (
      <TabWrap>
        {title}
        <Hint>{labels.needDataset}</Hint>
      </TabWrap>
    )
  }

  const connected = test.link.kind === 'connected'
  const configured = test.link.kind === 'connected' || test.link.kind === 'disconnected'

  return (
    <TabWrap>
      {title}
      <Hint>{labels.intro}</Hint>
      <Hint role="status">{labels.scope(dataset.project, dataset.dataset)}</Hint>

      <ActionRow>
        <SectionLabel>{labels.handoverTitle}</SectionLabel>
        <CopyButton size="sm" value={handoverText} copiedLabel={labels.handoverCopied}>{labels.handoverCopy}</CopyButton>
      </ActionRow>
      <Hint>{labels.handoverHint}</Hint>
      <CodeBlock as="pre" data-testid="plc-handover-text">{handoverText}</CodeBlock>
      {locked && <Hint role="status">{labels.lockedWhileAuto}</Hint>}

      <SectionLabel>{labels.connectionSection}</SectionLabel>
      <FieldRow label={labels.host} htmlFor={fieldId('host')}>
        <TextField
          id={fieldId('host')}
          value={settings.host}
          placeholder="192.168.0.10"
          disabled={locked}
          onChange={(e) => onChange({ host: e.target.value })}
        />
      </FieldRow>
      <NumberRow id={fieldId('port')} label={labels.port} hint={labels.portHint} value={settings.port}
        range={PLC_RANGES.port} locked={locked} onChange={(port) => onChange({ port })} />
      <NumberRow id={fieldId('unit')} label={labels.unitId} hint={labels.unitIdHint} value={settings.unitId}
        range={PLC_RANGES.unitId} locked={locked} onChange={(unitId) => onChange({ unitId })} />

      <SectionLabel>{labels.inputSection}</SectionLabel>
      <FieldRow label={labels.signal.ready} htmlFor={fieldId('ready')}>
        <Inline gap="var(--ig-spacing-8)" align="center">
          <DropdownSelect
            value={settings.readyKind}
            options={PLC_READY_KINDS.map((kind) => ({ value: kind, label: labels.kind[kind] }))}
            disabled={locked}
            aria-label={`${labels.signal.ready} — ${labels.kind.coil} / ${labels.kind.discrete_input}`}
            onChange={(v) => onChange({ readyKind: v as typeof settings.readyKind })}
          />
          <NumberField
            id={fieldId('ready')}
            value={settings.readyAddress}
            {...PLC_RANGES.address}
            disabled={locked}
            format={String}
            parse={intOf}
            onChange={(readyAddress) => onChange({ readyAddress })}
          />
        </Inline>
        <Hint>{labels.readyHint}</Hint>
      </FieldRow>

      <SectionLabel>{labels.outputSection}</SectionLabel>
      <Hint>{labels.outputHint}</Hint>
      {PLC_OUTPUT_KEYS.map((key) => (
        <NumberRow key={key} id={fieldId(`out-${key}`)} label={labels.signal[key]} hint={labels.signalDesc[key]}
          value={settings.outputs[key]} range={PLC_RANGES.address} locked={locked}
          onChange={(v) => onChangeOutput(key, v)} />
      ))}
      {duplicateAddresses.length > 0 && (
        <Hint role="alert">{labels.duplicateWarning(duplicateAddresses.join(', '))}</Hint>
      )}

      <SectionLabel>{labels.timingSection}</SectionLabel>
      <NumberRow id={fieldId('timeout')} label={labels.responseTimeout} hint={labels.responseTimeoutHint}
        value={settings.responseTimeoutS} range={PLC_RANGES.responseTimeoutS} locked={locked} decimals
        onChange={(responseTimeoutS) => onChange({ responseTimeoutS })} />
      <NumberRow id={fieldId('heartbeat')} label={labels.heartbeat} hint={labels.heartbeatHint}
        value={settings.heartbeatS} range={PLC_RANGES.heartbeatS} locked={locked} decimals
        onChange={(heartbeatS) => onChange({ heartbeatS })} />

      <SectionLabel>{labels.testSection}</SectionLabel>
      <SettingsRow
        divider={false}
        asLabel={false}
        label={<DotText tone={connected ? 'success' : configured ? 'danger' : 'neutral'}>{linkText(test.link, labels)}</DotText>}
        control={(
          <Button size="sm" variant="secondary" type="button"
            disabled={test.busy || locked || !configured} onClick={onTestConnect}>
            {labels.testConnect}
          </Button>
        )}
      />
      {test.message && <Hint role="status">{test.message}</Hint>}
      <SettingsRow
        divider={false}
        asLabel={false}
        label={labels.signal.ready}
        description={labels.testReadyDesc}
        control={<OnOff on={connected && test.ready} labels={labels} />}
      />
      {PLC_OUTPUT_KEYS.map((key) => (
        <SettingsRow
          key={key}
          divider={false}
          asLabel={false}
          label={labels.signal[key]}
          control={(
            <ActionRow>
              <OnOff on={test.outputs[key]} labels={labels} />
              {/* 살아 있음은 앱이 알아서 바꾼다 — 값만 보인다. */}
              {key !== 'heartbeat' && (
                <Button size="sm" variant="secondary" type="button"
                  aria-label={`${test.outputs[key] ? labels.testTurnOff : labels.testTurnOn}: ${labels.signal[key]}`}
                  disabled={!connected || locked} onClick={() => onToggleOutput(key, !test.outputs[key])}>
                  {test.outputs[key] ? labels.testTurnOff : labels.testTurnOn}
                </Button>
              )}
            </ActionRow>
          )}
        />
      ))}
    </TabWrap>
  )
}

function OnOff({ on, labels }: { on: boolean; labels: PlcTabLabels }) {
  return <DotText tone={on ? 'success' : 'neutral'}>{on ? labels.testOn : labels.testOff}</DotText>
}

