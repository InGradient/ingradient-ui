import { Badge, Button, SelectableListItem, Spinner } from '@ingradient/ui'

import type { MonitorPickerViewProps } from '../types'
import {
  ActionRow, ErrorBox, Hint, RowBody, RowPrimary, RowSecondary, RowText, Rows, SectionLabel,
} from './tab-rows.styles'

export function MonitorPickerView(props: MonitorPickerViewProps): JSX.Element {
  const {
    monitors, selectedId, isAutoSelected, isSelectionKnown, loading, loadFailed,
    identifying, identifyError, disabled, labels,
    onSelect, onSelectAuto, onReload, onIdentify,
  } = props

  if (loading) return <Hint><Spinner size="sm" /></Hint>

  if (loadFailed) {
    return (
      <ErrorBox>
        <span>{labels.unreachable}</span>
        {/* 저장된 값은 그대로임을 보여줘 설정을 잃었다고 오해하지 않게 */}
        <Hint>{labels.section}: {selectedId}</Hint>
        <ActionRow>
          <Button size="sm" variant="secondary" onClick={onReload}>{labels.retry}</Button>
        </ActionRow>
      </ErrorBox>
    )
  }

  return (
    <>
      <SectionLabel>{labels.section}</SectionLabel>
      <Hint>{labels.desc}</Hint>
      <Rows>
        <SelectableListItem selected={isAutoSelected} disabled={disabled} onClick={onSelectAuto}>
          <RowBody><RowText><RowPrimary>{labels.auto}</RowPrimary></RowText></RowBody>
        </SelectableListItem>

        {monitors.map((monitor) => (
          <SelectableListItem
            key={monitor.id}
            selected={!isAutoSelected && selectedId === monitor.id}
            disabled={disabled}
            onClick={() => onSelect(monitor.id)}
          >
            <RowBody>
              <RowText>
                <RowPrimary>{monitor.label}</RowPrimary>
                {monitor.width && monitor.height && (
                  <RowSecondary>{monitor.width}×{monitor.height}</RowSecondary>
                )}
              </RowText>
              {monitor.isPrimary && <Badge>{labels.primaryBadge}</Badge>}
            </RowBody>
          </SelectableListItem>
        ))}

        {/* 저장된 모니터가 목록에 없다 = 분리됨. 값을 자동으로 고쳐 쓰지 않고 알린다. */}
        {!isSelectionKnown && (
          <SelectableListItem selected disabled={disabled} onClick={() => undefined}>
            <RowBody>
              <RowText>
                <RowPrimary>{selectedId}</RowPrimary>
                <RowSecondary>{labels.disconnectedHint}</RowSecondary>
              </RowText>
              <Badge>{labels.disconnected}</Badge>
            </RowBody>
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
