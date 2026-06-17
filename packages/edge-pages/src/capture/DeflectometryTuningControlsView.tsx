import { iconSizeNumbers } from '@ingradient/ui'
import { ChevronDown, ChevronRight } from 'lucide-react'
import {
  Wrap, CollapsibleHeader, Row, Label, LabelName, LabelValue, Slider, CheckRow, SliderInline,
  Btn, BtnRow, MetricRow, Warning, Spinner, Select,
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
                <CheckRow>
                  <input
                    type="checkbox"
                    aria-label={labels.modulationOverlay}
                    checked={modulationOverlayEnabled}
                    disabled={disabled}
                    onChange={(e) => onModulationOverlayChange(e.target.checked)}
                  />
                  <span>{labels.modulationOverlay}</span>
                </CheckRow>
              </SliderInline>
            </Row>
          )}

          {activeDerivedKind && (
            <Row>
              <Label>
                <LabelName>{labels.colormapSection}</LabelName>
              </Label>
              <Select
                value={colormaps[activeDerivedKind]}
                disabled={disabled}
                onChange={(e) => onColormapChange(activeDerivedKind, e.target.value as ColormapName)}
              >
                {COLORMAP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </Row>
          )}
        </>
      )}

      <Btn
        $primary
        disabled={disabled || isRecomputing || isAutoTuning}
        onClick={onRecompute}
      >
        {isRecomputing ? <><Spinner />{labels.analyzing}</> : labels.analyze}
      </Btn>

      <QualityCard>
        <QualityHeader>
          <QualityLabel>{labels.confidence}</QualityLabel>
          {isRecomputing && !metrics ? (
            <QualityLabel><Spinner />{labels.computing}</QualityLabel>
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
        <Btn disabled={disabled || isSavingDefault} onClick={onSaveDefault}>
          {isSavingDefault && <Spinner />}
          {isSavingDefault ? labels.saveDefaultSaving : labels.saveDefault}
        </Btn>
        <Btn disabled={disabled || isRecomputing || isAutoTuning} onClick={onReset}>
          {labels.reset}
        </Btn>
      </BtnRow>
    </Wrap>
  )
}
