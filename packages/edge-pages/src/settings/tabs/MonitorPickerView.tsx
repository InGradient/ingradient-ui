import { Badge, Button, InlineMessage, SelectableListItem, Spinner, Stack } from '@ingradient/ui'

import type { MonitorPickerViewProps } from '../types'
import { ActionRow, Hint, Rows, SectionLabel } from './tab-shell'
import { SettingsRow } from '@ingradient/ui/patterns'

export function MonitorPickerView(props: MonitorPickerViewProps): JSX.Element {
  const {
    monitors, selectedId, isAutoSelected, isSelectionKnown, loading, loadFailed,
    identifying, identifyError, disabled, labels,
    onSelect, onSelectAuto, onReload, onIdentify,
  } = props

  if (loading) return <Hint><Spinner size="sm" /></Hint>

  // 조회 실패를 합성 목록으로 가리면 사용자가 잘못된 화면을 고르게 된다.
  if (loadFailed) {
    return (
      <InlineMessage $tone="warning">
        <Stack gap="var(--ig-space-3)">
          <span>{labels.unreachable}</span>
          {/* 저장된 값은 그대로임을 보여줘 설정을 잃었다고 오해하지 않게 */}
          <Hint>{labels.section}: {selectedId}</Hint>
          <ActionRow>
            <Button size="sm" variant="secondary" onClick={onReload}>{labels.retry}</Button>
          </ActionRow>
        </Stack>
      </InlineMessage>
    )
  }

  return (
    <>
      <SectionLabel>{labels.section}</SectionLabel>
      <Hint>{labels.desc}</Hint>
      <Rows>
        <SelectableListItem selected={isAutoSelected} disabled={disabled} onClick={onSelectAuto}>
          <SettingsRow divider={false} label={labels.auto} />
        </SelectableListItem>

        {monitors.map((monitor) => (
          <SelectableListItem
            key={monitor.id}
            selected={!isAutoSelected && selectedId === monitor.id}
            disabled={disabled}
            onClick={() => onSelect(monitor.id)}
          >
            <SettingsRow
              divider={false}
              label={monitor.label}
              description={monitor.width && monitor.height
                ? `${monitor.width}×${monitor.height}`
                : undefined}
              control={monitor.isPrimary ? <Badge>{labels.primaryBadge}</Badge> : undefined}
            />
          </SelectableListItem>
        ))}

        {/* 저장된 모니터가 목록에 없다 = 분리됨. 값을 자동으로 고쳐 쓰지 않고 알린다. */}
        {!isSelectionKnown && (
          <SelectableListItem selected disabled={disabled} onClick={() => undefined}>
            <SettingsRow
              divider={false}
              label={selectedId}
              description={labels.disconnectedHint}
              control={<Badge>{labels.disconnected}</Badge>}
            />
          </SelectableListItem>
        )}
      </Rows>

      {!isSelectionKnown && (
        <ActionRow>
          <Button size="sm" variant="secondary" disabled={disabled} onClick={onSelectAuto}>
            {labels.revertAuto}
          </Button>
        </ActionRow>
      )}

      {monitors.length <= 1 && <Hint>{labels.singleMonitorHint}</Hint>}

      <ActionRow>
        <Button
          size="sm"
          variant="secondary"
          disabled={disabled || identifying || !isSelectionKnown}
          onClick={onIdentify}
        >
          {identifying ? <><Spinner size="sm" />{labels.identifying}</> : labels.identify}
        </Button>
        <Hint>{labels.identifyHint}</Hint>
      </ActionRow>
      {identifyError && <Hint>{identifyError}</Hint>}
    </>
  )
}
