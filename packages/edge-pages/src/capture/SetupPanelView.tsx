import { Button, iconSizeNumbers, Switch } from '@ingradient/ui'
import { CheckIcon } from '@ingradient/ui/components'
import { FieldGroup, FieldHint, SectionTitle } from '@ingradient/ui/patterns'
import { Inline, Text } from '@ingradient/ui/primitives'

import {
  SetupPanel as SetupPanelWrap, SetupPanelHeader, SetupPanelBody,
} from './SetupPanelView.styles'
import { SetupAccordion, SetupAccordionSummary } from './setup-sections/setup-shell'
import {
  AdvancedSection, CameraTuningSection, DeflectometrySection, PatternPreviewSection,
} from './setup-sections'
import { DERIVED_ORDER, patternLabelToUI } from './pattern-helpers'
import type { SetupPanelViewProps } from './types'

const SAVE_SUCCESS_ICON_COLOR = 'var(--ig-color-success-fg, var(--ig-color-success))'

export function SetupPanelView(props: SetupPanelViewProps): JSX.Element {
  const {
    isConnected, isSetupBusy, isSetupSaved, canSave, canEditSetup,
    progressText, setupStatusMessage,
    deflectometryEnabled, isMeasuringSettleDelay,
    setupConfig, cameraParams, previewPatternLabel,
    previewPatternLabels, sequenceSummary, pixelFormatOptions, phaseStepOptions,
    fringePreview, pixelFormatHint,
    enabledFeatures, labels,
    onSave, onReset, onSetSetupConfig, onUpdateCameraParams, onWhiteBalanceCalibrate,
    onPreviewPattern, onMeasureSettleDelay, onEnabledFeaturesChange,
  } = props
  const disabled = isSetupBusy || !canEditSetup

  const statusText = [progressText, setupStatusMessage].filter(Boolean).join(' — ') || null

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
        {/* 꺼진 항목은 촬영 시점 파생 계산에서 건너뛴다 — 목록에서도 숨는다. */}
        <FieldGroup style={{ gap: 'var(--ig-space-4)' }}>
          <SetupAccordion open>
            <summary>
              <SetupAccordionSummary>{labels.featuresTitle}</SetupAccordionSummary>
            </summary>
            <div>
              <SectionTitle>{labels.analysis}</SectionTitle>
              {DERIVED_ORDER.map((label) => (
                <Inline key={label} gap="var(--ig-space-4)" align="center" justify="space-between">
                  <FieldHint>{patternLabelToUI(label)}</FieldHint>
                  <Switch
                    checked={enabledFeatures[label] ?? true}
                    disabled={disabled}
                    aria-label={patternLabelToUI(label)}
                    onChange={(e) => onEnabledFeaturesChange({ ...enabledFeatures, [label]: e.target.checked })}
                  />
                </Inline>
              ))}
            </div>
          </SetupAccordion>
        </FieldGroup>

        <CameraTuningSection
          isConnected={isConnected}
          isSetupBusy={isSetupBusy}
          disabled={disabled}
          cameraParams={cameraParams}
          previewPatternLabel={previewPatternLabel}
          labels={labels}
          onUpdateCameraParams={onUpdateCameraParams}
          onWhiteBalanceCalibrate={onWhiteBalanceCalibrate}
          onPreviewPattern={onPreviewPattern}
        />

        <AdvancedSection
          cameraParams={cameraParams}
          disabled={disabled}
          labels={labels}
          pixelFormatOptions={pixelFormatOptions}
          pixelFormatHint={pixelFormatHint}
          onUpdateCameraParams={onUpdateCameraParams}
        />

        {deflectometryEnabled && (
          <>
            <DeflectometrySection
              setupConfig={setupConfig}
              disabled={disabled}
              isMeasuringSettleDelay={isMeasuringSettleDelay}
              sequenceSummary={sequenceSummary}
              phaseStepOptions={phaseStepOptions}
              fringePreview={fringePreview}
              labels={labels}
              onSetSetupConfig={onSetSetupConfig}
              onMeasureSettleDelay={onMeasureSettleDelay}
            />
            <PatternPreviewSection
              patterns={previewPatternLabels}
              previewPatternLabel={previewPatternLabel}
              isSetupBusy={isSetupBusy}
              statusText={statusText}
              labels={labels}
              formatPatternLabel={patternLabelToUI}
              onPreviewPattern={onPreviewPattern}
            />
          </>
        )}
      </SetupPanelBody>
    </SetupPanelWrap>
  )
}
