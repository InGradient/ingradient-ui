import { Button, NumberField, Switch } from '@ingradient/ui'
import { FlaskIcon, PlusIcon, TrashIcon } from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui/tokens'

import type { ExperimentsTabViewProps } from '../types'
import {
  ActionRow, Hint, PeriodNote, PeriodRow, RowBody, RowPrimary, RowSecondary, RowText,
  Rows, SectionLabel, TabTitle, TabWrap, TotalBox,
} from './ExperimentsTabView.styles'

/** 목록에서 같은 값이 앞에 또 있으면 중복이다 — 첫 번째만 원본으로 본다. */
function isDuplicate(periods: number[], index: number): boolean {
  return periods.indexOf(periods[index]) !== index
}

export function ExperimentsTabView(props: ExperimentsTabViewProps): JSX.Element {
  const {
    enabled, fringePeriods, primaryIndex, compositeEnabled, compositeSteps,
    limits, labels,
    onToggleEnabled, onChangePeriod, onAddPeriod, onRemovePeriod,
    onToggleComposite, onChangeCompositeSteps,
  } = props

  return (
    <TabWrap>
      <TabTitle>
        <FlaskIcon size={iconSizeNumbers.xs} />
        {labels.title}
      </TabTitle>

      <RowBody>
        <RowText>
          <RowPrimary>{labels.enabledLabel}</RowPrimary>
          <RowSecondary>{labels.enabledDesc}</RowSecondary>
        </RowText>
        <Switch checked={enabled} onChange={(e) => onToggleEnabled(e.target.checked)} />
      </RowBody>
      {!enabled && <Hint>{labels.disabledHint}</Hint>}

      {enabled && (
        <>
          <SectionLabel>{labels.periodsSection}</SectionLabel>
          <Rows>
            {fringePeriods.map((period, index) => (
              // 주기는 중복될 수 있어 값을 key 로 쓸 수 없다. 목록은 순서로만 편집한다.
              <PeriodRow key={index}>
                <NumberField
                  value={period}
                  min={limits.minPeriod}
                  step={1}
                  format={String}
                  parse={(raw: string) => parseInt(raw, 10)}
                  aria-label={labels.periodAria(index + 1)}
                  onChange={(value: number) => onChangePeriod(index, value)}
                />
                <PeriodNote>
                  {isDuplicate(fringePeriods, index)
                    ? labels.duplicate
                    : index === primaryIndex ? labels.primaryBadge : ''}
                </PeriodNote>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={fringePeriods.length <= 1}
                  aria-label={labels.removePeriod}
                  onClick={() => onRemovePeriod(index)}
                >
                  <TrashIcon size={iconSizeNumbers.xs} />
                </Button>
              </PeriodRow>
            ))}
          </Rows>

          <ActionRow>
            <Button
              size="sm"
              variant="secondary"
              leadingIcon={<PlusIcon size={iconSizeNumbers.xs} />}
              disabled={fringePeriods.length >= limits.maxPeriods}
              onClick={onAddPeriod}
            >
              {labels.addPeriod}
            </Button>
            <Hint>{labels.periodsHint}</Hint>
          </ActionRow>

          <RowBody>
            <RowText>
              <RowPrimary>{labels.compositeLabel}</RowPrimary>
              <RowSecondary>{labels.compositeDesc}</RowSecondary>
            </RowText>
            <Switch
              checked={compositeEnabled}
              onChange={(e) => onToggleComposite(e.target.checked)}
            />
          </RowBody>
          {compositeEnabled && (
            <ActionRow>
              <NumberField
                value={compositeSteps}
                min={1}
                max={limits.maxCompositeSteps}
                step={1}
                format={String}
                parse={(raw: string) => parseInt(raw, 10)}
                aria-label={labels.compositeSteps}
                onChange={onChangeCompositeSteps}
              />
              <Hint>{labels.compositeSteps}</Hint>
            </ActionRow>
          )}
        </>
      )}

      <TotalBox>{labels.total}</TotalBox>
    </TabWrap>
  )
}
