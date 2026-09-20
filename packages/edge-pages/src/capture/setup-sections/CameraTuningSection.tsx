import type { Dispatch, SetStateAction } from 'react'
import { Switch, Tooltip } from '@ingradient/ui'
import { HelpCircleIcon, NumberField } from '@ingradient/ui/components'
import { FieldGroup, FieldHint, FieldLabelWithHelp, SectionTitle } from '@ingradient/ui/patterns'
import { Inline, Text } from '@ingradient/ui/primitives'

import { PatternButton } from '../SetupPanelView.styles'
import { FOCUS_PEAKING_PATTERN } from '../types'
import type { CameraParams, PreviewPatternLabel, SetupPanelLabels } from '../types'

export interface CameraTuningSectionProps {
  isConnected: boolean
  isSetupBusy: boolean
  disabled: boolean
  cameraParams: CameraParams
  previewPatternLabel: PreviewPatternLabel | null
  labels: SetupPanelLabels
  onUpdateCameraParams: Dispatch<SetStateAction<CameraParams>>
  onWhiteBalanceCalibrate: () => void
  onPreviewPattern: (pattern: PreviewPatternLabel | null) => void
}

/** 노출은 초 단위로 보여주고 µs 로 저장한다. 카메라는 100µs 단위라 그 격자에 맞춰 반올림한다. */
const US_PER_SECOND = 1_000_000
const EXPOSURE_STEP_US = 100
const MIN_EXPOSURE_US = 100
const MAX_EXPOSURE_US = 5_000_000

export function CameraTuningSection(props: CameraTuningSectionProps): JSX.Element {
  const {
    isConnected, isSetupBusy, disabled, cameraParams, previewPatternLabel, labels,
    onUpdateCameraParams, onWhiteBalanceCalibrate, onPreviewPattern,
  } = props
  const focusPeakingOn = previewPatternLabel === FOCUS_PEAKING_PATTERN

  return (
    <FieldGroup style={{ gap: 'var(--ig-space-4)' }}>
      <SectionTitle>{labels.cameraTuning}</SectionTitle>
      <Text tone="muted" size="var(--ig-font-size-xs)">
        {isConnected ? labels.livePreviewAvailable : labels.noCamera}
      </Text>

      <Inline gap="var(--ig-space-2)" align="center">
        <PatternButton
          type="button"
          $active={focusPeakingOn}
          disabled={isSetupBusy}
          onClick={() => onPreviewPattern(focusPeakingOn ? null : FOCUS_PEAKING_PATTERN)}
        >
          {labels.focusPeaking}
        </PatternButton>
        {/* 버튼이 곧 라벨이라 이름 없이 도움말만 붙인다. */}
        <Tooltip content={labels.focusPeakingDesc}>
          <span style={{ display: 'inline-flex', cursor: 'help', opacity: 0.5 }}>
            <HelpCircleIcon size={12} />
          </span>
        </Tooltip>
      </Inline>

      <FieldGroup>
        <FieldLabelWithHelp label={labels.exposure} help={labels.exposureDesc} />
        <Inline gap="var(--ig-space-4)" align="center">
          <NumberField
            value={+(cameraParams.exposure / US_PER_SECOND).toFixed(4)}
            min={0.0001} max={5} step={0.1}
            disabled={disabled || cameraParams.exposureAuto}
            format={(v: number) => v.toFixed(4)}
            parse={parseFloat}
            aria-label={labels.exposure}
            onChange={(seconds: number) => {
              const us = Math.round(
                Math.min(MAX_EXPOSURE_US, Math.max(MIN_EXPOSURE_US, seconds * US_PER_SECOND))
                / EXPOSURE_STEP_US,
              ) * EXPOSURE_STEP_US
              onUpdateCameraParams((p) => ({ ...p, exposure: us }))
            }}
          />
          <FieldHint>s</FieldHint>
        </Inline>
        <Inline gap="var(--ig-space-4)" align="center">
          <FieldHint>{labels.auto}</FieldHint>
          <Switch
            checked={cameraParams.exposureAuto}
            disabled={disabled}
            aria-label={labels.auto}
            onChange={(e) => onUpdateCameraParams((p) => ({ ...p, exposureAuto: e.target.checked }))}
          />
        </Inline>
      </FieldGroup>

      <FieldGroup>
        <FieldLabelWithHelp label={labels.gain} help={labels.gainDesc} />
        <NumberField
          value={cameraParams.gain}
          min={0} max={1000} step={10}
          disabled={disabled}
          format={String}
          parse={parseFloat}
          aria-label={labels.gain}
          onChange={(v: number) => onUpdateCameraParams((p) => ({ ...p, gain: v }))}
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabelWithHelp label={labels.whiteBalance} help={labels.whiteBalanceDesc} />
        <PatternButton type="button" $active={false} disabled={disabled} onClick={onWhiteBalanceCalibrate}>
          {labels.autoCalibrate}
        </PatternButton>
      </FieldGroup>
    </FieldGroup>
  )
}
