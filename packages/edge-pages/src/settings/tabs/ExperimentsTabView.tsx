import { Button, Inline, InlineMessage, NumberField, SettingRow, Switch, Text } from '@ingradient/ui'
import { FlaskIcon, PlusIcon, TrashIcon } from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui/tokens'

import type { ExperimentsTabViewProps } from '../types'
import { ActionRow, Hint, Rows, SectionLabel, TabTitle, TabWrap } from './tab-shell'

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

      <SettingRow
        label={labels.enabledLabel}
        description={labels.enabledDesc}
        control={<Switch checked={enabled} onChange={(e) => onToggleEnabled(e.target.checked)} />}
      />
      {!enabled && <Hint>{labels.disabledHint}</Hint>}

      {enabled && (
        <>
          <SectionLabel>{labels.periodsSection}</SectionLabel>
          <Rows>
            {fringePeriods.map((period, index) => (
              // 주기는 중복될 수 있어 값을 key 로 쓸 수 없다. 목록은 순서로만 편집한다.
              <Inline key={index} gap="var(--ig-space-3)" align="center">
                <NumberField
                  value={period}
                  min={limits.minPeriod}
                  step={1}
                  format={String}
                  parse={(raw: string) => parseInt(raw, 10)}
                  aria-label={labels.periodAria(index + 1)}
                  onChange={(value: number) => onChangePeriod(index, value)}
                />
                {/* 값이 없어도 자리를 차지해 행이 흔들리지 않는다. */}
                <Text tone="muted" size="var(--ig-font-size-2xs)" style={{ flex: 1, minWidth: 0 }}>
                  {isDuplicate(fringePeriods, index)
                    ? labels.duplicate
                    : index === primaryIndex ? labels.primaryBadge : ''}
                </Text>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={fringePeriods.length <= 1}
                  aria-label={labels.removePeriod}
                  onClick={() => onRemovePeriod(index)}
                >
                  <TrashIcon size={iconSizeNumbers.xs} />
                </Button>
              </Inline>
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

          <SettingRow
            label={labels.compositeLabel}
            description={labels.compositeDesc}
            control={
              <Switch
                checked={compositeEnabled}
                onChange={(e) => onToggleComposite(e.target.checked)}
              />
            }
          />
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

      <InlineMessage>{labels.total}</InlineMessage>
    </TabWrap>
  )
}
