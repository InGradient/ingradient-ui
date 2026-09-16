import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { Button, SelectField, Switch, TextField } from '@ingradient/ui'
import { FieldGroup, FieldHint, FieldLabelWithHelp, SectionTitle } from '@ingradient/ui/patterns'
import { Inline, Text } from '@ingradient/ui/primitives'

import type { SetupConfigState, SetupPanelLabels } from '../types'

export interface DeflectometrySectionProps {
  setupConfig: SetupConfigState
  disabled: boolean
  isMeasuringSettleDelay: boolean
  /** 앱이 만든 한 줄 요약 — 몇 스텝·어떤 축·총 몇 장인지. 실험이 켜져 있으면 주기 목록이 계획을 정한다. */
  sequenceSummary: string
  phaseStepOptions: number[]
  fringePreview?: ReactNode
  labels: SetupPanelLabels
  onSetSetupConfig: Dispatch<SetStateAction<SetupConfigState>>
  onMeasureSettleDelay: () => void
}

const DEFAULT_FRINGE_PERIOD = 20
const DEFAULT_GAMMA = 2.2
const DEFAULT_SETTLE_DELAY_MS = 120

export function DeflectometrySection(props: DeflectometrySectionProps): JSX.Element {
  const {
    setupConfig, disabled, isMeasuringSettleDelay, sequenceSummary, phaseStepOptions,
    fringePreview, labels, onSetSetupConfig, onMeasureSettleDelay,
  } = props

  return (
    <FieldGroup style={{ gap: 'var(--ig-space-4)' }}>
      <SectionTitle>{labels.deflectometry}</SectionTitle>

      {fringePreview}

      <Text tone="muted" size="var(--ig-font-size-xs)">{sequenceSummary}</Text>

      <FieldGroup>
        <FieldLabelWithHelp label={labels.fringePeriod} />
        <TextField
          size="sm"
          type="number"
          value={setupConfig.fringePeriod}
          disabled={disabled}
          aria-label={labels.fringePeriod}
          onChange={(e) => onSetSetupConfig((prev) => ({
            ...prev, fringePeriod: Number(e.target.value) || DEFAULT_FRINGE_PERIOD,
          }))}
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabelWithHelp label={labels.phaseSteps} />
        <SelectField
          value={setupConfig.phaseSteps == null ? '' : String(setupConfig.phaseSteps)}
          disabled={disabled}
          aria-label={labels.phaseSteps}
          onChange={(e) => onSetSetupConfig((prev) => ({
            ...prev, phaseSteps: e.target.value ? Number(e.target.value) : null,
          }))}
        >
          {/* 빈 값 = 프로젝트 기본값. 여기서 고른 값은 이 촬영에만 적용된다. */}
          <option value="">{labels.phaseStepsProjectDefault}</option>
          {phaseStepOptions.map((steps) => (
            <option key={steps} value={steps}>{steps}</option>
          ))}
        </SelectField>
      </FieldGroup>

      <FieldGroup>
        <FieldLabelWithHelp label={labels.topoInvert} />
        <Inline gap="var(--ig-space-4)" align="center">
          <Switch
            checked={setupConfig.topoInvert}
            disabled={disabled}
            aria-label={labels.topoInvert}
            onChange={(e) => onSetSetupConfig((prev) => ({ ...prev, topoInvert: e.target.checked }))}
          />
          {/* 높낮이 방향은 기기 배치에 따라 뒤집힌다 — 현장에서 실물을 보고 맞춘다. */}
          <FieldHint>{labels.topoInvertHint}</FieldHint>
        </Inline>
      </FieldGroup>

      <FieldGroup>
        <FieldLabelWithHelp label={labels.gamma} />
        <TextField
          size="sm"
          type="number"
          step="0.1"
          value={setupConfig.gamma}
          disabled={disabled}
          aria-label={labels.gamma}
          onChange={(e) => onSetSetupConfig((prev) => ({
            ...prev, gamma: Number(e.target.value) || DEFAULT_GAMMA,
          }))}
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabelWithHelp label={labels.settleDelay} />
        <Inline gap="var(--ig-space-4)" align="center">
          <TextField
            size="sm"
            type="number"
            value={setupConfig.settleDelayMs}
            disabled={disabled || isMeasuringSettleDelay}
            aria-label={labels.settleDelay}
            onChange={(e) => onSetSetupConfig((prev) => ({
              ...prev, settleDelayMs: Number(e.target.value) || DEFAULT_SETTLE_DELAY_MS,
            }))}
          />
          <Button
            size="sm"
            variant="secondary"
            type="button"
            disabled={disabled || isMeasuringSettleDelay}
            onClick={onMeasureSettleDelay}
          >
            {isMeasuringSettleDelay ? labels.measuring : labels.measure}
          </Button>
        </Inline>
      </FieldGroup>
    </FieldGroup>
  )
}
