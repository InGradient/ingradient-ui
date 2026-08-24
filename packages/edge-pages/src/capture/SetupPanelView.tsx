import styled from 'styled-components'
import { Button, Switch, iconSizeNumbers } from '@ingradient/ui'
import { FieldGroup, FieldHint, SectionTitle } from '@ingradient/ui/patterns'
import { NumberField, CheckIcon, ChevronDownIcon } from '@ingradient/ui/components'
import { Inline, Text, surfacePanel } from '@ingradient/ui/primitives'

const Accordion = styled.details`
  ${surfacePanel}
  border-radius: var(--ig-radius-xl);
  overflow: hidden;
  summary {
    cursor: pointer;
    padding: var(--ig-space-6) var(--ig-space-7);
    list-style: none;
    font-weight: var(--ig-font-weight-semibold);
  }
  summary::-webkit-details-marker { display: none; }
  > div {
    padding: 0 var(--ig-space-7) var(--ig-space-7);
    color: var(--ig-color-text-muted);
  }
`
import {
  SetupPanel as SetupPanelWrap, SetupPanelHeader, SetupPanelBody,
  PatternButton, SetupMetaText,
  SetupAccordionSummaryRow,
} from './SetupPanelView.styles'
import { DERIVED_ORDER } from './pattern-helpers'
import { patternLabelToUI } from './pattern-helpers'
import { FOCUS_PEAKING_PATTERN } from './types'
import type { SetupPanelViewProps } from './types'

const SAVE_SUCCESS_ICON_COLOR = 'var(--ig-color-success-fg, var(--ig-color-success))'

export function SetupPanelView(props: SetupPanelViewProps): JSX.Element {
  const {
    isConnected, isSetupBusy, isSetupSaved, canSave, canEditSetup,
    cameraParams, previewPatternLabel,
    autoAnalyze, enabledFeatures, labels,
    onSave, onReset, onUpdateCameraParams, onWhiteBalanceCalibrate,
    onPreviewPattern, onAutoAnalyzeChange, onEnabledFeaturesChange,
  } = props
  const disabled = isSetupBusy || !canEditSetup

  return (
    <SetupPanelWrap>
      <SetupPanelHeader>
        <Text size="var(--ig-font-size-md)" weight="bold">{labels.title}</Text>
        {canEditSetup && (
          <Inline gap="var(--ig-space-2)" align="center" wrap="nowrap">
            <Button variant="secondary" size="sm" type="button" onClick={onReset} disabled={isSetupBusy}>
              {labels.reset}
            </Button>
            {canSave && (
              <Button variant="accent" size="sm" type="button" onClick={onSave} disabled={isSetupBusy}>
                {isSetupSaved ? <CheckIcon size={iconSizeNumbers.xs} color={SAVE_SUCCESS_ICON_COLOR} /> : null}
                {isSetupSaved ? labels.saved : labels.save}
              </Button>
            )}
          </Inline>
        )}
      </SetupPanelHeader>
      <SetupPanelBody>
        <FieldGroup style={{ gap: 'var(--ig-space-4)' }}>
          <FieldGroup>
            <Inline gap="var(--ig-space-4)" align="center" wrap="nowrap">
              <Inline gap="var(--ig-space-1-plus)" align="center" wrap="nowrap">{labels.autoAnalyze}</Inline>
              <Switch
                checked={autoAnalyze}
                onChange={(e) => onAutoAnalyzeChange(e.target.checked)}
                disabled={disabled}
              />
            </Inline>
          </FieldGroup>

          {autoAnalyze && (
            <Accordion open>
              <summary>
                <SetupAccordionSummaryRow>
                  {labels.featuresTitle}
                  <ChevronDownIcon size={iconSizeNumbers.md} />
                </SetupAccordionSummaryRow>
              </summary>
              <div>
                <SectionTitle>{labels.analysis}</SectionTitle>
                {DERIVED_ORDER.map((label) => (
                  <Inline key={label} gap="var(--ig-space-4)" align="center" wrap="nowrap">
                    <FieldHint>{patternLabelToUI(label)}</FieldHint>
                    <Switch
                      checked={enabledFeatures[label] ?? true}
                      onChange={(e) => onEnabledFeaturesChange({ ...enabledFeatures, [label]: e.target.checked })}
                      disabled={disabled}
                    />
                  </Inline>
                ))}
              </div>
            </Accordion>
          )}
        </FieldGroup>

        <FieldGroup style={{ gap: 'var(--ig-space-4)' }}>
          <SectionTitle>{labels.cameraTuning}</SectionTitle>
          <SetupMetaText>{isConnected ? labels.livePreviewAvailable : labels.noCamera}</SetupMetaText>

          <Inline gap="var(--ig-space-4)" align="center" wrap="nowrap">
            <PatternButton
              type="button"
              $active={previewPatternLabel === FOCUS_PEAKING_PATTERN}
              onClick={() => onPreviewPattern(previewPatternLabel === FOCUS_PEAKING_PATTERN ? null : FOCUS_PEAKING_PATTERN)}
              disabled={isSetupBusy}
            >
              {labels.focusPeaking}
            </PatternButton>
          </Inline>

          <FieldGroup>
            <Inline gap="var(--ig-space-1-plus)" align="center" wrap="nowrap">{labels.exposure}</Inline>
            <Inline gap="var(--ig-space-4)" align="center" wrap="nowrap">
              <NumberField
                value={+(cameraParams.exposure / 1_000_000).toFixed(4)}
                min={0.0001} max={5} step={0.1}
                disabled={disabled || cameraParams.exposureAuto}
                format={(v) => v.toFixed(4)}
                parse={parseFloat}
                onChange={(s) => {
                  const us = Math.round(Math.min(5_000_000, Math.max(100, s * 1_000_000)) / 100) * 100
                  onUpdateCameraParams((p) => ({ ...p, exposure: us }))
                }}
              />
              <FieldHint>s</FieldHint>
            </Inline>
            <Inline gap="var(--ig-space-4)" align="center" wrap="nowrap">
              <FieldHint>{labels.auto}</FieldHint>
              <Switch
                checked={cameraParams.exposureAuto}
                onChange={(e) => onUpdateCameraParams((p) => ({ ...p, exposureAuto: e.target.checked }))}
                disabled={disabled}
              />
            </Inline>
          </FieldGroup>

          <FieldGroup>
            <Inline gap="var(--ig-space-1-plus)" align="center" wrap="nowrap">{labels.gain}</Inline>
            <Inline gap="var(--ig-space-4)" align="center" wrap="nowrap">
              <NumberField
                value={cameraParams.gain}
                min={0} max={1000} step={10}
                disabled={disabled}
                format={String}
                parse={parseFloat}
                onChange={(v) => onUpdateCameraParams((p) => ({ ...p, gain: v }))}
              />
            </Inline>
          </FieldGroup>

          <FieldGroup>
            <Inline gap="var(--ig-space-1-plus)" align="center" wrap="nowrap">{labels.whiteBalance}</Inline>
            <PatternButton type="button" $active={false} disabled={disabled} onClick={onWhiteBalanceCalibrate}>
              {labels.autoCalibrate}
            </PatternButton>
          </FieldGroup>
        </FieldGroup>
      </SetupPanelBody>
    </SetupPanelWrap>
  )
}
