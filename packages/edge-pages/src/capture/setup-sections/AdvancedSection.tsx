import type { Dispatch, SetStateAction } from 'react'
import { SelectField, Switch, TextField } from '@ingradient/ui'
import { NumberField } from '@ingradient/ui/components'
import { FieldGroup, FieldHint, FieldLabelWithHelp, SectionTitle } from '@ingradient/ui/patterns'
import { Inline, Text } from '@ingradient/ui/primitives'

import type { CameraParams, SetupPanelLabels } from '../types'
import { SetupAccordion, SetupAccordionSummary } from './setup-shell'

export interface AdvancedSectionProps {
  cameraParams: CameraParams
  disabled: boolean
  labels: SetupPanelLabels
  pixelFormatOptions: { value: string; label: string }[]
  pixelFormatHint?: React.ReactNode
  onUpdateCameraParams: Dispatch<SetStateAction<CameraParams>>
}

const ROI_FIELDS = ['roiX', 'roiY', 'roiWidth', 'roiHeight'] as const

/**
 * 평소엔 접혀 있는 고급 설정.
 *
 * 하드웨어 절(ROI·트리거)은 아직 동작하지 않는다. 숨기지 않고 비활성으로 두는 이유는
 * "이 카메라는 못 한다" 와 "아직 안 만들었다" 가 사용자에게 다른 이야기라서다.
 */
export function AdvancedSection(props: AdvancedSectionProps): JSX.Element {
  const { cameraParams, disabled, labels, pixelFormatOptions, pixelFormatHint, onUpdateCameraParams } = props

  return (
    <SetupAccordion>
      <summary>
        <SetupAccordionSummary>{labels.advanced}</SetupAccordionSummary>
      </summary>
      <div>
        <SectionTitle>{labels.advancedImage}</SectionTitle>

        <FieldGroup>
          <FieldLabelWithHelp label={labels.frameRate} help={labels.frameRateDesc} />
          <NumberField
            value={cameraParams.frameRate}
            min={1} max={120} step={1}
            disabled={disabled || !cameraParams.frameRateEnabled}
            format={String}
            parse={parseFloat}
            aria-label={labels.frameRate}
            onChange={(v: number) => onUpdateCameraParams((p) => ({ ...p, frameRate: v }))}
          />
          <Inline gap="var(--ig-space-4)" align="center">
            <FieldHint>{labels.frameRateEnable}</FieldHint>
            <Switch
              checked={cameraParams.frameRateEnabled}
              disabled={disabled}
              aria-label={labels.frameRateEnable}
              onChange={(e) => onUpdateCameraParams((p) => ({ ...p, frameRateEnabled: e.target.checked }))}
            />
          </Inline>
        </FieldGroup>

        <FieldGroup>
          <FieldLabelWithHelp label={labels.gammaCamera} help={labels.gammaCameraDesc} />
          <NumberField
            value={cameraParams.gamma}
            min={0.5} max={4} step={0.1}
            disabled={disabled}
            format={(v: number) => v.toFixed(1)}
            parse={parseFloat}
            aria-label={labels.gammaCamera}
            onChange={(v: number) => onUpdateCameraParams((p) => ({ ...p, gamma: Math.round(v * 10) / 10 }))}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabelWithHelp label={labels.blackLevel} help={labels.blackLevelDesc} />
          <NumberField
            value={cameraParams.blackLevel}
            min={0} max={100} step={1}
            disabled={disabled}
            format={String}
            parse={parseFloat}
            aria-label={labels.blackLevel}
            onChange={(v: number) => onUpdateCameraParams((p) => ({ ...p, blackLevel: v }))}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabelWithHelp label={labels.sharpness} help={labels.sharpnessDesc} />
          <NumberField
            value={cameraParams.sharpness}
            min={0} max={100} step={1}
            disabled={disabled}
            format={String}
            parse={parseFloat}
            aria-label={labels.sharpness}
            onChange={(v: number) => onUpdateCameraParams((p) => ({ ...p, sharpness: v }))}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabelWithHelp label={labels.pixelFormat} help={labels.pixelFormatDesc} />
          <SelectField
            value={cameraParams.pixelFormat}
            disabled={disabled}
            aria-label={labels.pixelFormat}
            onChange={(e) => onUpdateCameraParams((p) => ({ ...p, pixelFormat: e.target.value }))}
          >
            {pixelFormatOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </SelectField>
          {/* 선택(재시작 때 적용)과 실제 카메라 값을 분리해 보여준다 — 겹쳐 쓰면 '자동' 의사가 지워진다. */}
          {pixelFormatHint}
        </FieldGroup>

        <SectionTitle>{labels.advancedHardware}</SectionTitle>
        <Text tone="muted" size="var(--ig-font-size-xs)">{labels.hardwareComingSoon}</Text>

        <FieldGroup>
          <FieldLabelWithHelp label={labels.roi} help={labels.roiDesc} />
          <Inline gap="var(--ig-space-2)" align="center" wrap="wrap">
            {ROI_FIELDS.map((key) => (
              <TextField
                key={key}
                size="sm"
                type="number"
                min="0"
                step="1"
                aria-label={key}
                style={{ width: 'var(--ig-popup-4xs, 72px)' }}
                value={cameraParams[key] || ''}
                disabled
                onChange={() => undefined}
              />
            ))}
          </Inline>
        </FieldGroup>

        <FieldGroup>
          <FieldLabelWithHelp label={labels.hardwareTrigger} help={labels.hardwareTriggerDesc} />
          <Inline gap="var(--ig-space-4)" align="center">
            <SelectField value={cameraParams.triggerSource} disabled aria-label={labels.hardwareTrigger} onChange={() => undefined}>
              <option value="Line1">Line 1</option>
              <option value="Line2">Line 2</option>
              <option value="Software">Software</option>
            </SelectField>
            <Switch checked={cameraParams.triggerEnabled} disabled aria-label={labels.hardwareTrigger} onChange={() => undefined} />
          </Inline>
        </FieldGroup>
      </div>
    </SetupAccordion>
  )
}
