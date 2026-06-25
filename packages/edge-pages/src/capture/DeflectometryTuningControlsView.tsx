import { iconSizeNumbers } from '@ingradient/ui'
import { Button, Checkbox, SelectField, Spinner } from '@ingradient/ui'
import { ChevronDown, ChevronRight } from 'lucide-react'
import {
  Wrap, CollapsibleHeader, Row, Label, LabelName, LabelValue, Slider, SliderInline,
  BtnRow, MetricRow, Warning,
  QualityCard, QualityHeader, QualityLabel, QualityStatus, QualityDivider,
  IndicatorRight, IndicatorValue,
} from './DeflectometryTuningControlsView.styles'
import { COLORMAP_OPTIONS, type ColormapName } from './colormap-helpers'
import type { DeflectometryTuningControlsViewProps } from './types'

function formatPct(v: number | null): string {
  if (v == null || !Number.isFinite(v)) return '—'
  return `${(v * 100).toFixed(0)}%`
}

export function DeflectometryTuningControlsView(props: DeflectometryTuningControlsViewProps): JSX.Element {
  const {
    disabled, expanded, activeDerivedKind,
    modulationThreshold, modulationOverlayEnabled, colormaps,
    isRecomputing, isAutoTuning, isSavingDefault, metrics,
    labels,
    onToggleExpanded, onModulationThresholdChange, onModulationOverlayChange, onColormapChange,
    onRecompute, onSaveDefault, onReset,
  } = props
  const isGradient = activeDerivedKind === 'gradient'

  return (
    <Wrap>
      <CollapsibleHeader type="button" onClick={onToggleExpanded} aria-expanded={expanded}>
        <span>{labels.title}</span>
        {expanded ? <ChevronDown size={iconSizeNumbers.sm} /> : <ChevronRight size={iconSizeNumbers.sm} />}
      </CollapsibleHeader>

      {expanded && (
        <>
          {isGradient && (
            <Row>
              <Label>
                <LabelName>modulation threshold</LabelName>
                <LabelValue>{modulationThreshold.toFixed(2)}</LabelValue>
              </Label>
              <SliderInline>
                <Slider
                  min={0.01} max={0.5} step={0.01} value={modulationThreshold}
                  disabled={disabled || !modulationOverlayEnabled}
                  onChange={(e) => onModulationThresholdChange(Number(e.target.value))}
                />
                <Checkbox
                  aria-label={labels.modulationOverlay}
                  label={labels.modulationOverlay}
                  checked={modulationOverlayEnabled}
                  disabled={disabled}
                  onChange={(e) => onModulationOverlayChange(e.target.checked)}
                />
              </SliderInline>
            </Row>
          )}

          {activeDerivedKind && (
            <Row>
              <Label>
                <LabelName>{labels.colormapSection}</LabelName>
              </Label>
              <SelectField
                value={colormaps[activeDerivedKind]}
                disabled={disabled}
                onChange={(e) => onColormapChange(activeDerivedKind, e.target.value as ColormapName)}
              >
                {COLORMAP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </SelectField>
            </Row>
          )}
        </>
      )}

      <Button
        variant="accent"
        size="sm"
        disabled={disabled || isRecomputing || isAutoTuning}
        onClick={onRecompute}
      >
        {isRecomputing ? <><Spinner tone="white" size="sm" />{labels.analyzing}</> : labels.analyze}
      </Button>

      <QualityCard>
        <QualityHeader>
          <QualityLabel>{labels.confidence}</QualityLabel>
          {isRecomputing && !metrics ? (
            <QualityLabel><Spinner tone="white" size="sm" />{labels.computing}</QualityLabel>
          ) : (
            <IndicatorRight>
              <IndicatorValue>{formatPct(metrics?.validRatio ?? null)}</IndicatorValue>
              <QualityStatus $status={metrics?.confidenceStatus ?? null}>
                {metrics?.confidenceStatus ?? '—'}
              </QualityStatus>
            </IndicatorRight>
          )}
        </QualityHeader>
        <QualityDivider />
        <MetricRow>
          <span>{labels.validRatio}</span>
          <span>{formatPct(metrics?.validRatio ?? null)}</span>
        </MetricRow>
        {metrics?.warnings?.includes('low_confidence') && (
          <Warning $kind="warn">⚠ {labels.warnLowConfidence}</Warning>
        )}
      </QualityCard>

      <BtnRow>
        <Button variant="secondary" size="sm" disabled={disabled || isSavingDefault} onClick={onSaveDefault}>
          {isSavingDefault && <Spinner tone="white" size="sm" />}
          {isSavingDefault ? labels.saveDefaultSaving : labels.saveDefault}
        </Button>
        <Button variant="secondary" size="sm" disabled={disabled || isRecomputing || isAutoTuning} onClick={onReset}>
          {labels.reset}
        </Button>
      </BtnRow>
    </Wrap>
  )
}
